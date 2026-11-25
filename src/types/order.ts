export type CategoryId = 'salchipapas' | 'hamburguesas' | 'perros' | 'gaseosas';

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  description: string;
  servings?: string;
  image: string;
  featured?: boolean;
  supportsCustomization: boolean;
}

export interface AdditionOption {
  id: string;
  name: string;
  price: number;
}

export interface SauceOption {
  id: string;
  name: string;
}

export interface CartItem {
  cartItemId: string;
  menuItemId: string;
  name: string;
  category: CategoryId;
  basePrice: number;
  image: string;
  quantity: number;
  supportsCustomization: boolean;
  selectedSauces: string[];
  saucesOnSide: boolean;
  selectedAdditions: AdditionOption[];
  note: string;
}

export type DeliveryType = 'domicilio' | 'recoger';

export type PaymentMethod = 'efectivo' | 'nequi' | 'daviplata';

export type OrderStatus = 'nuevo' | 'en_cocina' | 'listo' | 'entregado' | 'cancelado';

export interface CustomerInfo {
  name: string;
  phone: string;
  deliveryType: DeliveryType;
  address: string;
  neighborhood: string;
  reference: string;
  paymentMethod: PaymentMethod;
  cashPaidWith?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export type AppView = 'home' | 'carrito' | 'central';
