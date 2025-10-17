import { create } from "zustand";
import {
  Order,
  OrderFormData,
  ReturnOrder,
  ReturnOrderFormData,
  OrderItem,
  ReturnItem,
  SKU,
} from "../models/Order";

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

// This is a mock implementation. In a real application, these would connect to an API
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

      // Mock API call - in a real app, this would be an API request
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock SKUs data
      const mockSKUs: SKU[] = [
        {
          id: "SKU001",
          name: "Product A",
          description: "A high-quality product for everyday use",
          price: 250,
          costPerUnit: 200,
        },
        {
          id: "SKU002",
          name: "Product B",
          description: "Premium product with extra features",
          price: 350,
          costPerUnit: 280,
        },
        {
          id: "SKU003",
          name: "Product C",
          description: "Economy version for budget-conscious customers",
          price: 150,
          costPerUnit: 100,
        },
        {
          id: "SKU004",
          name: "Product D",
          description: "Specialized product for specific needs",
          price: 450,
          costPerUnit: 380,
        },
      ];

      set({ skus: mockSKUs, loading: false });
      return mockSKUs;
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

      // Mock API call - in a real app, this would be an API request
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Calculate total amount
      let totalAmount = 0;

      // Calculate total for order items
      orderData.orderItems.forEach((item) => {
        totalAmount += item.sku.price * item.quantity;
      });

      // Apply discount (mock implementation)
      let discountAmount = 0;
      if (orderData.discountCode) {
        // Simple mock discount - 10% off
        discountAmount = Math.round(totalAmount * 0.1);
      }

      const finalAmount = totalAmount - discountAmount;

      const newOrder: Order = {
        id: Date.now().toString(), // Generate a temporary ID
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

      // Mock API call - in a real app, this would be an API request
      await new Promise((resolve) => setTimeout(resolve, 500));

      // If we don't have any orders yet, create some mock data
      if (get().orders.length === 0) {
        // First ensure we have SKUs
        const skus =
          get().skus.length > 0 ? get().skus : await get().fetchSKUs();

        // Mock Orders
        const mockOrders: Order[] = [
          {
            id: "1",
            shopId: "1",
            orderItems: [
              { sku: skus[0], quantity: 5 },
              { sku: skus[1], quantity: 2 },
            ],
            totalAmount: 1950, // (250 * 5) + (350 * 2)
            discountAmount: 0,
            finalAmount: 1950,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          },
          {
            id: "2",
            shopId: "2",
            orderItems: [{ sku: skus[2], quantity: 10 }],
            totalAmount: 1500, // (150 * 10)
            discountAmount: 105, // 10% discount
            finalAmount: 945,
            discountCode: "SUMMER10",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          },
        ];

        set({ orders: mockOrders, loading: false });
        return mockOrders;
      }

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

      // Mock API call - in a real app, this would be an API request
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Calculate total amount for returns
      let totalAmount = 0;

      // Calculate total for return items
      returnData.returnItems.forEach((item) => {
        totalAmount += item.sku.price * item.quantity;
      });

      const newReturnOrder: ReturnOrder = {
        id: Date.now().toString(), // Generate a temporary ID
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

      // Mock API call - in a real app, this would be an API request
      await new Promise((resolve) => setTimeout(resolve, 500));

      // If we don't have any return orders yet, create some mock data
      if (get().returnOrders.length === 0) {
        // First ensure we have SKUs
        const skus =
          get().skus.length > 0 ? get().skus : await get().fetchSKUs();

        // Mock Return Orders
        const mockReturnOrders: ReturnOrder[] = [
          {
            id: "1",
            shopId: "1",
            returnItems: [{ sku: skus[1], quantity: 1 }],
            totalAmount: 350,
            reasonCode: "DAMAGED",
            notes: "Product was damaged during delivery",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          },
          {
            id: "2",
            shopId: "2",
            returnItems: [{ sku: skus[3], quantity: 1 }],
            totalAmount: 450,
            reasonCode: "WRONG_ITEM",
            notes: "Customer received incorrect item",
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          },
        ];

        set({ returnOrders: mockReturnOrders, loading: false });
        return mockReturnOrders;
      }

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

      // Mock API call - in a real app, this would validate the discount code
      await new Promise((resolve) => setTimeout(resolve, 500));

      const orders = [...get().orders];
      const orderIndex = orders.findIndex((order) => order.id === orderId);

      if (orderIndex === -1) {
        throw new Error("Order not found");
      }

      const order = orders[orderIndex];

      // Simple mock discount - 10% off
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
