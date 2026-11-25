import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Plus,
  Minus,
  Trash2,
  Check,
  MapPin,
  Store,
  Copy,
  ArrowRight,
  ShoppingBag,
  MessageSquare,
  UtensilsCrossed,
} from 'lucide-react';
import {
  AdditionOption,
  AppView,
  CartItem,
  CustomerInfo,
  DeliveryType,
  MenuItem,
  Order,
  PaymentMethod,
  SauceOption,
} from '../types/order';
import {
  buildWhatsAppOrderSummary,
  formatCOP,
  getCartItemLineTotal,
  getCartItemUnitTotal,
} from '../utils/formatters';

interface CartViewProps {
  cartItems: CartItem[];
  menuItems: MenuItem[];
  sauces: SauceOption[];
  additions: AdditionOption[];
  deliveryFeeConfig: number;
  freeDeliveryThreshold: number;
  onUpdateCartItem: (cartItemId: string, updater: (item: CartItem) => CartItem) => void;
  onRemoveCartItem: (cartItemId: string) => void;
  onAddMenuItem: (item: MenuItem) => void;
  onSubmitOrder: (customer: CustomerInfo) => Order;
  onNavigate: (view: AppView) => void;
}

/* Compact Multi-Select Dropdown for Sauces */
const SauceDropdown: React.FC<{
  sauces: SauceOption[];
  selectedSauces: string[];
  saucesOnSide: boolean;
  onChange: (nextSauces: string[], onSide: boolean) => void;
}> = ({ sauces, selectedSauces, saucesOnSide, onChange }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const toggleSauce = (name: string) => {
    const exists = selectedSauces.includes(name);
    const next = exists
      ? selectedSauces.filter((s) => s !== name)
      : [...selectedSauces, name];
    onChange(next, saucesOnSide);
  };

  const summary =
    selectedSauces.length === 0
      ? 'Sin salsas'
      : selectedSauces.length === sauces.length
        ? 'Todas las salsas'
        : selectedSauces.slice(0, 2).join(', ') +
          (selectedSauces.length > 2 ? ` +${selectedSauces.length - 2}` : '');

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left text-xs sm:text-sm transition-colors cursor-pointer ${
          open
            ? 'border-[#0E0E10] bg-neutral-50 text-[#0E0E10]'
            : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
        }`}
        aria-expanded={open}
      >
        <span className="truncate">
          <span className="text-neutral-500 font-normal">Salsas: </span>
          <span className="font-medium">
            {summary}
            {saucesOnSide && selectedSauces.length > 0 ? ' (aparte)' : ''}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 sm:w-72 mt-1.5 z-30 bg-white border border-neutral-200 rounded-xl shadow-xl p-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
            <span className="text-xs font-semibold text-neutral-700">Elige tus salsas</span>
            <div className="flex items-center gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => onChange(sauces.map((s) => s.name), saucesOnSide)}
                className="text-[#D92525] font-medium hover:underline cursor-pointer"
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => onChange([], false)}
                className="text-neutral-500 hover:text-neutral-800 cursor-pointer"
              >
                Ninguna
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1">
            {sauces.map((sauce) => {
              const checked = selectedSauces.includes(sauce.name);
              return (
                <label
                  key={sauce.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer text-xs text-neutral-800 select-none"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSauce(sauce.name)}
                    className="w-3.5 h-3.5 rounded accent-[#D92525]"
                  />
                  <span className="truncate">{sauce.name}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saucesOnSide}
                onChange={(e) => onChange(selectedSauces, e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-[#0E0E10]"
              />
              <span>Enviar salsas aparte</span>
            </label>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-[#0E0E10] hover:underline cursor-pointer"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* Compact Multi-Select Dropdown for Additions with COP prices */
const AdditionsDropdown: React.FC<{
  additions: AdditionOption[];
  selectedAdditions: AdditionOption[];
  onChange: (nextAdditions: AdditionOption[]) => void;
}> = ({ additions, selectedAdditions, onChange }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const toggleAddition = (option: AdditionOption) => {
    const exists = selectedAdditions.some((a) => a.id === option.id);
    const next = exists
      ? selectedAdditions.filter((a) => a.id !== option.id)
      : [...selectedAdditions, option];
    onChange(next);
  };

  const additionsCost = selectedAdditions.reduce((acc, a) => acc + a.price, 0);

  const summary =
    selectedAdditions.length === 0
      ? 'Ninguna'
      : selectedAdditions
          .slice(0, 2)
          .map((a) => a.name)
          .join(', ') +
        (selectedAdditions.length > 2 ? ` +${selectedAdditions.length - 2}` : '');

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left text-xs sm:text-sm transition-colors cursor-pointer ${
          open
            ? 'border-[#0E0E10] bg-neutral-50 text-[#0E0E10]'
            : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
        }`}
        aria-expanded={open}
      >
        <span className="truncate">
          <span className="text-neutral-500 font-normal">Adiciones: </span>
          <span className="font-medium">{summary}</span>
          {additionsCost > 0 && (
            <span className="font-mono text-xs text-[#D92525] ml-1 tabular-nums">
              (+{formatCOP(additionsCost)})
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 sm:w-72 mt-1.5 z-30 bg-white border border-neutral-200 rounded-xl shadow-xl p-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
            <span className="text-xs font-semibold text-neutral-700">Agregar adiciones</span>
            {selectedAdditions.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-neutral-500 hover:text-neutral-800 cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {additions.map((option) => {
              const checked = selectedAdditions.some((a) => a.id === option.id);
              return (
                <label
                  key={option.id}
                  className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer text-xs text-neutral-800 select-none"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAddition(option)}
                      className="w-3.5 h-3.5 rounded accent-[#D92525]"
                    />
                    <span className="font-medium">{option.name}</span>
                  </span>
                  <span className="font-mono text-neutral-600 tabular-nums">
                    +{formatCOP(option.price)}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="mt-2.5 pt-2 border-t border-neutral-100 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-[#0E0E10] hover:underline cursor-pointer"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const CartView: React.FC<CartViewProps> = ({
  cartItems,
  menuItems,
  sauces,
  additions,
  deliveryFeeConfig,
  freeDeliveryThreshold,
  onUpdateCartItem,
  onRemoveCartItem,
  onAddMenuItem,
  onSubmitOrder,
  onNavigate,
}) => {
  const [quickAddId, setQuickAddId] = useState<string>(menuItems[0]?.id || '');
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('domicilio');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [reference, setReference] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [cashPaidWith, setCashPaidWith] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + getCartItemLineTotal(item), 0);
  const qualifiesFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryFee =
    cartItems.length === 0 || deliveryType === 'recoger' || qualifiesFreeDelivery
      ? 0
      : deliveryFeeConfig;
  const total = subtotal + deliveryFee;

  const parsedCash = Number(cashPaidWith.replace(/\D/g, '')) || 0;
  const changeDue = parsedCash > total ? parsedCash - total : 0;

  const handleQuickAddSubmit = () => {
    const found = menuItems.find((m) => m.id === quickAddId);
    if (found) onAddMenuItem(found);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (cartItems.length === 0) {
      setFormError('Agrega al menos un producto antes de confirmar tu pedido.');
      return;
    }
    if (!name.trim()) {
      setFormError('Ingresa el nombre de quien recibe el pedido.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 7) {
      setFormError('Ingresa un número de teléfono o WhatsApp válido.');
      return;
    }
    if (deliveryType === 'domicilio' && !address.trim()) {
      setFormError('Ingresa la dirección de entrega en Tuluá.');
      return;
    }

    const order = onSubmitOrder({
      name: name.trim(),
      phone: phone.trim(),
      deliveryType,
      address: deliveryType === 'domicilio' ? address.trim() : '',
      neighborhood: deliveryType === 'domicilio' ? neighborhood.trim() : '',
      reference: reference.trim(),
      paymentMethod,
      cashPaidWith: paymentMethod === 'efectivo' && parsedCash > 0 ? parsedCash : undefined,
    });

    setConfirmedOrder(order);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopySummary = () => {
    if (!confirmedOrder) return;
    navigator.clipboard?.writeText(buildWhatsAppOrderSummary(confirmedOrder));
    setCopiedWhatsApp(true);
    window.setTimeout(() => setCopiedWhatsApp(false), 2000);
  };

  /* CONFIRMED RECEIPT VIEW */
  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] text-[#141417] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="flex items-center justify-between gap-4 pb-6 border-b border-neutral-200">
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
                Pedido enviado a cocina
              </p>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0E0E10]">
                ¡Gracias, {confirmedOrder.customer.name}!
              </h1>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500">Comanda</p>
              <p className="font-mono text-xl font-bold text-[#D92525] tabular-nums">
                {confirmedOrder.orderNumber}
              </p>
            </div>
          </div>

          <div className="py-6 space-y-3 border-b border-neutral-200 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-neutral-500">Modalidad</span>
              <span className="font-medium text-neutral-900">
                {confirmedOrder.customer.deliveryType === 'domicilio'
                  ? `Domicilio · ${confirmedOrder.customer.address}${confirmedOrder.customer.neighborhood ? `, ${confirmedOrder.customer.neighborhood}` : ''}`
                  : 'Recoger en local (La Casa de la Salchipapa)'}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-neutral-500">Teléfono</span>
              <span className="font-mono text-neutral-900">{confirmedOrder.customer.phone}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-neutral-500">Método de pago</span>
              <span className="font-medium text-neutral-900 capitalize">
                {confirmedOrder.customer.paymentMethod}
                {confirmedOrder.customer.cashPaidWith &&
                  confirmedOrder.customer.cashPaidWith > confirmedOrder.total &&
                  ` (Paga con ${formatCOP(confirmedOrder.customer.cashPaidWith)})`}
              </span>
            </div>
          </div>

          <div className="py-6 border-b border-neutral-200">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-4">
              Resumen de productos
            </h2>
            <ul className="space-y-4">
              {confirmedOrder.items.map((item) => (
                <li key={item.cartItemId} className="flex justify-between gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-[#0E0E10]">
                      {item.quantity}x {item.name}
                    </p>
                    {item.supportsCustomization && (
                      <p className="text-xs text-neutral-600 mt-0.5">
                        Salsas:{' '}
                        {item.selectedSauces.length > 0
                          ? item.selectedSauces.join(', ') + (item.saucesOnSide ? ' (aparte)' : '')
                          : 'Sin salsas'}
                      </p>
                    )}
                    {item.selectedAdditions.length > 0 && (
                      <p className="text-xs text-neutral-600">
                        Adiciones: {item.selectedAdditions.map((a) => a.name).join(', ')}
                      </p>
                    )}
                    {item.note && (
                      <p className="text-xs text-neutral-500 italic">Nota: {item.note}</p>
                    )}
                  </div>
                  <span className="font-mono font-semibold text-neutral-900 tabular-nums shrink-0">
                    {formatCOP(getCartItemLineTotal(item))}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="py-5 space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">{formatCOP(confirmedOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Domicilio</span>
              <span className="font-mono tabular-nums">
                {confirmedOrder.deliveryFee === 0 ? 'Gratis' : formatCOP(confirmedOrder.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#0E0E10] pt-2 border-t border-neutral-100">
              <span>Total a pagar</span>
              <span className="font-mono tabular-nums">{formatCOP(confirmedOrder.total)}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => onNavigate('central')}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#0E0E10] text-white text-sm font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#F5B800]" />
              <span>Ver este pedido en Central de Cocina</span>
            </button>
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-neutral-300 text-neutral-800 text-sm font-semibold hover:bg-neutral-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              {copiedWhatsApp ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Resumen copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar para WhatsApp</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setConfirmedOrder(null);
                onNavigate('home');
              }}
              className="text-xs font-medium text-neutral-500 hover:text-[#0E0E10] underline underline-offset-4 cursor-pointer"
            >
              Volver al inicio y hacer otro pedido
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#141417] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
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

          {/* Quick-Add Bar right inside Cart */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={quickAddId}
              onChange={(e) => setQuickAddId(e.target.value)}
              aria-label="Seleccionar producto para agregar rápido"
              className="flex-1 sm:w-64 px-3 py-2.5 rounded-lg bg-white border border-neutral-300 text-sm text-neutral-800 focus:outline-none focus:border-[#0E0E10]"
            >
              {menuItems.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {formatCOP(m.price)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleQuickAddSubmit}
              className="px-4 py-2.5 rounded-lg bg-[#0E0E10] text-white text-sm font-semibold hover:bg-neutral-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#F5B800]" />
              <span>Añadir</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items with Compact Dropdowns */}
          <div className="lg:col-span-7 space-y-4">
            {cartItems.length === 0 ? (
              <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
                <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                <h2 className="font-display font-bold text-xl text-[#0E0E10] mb-1">
                  Tu pedido está vacío
                </h2>
                <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-6">
                  Agrega tus salchipapas, perros, hamburguesas o bebidas favoritas desde la carta o
                  usando el selector rápido arriba.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="px-6 py-3 rounded-xl bg-[#F5B800] text-[#0E0E10] text-sm font-semibold hover:bg-[#e5ad00] transition-colors cursor-pointer"
                >
                  Explorar el menú
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const unitTotal = getCartItemUnitTotal(item);
                const lineTotal = getCartItemLineTotal(item);
                const showNoteInput = expandedNoteId === item.cartItemId || item.note.length > 0;

                return (
                  <div
                    key={item.cartItemId}
                    className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 transition-colors hover:border-neutral-300"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover bg-neutral-900 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-base text-[#0E0E10] truncate">
                              {item.name}
                            </h3>
                            <p className="text-xs text-neutral-500 font-mono tabular-nums mt-0.5">
                              Base {formatCOP(item.basePrice)}
                              {unitTotal > item.basePrice &&
                                ` · Con adiciones ${formatCOP(unitTotal)} c/u`}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="font-mono text-base font-bold text-[#0E0E10] tabular-nums">
                              {formatCOP(lineTotal)}
                            </p>
                          </div>
                        </div>

                        {/* Compact Dropdowns for Sauces & Additions */}
                        {item.supportsCustomization ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5">
                            <SauceDropdown
                              sauces={sauces}
                              selectedSauces={item.selectedSauces}
                              saucesOnSide={item.saucesOnSide}
                              onChange={(nextSauces, onSide) =>
                                onUpdateCartItem(item.cartItemId, (curr) => ({
                                  ...curr,
                                  selectedSauces: nextSauces,
                                  saucesOnSide: onSide,
                                }))
                              }
                            />

                            <AdditionsDropdown
                              additions={additions}
                              selectedAdditions={item.selectedAdditions}
                              onChange={(nextAdditions) =>
                                onUpdateCartItem(item.cartItemId, (curr) => ({
                                  ...curr,
                                  selectedAdditions: nextAdditions,
                                }))
                              }
                            />
                          </div>
                        ) : (
                          <div className="mt-3">
                            <input
                              type="text"
                              value={item.note}
                              onChange={(e) =>
                                onUpdateCartItem(item.cartItemId, (curr) => ({
                                  ...curr,
                                  note: e.target.value,
                                }))
                              }
                              placeholder="Ej: Coca-Cola, Colombiana, Hit Mora..."
                              className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10]"
                            />
                          </div>
                        )}

                        {/* Quantity Stepper + Optional Note Toggle + Remove */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-neutral-100">
                          <div className="flex items-center gap-1 border border-neutral-200 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (item.quantity <= 1) {
                                  onRemoveCartItem(item.cartItemId);
                                } else {
                                  onUpdateCartItem(item.cartItemId, (curr) => ({
                                    ...curr,
                                    quantity: curr.quantity - 1,
                                  }));
                                }
                              }}
                              className="p-1.5 text-neutral-600 hover:text-[#0E0E10] hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-mono text-sm font-semibold tabular-nums text-[#0E0E10]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateCartItem(item.cartItemId, (curr) => ({
                                  ...curr,
                                  quantity: curr.quantity + 1,
                                }))
                              }
                              className="p-1.5 text-neutral-600 hover:text-[#0E0E10] hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            {item.supportsCustomization && !showNoteInput && (
                              <button
                                type="button"
                                onClick={() => setExpandedNoteId(item.cartItemId)}
                                className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-[#0E0E10] transition-colors cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Nota cocina</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => onRemoveCartItem(item.cartItemId)}
                              className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-[#D92525] transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Quitar</span>
                            </button>
                          </div>
                        </div>

                        {item.supportsCustomization && showNoteInput && (
                          <div className="mt-3">
                            <input
                              type="text"
                              value={item.note}
                              onChange={(e) =>
                                onUpdateCartItem(item.cartItemId, (curr) => ({
                                  ...curr,
                                  note: e.target.value,
                                }))
                              }
                              placeholder="Nota opcional (ej: sin tomate, papas bien crocantes...)"
                              className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10] focus:bg-white"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Sticky Delivery & Customer Info Form */}
          <form
            onSubmit={handlePlaceOrder}
            className="lg:col-span-5 lg:sticky lg:top-24 bg-white border border-neutral-200 rounded-2xl p-6 space-y-5"
          >
            <div className="pb-4 border-b border-neutral-100">
              <h2 className="font-display font-bold text-xl text-[#0E0E10]">
                Datos de entrega y pago
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Sin registro · Tu pedido entra directo a la cocina
              </p>
            </div>

            {/* Delivery Mode Segmented Control */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-100 rounded-xl">
              <button
                type="button"
                onClick={() => setDeliveryType('domicilio')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  deliveryType === 'domicilio'
                    ? 'bg-[#0E0E10] text-white shadow-sm'
                    : 'text-neutral-600 hover:text-[#0E0E10]'
                }`}
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Domicilio</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('recoger')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  deliveryType === 'recoger'
                    ? 'bg-[#0E0E10] text-white shadow-sm'
                    : 'text-neutral-600 hover:text-[#0E0E10]'
                }`}
              >
                <Store className="w-4 h-4 shrink-0" />
                <span>Recoger</span>
              </button>
            </div>

            {/* Customer Fields */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nombre de quien recibe *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Daniela Gómez"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej: 315 842 9104"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm font-mono text-neutral-900 placeholder:font-sans placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10]"
                />
              </div>

              {deliveryType === 'domicilio' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ej: Calle 26 # 31-14"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Barrio (Tuluá)
                      </label>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="Ej: Sajonia, Victoria..."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Referencia (opcional)
                    </label>
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Casa reja blanca, apartamento 201..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10]"
                    />
                  </div>
                </>
              )}

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Forma de pago
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['efectivo', 'nequi', 'daviplata'] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-colors cursor-pointer ${
                        paymentMethod === method
                          ? 'border-[#0E0E10] bg-[#0E0E10] text-white'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'efectivo' && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    ¿Con cuánto pagas? (para llevar vueltas exactas)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cashPaidWith}
                    onChange={(e) => setCashPaidWith(e.target.value)}
                    placeholder="Ej: 50000"
                    className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm font-mono text-neutral-900 placeholder:font-sans placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10]"
                  />
                  {changeDue > 0 && (
                    <p className="text-xs text-emerald-700 font-medium mt-1 font-mono tabular-nums">
                      El domiciliario llevará {formatCOP(changeDue)} de cambio.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Order Totals */}
            <div className="pt-4 border-t border-neutral-200 space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">{formatCOP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>
                  Domicilio{' '}
                  {deliveryType === 'domicilio' && !qualifiesFreeDelivery && cartItems.length > 0 && (
                    <span className="text-xs text-neutral-400">
                      (Gratis desde {formatCOP(freeDeliveryThreshold)})
                    </span>
                  )}
                </span>
                <span className="font-mono tabular-nums">
                  {deliveryFee === 0 ? 'Gratis' : formatCOP(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#0E0E10] pt-2 border-t border-neutral-100">
                <span>Total</span>
                <span className="font-mono tabular-nums">{formatCOP(total)}</span>
              </div>
            </div>

            {formError && (
              <p className="text-xs font-medium text-[#D92525] bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={cartItems.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#F5B800] text-[#0E0E10] font-bold text-sm sm:text-base hover:bg-[#e5ad00] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span>Confirmar pedido</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
