export type ProductCategory = 'All' | 'Electronics' | 'Audio' | 'Wearables' | 'Home & Workspace' | 'Accessories';

export interface Product {
  id: string;
  sku: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  features: string[];
  specs: Record<string, string>;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  badge?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  isGuest: boolean;
  guestEmail?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  transactionId: string;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  timeline: {
    status: OrderStatus;
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  avatar?: string;
  addresses: ShippingAddress[];
  savedPaymentMethod?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: 'order_status' | 'inventory_alert' | 'sale_alert' | 'system';
  orderId?: string;
  orderNumber?: string;
  status?: OrderStatus;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface SalesMetricPoint {
  date: string;
  revenue: number;
  orders: number;
  visitors: number;
}

export interface CategoryBreakdown {
  category: ProductCategory;
  sales: number;
  percentage: number;
  units: number;
}
