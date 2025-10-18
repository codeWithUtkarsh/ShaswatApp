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

class ShopDatabase {
  private dbName = "shaswat_shops_db";
  private storeName = "shops";

  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

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
}

export const shopDB = new ShopDatabase();
