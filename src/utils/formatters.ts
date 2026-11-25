import { CartItem, Order } from '../types/order';

export function formatCOP(amount: number): string {
  return '$' + Math.round(amount).toLocaleString('es-CO');
}

export function getCartItemUnitTotal(item: CartItem): number {
  const additionsSum = item.selectedAdditions.reduce((sum, add) => sum + add.price, 0);
  return item.basePrice + additionsSum;
}

export function getCartItemLineTotal(item: CartItem): number {
  return getCartItemUnitTotal(item) * item.quantity;
}

export function formatTimeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMins = Math.max(0, Math.floor(diffMs / 60000));
  if (diffMins < 1) return 'Hace un momento';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  const hours = Math.floor(diffMins / 60);
  const remMins = diffMins % 60;
  return remMins > 0 ? `Hace ${hours}h ${remMins}m` : `Hace ${hours}h`;
}

export function formatClockTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function buildWhatsAppOrderSummary(order: Order): string {
  const lines: string[] = [
    `*PEDIDO ${order.orderNumber} — LA CASA DE LA SALCHIPAPA*`,
    `Cliente: ${order.customer.name}`,
    `Teléfono: ${order.customer.phone}`,
    order.customer.deliveryType === 'domicilio'
      ? `Domicilio: ${order.customer.address}${order.customer.neighborhood ? ` (${order.customer.neighborhood})` : ''}`
      : `Modalidad: Recoger en local`,
  ];

  if (order.customer.deliveryType === 'domicilio' && order.customer.reference) {
    lines.push(`Referencia: ${order.customer.reference}`);
  }

  lines.push('', '*DETALLE DEL PEDIDO:*');
  order.items.forEach((item) => {
    lines.push(`• ${item.quantity}x ${item.name} — ${formatCOP(getCartItemLineTotal(item))}`);
    if (item.supportsCustomization) {
      const saucesText =
        item.selectedSauces.length > 0
          ? item.selectedSauces.join(', ') + (item.saucesOnSide ? ' (aparte)' : '')
          : 'Sin salsas';
      lines.push(`  Salsas: ${saucesText}`);
      if (item.selectedAdditions.length > 0) {
        lines.push(
          `  Adiciones: ${item.selectedAdditions.map((a) => `${a.name} (+${formatCOP(a.price)})`).join(', ')}`
        );
      }
      if (item.note.trim()) {
        lines.push(`  Nota: ${item.note.trim()}`);
      }
    }
  });

  lines.push('');
  lines.push(`Subtotal: ${formatCOP(order.subtotal)}`);
  if (order.deliveryFee > 0) {
    lines.push(`Domicilio: ${formatCOP(order.deliveryFee)}`);
  }
  lines.push(`*TOTAL: ${formatCOP(order.total)}*`);
  lines.push(`Pago: ${order.customer.paymentMethod.toUpperCase()}`);
  if (
    order.customer.paymentMethod === 'efectivo' &&
    order.customer.cashPaidWith &&
    order.customer.cashPaidWith > order.total
  ) {
    lines.push(
      `Paga con: ${formatCOP(order.customer.cashPaidWith)} (Cambio: ${formatCOP(order.customer.cashPaidWith - order.total)})`
    );
  }

  return lines.join('\n');
}
