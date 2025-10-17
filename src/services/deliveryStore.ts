import { create } from "zustand";
import { Delivery, DeliveryStatus, StatusUpdate, DeliveryFormData } from "../models/Delivery";
import { Order } from "../models/Order";
import { useOrderStore } from "./orderStore";

interface DeliveryStore {
  deliveries: Delivery[];
  currentDelivery: Delivery | null;
  loading: boolean;
  error: string | null;

  // Actions
  addDelivery: (deliveryData: DeliveryFormData) => Promise<Delivery>;
  createDeliveryFromOrder: (order: Order) => Promise<Delivery>;
  fetchDeliveries: () => Promise<Delivery[]>;
  getDeliveryById: (deliveryId: string) => Delivery | null;
  getDeliveryByOrderId: (orderId: string) => Delivery | null;
  updateDeliveryStatus: (deliveryId: string, newStatus: DeliveryStatus, notes?: string, location?: string) => Promise<Delivery>;
  setCurrentDelivery: (delivery: Delivery | null) => void;
}

// This is a mock implementation. In a real application, these would connect to an API
export const useDeliveryStore = create<DeliveryStore>((set, get) => ({
  deliveries: [],
  currentDelivery: null,
  loading: false,
  error: null,

  addDelivery: async (deliveryData: DeliveryFormData) => {
    try {
      set({ loading: true, error: null });

      // Mock API call - in a real app, this would be an API request
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create initial status update
      const initialStatus: StatusUpdate = {
        status: deliveryData.status,
        timestamp: new Date(),
        notes: deliveryData.deliveryNotes,
        location: deliveryData.currentLocation,
      };

      const newDelivery: Delivery = {
        id: Date.now().toString(), // Generate a temporary ID
        ...deliveryData,
        statusHistory: [initialStatus],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      set((state) => ({
        deliveries: [...state.deliveries, newDelivery],
        currentDelivery: newDelivery,
        loading: false,
      }));

      return newDelivery;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },

  createDeliveryFromOrder: async (order: Order) => {
    try {
      set({ loading: true, error: null });

      // Mock API call - in a real app, this would be an API request
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if a delivery for this order already exists
      const existingDelivery = get().deliveries.find(
        (delivery) => delivery.orderId === order.id
      );

      if (existingDelivery) {
        set({ loading: false });
        return existingDelivery;
      }

      // Create a new delivery for this order
      const initialStatus: StatusUpdate = {
        status: "Packaging",
        timestamp: new Date(),
        notes: "Order received and processing started",
      };

      // Add 3 days for estimated delivery
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + 3);

      const newDelivery: Delivery = {
        id: Date.now().toString(), // Generate a temporary ID
        orderId: order.id || "",
        shopId: order.shopId,
        status: "Packaging",
        currentLocation: "Warehouse",
        estimatedDeliveryDate: estimatedDate,
        trackingNumber: `TR-${Math.floor(100000 + Math.random() * 900000)}`,
        statusHistory: [initialStatus],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      set((state) => ({
        deliveries: [...state.deliveries, newDelivery],
        currentDelivery: newDelivery,
        loading: false,
      }));

      return newDelivery;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },

  fetchDeliveries: async () => {
    try {
      set({ loading: true, error: null });

      // Mock API call - in a real app, this would be an API request
      await new Promise((resolve) => setTimeout(resolve, 500));

      // If we don't have any deliveries yet, create some mock data
      if (get().deliveries.length === 0) {
        // Get orders
        const orders = useOrderStore.getState().orders;

        const mockDeliveries: Delivery[] = [];

        // Create a delivery for each order
        for (const order of orders) {
          if (!order.id) continue;

          // Create random status and history
          const statuses: DeliveryStatus[] = [
            "Packaging",
            "Transit",
            "ShipToOutlet",
            "OutForDelivery",
            "Delivered"
          ];

          // Pick a random status index
          const statusIndex = Math.floor(Math.random() * statuses.length);
          const currentStatus = statuses[statusIndex];

          // Create status history up to current status
          const statusHistory: StatusUpdate[] = [];

          // Add each status up to the current one
          for (let i = 0; i <= statusIndex; i++) {
            // Create a date in the past, getting progressively more recent
            const daysAgo = 5 - i;
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);

            statusHistory.push({
              status: statuses[i],
              timestamp: new Date(date),
              notes: `Status updated to ${statuses[i]}`,
              location: i === 0 ? "Warehouse" :
                       i === 1 ? "Distribution Center" :
                       i === 2 ? "Local Outlet" :
                       i === 3 ? "Delivery Vehicle" : "Customer Location"
            });
          }

          // Add estimated or actual delivery date
          const estimatedDate = new Date();
          estimatedDate.setDate(estimatedDate.getDate() + 3 - statusIndex);

          // If delivered, add actual delivery date
          const actualDeliveryDate = currentStatus === "Delivered"
            ? statusHistory[statusHistory.length - 1].timestamp
            : undefined;

          mockDeliveries.push({
            id: `d-${order.id}`,
            orderId: order.id,
            shopId: order.shopId,
            status: currentStatus,
            currentLocation: statusHistory[statusHistory.length - 1].location,
            estimatedDeliveryDate: estimatedDate,
            actualDeliveryDate,
            trackingNumber: `TR-${Math.floor(100000 + Math.random() * 900000)}`,
            statusHistory,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            updatedAt: statusHistory[statusHistory.length - 1].timestamp
          });
        }

        set({ deliveries: mockDeliveries, loading: false });
        return mockDeliveries;
      }

      set({ loading: false });
      return get().deliveries;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },

  getDeliveryById: (deliveryId: string) => {
    return get().deliveries.find((delivery) => delivery.id === deliveryId) || null;
  },

  getDeliveryByOrderId: (orderId: string) => {
    return get().deliveries.find((delivery) => delivery.orderId === orderId) || null;
  },

  updateDeliveryStatus: async (
    deliveryId: string,
    newStatus: DeliveryStatus,
    notes?: string,
    location?: string
  ) => {
    try {
      set({ loading: true, error: null });

      // Mock API call - in a real app, this would be an API request
      await new Promise((resolve) => setTimeout(resolve, 500));

      const deliveries = [...get().deliveries];
      const deliveryIndex = deliveries.findIndex((d) => d.id === deliveryId);

      if (deliveryIndex === -1) {
        throw new Error("Delivery not found");
      }

      const delivery = deliveries[deliveryIndex];

      // Create a new status update
      const statusUpdate: StatusUpdate = {
        status: newStatus,
        timestamp: new Date(),
        notes,
        location: location || delivery.currentLocation,
      };

      // Add actual delivery date if status is Delivered
      const actualDeliveryDate =
        newStatus === "Delivered" ? new Date() : delivery.actualDeliveryDate;

      const updatedDelivery: Delivery = {
        ...delivery,
        status: newStatus,
        currentLocation: location || delivery.currentLocation,
        actualDeliveryDate,
        statusHistory: [...delivery.statusHistory, statusUpdate],
        updatedAt: new Date(),
      };

      deliveries[deliveryIndex] = updatedDelivery;

      set({
        deliveries,
        currentDelivery: updatedDelivery,
        loading: false,
      });

      return updatedDelivery;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },

  setCurrentDelivery: (delivery: Delivery | null) => {
    set({ currentDelivery: delivery });
  },
}));

// Utility function to get next delivery status
export const getNextStatus = (currentStatus: DeliveryStatus): DeliveryStatus | null => {
  const statusOrder: DeliveryStatus[] = [
    "Packaging",
    "Transit",
    "ShipToOutlet",
    "OutForDelivery",
    "Delivered"
  ];

  const currentIndex = statusOrder.indexOf(currentStatus);

  if (currentIndex === -1 || currentIndex === statusOrder.length - 1) {
    return null; // No next status available
  }

  return statusOrder[currentIndex + 1];
};
