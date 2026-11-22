"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Upload, 
  Check, 
  Shirt, 
  Sparkles,
  SlidersHorizontal,
  Loader2,
  Image as ImageIcon,
  Copy,
  ExternalLink
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Product, ConditionGrade, ProductStatus } from "@/types/database";
import { formatRupiah, slugify, getProductImage, DEFAULT_PRODUCT_IMAGE } from "@/lib/utils";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const sqlFixScript = `-- 1. Buka izin tabel products (INSERT, SELECT, UPDATE, DELETE)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Products are readable by everyone" ON public.products;
CREATE POLICY "Products are readable by everyone" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Products manageable by admin" ON public.products;
DROP POLICY IF EXISTS "Products manageable by all" ON public.products;
CREATE POLICY "Products manageable by all" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- 2. Dukungan status inactive pada produk
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_status_check;
ALTER TABLE public.products ADD CONSTRAINT products_status_check CHECK (status IN ('available', 'reserved', 'sold', 'inactive'));

-- 3. Buka izin tabel orders & orderitems (Pesanan Pelanggan)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Orders manageable by all" ON public.orders;
CREATE POLICY "Orders manageable by all" ON public.orders FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.orderitems ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Order items manageable by all" ON public.orderitems;
CREATE POLICY "Order items manageable by all" ON public.orderitems FOR ALL USING (true) WITH CHECK (true);

-- 4. Buka izin Supabase Storage (Wadah Foto Produk)
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO UPDATE SET public = true;
DROP POLICY IF EXISTS "Public can upload product images" ON storage.objects;
CREATE POLICY "Public can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Public can update product images" ON storage.objects;
CREATE POLICY "Public can update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');`;

  const copyToClipboard = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(sqlFixScript);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  };

  // Form State
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [lengthCm, setLengthCm] = useState<number | "">("");
  const [widthCm, setWidthCm] = useState<number | "">("");
  const [conditionGrade, setConditionGrade] = useState<ConditionGrade>("Grade A (9.5/10)");
  const [conditionNotes, setConditionNotes] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<ProductStatus>("available");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => resolve(blob || file),
          "image/jpeg",
          0.85
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };
      img.src = objectUrl;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);

    try {
      // Auto-compress photo to lightweight ~150KB JPEG
      const compressedBlob = await compressImage(file);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.storage
            .from("product-images")
            .upload(fileName, compressedBlob, {
              contentType: "image/jpeg",
              cacheControl: "3600",
              upsert: true,
            });

          if (!error && data) {
            const { data: publicUrlData } = supabase.storage
              .from("product-images")
              .getPublicUrl(fileName);

            if (publicUrlData?.publicUrl) {
              setImageUrl(publicUrlData.publicUrl);
              setIsUploadingImage(false);
              return;
            }
          }
        } catch (err) {
          console.warn("Supabase storage upload exception:", err);
        }
      }

      // Fallback: Read the COMPRESSED blob (~150KB) so it can be previewed & saved without payload limits
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(compressedBlob);
    } catch (err) {
      console.error("Image processing error:", err);
      setIsUploadingImage(false);
    }
  };

  const conditionOptions: ConditionGrade[] = [
    "Grade A+ (Like New)",
    "Grade A (9.5/10)",
    "Grade B+ (Good Condition)",
    "Grade B (Minus Noda Samar)",
    "Vintage Distressed",
  ];

  const filteredProducts = products.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.size.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle("");
    setCategoryId(categories[0]?.id || "");
    setBrand("");
    setSize("");
    setLengthCm("");
    setWidthCm("");
    setConditionGrade("Grade A (9.5/10)");
    setConditionNotes("");
    setPrice("");
    setOriginalPrice("");
    setImageUrl("");
    setDescription("");
    setStatus("available");
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setCategoryId(p.categoryId);
    setBrand(p.brand);
    setSize(p.size);
    setLengthCm(p.lengthCm || "");
    setWidthCm(p.widthCm || "");
    setConditionGrade(p.conditionGrade);
    setConditionNotes(p.conditionNotes || "");
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || "");
    setImageUrl(getProductImage(p));
    setDescription(p.description);
    setStatus(p.status || "available");
    setIsFeatured(p.isFeatured);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !brand) {
      alert("Mohon isi judul, brand, dan harga produk.");
      return;
    }

    const categoryObj = categories.find((c) => c.id === categoryId);
    let finalImageUrl = imageUrl.trim();

    // Auto-resolve if user pasted just a filename or relative path
    if (
      finalImageUrl &&
      !finalImageUrl.startsWith("http://") &&
      !finalImageUrl.startsWith("https://") &&
      !finalImageUrl.startsWith("data:")
    ) {
      const sbUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sqawuxrsefptxdjjmezu.supabase.co";
      finalImageUrl = `${sbUrl}/storage/v1/object/public/product-images/${finalImageUrl}`;
    }

    const imagesArray = finalImageUrl
      ? [finalImageUrl]
      : [DEFAULT_PRODUCT_IMAGE];

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        title,
        slug: slugify(title),
        categoryId,
        categoryName: categoryObj?.name,
        brand,
        size,
        lengthCm: lengthCm ? Number(lengthCm) : undefined,
        widthCm: widthCm ? Number(widthCm) : undefined,
        conditionGrade,
        conditionNotes,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        images: imagesArray,
        description,
        status,
        isFeatured,
      });
    } else {
      await addProduct({
        title,
        slug: slugify(title) + "-" + Math.floor(Math.random() * 1000),
        categoryId,
        categoryName: categoryObj?.name,
        brand,
        size,
        lengthCm: lengthCm ? Number(lengthCm) : undefined,
        widthCm: widthCm ? Number(widthCm) : undefined,
        conditionGrade,
        conditionNotes,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        images: imagesArray,
        description,
        status,
        isFeatured,
      });
    }

    setIsModalOpen(false);
  };

  const toggleStatus = async (p: Product) => {
    const nextStatus: Record<ProductStatus, ProductStatus> = {
      available: "sold",
      sold: "inactive",
      inactive: "available",
      reserved: "available",
    };
    const newStatus = nextStatus[p.status] || "available";
    await updateProduct(p.id, { status: newStatus });
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus produk "${name}"?`)) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E4DE]">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#3A4D28] block mb-1">
            INVENTORY MANAGEMENT
          </span>
          <h1 className="text-3xl font-black text-[#0F1012] tracking-tight">
            Katalog Produk Thrift
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Total {products.length} item pakaian streetwear tercatat dalam database.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsSqlModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FAF9F5] border border-[#E5E4DE] hover:border-[#3A4D28] text-[#0F1012] text-xs font-bold rounded-xl transition shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#3A4D28]" />
            <span>Kunci Database Supabase</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F1012] hover:bg-[#27272A] text-white text-xs font-bold rounded-xl shadow-lg transition"
          >
            <Plus className="w-4 h-4 text-[#4D6635]" />
            <span>Tambah Item Thrift</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E4DE] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#71717A]" />
          <input
            type="text"
            placeholder="Cari judul, brand, ukuran..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl pl-10 pr-4 py-2 text-xs text-[#0F1012]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["all", "available", "sold", "inactive"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                statusFilter === st
                  ? "bg-[#0F1012] text-white"
                  : "bg-[#FAF9F5] border border-[#E5E4DE] text-[#71717A] hover:text-[#0F1012]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Fluid Table */}
      <div className="bg-white rounded-2xl border border-[#E5E4DE] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF9F5] text-[#71717A] uppercase text-[10px] font-bold border-b border-[#E5E4DE]">
              <tr>
                <th className="p-3.5">Foto</th>
                <th className="p-3.5">Item & Brand</th>
                <th className="p-3.5">Ukuran PxL</th>
                <th className="p-3.5">Grade</th>
                <th className="p-3.5">Harga</th>
                <th className="p-3.5">Status Stok</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F0EB]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF9F5]/60 transition">
                  <td className="p-3.5">
                    <img
                      src={getProductImage(p)}
                      alt={p.title}
                      className="w-12 h-12 object-cover rounded-lg border border-[#E5E4DE] bg-[#FAF9F5]"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                      }}
                    />
                  </td>
                  <td className="p-3.5 max-w-xs">
                    <span className="font-bold text-[#0F1012] block truncate">{p.title}</span>
                    <span className="text-[11px] text-[#71717A] uppercase tracking-wider block">
                      {p.brand} {p.isFeatured && "• ⭐ GRAIL"}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[#52525B]">
                    {p.size}
                    {p.lengthCm && p.widthCm && (
                      <span className="block text-[10px] text-[#71717A]">
                        ({p.lengthCm}x{p.widthCm} cm)
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#E5E4DE] text-[#0F1012]">
                      {p.conditionGrade.split(" ")[0]} {p.conditionGrade.split(" ")[1] || ""}
                    </span>
                  </td>
                  <td className="p-3.5 font-black text-[#0F1012]">
                    {formatRupiah(p.price)}
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => toggleStatus(p)}
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full transition ${
                        p.status === "available"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : p.status === "sold"
                          ? "bg-red-100 text-red-800 hover:bg-red-200"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }`}
                      title="Klik untuk ubah status (Available -> Sold -> Inactive)"
                    >
                      {p.status === "inactive" ? "INACTIVE (DISEMBUNYIKAN)" : p.status}
                    </button>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-[#71717A] hover:text-[#0F1012] hover:bg-[#FAF9F5] rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E5E4DE] space-y-6 animate-fade-in my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E4DE]">
              <h3 className="font-black text-lg text-[#0F1012]">
                {editingProduct ? "Edit Item Thrift" : "Tambah Item Thrift Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#71717A] hover:text-[#0F1012] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#3F3F46] mb-1">Judul Produk *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Carhartt Detroit Jacket J97 Vintage"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3F3F46] mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Carhartt / Nike / Stussy"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3F3F46] mb-1">Kategori *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[#3F3F46] mb-1">Ukuran Tag *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. L fit XL"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3F3F46] mb-1">Panjang (cm)</label>
                  <input
                    type="number"
                    placeholder="68"
                    value={lengthCm}
                    onChange={(e) => setLengthCm(e.target.value ? Number(e.target.value) : "")}
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3F3F46] mb-1">Lebar Dada (cm)</label>
                  <input
                    type="number"
                    placeholder="60"
                    value={widthCm}
                    onChange={(e) => setWidthCm(e.target.value ? Number(e.target.value) : "")}
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3F3F46] mb-1">Grade Kondisi *</label>
                  <select
                    value={conditionGrade}
                    onChange={(e) => setConditionGrade(e.target.value as ConditionGrade)}
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                  >
                    {conditionOptions.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#3F3F46] mb-1">Catatan Minus / Fisik</label>
                  <input
                    type="text"
                    placeholder="Noda pudar samar, zipper tembaga mulus..."
                    value={conditionNotes}
                    onChange={(e) => setConditionNotes(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3F3F46] mb-1">Harga Jual (Rp) *</label>
                  <input
                    type="number"
                    required
                    placeholder="1250000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3F3F46] mb-1">Harga Coret / Asli (Opsional)</label>
                  <input
                    type="number"
                    placeholder="1800000"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : "")}
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                  />
                </div>
              </div>

              {/* Image Upload & Preview Section */}
              <div className="space-y-2">
                <label className="block font-bold text-[#3F3F46]">
                  Foto Produk Thrift (Pilih dari HP/Laptop atau Masukkan Link)
                </label>

                {/* File Upload Box */}
                <div className="border-2 border-dashed border-[#D4D4D8] hover:border-[#3A4D28] rounded-2xl p-4 bg-[#FAF9F5] text-center transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploadingImage}
                  />
                  {isUploadingImage ? (
                    <div className="flex flex-col items-center justify-center py-3 text-[#3A4D28]">
                      <Loader2 className="w-6 h-6 animate-spin mb-1.5" />
                      <span className="text-xs font-bold">Mengunggah foto ke Supabase Storage...</span>
                    </div>
                  ) : imageUrl ? (
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#E5E4DE] bg-white shrink-0">
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-black text-[#0F1012] block">Foto Siap Digunakan</span>
                        <span className="text-[11px] text-[#71717A] truncate block">{imageUrl}</span>
                        <span className="text-[10px] text-[#3A4D28] font-bold mt-0.5 inline-block">Klik kotak ini untuk ganti foto</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-3 text-[#71717A]">
                      <Upload className="w-6 h-6 text-[#3A4D28] mb-1.5" />
                      <span className="text-xs font-bold text-[#0F1012]">Klik untuk pilih foto dari Galeri HP / Laptop</span>
                      <span className="text-[10px] text-[#A1A1AA] mt-0.5">Format JPG, PNG, atau WEBP (Maksimal 5MB)</span>
                    </div>
                  )}
                </div>

                {/* Optional Manual URL Input */}
                <div className="pt-1">
                  <span className="text-[11px] text-[#71717A] block mb-1">Atau masukkan Link / Nama File foto secara manual:</span>
                  <input
                    type="text"
                    placeholder="https://... atau nama-file.png"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-white border border-[#E5E4DE] rounded-xl p-2.5 text-xs text-[#0F1012] placeholder:text-[#A1A1AA]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#3F3F46] mb-1">Deskripsi Lengkap</label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan sejarah atau keunikan pakaian ini..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-[#3F3F46] mb-1">Status Ketersediaan *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProductStatus)}
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                  >
                    <option value="available">Available (Aktif Dijual & Tampil)</option>
                    <option value="sold">Sold (Ditandai Terjual)</option>
                    <option value="inactive">Inactive (Disembunyikan dari Pelanggan)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-[#3A4D28] w-4 h-4 rounded"
                  />
                  <label htmlFor="featured" className="font-bold text-[#0F1012]">
                    Tampilkan di Koleksi Unggulan (Grail)
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E4DE] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white border border-[#E5E4DE] text-[#0F1012] font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0F1012] hover:bg-[#27272A] text-white font-bold rounded-xl shadow-lg"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Buka Kunci Database Supabase (SQL Fix) */}
      {isSqlModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E5E4DE] space-y-5 animate-fade-in my-8">
            <div className="flex items-start justify-between pb-3 border-b border-[#E5E4DE]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#3A4D28]">PANDUAN 1 MENIT</span>
                <h3 className="font-black text-lg text-[#0F1012]">
                  Buka Izin Sinkronisasi Supabase Cloud
                </h3>
              </div>
              <button
                onClick={() => setIsSqlModalOpen(false)}
                className="p-1.5 text-[#71717A] hover:text-[#0F1012] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#71717A] leading-relaxed">
              Supabase secara default mengunci penambahan produk & pesanan (Error 42501). Jalankan script ini sekali saja di <b>Supabase SQL Editor</b> agar seluruh produk yang ditambahkan admin langsung tersimpan ke database cloud dan tampil di pelanggan.
            </p>

            <div className="relative">
              <pre className="bg-[#0F1012] text-[#A1A1AA] text-[11px] p-4 rounded-xl overflow-x-auto max-h-56 font-mono leading-relaxed border border-white/10">
                {sqlFixScript}
              </pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3A4D28] hover:bg-[#4D6635] text-white text-[11px] font-bold rounded-lg shadow transition"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E5E4DE] text-[11px] text-[#3F3F46] space-y-1.5">
              <span className="font-bold block text-[#0F1012]">Langkah Cepat di Supabase:</span>
              <p>1. Buka <b>Supabase SQL Editor</b> &rarr; klik tombol <b>+</b> &rarr; pilih <b>Create a new snippet</b>.</p>
              <p>2. Tempelkan (paste) script SQL di atas.</p>
              <p>3. Klik tombol hijau <b>Run</b> (atau tekan Ctrl+Enter).</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsSqlModalOpen(false)}
                className="px-5 py-2.5 bg-[#0F1012] text-white text-xs font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
