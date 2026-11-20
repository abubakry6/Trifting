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
  SlidersHorizontal 
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Product, ConditionGrade, ProductStatus } from "@/types/database";
import { formatRupiah, slugify } from "@/lib/utils";

export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
    setImageUrl(p.images[0] || "");
    setDescription(p.description);
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
    const imagesArray = imageUrl.trim()
      ? [imageUrl.trim()]
      : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800"];

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
        status: "available",
        isFeatured,
      });
    }

    setIsModalOpen(false);
  };

  const toggleStatus = async (p: Product) => {
    const newStatus: ProductStatus = p.status === "available" ? "sold" : "available";
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

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F1012] hover:bg-[#27272A] text-white text-xs font-bold rounded-xl shadow-lg transition"
        >
          <Plus className="w-4 h-4 text-[#4D6635]" />
          <span>Tambah Item Thrift</span>
        </button>
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
          {["all", "available", "sold"].map((st) => (
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
                      src={p.images[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200"}
                      alt={p.title}
                      className="w-12 h-12 object-cover rounded-lg border border-[#E5E4DE] bg-[#FAF9F5]"
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
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                      title="Klik untuk ubah status"
                    >
                      {p.status}
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

              <div>
                <label className="block font-bold text-[#3F3F46] mb-1">URL Foto Produk (Supabase Storage / Web URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                />
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

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-[#3A4D28] w-4 h-4 rounded"
                />
                <label htmlFor="featured" className="font-bold text-[#0F1012]">
                  Tampilkan di Koleksi Unggulan (Featured Grail)
                </label>
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
    </div>
  );
}
