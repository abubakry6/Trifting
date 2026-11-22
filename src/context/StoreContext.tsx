"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Category, Order, Promotion } from "@/types/database";
import { initialProducts, initialCategories, initialPromotions } from "@/lib/mockData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { generateUUID, isValidUUID, normalizeImages, DEFAULT_PRODUCT_IMAGE } from "@/lib/utils";

interface StoreContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  promotions: Promotion[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  addOrder: (order: Omit<Order, "id" | "createdAt">) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order["orderStatus"], resi?: string) => Promise<boolean>;
  addCategory: (cat: Omit<Category, "id">) => Promise<Category>;
  addPromotion: (promo: Omit<Promotion, "id">) => Promise<Promotion>;
  togglePromotionActive: (promoId: string) => void;
  refreshData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const syncProductToSupabase = async (prod: Product) => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { categoryName, ...supabasePayload } = prod as any;
      const cleanPayload = {
        ...supabasePayload,
        id: isValidUUID(prod.id) ? prod.id : generateUUID(),
        categoryId: isValidUUID(supabasePayload.categoryId) ? supabasePayload.categoryId : null,
        images: normalizeImages(supabasePayload.images),
        lengthCm: supabasePayload.lengthCm ? Number(supabasePayload.lengthCm) : null,
        widthCm: supabasePayload.widthCm ? Number(supabasePayload.widthCm) : null,
        originalPrice: supabasePayload.originalPrice ? Number(supabasePayload.originalPrice) : null,
      };
      await supabase.from("products").insert([cleanPayload]);
    } catch {}
  };

  const syncOrderToSupabase = async (order: Order) => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { items: orderItemsList, ...orderWithoutItems } = order;
      const cleanOrderId = isValidUUID(order.id) ? order.id : generateUUID();
      const cleanOrderPayload = {
        ...orderWithoutItems,
        id: cleanOrderId,
        userId: isValidUUID(orderWithoutItems.userId) ? orderWithoutItems.userId : null,
      };

      const { error: insertErr } = await supabase.from("orders").insert([cleanOrderPayload]);
      if (insertErr) return;

      if (orderItemsList && orderItemsList.length > 0) {
        const itemsPayload = orderItemsList.map((item) => ({
          id: generateUUID(),
          orderId: cleanOrderId,
          productId: isValidUUID(item.productId) ? item.productId : null,
          productTitle: item.productTitle,
          productPrice: item.productPrice,
          productSize: item.productSize || "",
          productImage: item.productImage || "",
        }));

        await supabase.from("orderitems").insert(itemsPayload);
      }
    } catch {}
  };

  // Initialize and load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        // Fetch from Supabase
        const [prodRes, catRes, orderRes, promoRes] = await Promise.all([
          supabase.from("products").select("*, categories(name)").order("createdAt", { ascending: false }),
          supabase.from("categories").select("*"),
          supabase.from("orders").select("*, orderitems(*)").order("createdAt", { ascending: false }),
          supabase.from("promotions").select("*"),
        ]);

        let remoteProducts: Product[] = [];
        if (prodRes.data && prodRes.data.length > 0) {
          remoteProducts = prodRes.data.map((p) => ({
            ...p,
            categoryName: p.categories?.name,
            images: normalizeImages(p.images),
          }));
        }

        // Dual-Sync Merge: Combine Supabase remote products with local products
        let mergedProducts: Product[] = [...remoteProducts];
        try {
          const saved = localStorage.getItem("trifting_products");
          if (saved) {
            const localProducts: Product[] = JSON.parse(saved).map((lp: any) => ({
              ...lp,
              images: normalizeImages(lp.images),
            }));
            for (const lp of localProducts) {
              if (!mergedProducts.some((p) => p.id === lp.id || (p.slug && p.slug === lp.slug))) {
                mergedProducts.unshift(lp);
                syncProductToSupabase(lp);
              }
            }
          }
        } catch {}

        if (mergedProducts.length > 0) {
          setProducts(mergedProducts);
          try {
            localStorage.setItem("trifting_products", JSON.stringify(mergedProducts));
          } catch {}
        } else {
          initLocalProducts();
        }

        if (catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data);
        } else {
          initLocalCategories();
        }

        let remoteOrders: Order[] = [];
        if (orderRes.data && orderRes.data.length > 0) {
          remoteOrders = orderRes.data.map((ord: any) => ({
            ...ord,
            items: ord.orderitems && ord.orderitems.length > 0 ? ord.orderitems : ord.items || [],
          }));
        }

        // Dual-Sync Merge for Orders: Sinkronisasi pesanan dari HP & Laptop ke Cloud
        let mergedOrders: Order[] = [...remoteOrders];
        try {
          const savedOrders = localStorage.getItem("trifting_orders");
          if (savedOrders) {
            const localOrders: Order[] = JSON.parse(savedOrders);
            for (const lo of localOrders) {
              if (!mergedOrders.some((o) => o.id === lo.id || o.orderNumber === lo.orderNumber)) {
                mergedOrders.unshift(lo);
                syncOrderToSupabase(lo);
              }
            }
          }
        } catch {}

        setOrders(mergedOrders);
        try {
          localStorage.setItem("trifting_orders", JSON.stringify(mergedOrders));
        } catch {}

        if (promoRes.data && promoRes.data.length > 0) {
          setPromotions(promoRes.data);
        } else {
          setPromotions(initialPromotions);
        }
      } catch (err) {
        console.error("Supabase load error, falling back to local storage:", err);
        initAllFromLocalStorage();
      }
    } else {
      initAllFromLocalStorage();
    }

    setIsLoading(false);
  };

  const initLocalProducts = () => {
    try {
      const saved = localStorage.getItem("trifting_products");
      if (saved) {
        const parsed = JSON.parse(saved).map((p: any) => ({
          ...p,
          images: normalizeImages(p.images),
        }));
        setProducts(parsed);
      } else {
        const mapped = initialProducts.map((p) => ({
          ...p,
          images: normalizeImages(p.images),
        }));
        setProducts(mapped);
        localStorage.setItem("trifting_products", JSON.stringify(mapped));
      }
    } catch {
      setProducts(initialProducts);
    }
  };

  const initLocalCategories = () => {
    try {
      const saved = localStorage.getItem("trifting_categories");
      if (saved) {
        setCategories(JSON.parse(saved));
      } else {
        setCategories(initialCategories);
        localStorage.setItem("trifting_categories", JSON.stringify(initialCategories));
      }
    } catch {
      setCategories(initialCategories);
    }
  };

  const initAllFromLocalStorage = () => {
    initLocalProducts();
    initLocalCategories();

    try {
      const savedOrders = localStorage.getItem("trifting_orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedPromos = localStorage.getItem("trifting_promos");
      if (savedPromos) {
        setPromotions(JSON.parse(savedPromos));
      } else {
        setPromotions(initialPromotions);
      }
    } catch {
      setPromotions(initialPromotions);
    }
  };

  // Sync to local storage on changes
  useEffect(() => {
    if (products.length > 0) {
      try {
        localStorage.setItem("trifting_products", JSON.stringify(products));
      } catch {}
    }
  }, [products]);

  useEffect(() => {
    if (orders.length > 0) {
      try {
        localStorage.setItem("trifting_orders", JSON.stringify(orders));
      } catch {}
    }
  }, [orders]);

  const addProduct = async (productData: Omit<Product, "id" | "createdAt">): Promise<Product> => {
    const prodId = generateUUID();
    const newProduct: Product = {
      ...productData,
      id: prodId,
      images: normalizeImages(productData.images),
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { categoryName, ...supabasePayload } = newProduct as any;
        const cleanPayload = {
          ...supabasePayload,
          categoryId: isValidUUID(supabasePayload.categoryId) ? supabasePayload.categoryId : null,
          images: normalizeImages(supabasePayload.images),
          lengthCm: supabasePayload.lengthCm !== undefined && supabasePayload.lengthCm !== "" ? Number(supabasePayload.lengthCm) : null,
          widthCm: supabasePayload.widthCm !== undefined && supabasePayload.widthCm !== "" ? Number(supabasePayload.widthCm) : null,
          originalPrice: supabasePayload.originalPrice !== undefined && supabasePayload.originalPrice !== "" ? Number(supabasePayload.originalPrice) : null,
        };
        const { error } = await supabase.from("products").insert([cleanPayload]);
        if (error) {
          console.error("Supabase insert product error:", error);
          if (typeof window !== "undefined") {
            alert(
              `⚠️ Peringatan Sinkronisasi Cloud:\nProduk tersimpan di browser ini, tetapi GAGAL masuk ke Database Supabase.\n\nPesan Supabase: ${error.message} (Kode: ${error.code})\n\n💡 Solusi: Pintu izin Supabase (RLS) masih terkunci. Silakan buka Supabase SQL Editor dan klik 'Run' pada script SQL yang diberikan ZettBOT.`
            );
          }
        } else {
          if (typeof window !== "undefined") {
            alert("✅ Berhasil!\nProduk telah tersimpan ke Database Cloud Supabase dan akan tampil di seluruh perangkat pelanggan.");
          }
        }
      } catch (err) {
        console.error("Supabase insert product error:", err);
      }
    }

    setProducts((prev) => {
      const updated = [newProduct, ...prev.filter((p) => p.id !== newProduct.id)];
      try {
        localStorage.setItem("trifting_products", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { categoryName, ...cleanUpdates } = updates as any;
        if (cleanUpdates.categoryId !== undefined) {
          cleanUpdates.categoryId = isValidUUID(cleanUpdates.categoryId) ? cleanUpdates.categoryId : null;
        }
        if (cleanUpdates.images) {
          cleanUpdates.images = normalizeImages(cleanUpdates.images);
        }
        if (cleanUpdates.lengthCm !== undefined) {
          cleanUpdates.lengthCm = cleanUpdates.lengthCm !== "" && cleanUpdates.lengthCm !== null ? Number(cleanUpdates.lengthCm) : null;
        }
        if (cleanUpdates.widthCm !== undefined) {
          cleanUpdates.widthCm = cleanUpdates.widthCm !== "" && cleanUpdates.widthCm !== null ? Number(cleanUpdates.widthCm) : null;
        }
        if (cleanUpdates.originalPrice !== undefined) {
          cleanUpdates.originalPrice = cleanUpdates.originalPrice !== "" && cleanUpdates.originalPrice !== null ? Number(cleanUpdates.originalPrice) : null;
        }
        await supabase.from("products").update(cleanUpdates).eq("id", id);
      } catch (err) {
        console.error("Supabase update product error:", err);
      }
    }

    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    return true;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("products").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase delete product error:", err);
      }
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  const addOrder = async (orderData: Omit<Order, "id" | "createdAt">): Promise<Order> => {
    const orderId = generateUUID();
    const createdAt = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt,
    };

    // Mark purchased products as 'sold'
    if (orderData.items && orderData.items.length > 0) {
      const productIds = orderData.items.map((i) => i.productId);
      setProducts((prev) =>
        prev.map((p) => (productIds.includes(p.id) ? { ...p, status: "sold" } : p))
      );

      if (isSupabaseConfigured && supabase) {
        try {
          const validProductUuids = productIds.filter(isValidUUID);
          if (validProductUuids.length > 0) {
            await supabase.from("products").update({ status: "sold" }).in("id", validProductUuids);
          }
        } catch (err) {
          console.error("Error updating product status in Supabase:", err);
        }
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        // Strip out 'items' before inserting into orders table
        const { items: orderItemsList, ...orderWithoutItems } = newOrder;

        const cleanOrderPayload = {
          ...orderWithoutItems,
          id: orderId,
          userId: isValidUUID(orderWithoutItems.userId) ? orderWithoutItems.userId : null,
        };

        const { error: insertOrderErr } = await supabase.from("orders").insert([cleanOrderPayload]);
        if (insertOrderErr) {
          console.error("Supabase insert order error:", insertOrderErr);
        }

        // Insert order items into orderitems table
        if (orderItemsList && orderItemsList.length > 0) {
          const itemsPayload = orderItemsList.map((item) => ({
            id: generateUUID(),
            orderId: orderId,
            productId: isValidUUID(item.productId) ? item.productId : null,
            productTitle: item.productTitle,
            productPrice: item.productPrice,
            productSize: item.productSize || "",
            productImage: item.productImage || "",
          }));

          const { error: insertItemsErr } = await supabase.from("orderitems").insert(itemsPayload);
          if (insertItemsErr) {
            console.error("Supabase insert orderitems error:", insertItemsErr);
          }
        }
      } catch (err) {
        console.error("Supabase insert order transaction error:", err);
      }
    }

    setOrders((prev) => [newOrder, ...prev]);
    try {
      const existing = JSON.parse(localStorage.getItem("trifting_orders") || "[]");
      localStorage.setItem("trifting_orders", JSON.stringify([newOrder, ...existing]));
    } catch {}

    return newOrder;
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order["orderStatus"],
    resi?: string
  ): Promise<boolean> => {
    const updates: Partial<Order> = { orderStatus: status };
    if (resi) updates.trackingNumber = resi;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("orders").update(updates).eq("id", orderId);
      } catch {}
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o))
    );
    return true;
  };

  const addCategory = async (catData: Omit<Category, "id">): Promise<Category> => {
    const newCat: Category = {
      ...catData,
      id: "cat-" + Date.now(),
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const addPromotion = async (promoData: Omit<Promotion, "id">): Promise<Promotion> => {
    const newPromo: Promotion = {
      ...promoData,
      id: "promo-" + Date.now(),
    };
    setPromotions((prev) => [...prev, newPromo]);
    return newPromo;
  };

  const togglePromotionActive = (promoId: string) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === promoId ? { ...p, isActive: !p.isActive } : p))
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        promotions,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        addCategory,
        addPromotion,
        togglePromotionActive,
        refreshData: loadData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
