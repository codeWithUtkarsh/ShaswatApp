export interface SKU {
  id: string;
  name: string;
  description: string;
  price: number; // Price per unit/piece
  boxPrice: number; // Price per box
  costPerUnit: number;
}

export interface OrderItem {
  sku: SKU;
  quantity: number;
}

export interface ReturnItem {
  sku: SKU;
  quantity: number;
}

export interface Order {
  id?: string;
  shopId: string;
  orderItems: OrderItem[];
  totalAmount: number;
  discountCode?: string;
  discountAmount?: number;
  finalAmount: number;
  createdAt: Date;
}

export interface ReturnOrder {
  id?: string;
  shopId: string;
  linkedOrderId?: string;
  returnItems: ReturnItem[];
  totalAmount: number;
  reasonCode?: string;
  notes?: string;
  createdAt: Date;
}

// This will be used for the order creation form
export interface OrderFormData {
  shopId: string;
  orderItems: OrderItem[];
  discountCode?: string;
}

// This will be used for the return order creation form
export interface ReturnOrderFormData {
  shopId: string;
  linkedOrderId?: string;
  returnItems: ReturnItem[];
  reasonCode?: string;
  notes?: string;
}
