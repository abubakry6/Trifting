import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const randomSeq = String(Math.floor(100 + Math.random() * 900));
  return `TRF-${year}${month}${date}-${randomSeq}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function isValidUUID(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

export const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";

export function getProductImage(product?: { images?: string[] | string } | null): string {
  if (!product || !product.images) return DEFAULT_PRODUCT_IMAGE;

  // 1. Array of images
  if (Array.isArray(product.images)) {
    if (product.images.length === 0) return DEFAULT_PRODUCT_IMAGE;
    const first = product.images[0];
    if (typeof first === "string" && first.trim()) {
      const clean = first.replace(/^\{+|\}+$/g, "").replace(/^"+|"+$/g, "").trim();
      return clean.startsWith("http") || clean.startsWith("data:") ? clean : DEFAULT_PRODUCT_IMAGE;
    }
  }

  // 2. String representation
  if (typeof product.images === "string") {
    let str = (product.images as string).trim();
    if (str.startsWith("[") && str.endsWith("]")) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
          const first = parsed[0].replace(/^\{+|\}+$/g, "").replace(/^"+|"+$/g, "").trim();
          if (first.startsWith("http") || first.startsWith("data:")) return first;
        }
      } catch {}
    }
    if (str.startsWith("{") && str.endsWith("}")) {
      const inside = str.slice(1, -1).split(",")[0].replace(/^"+|"+$/g, "").trim();
      if (inside.startsWith("http") || inside.startsWith("data:")) return inside;
    }
    if (str.startsWith("http") || str.startsWith("data:")) {
      return str;
    }
  }

  return DEFAULT_PRODUCT_IMAGE;
}

export function normalizeImages(images: any): string[] {
  if (!images) return [DEFAULT_PRODUCT_IMAGE];
  if (Array.isArray(images)) {
    const valid = images
      .map((img) => {
        if (typeof img === "string") {
          const clean = img.replace(/^\{+|\}+$/g, "").replace(/^"+|"+$/g, "").trim();
          return clean.startsWith("http") || clean.startsWith("data:") ? clean : null;
        }
        return null;
      })
      .filter((img): img is string => img !== null);
    return valid.length > 0 ? valid : [DEFAULT_PRODUCT_IMAGE];
  }
  if (typeof images === "string") {
    const clean = images.replace(/^\{+|\}+$/g, "").replace(/^"+|"+$/g, "").trim();
    if (clean.startsWith("[") && clean.endsWith("]")) {
      try {
        const parsed = JSON.parse(clean);
        return normalizeImages(parsed);
      } catch {}
    }
    if (clean.startsWith("{") && clean.endsWith("}")) {
      const parts = clean.slice(1, -1).split(",").map((s) => s.replace(/^"+|"+$/g, "").trim());
      return normalizeImages(parts);
    }
    if (clean.startsWith("http") || clean.startsWith("data:")) {
      return [clean];
    }
  }
  return [DEFAULT_PRODUCT_IMAGE];
}
