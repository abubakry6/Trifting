export type Role = 'customer' | 'admin';

export type ProductStatus = 'available' | 'reserved' | 'sold' | 'inactive';

export type ConditionGrade = 
  | 'Grade A+ (Like New)' 
  | 'Grade A (9.5/10)' 
  | 'Grade B+ (Good Condition)' 
  | 'Grade B (Minus Noda Samar)' 
  | 'Vintage Distressed';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  itemCount?: number;
  createdAt?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  brand: string;
  size: string; // e.g. "L (P 72cm x L 56cm)"
  lengthCm?: number;
  widthCm?: number;
  conditionGrade: ConditionGrade;
  conditionNotes?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  status: ProductStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  addedAt: string;
}

export interface ShippingAddress {
  recipientName: string;
  phoneNumber: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  streetAddress: string;
  notes?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  productSize: string;
  productImage: string;
}

export interface Order {
  id: string;
  orderNumber: string; // TRF-YYYYMMDD-XXX
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  shippingCourier: string;
  shippingCost: number;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentMethod: string;
  paymentRef?: string;
  trackingNumber?: string;
  notes?: string;
  items?: OrderItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface Promotion {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: Role;
  avatarUrl?: string;
  defaultAddress?: ShippingAddress;
}
