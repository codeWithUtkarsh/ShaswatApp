import { create } from "zustand";
import {
  Order,
  OrderFormData,
  ReturnOrder,
  ReturnOrderFormData,
  SKU,
} from "../models/Order";
import { shopDB } from "./database";

interface OrderStore {
  orders: Order[];
  returnOrders: ReturnOrder[];
  skus: SKU[];
  loading: boolean;
  error: string | null;
  currentOrder: Order | null;
  currentReturnOrder: ReturnOrder | null;

  // Actions
  fetchSKUs: () => Promise<SKU[]>;
  createOrder: (orderData: OrderFormData) => Promise<Order>;
  createReturnOrder: (returnData: ReturnOrderFormData) => Promise<ReturnOrder>;
  fetchOrders: () => Promise<Order[]>;
  fetchReturnOrders: () => Promise<ReturnOrder[]>;
  getOrderById: (orderId: string) => Order | null;
  getReturnOrderById: (returnOrderId: string) => ReturnOrder | null;
  setCurrentOrder: (order: Order | null) => void;
  setCurrentReturnOrder: (returnOrder: ReturnOrder | null) => void;
  applyDiscount: (orderId: string, discountCode: string) => Promise<Order>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  returnOrders: [],
  skus: [],
  loading: false,
  error: null,
  currentOrder: null,
  currentReturnOrder: null,

  fetchSKUs: async () => {
    try {
      set({ loading: true, error: null });

      await shopDB.initializeSKUs();
      const skus = await shopDB.getAllSKUs();

      set({ skus, loading: false });
      return skus;
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },

  createOrder: async (orderData: OrderFormData) => {
    try {
      set({ loading: true, error: null });

      let totalAmount = 0;

      orderData.orderItems.forEach((item) => {
        totalAmount += item.sku.price * item.quantity;
      });

      let discountAmount = 0;
      if (orderData.discountCode) {
        discountAmount = Math.round(totalAmount * 0.1);
      }

      const finalAmount = totalAmount - discountAmount;

      const newOrder: Order = {
        id: Date.now().toString(),
        ...orderData,
        totalAmount,
        discountAmount,
        finalAmount,
        createdAt: new Date(),
      };

      set((state) => ({
        orders: [...state.orders, newOrder],
        currentOrder: newOrder,
        loading: false,
      }));

      return newOrder;
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },

  fetchOrders: async () => {
    try {
      set({ loading: true, error: null });

      set({ loading: false });
      return get().orders;
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },

  getOrderById: (orderId: string) => {
    return get().orders.find((order) => order.id === orderId) || null;
  },

  createReturnOrder: async (returnData: ReturnOrderFormData) => {
    try {
      set({ loading: true, error: null });

      let totalAmount = 0;

      returnData.returnItems.forEach((item) => {
        totalAmount += item.sku.price * item.quantity;
      });

      const newReturnOrder: ReturnOrder = {
        id: Date.now().toString(),
        ...returnData,
        totalAmount,
        createdAt: new Date(),
      };

      set((state) => ({
        returnOrders: [...state.returnOrders, newReturnOrder],
        currentReturnOrder: newReturnOrder,
        loading: false,
      }));

      return newReturnOrder;
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },

  fetchReturnOrders: async () => {
    try {
      set({ loading: true, error: null });

      set({ loading: false });
      return get().returnOrders;
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },

  getReturnOrderById: (returnOrderId: string) => {
    return (
      get().returnOrders.find(
        (returnOrder) => returnOrder.id === returnOrderId,
      ) || null
    );
  },

  setCurrentOrder: (order: Order | null) => {
    set({ currentOrder: order });
  },

  setCurrentReturnOrder: (returnOrder: ReturnOrder | null) => {
    set({ currentReturnOrder: returnOrder });
  },

  applyDiscount: async (orderId: string, discountCode: string) => {
    try {
      set({ loading: true, error: null });

      const orders = [...get().orders];
      const orderIndex = orders.findIndex((order) => order.id === orderId);

      if (orderIndex === -1) {
        throw new Error("Order not found");
      }

      const order = orders[orderIndex];

      const discountAmount = Math.round(order.totalAmount * 0.1);
      const finalAmount = order.totalAmount - discountAmount;

      const updatedOrder: Order = {
        ...order,
        discountCode,
        discountAmount,
        finalAmount,
      };

      orders[orderIndex] = updatedOrder;

      set({
        orders,
        currentOrder: updatedOrder,
        loading: false,
      });

      return updatedOrder;
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },
}));
