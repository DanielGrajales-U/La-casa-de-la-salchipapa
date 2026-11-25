import React, { useState } from 'react';
import { Plus, ShoppingBag } from 'lucide-react';
import { ADDITIONS, MENU_ITEMS, RESTAURANT_INFO, SAUCES } from '../data/catalog';
import { AppView, CartItem, CustomerInfo, MenuItem, Order } from '../types/order';
import { formatCOP } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { CartItemCard } from '../components/cart/CartItemCard';
import { CheckoutForm } from '../components/cart/CheckoutForm';
import { OrderConfirmationReceipt } from '../components/cart/OrderConfirmationReceipt';

interface CartPageProps {
  cartItems: CartItem[];
  cartSubtotal: number;
  onUpdateCartItem: (cartItemId: string, updater: (item: CartItem) => CartItem) => void;
  onRemoveCartItem: (cartItemId: string) => void;
  onAddMenuItem: (item: MenuItem) => void;
  onSubmitOrder: (customer: CustomerInfo) => Order;
  onNavigate: (view: AppView) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cartItems,
  cartSubtotal,
  onUpdateCartItem,
  onRemoveCartItem,
  onAddMenuItem,
  onSubmitOrder,
  onNavigate,
}) => {
  const [quickAddId, setQuickAddId] = useState<string>(MENU_ITEMS[0]?.id || '');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const handleQuickAdd = () => {
    const found = MENU_ITEMS.find((m) => m.id === quickAddId);
    if (found) onAddMenuItem(found);
  };

  const handleConfirmOrder = (customer: CustomerInfo) => {
    const order = onSubmitOrder(customer);
    setConfirmedOrder(order);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (confirmedOrder) {
    return (
      <OrderConfirmationReceipt
        order={confirmedOrder}
        onNavigate={onNavigate}
        onNewOrder={() => {
          setConfirmedOrder(null);
          onNavigate('home');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#141417] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-neutral-200">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#D92525] mb-1">
              Organizador de Pedido
            </p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0E0E10] tracking-tight">
              Tu Carrito
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              Elige tus salsas y adiciones desde los menús desplegables y completa tus datos de entrega.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={quickAddId}
              onChange={(e) => setQuickAddId(e.target.value)}
              aria-label="Seleccionar producto para agregar rápido"
              className="flex-1 sm:w-64 px-3 py-2.5 rounded-lg bg-white border border-neutral-300 text-sm text-neutral-800 focus:outline-none focus:border-[#0E0E10]"
            >
              {MENU_ITEMS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {formatCOP(m.price)}
                </option>
              ))}
            </select>
            <Button variant="dark" onClick={handleQuickAdd} className="rounded-lg px-4">
              <Plus className="w-4 h-4 text-[#F5B800]" />
              <span>Añadir</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            {cartItems.length === 0 ? (
              <EmptyState
                icon={<ShoppingBag className="w-10 h-10" />}
                title="Tu pedido está vacío"
                description="Agrega tus salchipapas, perros, hamburguesas o bebidas favoritas desde la carta o usando el selector rápido arriba."
                actionLabel="Explorar el menú"
                onAction={() => onNavigate('home')}
              />
            ) : (
              cartItems.map((item) => (
                <CartItemCard
                  key={item.cartItemId}
                  item={item}
                  sauces={SAUCES}
                  additions={ADDITIONS}
                  onUpdate={(updater) => onUpdateCartItem(item.cartItemId, updater)}
                  onRemove={() => onRemoveCartItem(item.cartItemId)}
                />
              ))
            )}
          </div>

          <div className="lg:col-span-5">
            <CheckoutForm
              subtotal={cartSubtotal}
              hasItems={cartItems.length > 0}
              deliveryFeeConfig={RESTAURANT_INFO.deliveryFee}
              freeDeliveryThreshold={RESTAURANT_INFO.freeDeliveryThreshold}
              onSubmit={handleConfirmOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
