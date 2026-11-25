import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { Order, OrderStatus } from '../../types/order';
import {
  buildWhatsAppOrderSummary,
  formatClockTime,
  formatCOP,
} from '../../utils/formatters';
import { Button } from '../ui/Button';
import { ORDER_STATUS_META } from './orderStatusMeta';

interface OrdersTableProps {
  orders: Order[];
  byPayment: {
    efectivo: number;
    nequi: number;
    daviplata: number;
  };
  avgTicket: number;
  onUpdateStatus: (orderId: string, nextStatus: OrderStatus) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  byPayment,
  avgTicket,
  onUpdateStatus,
}) => {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-xs text-neutral-500">Caja Efectivo</p>
          <p className="font-mono text-lg font-bold text-[#0E0E10] tabular-nums mt-1">
            {formatCOP(byPayment.efectivo)}
          </p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-xs text-neutral-500">Recibido en Nequi</p>
          <p className="font-mono text-lg font-bold text-[#0E0E10] tabular-nums mt-1">
            {formatCOP(byPayment.nequi)}
          </p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-xs text-neutral-500">Recibido en Daviplata</p>
          <p className="font-mono text-lg font-bold text-[#0E0E10] tabular-nums mt-1">
            {formatCOP(byPayment.daviplata)}
          </p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-xs text-neutral-500">Ticket promedio</p>
          <p className="font-mono text-lg font-bold text-[#0E0E10] tabular-nums mt-1">
            {formatCOP(avgTicket)}
          </p>
        </div>
      </div>

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
              {orders.map((order) => {
                const meta = ORDER_STATUS_META[order.status];
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
                          <Button
                            variant="dark"
                            size="sm"
                            onClick={() => onUpdateStatus(order.id, meta.nextStatus!)}
                          >
                            {meta.nextLabel}
                          </Button>
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
                                        — Salsas: {it.selectedSauces.join(', ') || 'Sin salsas'}
                                        {it.selectedAdditions.length > 0 &&
                                          ` · Adiciones: ${it.selectedAdditions
                                            .map((a) => a.name)
                                            .join(', ')}`}
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
                                onClick={() =>
                                  navigator.clipboard?.writeText(buildWhatsAppOrderSummary(order))
                                }
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
  );
};
