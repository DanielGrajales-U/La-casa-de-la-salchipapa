import React, { useState, useMemo } from 'react';
import {
  Search,
  Clock,
  MapPin,
  Store,
  CheckCircle2,
  Flame,
  Bell,
  Copy,
  Check,
  Plus,
  XCircle,
  ClipboardList,
  LayoutGrid,
  Phone,
} from 'lucide-react';
import { DeliveryType, Order, OrderStatus } from '../types/order';
import {
  buildWhatsAppOrderSummary,
  formatClockTime,
  formatCOP,
  formatTimeAgo,
  getCartItemLineTotal,
} from '../utils/formatters';

interface CentralPedidosViewProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onSimulateIncomingOrder: () => void;
}

const STATUS_META: Record<
  OrderStatus,
  {
    label: string;
    textClass: string;
    bgClass: string;
    nextStatus?: OrderStatus;
    nextLabel?: string;
  }
> = {
  nuevo: {
    label: 'Nuevo',
    textClass: 'text-[#D92525]',
    bgClass: 'bg-red-50 border-red-200',
    nextStatus: 'en_cocina',
    nextLabel: 'Aceptar y pasar a cocina',
  },
  en_cocina: {
    label: 'En cocina',
    textClass: 'text-amber-700',
    bgClass: 'bg-amber-50 border-amber-200',
    nextStatus: 'listo',
    nextLabel: 'Marcar listo',
  },
  listo: {
    label: 'Listo para entrega',
    textClass: 'text-blue-700',
    bgClass: 'bg-blue-50 border-blue-200',
    nextStatus: 'entregado',
    nextLabel: 'Confirmar entregado',
  },
  entregado: {
    label: 'Entregado',
    textClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50 border-emerald-200',
  },
  cancelado: {
    label: 'Cancelado',
    textClass: 'text-neutral-500',
    bgClass: 'bg-neutral-100 border-neutral-200',
  },
};

export const CentralPedidosView: React.FC<CentralPedidosViewProps> = ({
  orders,
  onUpdateStatus,
  onSimulateIncomingOrder,
}) => {
  const [viewMode, setViewMode] = useState<'cocina' | 'dueno'>('cocina');
  const [statusFilter, setStatusFilter] = useState<'activos' | 'todos' | OrderStatus>('activos');
  const [deliveryFilter, setDeliveryFilter] = useState<'todos' | DeliveryType>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const nuevos = orders.filter((o) => o.status === 'nuevo').length;
    const enCocina = orders.filter((o) => o.status === 'en_cocina').length;
    const listos = orders.filter((o) => o.status === 'listo').length;
    const validOrders = orders.filter((o) => o.status !== 'cancelado');
    const totalSales = validOrders.reduce((sum, o) => sum + o.total, 0);

    const byPayment = {
      efectivo: validOrders
        .filter((o) => o.customer.paymentMethod === 'efectivo')
        .reduce((sum, o) => sum + o.total, 0),
      nequi: validOrders
        .filter((o) => o.customer.paymentMethod === 'nequi')
        .reduce((sum, o) => sum + o.total, 0),
      daviplata: validOrders
        .filter((o) => o.customer.paymentMethod === 'daviplata')
        .reduce((sum, o) => sum + o.total, 0),
    };

    const avgTicket = validOrders.length > 0 ? totalSales / validOrders.length : 0;

    return { nuevos, enCocina, listos, totalSales, byPayment, avgTicket, validCount: validOrders.length };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter === 'activos') {
        if (order.status === 'entregado' || order.status === 'cancelado') return false;
      } else if (statusFilter !== 'todos' && order.status !== statusFilter) {
        return false;
      }

      if (deliveryFilter !== 'todos' && order.customer.deliveryType !== deliveryFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchOrder = order.orderNumber.toLowerCase().includes(q);
        const matchName = order.customer.name.toLowerCase().includes(q);
        const matchPhone = order.customer.phone.toLowerCase().includes(q);
        const matchHood = order.customer.neighborhood.toLowerCase().includes(q);
        if (!matchOrder && !matchName && !matchPhone && !matchHood) return false;
      }

      return true;
    });
  }, [orders, statusFilter, deliveryFilter, searchQuery]);

  const handleCopyTicket = (order: Order) => {
    navigator.clipboard?.writeText(buildWhatsAppOrderSummary(order));
    setCopiedId(order.id);
    window.setTimeout(() => setCopiedId((prev) => (prev === order.id ? null : prev)), 1800);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#141417] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Operational Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 mb-6 border-b border-neutral-200">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#D92525] mb-1">
              Operación en Tiempo Real · Tuluá
            </p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0E0E10] tracking-tight">
              Central de Pedidos
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              Vista diseñada para que el dueño controle ventas y los cocineros preparen cada comanda sin revisar WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle: Kitchen Tickets vs Owner Table */}
            <div className="flex items-center p-1 bg-neutral-200/75 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('cocina')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'cocina'
                    ? 'bg-[#0E0E10] text-white'
                    : 'text-neutral-700 hover:text-[#0E0E10]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Comandas Cocina</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('dueno')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'dueno'
                    ? 'bg-[#0E0E10] text-white'
                    : 'text-neutral-700 hover:text-[#0E0E10]'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Resumen Dueño</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onSimulateIncomingOrder}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F5B800] text-[#0E0E10] text-xs sm:text-sm font-bold hover:bg-[#e5ad00] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Simular pedido nuevo</span>
            </button>
          </div>
        </div>

        {/* Clean 4-Column Operational KPI Strip (single elevation, hairline dividers) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 bg-white border border-neutral-200 rounded-xl divide-y lg:divide-y-0 lg:divide-x divide-neutral-200 mb-6 overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-neutral-500 mb-1.5">
              <span>Nuevos por aceptar</span>
              <Bell className="w-4 h-4 text-[#D92525]" />
            </div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[#0E0E10] tabular-nums">
              {stats.nuevos}
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-neutral-500 mb-1.5">
              <span>En cocina</span>
              <Flame className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[#0E0E10] tabular-nums">
              {stats.enCocina}
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-neutral-500 mb-1.5">
              <span>Listos para entrega</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[#0E0E10] tabular-nums">
              {stats.listos}
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between text-xs font-medium text-neutral-500 mb-1.5">
              <span>Ventas del turno ({stats.validCount})</span>
            </div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[#0E0E10] tabular-nums">
              {formatCOP(stats.totalSales)}
            </p>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-1.5 bg-white border border-neutral-200 p-1 rounded-xl">
            {(
              [
                { id: 'activos', label: 'Activos' },
                { id: 'nuevo', label: 'Nuevos' },
                { id: 'en_cocina', label: 'En cocina' },
                { id: 'listo', label: 'Listos' },
                { id: 'entregado', label: 'Entregados' },
                { id: 'todos', label: 'Todos' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-[#0E0E10] text-white'
                    : 'text-neutral-600 hover:text-[#0E0E10]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value as 'todos' | DeliveryType)}
              aria-label="Filtrar por tipo de entrega"
              className="px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-medium text-neutral-700 focus:outline-none focus:border-[#0E0E10]"
            >
              <option value="todos">Domicilio y Recoger</option>
              <option value="domicilio">Solo Domicilio</option>
              <option value="recoger">Solo Recoger</option>
            </select>

            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar #pedido, cliente o barrio..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10]"
              />
            </div>
          </div>
        </div>

        {/* VIEW 1: KITCHEN COMANDAS GRID */}
        {viewMode === 'cocina' ? (
          filteredOrders.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
              <p className="font-display font-bold text-lg text-[#0E0E10] mb-1">
                No hay pedidos en esta vista
              </p>
              <p className="text-sm text-neutral-500 mb-5">
                Cambia el filtro de estado o simula un pedido entrante para probar el flujo de cocina.
              </p>
              <button
                type="button"
                onClick={() => setStatusFilter('todos')}
                className="px-4 py-2 rounded-lg bg-[#0E0E10] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Mostrar todos los pedidos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredOrders.map((order) => {
                const meta = STATUS_META[order.status];
                const isCopied = copiedId === order.id;

                return (
                  <article
                    key={order.id}
                    className="flex flex-col bg-white border border-neutral-200 rounded-xl overflow-hidden"
                  >
                    {/* Ticket Header */}
                    <div className="px-5 py-4 border-b border-neutral-200 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-[#0E0E10] tabular-nums">
                            {order.orderNumber}
                          </span>
                          <span aria-hidden="true" className="text-neutral-300">
                            ·
                          </span>
                          <span className={`text-xs font-semibold ${meta.textClass}`}>
                            {meta.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span className="tabular-nums">{formatClockTime(order.createdAt)}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatTimeAgo(order.createdAt)}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-800">
                          {order.customer.deliveryType === 'domicilio' ? (
                            <>
                              <MapPin className="w-3.5 h-3.5 text-[#D92525]" />
                              <span>Domicilio</span>
                            </>
                          ) : (
                            <>
                              <Store className="w-3.5 h-3.5 text-[#0E0E10]" />
                              <span>Recoger</span>
                            </>
                          )}
                        </span>
                        <p className="font-mono text-sm font-bold text-[#0E0E10] tabular-nums mt-0.5">
                          {formatCOP(order.total)}
                        </p>
                      </div>
                    </div>

                    {/* Customer & Logistics Block */}
                    <div className="px-5 py-3.5 bg-neutral-50 border-b border-neutral-200 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-neutral-900 text-sm">
                          {order.customer.name}
                        </span>
                        <span className="font-mono text-neutral-600 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {order.customer.phone}
                        </span>
                      </div>

                      {order.customer.deliveryType === 'domicilio' ? (
                        <p className="text-neutral-700">
                          {order.customer.address}
                          {order.customer.neighborhood && ` · ${order.customer.neighborhood}`}
                        </p>
                      ) : (
                        <p className="text-neutral-600">El cliente pasa a recoger en el local.</p>
                      )}

                      {order.customer.reference && (
                        <p className="text-neutral-500">Ref: {order.customer.reference}</p>
                      )}

                      <p className="text-neutral-700 pt-1">
                        Pago:{' '}
                        <span className="font-semibold uppercase">
                          {order.customer.paymentMethod}
                        </span>
                        {order.customer.paymentMethod === 'efectivo' &&
                          order.customer.cashPaidWith &&
                          order.customer.cashPaidWith > order.total && (
                            <span className="font-mono text-[#D92525] font-semibold ml-1.5 tabular-nums">
                              (Paga {formatCOP(order.customer.cashPaidWith)} · Cambio{' '}
                              {formatCOP(order.customer.cashPaidWith - order.total)})
                            </span>
                          )}
                      </p>
                    </div>

                    {/* Kitchen Itemized Comanda List */}
                    <div className="flex-1 px-5 py-4 space-y-3.5">
                      {order.items.map((item) => (
                        <div
                          key={item.cartItemId}
                          className="pb-3 last:pb-0 border-b last:border-b-0 border-neutral-100"
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-sm font-bold text-[#0E0E10]">
                              <span className="font-mono text-[#D92525] mr-1.5 tabular-nums">
                                {item.quantity}x
                              </span>
                              {item.name}
                            </p>
                            <span className="font-mono text-xs text-neutral-500 tabular-nums shrink-0">
                              {formatCOP(getCartItemLineTotal(item))}
                            </span>
                          </div>

                          {item.supportsCustomization && (
                            <div className="mt-1.5 pl-5 space-y-1 text-xs">
                              <p className="text-neutral-700">
                                <span className="text-neutral-500">Salsas: </span>
                                <span className="font-medium">
                                  {item.selectedSauces.length > 0
                                    ? item.selectedSauces.join(', ') +
                                      (item.saucesOnSide ? ' — APARTE' : '')
                                    : 'Sin salsas'}
                                </span>
                              </p>

                              {item.selectedAdditions.length > 0 && (
                                <p className="text-[#0E0E10] font-semibold">
                                  <span className="text-[#D92525]">Adiciones: </span>
                                  {item.selectedAdditions.map((a) => a.name).join(', ')}
                                </p>
                              )}
                            </div>
                          )}

                          {item.note && (
                            <p className="mt-1 pl-5 text-xs text-amber-800 font-medium">
                              Nota: {item.note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Kitchen Action Footer */}
                    <div className="px-5 py-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center gap-2">
                      {meta.nextStatus && meta.nextLabel ? (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(order.id, meta.nextStatus!)}
                          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                            order.status === 'nuevo'
                              ? 'bg-[#D92525] text-white hover:bg-[#b91c1c]'
                              : order.status === 'en_cocina'
                                ? 'bg-[#F5B800] text-[#0E0E10] hover:bg-[#e5ad00]'
                                : 'bg-[#0E0E10] text-white hover:bg-neutral-800'
                          }`}
                        >
                          {meta.nextLabel}
                        </button>
                      ) : (
                        <span className="flex-1 text-xs font-medium text-neutral-500">
                          {order.status === 'entregado'
                            ? 'Pedido completado'
                            : 'Pedido cancelado'}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCopyTicket(order)}
                        className="p-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:border-[#0E0E10] hover:text-[#0E0E10] transition-colors cursor-pointer shrink-0"
                        title="Copiar comanda para WhatsApp o impresión"
                        aria-label={`Copiar comanda ${order.orderNumber}`}
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      {order.status !== 'entregado' && order.status !== 'cancelado' && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(order.id, 'cancelado')}
                          className="p-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-500 hover:border-red-300 hover:text-[#D92525] transition-colors cursor-pointer shrink-0"
                          title="Cancelar pedido"
                          aria-label={`Cancelar pedido ${order.orderNumber}`}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )
        ) : (
          /* VIEW 2: OWNER FINANCIAL SUMMARY & HIGH-DENSITY ORDERS TABLE */
          <div className="space-y-6">
            {/* Payment Breakdown Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-neutral-200 rounded-xl p-4">
                <p className="text-xs text-neutral-500">Caja Efectivo</p>
                <p className="font-mono text-lg font-bold text-[#0E0E10] tabular-nums mt-1">
                  {formatCOP(stats.byPayment.efectivo)}
                </p>
              </div>
              <div className="bg-white border border-neutral-200 rounded-xl p-4">
                <p className="text-xs text-neutral-500">Recibido en Nequi</p>
                <p className="font-mono text-lg font-bold text-[#0E0E10] tabular-nums mt-1">
                  {formatCOP(stats.byPayment.nequi)}
                </p>
              </div>
              <div className="bg-white border border-neutral-200 rounded-xl p-4">
                <p className="text-xs text-neutral-500">Recibido en Daviplata</p>
                <p className="font-mono text-lg font-bold text-[#0E0E10] tabular-nums mt-1">
                  {formatCOP(stats.byPayment.daviplata)}
                </p>
              </div>
              <div className="bg-white border border-neutral-200 rounded-xl p-4">
                <p className="text-xs text-neutral-500">Ticket promedio</p>
                <p className="font-mono text-lg font-bold text-[#0E0E10] tabular-nums mt-1">
                  {formatCOP(stats.avgTicket)}
                </p>
              </div>
            </div>

            {/* Structured Table */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-500">
                      <th className="py-3 px-4">Comanda</th>
                      <th className="py-3 px-4">Hora</th>
                      <th className="py-3 px-4">Cliente</th>
                      <th className="py-3 px-4">Entrega</th>
                      <th className="py-3 px-4">Pago</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Total</th>
                      <th className="py-3 px-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-sm">
                    {filteredOrders.map((order) => {
                      const meta = STATUS_META[order.status];
                      const isExpanded = expandedRowId === order.id;

                      return (
                        <React.Fragment key={order.id}>
                          <tr
                            onClick={() =>
                              setExpandedRowId((prev) => (prev === order.id ? null : order.id))
                            }
                            className="hover:bg-neutral-50 transition-colors cursor-pointer"
                          >
                            <td className="py-3 px-4 font-mono text-xs font-bold text-[#0E0E10] tabular-nums whitespace-nowrap">
                              {order.orderNumber}
                            </td>
                            <td className="py-3 px-4 font-mono text-xs text-neutral-600 tabular-nums whitespace-nowrap">
                              {formatClockTime(order.createdAt)}
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-medium text-neutral-900">{order.customer.name}</p>
                              <p className="text-xs font-mono text-neutral-500">
                                {order.customer.phone}
                              </p>
                            </td>
                            <td className="py-3 px-4 text-xs text-neutral-700">
                              {order.customer.deliveryType === 'domicilio'
                                ? `${order.customer.neighborhood || 'Domicilio'} · ${order.customer.address}`
                                : 'Recoger en local'}
                            </td>
                            <td className="py-3 px-4 text-xs font-medium uppercase text-neutral-700">
                              {order.customer.paymentMethod}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`text-xs font-semibold ${meta.textClass}`}>
                                {meta.label}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-semibold text-[#0E0E10] tabular-nums whitespace-nowrap">
                              {formatCOP(order.total)}
                            </td>
                            <td
                              className="py-3 px-4 text-right whitespace-nowrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {meta.nextStatus && meta.nextLabel ? (
                                <button
                                  type="button"
                                  onClick={() => onUpdateStatus(order.id, meta.nextStatus!)}
                                  className="px-3 py-1.5 rounded-lg bg-[#0E0E10] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                                >
                                  {meta.nextLabel}
                                </button>
                              ) : (
                                <span className="text-xs text-neutral-400">—</span>
                              )}
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr className="bg-neutral-50/80">
                              <td colSpan={8} className="px-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <p className="font-semibold text-neutral-700 mb-2">
                                      Productos incluidos:
                                    </p>
                                    <ul className="space-y-1.5">
                                      {order.items.map((it) => (
                                        <li key={it.cartItemId} className="text-neutral-700">
                                          <span className="font-semibold">
                                            {it.quantity}x {it.name}
                                          </span>
                                          {it.supportsCustomization && (
                                            <span className="text-neutral-500">
                                              {' '}
                                              — Salsas:{' '}
                                              {it.selectedSauces.join(', ') || 'Sin salsas'}
                                              {it.selectedAdditions.length > 0 &&
                                                ` · Adiciones: ${it.selectedAdditions.map((a) => a.name).join(', ')}`}
                                            </span>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="flex flex-col justify-between items-start md:items-end">
                                    <div className="text-neutral-600 md:text-right">
                                      <p>
                                        Subtotal:{' '}
                                        <span className="font-mono tabular-nums">
                                          {formatCOP(order.subtotal)}
                                        </span>{' '}
                                        · Domicilio:{' '}
                                        <span className="font-mono tabular-nums">
                                          {formatCOP(order.deliveryFee)}
                                        </span>
                                      </p>
                                      {order.customer.reference && (
                                        <p className="mt-1">Referencia: {order.customer.reference}</p>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyTicket(order)}
                                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E0E10] hover:underline cursor-pointer"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Copiar detalle WhatsApp</span>
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
