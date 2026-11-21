"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Category, Order, Promotion } from "@/types/database";
import { initialProducts, initialCategories, initialPromotions } from "@/lib/mockData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { generateUUID, isValidUUID } from "@/lib/utils";

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

        if (prodRes.data && prodRes.data.length > 0) {
          setProducts(
            prodRes.data.map((p) => ({
              ...p,
              categoryName: p.categories?.name,
            }))
          );
        } else {
          initLocalProducts();
        }

        if (catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data);
        } else {
          initLocalCategories();
        }

        if (orderRes.data && orderRes.data.length > 0) {
          const mappedOrders: Order[] = orderRes.data.map((ord: any) => ({
            ...ord,
            items: ord.orderitems && ord.orderitems.length > 0 ? ord.orderitems : ord.items || [],
          }));
          setOrders(mappedOrders);
          try {
            localStorage.setItem("trifting_orders", JSON.stringify(mappedOrders));
          } catch {}
        } else {
          const savedOrders = localStorage.getItem("trifting_orders");
          if (savedOrders) {
            try {
              setOrders(JSON.parse(savedOrders));
            } catch {}
          }
        }

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
        setProducts(JSON.parse(saved));
      } else {
        setProducts(initialProducts);
        localStorage.setItem("trifting_products", JSON.stringify(initialProducts));
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
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { categoryName, ...supabasePayload } = newProduct as any;
        const cleanPayload = {
          ...supabasePayload,
          categoryId: isValidUUID(supabasePayload.categoryId) ? supabasePayload.categoryId : null,
        };
        const { data, error } = await supabase.from("products").insert([cleanPayload]).select().single();
        if (!error && data) {
          setProducts((prev) => [data, ...prev]);
          return data;
        }
      } catch (err) {
        console.error("Supabase insert product error:", err);
      }
    }

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { categoryName, ...cleanUpdates } = updates as any;
        if (cleanUpdates.categoryId !== undefined) {
          cleanUpdates.categoryId = isValidUUID(cleanUpdates.categoryId) ? cleanUpdates.categoryId : null;
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
