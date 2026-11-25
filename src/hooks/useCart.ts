import { useMemo, useCallback } from 'react';
import restaurantData from '../data/restaurantData.json';
import { CartItem, MenuItem } from '../types/order';
import { getCartItemLineTotal } from '../utils/formatters';
import { useLocalStorage } from './useLocalStorage';

const CART_STORAGE_KEY = 'lcs_tulua_cart_v1';
const DEFAULT_SAUCES = ['Salsa de la Casa', 'Rosada', 'Ajo'];

function buildStarterCart(): CartItem[] {
  const items = restaurantData.menuItems as MenuItem[];
  const starter = items.find((m) => m.id === 'salchipapa-especial') || items[0];
  if (!starter) return [];

  return [
    {
      cartItemId: 'starter-item-1',
      menuItemId: starter.id,
      name: starter.name,
      category: starter.category,
      basePrice: starter.price,
      image: starter.image,
      quantity: 1,
      supportsCustomization: starter.supportsCustomization,
      selectedSauces: [...DEFAULT_SAUCES],
      saucesOnSide: false,
      selectedAdditions: [{ id: 'queso', name: 'Queso', price: 1000 }],
      note: '',
    },
  ];
}

export function useCart() {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    CART_STORAGE_KEY,
    buildStarterCart
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + getCartItemLineTotal(item), 0),
    [cartItems]
  );

  const addItem = useCallback(
    (item: MenuItem) => {
      const newCartItem: CartItem = {
        cartItemId: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        menuItemId: item.id,
        name: item.name,
        category: item.category,
        basePrice: item.price,
        image: item.image,
        quantity: 1,
        supportsCustomization: item.supportsCustomization,
        selectedSauces: item.supportsCustomization ? [...DEFAULT_SAUCES] : [],
        saucesOnSide: false,
        selectedAdditions: [],
        note: '',
      };

      setCartItems((prev) => [newCartItem, ...prev]);
    },
    [setCartItems]
  );

  const updateItem = useCallback(
    (cartItemId: string, updater: (item: CartItem) => CartItem) => {
      setCartItems((prev) =>
        prev.map((item) => (item.cartItemId === cartItemId ? updater(item) : item))
      );
    },
    [setCartItems]
  );

  const removeItem = useCallback(
    (cartItemId: string) => {
      setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    },
    [setCartItems]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, [setCartItems]);

  return {
    cartItems,
    cartCount,
    cartSubtotal,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  };
}
