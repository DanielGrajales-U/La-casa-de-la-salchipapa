import { useMemo, useCallback } from 'react';
import restaurantData from '../data/restaurantData.json';
import simulatedCustomersData from '../data/simulatedCustomers.json';
import {
  AdditionOption,
  CartItem,
  CustomerInfo,
  MenuItem,
  Order,
  OrderStatus,
} from '../types/order';
import { getCartItemLineTotal } from '../utils/formatters';
import { useLocalStorage } from './useLocalStorage';

const ORDERS_STORAGE_KEY = 'lcs_tulua_orders_v1';

function buildInitialOrders(): Order[] {
  const now = Date.now();
  return restaurantData.initialOrders.map((seed) => ({
    id: seed.id,
    orderNumber: seed.orderNumber,
    createdAt: new Date(now - seed.minutesAgo * 60000).toISOString(),
    status: seed.status as OrderStatus,
    customer: seed.customer as CustomerInfo,
    items: seed.items as CartItem[],
    subtotal: seed.subtotal,
    deliveryFee: seed.deliveryFee,
    total: seed.total,
  }));
}

function generateNextOrderNumber(currentOrders: Order[]): string {
  const maxNum = currentOrders.reduce((max, order) => {
    const match = order.orderNumber.match(/\d+/);
    const val = match ? parseInt(match[0], 10) : 1045;
    return Math.max(max, val);
  }, 1045);
  return `#LCS-${maxNum + 1}`;
}

export function useOrders() {
  const { deliveryFee: baseDeliveryFee, freeDeliveryThreshold } = restaurantData.restaurant;
  const menuItems = restaurantData.menuItems as MenuItem[];
  const additions = restaurantData.additions as AdditionOption[];
  const simulatedCustomers = simulatedCustomersData as CustomerInfo[];

  const [orders, setOrders] = useLocalStorage<Order[]>(ORDERS_STORAGE_KEY, buildInitialOrders);

  const pendingOrdersCount = useMemo(
    () => orders.filter((o) => o.status === 'nuevo' || o.status === 'en_cocina').length,
    [orders]
  );

  const createOrder = useCallback(
    (items: CartItem[], customer: CustomerInfo): Order => {
      const subtotal = items.reduce((sum, item) => sum + getCartItemLineTotal(item), 0);
      const deliveryFee =
        customer.deliveryType === 'recoger' || subtotal >= freeDeliveryThreshold
          ? 0
          : baseDeliveryFee;

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: generateNextOrderNumber(orders),
        createdAt: new Date().toISOString(),
        status: 'nuevo',
        customer,
        items,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
      };

      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    },
    [orders, baseDeliveryFee, freeDeliveryThreshold, setOrders]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, nextStatus: OrderStatus) => {
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: nextStatus } : order))
      );
    },
    [setOrders]
  );

  const simulateIncomingOrder = useCallback(() => {
    const customer =
      simulatedCustomers[Math.floor(Math.random() * simulatedCustomers.length)];
    const foodItems = menuItems.filter((m) => m.supportsCustomization);
    const drinkItems = menuItems.filter((m) => !m.supportsCustomization);

    const pickedFood = foodItems[Math.floor(Math.random() * foodItems.length)];
    const pickedDrink = drinkItems[Math.floor(Math.random() * drinkItems.length)];
    const pickedAddition = additions[Math.floor(Math.random() * additions.length)];

    const items: CartItem[] = [
      {
        cartItemId: `sim-${Date.now()}-1`,
        menuItemId: pickedFood.id,
        name: pickedFood.name,
        category: pickedFood.category,
        basePrice: pickedFood.price,
        image: pickedFood.image,
        quantity: Math.random() > 0.5 ? 2 : 1,
        supportsCustomization: true,
        selectedSauces: ['Salsa de la Casa', 'Rosada', 'Piña'],
        saucesOnSide: Math.random() > 0.7,
        selectedAdditions: [pickedAddition],
        note: Math.random() > 0.5 ? 'Bien crocante' : '',
      },
      {
        cartItemId: `sim-${Date.now()}-2`,
        menuItemId: pickedDrink.id,
        name: pickedDrink.name,
        category: pickedDrink.category,
        basePrice: pickedDrink.price,
        image: pickedDrink.image,
        quantity: 1,
        supportsCustomization: false,
        selectedSauces: [],
        saucesOnSide: false,
        selectedAdditions: [],
        note: 'Bien fría',
      },
    ];

    createOrder(items, customer);
  }, [simulatedCustomers, menuItems, additions, createOrder]);

  return {
    orders,
    pendingOrdersCount,
    createOrder,
    updateOrderStatus,
    simulateIncomingOrder,
  };
}
