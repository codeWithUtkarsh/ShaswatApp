import { create } from "zustand";
import { Shop, ShopFormData } from "../models/Shop";

interface ShopStore {
  shops: Shop[];
  loading: boolean;
  error: string | null;

  // Actions
  addShop: (shopData: ShopFormData) => Promise<Shop>;
  fetchShops: () => Promise<Shop[]>;
  updateShopStatus: () => Promise<void>;
  getShopsByLocation: (
    latitude: number,
    longitude: number,
    radiusKm: number,
  ) => Shop[];
}

// This is a mock implementation. In a real application, these would connect to an API
export const useShopStore = create<ShopStore>((set, get) => ({
  shops: [],
  loading: false,
  error: null,

  addShop: async (shopData: ShopFormData) => {
    try {
      set({ loading: true, error: null });

      // Mock API call - in a real app, this would be an API request
      // Adding a delay to simulate network request
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newShop: Shop = {
        id: Date.now().toString(), // Generate a temporary ID
        ...shopData,
        isNew: true,
        createdAt: new Date(),
        latitude: shopData.latitude,
        longitude: shopData.longitude,
      };

      set((state) => ({
        shops: [...state.shops, newShop],
        loading: false,
      }));

      return newShop;
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },

  fetchShops: async () => {
    try {
      set({ loading: true, error: null });

      // Mock API call - in a real app, this would be an API request
      await new Promise((resolve) => setTimeout(resolve, 500));

      // If we had shops in the store already, we'd return them
      // This is just for demo purposes
      if (get().shops.length === 0) {
        const mockShops: Shop[] = [
          {
            id: "1",
            name: "Central Market",
            location: "Main Street",
            phoneNumber: "123-456-7890",
            category: "retailer",
            isNew: false,
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
            latitude: 28.6139,
            longitude: 77.209,
          },
          {
            id: "2",
            name: "Wholesale Depot",
            location: "Industrial Zone",
            phoneNumber: "987-654-3210",
            category: "wholeseller",
            isNew: true,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            latitude: 28.6229,
            longitude: 77.21,
          },
        ];

        set({ shops: mockShops, loading: false });
        return mockShops;
      }

      set({ loading: false });
      return get().shops;
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },

  updateShopStatus: async () => {
    try {
      set({ loading: true, error: null });

      // Find shops that are marked as new but were created more than 7 days ago
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const updatedShops = get().shops.map((shop) => {
        if (shop.isNew && shop.createdAt < oneWeekAgo) {
          return { ...shop, isNew: false };
        }
        return shop;
      });

      set({ shops: updatedShops, loading: false });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },

  // Helper function to calculate distance between two coordinates in km using Haversine formula
  getShopsByLocation: (
    latitude: number,
    longitude: number,
    radiusKm: number,
  ) => {
    const shops = get().shops;

    return shops.filter((shop) => {
      if (!shop.latitude || !shop.longitude) return false;

      // Haversine formula to calculate distance
      const R = 6371; // Earth's radius in km
      const dLat = ((shop.latitude - latitude) * Math.PI) / 180;
      const dLon = ((shop.longitude - longitude) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((latitude * Math.PI) / 180) *
          Math.cos((shop.latitude * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance <= radiusKm;
    });
  },
}));
