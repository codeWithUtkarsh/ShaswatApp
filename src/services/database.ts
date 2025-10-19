// Supabase Postgres database wrapper for shops and SKUs
import { supabase } from "../utils/supabase";

interface Shop {
  id?: string;
  name: string;
  location: string;
  phoneNumber: string;
  category: "wholeseller" | "retailer";
  isNew: boolean;
  createdAt: Date;
  latitude?: number;
  longitude?: number;
}

interface SKU {
  id: string;
  name: string;
  description: string;
  price: number;
  boxPrice: number;
  costPerUnit: number;
}

class ShopDatabase {
  // Shop methods
  async addShop(shop: Shop): Promise<Shop> {
    const { data, error } = await supabase
      .from("shops")
      .insert([
        {
          id: shop.id,
          name: shop.name,
          location: shop.location,
          phone_number: shop.phoneNumber,
          category: shop.category,
          is_new: shop.isNew,
          created_at: shop.createdAt.toISOString(),
          latitude: shop.latitude,
          longitude: shop.longitude,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      location: data.location,
      phoneNumber: data.phone_number,
      category: data.category,
      isNew: data.is_new,
      createdAt: new Date(data.created_at),
      latitude: data.latitude,
      longitude: data.longitude,
    };
  }

  async getAllShops(): Promise<Shop[]> {
    const { data, error } = await supabase
      .from("shops")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((shop: any) => ({
      id: shop.id,
      name: shop.name,
      location: shop.location,
      phoneNumber: shop.phone_number,
      category: shop.category,
      isNew: shop.is_new,
      createdAt: new Date(shop.created_at),
      latitude: shop.latitude,
      longitude: shop.longitude,
    }));
  }

  async updateShop(shop: Shop): Promise<Shop> {
    const { data, error } = await supabase
      .from("shops")
      .update({
        name: shop.name,
        location: shop.location,
        phone_number: shop.phoneNumber,
        category: shop.category,
        is_new: shop.isNew,
        created_at: shop.createdAt.toISOString(),
        latitude: shop.latitude,
        longitude: shop.longitude,
      })
      .eq("id", shop.id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      location: data.location,
      phoneNumber: data.phone_number,
      category: data.category,
      isNew: data.is_new,
      createdAt: new Date(data.created_at),
      latitude: data.latitude,
      longitude: data.longitude,
    };
  }

  async deleteShop(id: string): Promise<void> {
    const { error } = await supabase.from("shops").delete().eq("id", id);

    if (error) throw error;
  }

  async clearAllShops(): Promise<void> {
    const { error } = await supabase.from("shops").delete().neq("id", "");

    if (error) throw error;
  }

  // SKU methods
  async addSKU(sku: SKU): Promise<SKU> {
    const { data, error } = await supabase
      .from("skus")
      .insert([
        {
          id: sku.id,
          name: sku.name,
          description: sku.description,
          price: sku.price,
          box_price: sku.boxPrice,
          cost_per_unit: sku.costPerUnit,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      boxPrice: data.box_price,
      costPerUnit: data.cost_per_unit,
    };
  }

  async getAllSKUs(): Promise<SKU[]> {
    const { data, error } = await supabase.from("skus").select("*");

    if (error) throw error;

    return (data || []).map((sku: any) => ({
      id: sku.id,
      name: sku.name,
      description: sku.description,
      price: sku.price,
      boxPrice: sku.box_price,
      costPerUnit: sku.cost_per_unit,
    }));
  }

  async updateSKU(sku: SKU): Promise<SKU> {
    const { data, error } = await supabase
      .from("skus")
      .update({
        name: sku.name,
        description: sku.description,
        price: sku.price,
        box_price: sku.boxPrice,
        cost_per_unit: sku.costPerUnit,
      })
      .eq("id", sku.id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      boxPrice: data.box_price,
      costPerUnit: data.cost_per_unit,
    };
  }

  async deleteSKU(id: string): Promise<void> {
    const { error } = await supabase.from("skus").delete().eq("id", id);

    if (error) throw error;
  }

  async clearAllSKUs(): Promise<void> {
    const { error } = await supabase.from("skus").delete().neq("id", "");

    if (error) throw error;
  }

  async initializeSKUs(): Promise<void> {
    const existingSKUs = await this.getAllSKUs();
    if (existingSKUs.length > 0) {
      return; // Already initialized
    }

    const defaultSKUs: SKU[] = [
      {
        id: "SKU001",
        name: "Puffed Rice",
        description: "High-quality puffed rice",
        price: 13,
        boxPrice: 520,
        costPerUnit: 10,
      },
      {
        id: "SKU002",
        name: "Roasted Makhana",
        description: "Premium roasted makhana",
        price: 300,
        boxPrice: 6000,
        costPerUnit: 250,
      },
      {
        id: "SKU003",
        name: "Makhana (Cheese)",
        description: "Cheese flavored makhana",
        price: 90,
        boxPrice: 900,
        costPerUnit: 75,
      },
      {
        id: "SKU004",
        name: "Makhana (Onion & Cream)",
        description: "Onion & Cream flavored makhana",
        price: 90,
        boxPrice: 900,
        costPerUnit: 75,
      },
      {
        id: "SKU005",
        name: "Rakhiya Bari",
        description: "Traditional Rakhiya Bari",
        price: 90,
        boxPrice: 1440,
        costPerUnit: 75,
      },
      {
        id: "SKU006",
        name: "Adori Bari",
        description: "Fresh Adori Bari",
        price: 65,
        boxPrice: 1040,
        costPerUnit: 50,
      },
      {
        id: "SKU007",
        name: "Dahi Mirchi (Curd Chillies)",
        description: "Spicy curd chillies",
        price: 50,
        boxPrice: 1000,
        costPerUnit: 40,
      },
      {
        id: "SKU008",
        name: "Bijori",
        description: "Traditional Bijori snack",
        price: 50,
        boxPrice: 1000,
        costPerUnit: 40,
      },
      {
        id: "SKU009",
        name: "Instant Bhel",
        description: "Ready to eat instant bhel",
        price: 40,
        boxPrice: 1600,
        costPerUnit: 30,
      },
      {
        id: "SKU010",
        name: "Chewda",
        description: "Crunchy chewda mix",
        price: 40,
        boxPrice: 1600,
        costPerUnit: 30,
      },
    ];

    // Insert all SKUs using Supabase batch insert
    const { error } = await supabase.from("skus").insert(
      defaultSKUs.map((sku) => ({
        id: sku.id,
        name: sku.name,
        description: sku.description,
        price: sku.price,
        box_price: sku.boxPrice,
        cost_per_unit: sku.costPerUnit,
      })),
    );

    if (error) throw error;
  }
}

export const shopDB = new ShopDatabase();
