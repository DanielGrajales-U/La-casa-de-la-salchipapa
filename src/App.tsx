import { useState, useEffect, useMemo } from 'react';
import restaurantData from './data/restaurantData.json';
import {
  AdditionOption,
  AppView,
  CartItem,
  CustomerInfo,
  MenuItem,
  Order,
  OrderStatus,
  SauceOption,
} from './types/order';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { CartView } from './components/CartView';
import { CentralPedidosView } from './components/CentralPedidosView';
import { getCartItemLineTotal } from './utils/formatters';

const ORDERS_STORAGE_KEY = 'lcs_tulua_orders_v1';
const CART_STORAGE_KEY = 'lcs_tulua_cart_v1';

const SIMULATED_CUSTOMERS: CustomerInfo[] = [
  {
    name: 'Sebastián Restrepo',
    phone: '317 504 2219',
    deliveryType: 'domicilio',
    address: 'Calle 25 # 38-12',
    neighborhood: 'Barrio Príncipe',
    reference: 'Casa portón gris, al lado de la tienda',
    paymentMethod: 'nequi',
  },
  {
    name: 'Mariana Velásquez',
    phone: '314 889 1024',
    deliveryType: 'recoger',
    address: '',
    neighborhood: '',
    reference: 'Llega en 15 minutos',
    paymentMethod: 'efectivo',
    cashPaidWith: 20000,
  },
  {
    name: 'Juan David Quintero',
    phone: '321 440 7781',
    deliveryType: 'domicilio',
    address: 'Carrera 30 # 19-08',
    neighborhood: 'Barrio Rubén Cruz Vélez',
    reference: 'Segundo piso, timbrar abajo',
    paymentMethod: 'efectivo',
    cashPaidWith: 50000,
  },
  {
    name: 'Paola Andrea Mejía',
    phone: '310 623 9940',
    deliveryType: 'domicilio',
    address: 'Calle 29 # 22-51',
    neighborhood: 'Barrio Alvernia',
    reference: 'Frente al parque',
    paymentMethod: 'daviplata',
  },
];

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

export default function App() {
  const menuItems = restaurantData.menuItems as MenuItem[];
  const sauces = restaurantData.sauces as SauceOption[];
  const additions = restaurantData.additions as AdditionOption[];
  const restaurantInfo = restaurantData.restaurant;

  const [currentView, setCurrentView] = useState<AppView>('home');

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved) as CartItem[];
    } catch {
      // ignore storage errors
    }
    // Pre-populate 1 signature item so visitors immediately see the compact dropdowns in Carrito
    const yumbo = menuItems.find((m) => m.id === 'salchipapa-especial') || menuItems[0];
    return [
      {
        cartItemId: 'starter-item-1',
        menuItemId: yumbo.id,
        name: yumbo.name,
        category: yumbo.category,
        basePrice: yumbo.price,
        image: yumbo.image,
        quantity: 1,
        supportsCustomization: yumbo.supportsCustomization,
        selectedSauces: ['Salsa de la Casa', 'Rosada', 'Ajo'],
        saucesOnSide: false,
        selectedAdditions: [{ id: 'queso', name: 'Queso', price: 1000 }],
        note: '',
      },
    ];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Order[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return buildInitialOrders();
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore storage errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore storage errors
    }
  }, [orders]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + getCartItemLineTotal(item), 0),
    [cartItems]
  );

  const pendingOrdersCount = useMemo(
    () => orders.filter((o) => o.status === 'nuevo' || o.status === 'en_cocina').length,
    [orders]
  );

  const handleNavigate = (view: AppView, scrollToMenu = false) => {
    setCurrentView(view);
    if (view === 'home' && scrollToMenu) {
      window.setTimeout(() => {
        const el = document.getElementById('menu-de-hoy');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (item: MenuItem, goToCart = false) => {
    const newCartItem: CartItem = {
      cartItemId: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      menuItemId: item.id,
      name: item.name,
      category: item.category,
      basePrice: item.price,
      image: item.image,
      quantity: 1,
      supportsCustomization: item.supportsCustomization,
      selectedSauces: item.supportsCustomization ? ['Salsa de la Casa', 'Rosada', 'Ajo'] : [],
      saucesOnSide: false,
      selectedAdditions: [],
      note: '',
    };

    setCartItems((prev) => [newCartItem, ...prev]);
    if (goToCart) {
      handleNavigate('carrito');
    }
  };

  const handleUpdateCartItem = (
    cartItemId: string,
    updater: (item: CartItem) => CartItem
  ) => {
    setCartItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? updater(item) : item))
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const generateNextOrderNumber = (currentOrders: Order[]): string => {
    const maxNum = currentOrders.reduce((max, o) => {
      const match = o.orderNumber.match(/\d+/);
      const val = match ? parseInt(match[0], 10) : 1045;
      return Math.max(max, val);
    }, 1045);
    return `#LCS-${maxNum + 1}`;
  };

  const handleSubmitOrder = (customer: CustomerInfo): Order => {
    const subtotal = cartItems.reduce((sum, item) => sum + getCartItemLineTotal(item), 0);
    const deliveryFee =
      customer.deliveryType === 'recoger' || subtotal >= restaurantInfo.freeDeliveryThreshold
        ? 0
        : restaurantInfo.deliveryFee;
    const total = subtotal + deliveryFee;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: generateNextOrderNumber(orders),
      createdAt: new Date().toISOString(),
      status: 'nuevo',
      customer,
      items: cartItems,
      subtotal,
      deliveryFee,
      total,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    return newOrder;
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: nextStatus } : order))
    );
  };

  const handleSimulateIncomingOrder = () => {
    const customer =
      SIMULATED_CUSTOMERS[Math.floor(Math.random() * SIMULATED_CUSTOMERS.length)];
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

    const subtotal = items.reduce((sum, it) => sum + getCartItemLineTotal(it), 0);
    const deliveryFee =
      customer.deliveryType === 'recoger' || subtotal >= restaurantInfo.freeDeliveryThreshold
        ? 0
        : restaurantInfo.deliveryFee;

    const simulatedOrder: Order = {
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

    setOrders((prev) => [simulatedOrder, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        pendingOrdersCount={pendingOrdersCount}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            menuItems={menuItems}
            restaurantInfo={restaurantInfo}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'carrito' && (
          <CartView
            cartItems={cartItems}
            menuItems={menuItems}
            sauces={sauces}
            additions={additions}
            deliveryFeeConfig={restaurantInfo.deliveryFee}
            freeDeliveryThreshold={restaurantInfo.freeDeliveryThreshold}
            onUpdateCartItem={handleUpdateCartItem}
            onRemoveCartItem={handleRemoveCartItem}
            onAddMenuItem={(item) => handleAddToCart(item, false)}
            onSubmitOrder={handleSubmitOrder}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'central' && (
          <CentralPedidosView
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onSimulateIncomingOrder={handleSimulateIncomingOrder}
          />
        )}
      </main>
    </div>
  );
}
