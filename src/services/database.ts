// Simple SQLite database wrapper using sql.js
// This provides persistence for shop data in the browser

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
  private dbName = "shaswat_shops_db";
  private storeName = "shops";
  private skuStoreName = "skus";

  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 2);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, {
            keyPath: "id",
          });
          objectStore.createIndex("category", "category", { unique: false });
          objectStore.createIndex("createdAt", "createdAt", { unique: false });
        }
        if (!db.objectStoreNames.contains(this.skuStoreName)) {
          const skuObjectStore = db.createObjectStore(this.skuStoreName, {
            keyPath: "id",
          });
          skuObjectStore.createIndex("name", "name", { unique: false });
        }
      };
    });
  }

  async addShop(shop: Shop): Promise<Shop> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const objectStore = transaction.objectStore(this.storeName);

      const shopToStore = {
        ...shop,
        createdAt: shop.createdAt.toISOString(),
      };

      const request = objectStore.add(shopToStore);

      request.onsuccess = () => {
        resolve(shop);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getAllShops(): Promise<Shop[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const shops = request.result.map((shop: any) => ({
          ...shop,
          createdAt: new Date(shop.createdAt),
        }));
        resolve(shops);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async updateShop(shop: Shop): Promise<Shop> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const objectStore = transaction.objectStore(this.storeName);

      const shopToStore = {
        ...shop,
        createdAt:
          typeof shop.createdAt === "string"
            ? shop.createdAt
            : shop.createdAt.toISOString(),
      };

      const request = objectStore.put(shopToStore);

      request.onsuccess = () => {
        resolve(shop);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async deleteShop(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async clearAllShops(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async addSKU(sku: SKU): Promise<SKU> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.skuStoreName], "readwrite");
      const objectStore = transaction.objectStore(this.skuStoreName);

      const request = objectStore.add(sku);

      request.onsuccess = () => {
        resolve(sku);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getAllSKUs(): Promise<SKU[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.skuStoreName], "readonly");
      const objectStore = transaction.objectStore(this.skuStoreName);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async updateSKU(sku: SKU): Promise<SKU> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.skuStoreName], "readwrite");
      const objectStore = transaction.objectStore(this.skuStoreName);

      const request = objectStore.put(sku);

      request.onsuccess = () => {
        resolve(sku);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async deleteSKU(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.skuStoreName], "readwrite");
      const objectStore = transaction.objectStore(this.skuStoreName);
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async clearAllSKUs(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.skuStoreName], "readwrite");
      const objectStore = transaction.objectStore(this.skuStoreName);
      const request = objectStore.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
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

    for (const sku of defaultSKUs) {
      await this.addSKU(sku);
    }
  }
}

export const shopDB = new ShopDatabase();
