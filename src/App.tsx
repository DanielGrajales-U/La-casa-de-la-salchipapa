import { CustomerInfo, MenuItem } from './types/order';
import { useNavigation } from './hooks/useNavigation';
import { useCart } from './hooks/useCart';
import { useOrders } from './hooks/useOrders';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { CentralPedidosPage } from './pages/CentralPedidosPage';

export default function App() {
  const { currentView, navigate } = useNavigation('home');
  const { cartItems, cartCount, cartSubtotal, addItem, updateItem, removeItem, clearCart } =
    useCart();
  const { orders, pendingOrdersCount, createOrder, updateOrderStatus, simulateIncomingOrder } =
    useOrders();

  const handleAddToCart = (item: MenuItem, goToCart = false) => {
    addItem(item);
    if (goToCart) navigate('carrito');
  };

  const handleSubmitOrder = (customer: CustomerInfo) => {
    const newOrder = createOrder(cartItems, customer);
    clearCart();
    return newOrder;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        currentView={currentView}
        onNavigate={navigate}
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        pendingOrdersCount={pendingOrdersCount}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage onAddToCart={handleAddToCart} onNavigate={navigate} />
        )}

        {currentView === 'carrito' && (
          <CartPage
            cartItems={cartItems}
            cartSubtotal={cartSubtotal}
            onUpdateCartItem={updateItem}
            onRemoveCartItem={removeItem}
            onAddMenuItem={addItem}
            onSubmitOrder={handleSubmitOrder}
            onNavigate={navigate}
          />
        )}

        {currentView === 'central' && (
          <CentralPedidosPage
            orders={orders}
            onUpdateStatus={updateOrderStatus}
            onSimulateIncomingOrder={simulateIncomingOrder}
          />
        )}
      </main>
    </div>
  );
}
