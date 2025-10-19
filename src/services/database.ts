// Supabase Postgres database wrapper for shops, SKUs, orders, and deliveries
import { supabase } from "../utils/supabase";
import { DeliveryStatus } from "../models/Delivery";

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

interface OrderItem {
  sku: SKU;
  quantity: number;
  unitType: "packet" | "box";
}

interface Order {
  id?: string;
  shopId: string;
  employeeId?: string;
  orderItems: OrderItem[];
  totalAmount: number;
  discountCode?: string;
  discountAmount?: number;
  finalAmount: number;
  createdAt: Date;
}

interface ReturnItem {
  sku: SKU;
  quantity: number;
  unitType: "packet" | "box";
}

interface ReturnOrder {
  id?: string;
  shopId: string;
  employeeId?: string;
  linkedOrderId?: string;
  returnItems: ReturnItem[];
  totalAmount: number;
  reasonCode?: string;
  notes?: string;
  createdAt: Date;
}

interface StatusUpdate {
  status: DeliveryStatus;
  timestamp: Date;
  notes?: string;
  location?: string;
}

interface Delivery {
  id?: string;
  orderId: string;
  shopId: string;
  status: DeliveryStatus;
  currentLocation?: string;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  trackingNumber?: string;
  deliveryNotes?: string;
  statusHistory: StatusUpdate[];
  createdAt: Date;
  updatedAt: Date;
}

interface Survey {
  id?: string;
  shopId?: string;
  respondentName: string;
  respondentContact?: string;
  respondentRole: string;
  productQualityRating: number;
  serviceRating: number;
  deliveryRating: number;
  priceRating: number;
  recommendationLikelihood: number;
  purchaseFrequency: string;
  feedback?: string;
  concerns: string[];
  productSuggestions?: string;
  createdAt: Date;
}

interface User {
  id?: string;
  email: string;
  name: string;
  role: "admin" | "employee";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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

  // Order methods
  async addOrder(order: Order): Promise<Order> {
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          id: order.id,
          shop_id: order.shopId,
          employee_id: order.employeeId,
          order_items: JSON.stringify(order.orderItems),
          total_amount: order.totalAmount,
          discount_code: order.discountCode,
          discount_amount: order.discountAmount,
          final_amount: order.finalAmount,
          created_at: order.createdAt.toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      shopId: data.shop_id,
      employeeId: data.employee_id,
      orderItems: JSON.parse(data.order_items),
      totalAmount: data.total_amount,
      discountCode: data.discount_code,
      discountAmount: data.discount_amount,
      finalAmount: data.final_amount,
      createdAt: new Date(data.created_at),
    };
  }

  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((order: any) => ({
      id: order.id,
      shopId: order.shop_id,
      employeeId: order.employee_id,
      orderItems: JSON.parse(order.order_items),
      totalAmount: order.total_amount,
      discountCode: order.discount_code,
      discountAmount: order.discount_amount,
      finalAmount: order.final_amount,
      createdAt: new Date(order.created_at),
    }));
  }

  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;

    return {
      id: data.id,
      shopId: data.shop_id,
      orderItems: JSON.parse(data.order_items),
      totalAmount: data.total_amount,
      discountCode: data.discount_code,
      discountAmount: data.discount_amount,
      finalAmount: data.final_amount,
      createdAt: new Date(data.created_at),
    };
  }

  // Return Order methods
  async addReturnOrder(returnOrder: ReturnOrder): Promise<ReturnOrder> {
    const { data, error } = await supabase
      .from("return_orders")
      .insert([
        {
          id: returnOrder.id,
          shop_id: returnOrder.shopId,
          employee_id: returnOrder.employeeId,
          linked_order_id: returnOrder.linkedOrderId,
          return_items: JSON.stringify(returnOrder.returnItems),
          total_amount: returnOrder.totalAmount,
          reason_code: returnOrder.reasonCode,
          notes: returnOrder.notes,
          created_at: returnOrder.createdAt.toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      shopId: data.shop_id,
      linkedOrderId: data.linked_order_id,
      returnItems: JSON.parse(data.return_items),
      totalAmount: data.total_amount,
      reasonCode: data.reason_code,
      notes: data.notes,
      createdAt: new Date(data.created_at),
    };
  }

  async getAllReturnOrders(): Promise<ReturnOrder[]> {
    const { data, error } = await supabase
      .from("return_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((returnOrder: any) => ({
      id: returnOrder.id,
      shopId: returnOrder.shop_id,
      employeeId: returnOrder.employee_id,
      linkedOrderId: returnOrder.linked_order_id,
      returnItems: JSON.parse(returnOrder.return_items),
      totalAmount: returnOrder.total_amount,
      reasonCode: returnOrder.reason_code,
      notes: returnOrder.notes,
      createdAt: new Date(returnOrder.created_at),
    }));
  }

  async getReturnOrderById(id: string): Promise<ReturnOrder | null> {
    const { data, error } = await supabase
      .from("return_orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;

    return {
      id: data.id,
      shopId: data.shop_id,
      linkedOrderId: data.linked_order_id,
      returnItems: JSON.parse(data.return_items),
      totalAmount: data.total_amount,
      reasonCode: data.reason_code,
      notes: data.notes,
      createdAt: new Date(data.created_at),
    };
  }

  // Delivery methods
  async addDelivery(delivery: Delivery): Promise<Delivery> {
    const { data, error } = await supabase
      .from("deliveries")
      .insert([
        {
          id: delivery.id,
          order_id: delivery.orderId,
          shop_id: delivery.shopId,
          status: delivery.status,
          current_location: delivery.currentLocation,
          estimated_delivery_date:
            delivery.estimatedDeliveryDate?.toISOString(),
          actual_delivery_date: delivery.actualDeliveryDate?.toISOString(),
          tracking_number: delivery.trackingNumber,
          delivery_notes: delivery.deliveryNotes,
          status_history: JSON.stringify(delivery.statusHistory),
          created_at: delivery.createdAt.toISOString(),
          updated_at: delivery.updatedAt.toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      orderId: data.order_id,
      shopId: data.shop_id,
      status: data.status,
      currentLocation: data.current_location,
      estimatedDeliveryDate: data.estimated_delivery_date
        ? new Date(data.estimated_delivery_date)
        : undefined,
      actualDeliveryDate: data.actual_delivery_date
        ? new Date(data.actual_delivery_date)
        : undefined,
      trackingNumber: data.tracking_number,
      deliveryNotes: data.delivery_notes,
      statusHistory: JSON.parse(data.status_history),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async getAllDeliveries(): Promise<Delivery[]> {
    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((delivery: any) => ({
      id: delivery.id,
      orderId: delivery.order_id,
      shopId: delivery.shop_id,
      status: delivery.status,
      currentLocation: delivery.current_location,
      estimatedDeliveryDate: delivery.estimated_delivery_date
        ? new Date(delivery.estimated_delivery_date)
        : undefined,
      actualDeliveryDate: delivery.actual_delivery_date
        ? new Date(delivery.actual_delivery_date)
        : undefined,
      trackingNumber: delivery.tracking_number,
      deliveryNotes: delivery.delivery_notes,
      statusHistory: JSON.parse(delivery.status_history),
      createdAt: new Date(delivery.created_at),
      updatedAt: new Date(delivery.updated_at),
    }));
  }

  async getDeliveryById(id: string): Promise<Delivery | null> {
    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;

    return {
      id: data.id,
      orderId: data.order_id,
      shopId: data.shop_id,
      status: data.status,
      currentLocation: data.current_location,
      estimatedDeliveryDate: data.estimated_delivery_date
        ? new Date(data.estimated_delivery_date)
        : undefined,
      actualDeliveryDate: data.actual_delivery_date
        ? new Date(data.actual_delivery_date)
        : undefined,
      trackingNumber: data.tracking_number,
      deliveryNotes: data.delivery_notes,
      statusHistory: JSON.parse(data.status_history),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async updateDelivery(delivery: Delivery): Promise<Delivery> {
    const { data, error } = await supabase
      .from("deliveries")
      .update({
        status: delivery.status,
        current_location: delivery.currentLocation,
        estimated_delivery_date: delivery.estimatedDeliveryDate?.toISOString(),
        actual_delivery_date: delivery.actualDeliveryDate?.toISOString(),
        tracking_number: delivery.trackingNumber,
        delivery_notes: delivery.deliveryNotes,
        status_history: JSON.stringify(delivery.statusHistory),
        updated_at: new Date().toISOString(),
      })
      .eq("id", delivery.id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      orderId: data.order_id,
      shopId: data.shop_id,
      status: data.status,
      currentLocation: data.current_location,
      estimatedDeliveryDate: data.estimated_delivery_date
        ? new Date(data.estimated_delivery_date)
        : undefined,
      actualDeliveryDate: data.actual_delivery_date
        ? new Date(data.actual_delivery_date)
        : undefined,
      trackingNumber: data.tracking_number,
      deliveryNotes: data.delivery_notes,
      statusHistory: JSON.parse(data.status_history),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async getDeliveryByOrderId(orderId: string): Promise<Delivery | null> {
    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (error) return null;

    return {
      id: data.id,
      orderId: data.order_id,
      shopId: data.shop_id,
      status: data.status,
      currentLocation: data.current_location,
      estimatedDeliveryDate: data.estimated_delivery_date
        ? new Date(data.estimated_delivery_date)
        : undefined,
      actualDeliveryDate: data.actual_delivery_date
        ? new Date(data.actual_delivery_date)
        : undefined,
      trackingNumber: data.tracking_number,
      deliveryNotes: data.delivery_notes,
      statusHistory: JSON.parse(data.status_history),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  // Survey methods
  async addSurvey(survey: Survey): Promise<Survey> {
    const { data, error } = await supabase
      .from("surveys")
      .insert([
        {
          id: survey.id,
          shop_id: survey.shopId,
          respondent_name: survey.respondentName,
          respondent_contact: survey.respondentContact,
          respondent_role: survey.respondentRole,
          product_quality_rating: survey.productQualityRating,
          service_rating: survey.serviceRating,
          delivery_rating: survey.deliveryRating,
          price_rating: survey.priceRating,
          recommendation_likelihood: survey.recommendationLikelihood,
          purchase_frequency: survey.purchaseFrequency,
          feedback: survey.feedback,
          concerns: JSON.stringify(survey.concerns),
          product_suggestions: survey.productSuggestions,
          created_at: survey.createdAt.toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      shopId: data.shop_id,
      respondentName: data.respondent_name,
      respondentContact: data.respondent_contact,
      respondentRole: data.respondent_role,
      productQualityRating: data.product_quality_rating,
      serviceRating: data.service_rating,
      deliveryRating: data.delivery_rating,
      priceRating: data.price_rating,
      recommendationLikelihood: data.recommendation_likelihood,
      purchaseFrequency: data.purchase_frequency,
      feedback: data.feedback,
      concerns: JSON.parse(data.concerns),
      productSuggestions: data.product_suggestions,
      createdAt: new Date(data.created_at),
    };
  }

  async getAllSurveys(): Promise<Survey[]> {
    const { data, error } = await supabase
      .from("surveys")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((survey: any) => ({
      id: survey.id,
      shopId: survey.shop_id,
      respondentName: survey.respondent_name,
      respondentContact: survey.respondent_contact,
      respondentRole: survey.respondent_role,
      productQualityRating: survey.product_quality_rating,
      serviceRating: survey.service_rating,
      deliveryRating: survey.delivery_rating,
      priceRating: survey.price_rating,
      recommendationLikelihood: survey.recommendation_likelihood,
      purchaseFrequency: survey.purchase_frequency,
      feedback: survey.feedback,
      concerns: JSON.parse(survey.concerns),
      productSuggestions: survey.product_suggestions,
      createdAt: new Date(survey.created_at),
    }));
  }

  async getSurveyById(id: string): Promise<Survey | null> {
    const { data, error } = await supabase
      .from("surveys")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;

    return {
      id: data.id,
      shopId: data.shop_id,
      respondentName: data.respondent_name,
      respondentContact: data.respondent_contact,
      respondentRole: data.respondent_role,
      productQualityRating: data.product_quality_rating,
      serviceRating: data.service_rating,
      deliveryRating: data.delivery_rating,
      priceRating: data.price_rating,
      recommendationLikelihood: data.recommendation_likelihood,
      purchaseFrequency: data.purchase_frequency,
      feedback: data.feedback,
      concerns: JSON.parse(data.concerns),
      productSuggestions: data.product_suggestions,
      createdAt: new Date(data.created_at),
    };
  }

  async getSurveysByShopId(shopId: string): Promise<Survey[]> {
    const { data, error } = await supabase
      .from("surveys")
      .select("*")
      .eq("shop_id", shopId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((survey: any) => ({
      id: survey.id,
      shopId: survey.shop_id,
      respondentName: survey.respondent_name,
      respondentContact: survey.respondent_contact,
      respondentRole: survey.respondent_role,
      productQualityRating: survey.product_quality_rating,
      serviceRating: survey.service_rating,
      deliveryRating: survey.delivery_rating,
      priceRating: survey.price_rating,
      recommendationLikelihood: survey.recommendation_likelihood,
      purchaseFrequency: survey.purchase_frequency,
      feedback: survey.feedback,
      concerns: JSON.parse(survey.concerns),
      productSuggestions: survey.product_suggestions,
      createdAt: new Date(survey.created_at),
    }));
  }

  // User methods
  async addUser(user: User): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          is_active: user.isActive,
          created_at: user.createdAt.toISOString(),
          updated_at: user.updatedAt.toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.is_active,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    }));
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) return null;

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async updateUser(user: User): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .update({
        email: user.email,
        name: user.name,
        role: user.role,
        is_active: user.isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw error;
  }
}

export const shopDB = new ShopDatabase();
