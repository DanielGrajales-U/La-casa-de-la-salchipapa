import { OrderStatus } from '../../types/order';

export interface OrderStatusMeta {
  label: string;
  textClass: string;
  nextStatus?: OrderStatus;
  nextLabel?: string;
}

export const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
  nuevo: {
    label: 'Nuevo',
    textClass: 'text-[#D92525]',
    nextStatus: 'en_cocina',
    nextLabel: 'Aceptar y pasar a cocina',
  },
  en_cocina: {
    label: 'En cocina',
    textClass: 'text-amber-700',
    nextStatus: 'listo',
    nextLabel: 'Marcar listo',
  },
  listo: {
    label: 'Listo para entrega',
    textClass: 'text-blue-700',
    nextStatus: 'entregado',
    nextLabel: 'Confirmar entregado',
  },
  entregado: {
    label: 'Entregado',
    textClass: 'text-emerald-700',
  },
  cancelado: {
    label: 'Cancelado',
    textClass: 'text-neutral-500',
  },
};
