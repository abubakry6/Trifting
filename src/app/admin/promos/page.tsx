"use client";

import React, { useState } from "react";
import { Plus, Tag, Check, X, Trash2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Promotion } from "@/types/database";
import { formatRupiah } from "@/lib/utils";

export default function AdminPromosPage() {
  const { promotions, addPromotion, togglePromotionActive } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState<number | "">("");
  const [minSpend, setMinSpend] = useState<number | "">("");
  const [maxDiscount, setMaxDiscount] = useState<number | "">("");
  const [usageLimit, setUsageLimit] = useState<number | "">("");

  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue) {
      alert("Mohon isi kode kupon dan nilai diskon.");
      return;
    }

    await addPromotion({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minSpend: minSpend ? Number(minSpend) : 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      usedCount: 0,
      isActive: true,
    });

    setIsModalOpen(false);
    setCode("");
    setDiscountValue("");
    setMinSpend("");
    setMaxDiscount("");
    setUsageLimit("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E4DE]">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#3A4D28] block mb-1">
            CAMPAIGN & PROMOTIONS
          </span>
          <h1 className="text-3xl font-black text-[#0F1012] tracking-tight">
            Voucher & Diskon Toko
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Kelola kode kupon promo untuk meramaikan 'Drop War' pakaian thrift.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F1012] hover:bg-[#27272A] text-white text-xs font-bold rounded-xl shadow-lg transition"
        >
          <Plus className="w-4 h-4 text-[#4D6635]" />
          <span>Buat Kupon Baru</span>
        </button>
      </div>

      {/* Promos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className={`p-6 rounded-2xl border transition shadow-sm flex flex-col justify-between ${
              promo.isActive
                ? "bg-white border-[#E5E4DE]"
                : "bg-[#F4F3EE] border-[#E5E4DE] opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono font-black text-lg text-[#0F1012] bg-[#FAF9F5] px-3 py-1 rounded-lg border border-[#E5E4DE] tracking-wider">
                  {promo.code}
                </span>
                <button
                  onClick={() => togglePromotionActive(promo.id)}
                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full transition ${
                    promo.isActive
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {promo.isActive ? "Aktif" : "Nonaktif"}
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-[#52525B]">
                <p>
                  Diskon:{" "}
                  <strong className="text-[#0F1012]">
                    {promo.discountType === "percentage"
                      ? `${promo.discountValue}%`
                      : formatRupiah(promo.discountValue)}
                  </strong>
                </p>
                <p>
                  Min. Belanja:{" "}
                  <strong className="text-[#0F1012]">
                    {promo.minSpend > 0 ? formatRupiah(promo.minSpend) : "Tanpa Minimum"}
                  </strong>
                </p>
                {promo.maxDiscount && (
                  <p>
                    Maks. Potongan:{" "}
                    <strong className="text-[#0F1012]">{formatRupiah(promo.maxDiscount)}</strong>
                  </p>
                )}
                <p>
                  Terpakai:{" "}
                  <strong className="text-[#3A4D28]">
                    {promo.usedCount}
                    {promo.usageLimit ? ` / ${promo.usageLimit}` : " kali"}
                  </strong>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F0EB] mt-4 flex justify-between items-center text-xs">
              <span className="text-[#71717A]">Klik status untuk on/off</span>
              <button
                onClick={() => togglePromotionActive(promo.id)}
                className="font-bold text-[#0F1012] underline hover:text-[#3A4D28]"
              >
                {promo.isActive ? "Matikan" : "Aktifkan"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Promo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5E4DE] space-y-4 animate-fade-in text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E4DE]">
              <h3 className="font-black text-sm text-[#0F1012]">Buat Kupon Diskon Baru</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-[#71717A]" />
              </button>
            </div>

            <form onSubmit={handleAddPromo} className="space-y-4">
              <div>
                <label className="block font-bold text-[#3F3F46] mb-1">Kode Voucher (Kapital) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH40"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full uppercase font-mono bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012] font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#3F3F46] mb-1">Tipe Diskon *</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                  >
                    <option value="percentage">Persentase (%)</option>
                    <option value="fixed">Nominal Tetap (Rp)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#3F3F46] mb-1">
                    Nilai Diskon ({discountType === "percentage" ? "%" : "Rp"}) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder={discountType === "percentage" ? "15" : "50000"}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value ? Number(e.target.value) : "")}
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#3F3F46] mb-1">Minimal Belanja (Rp)</label>
                  <input
                    type="number"
                    placeholder="200000"
                    value={minSpend}
                    onChange={(e) => setMinSpend(e.target.value ? Number(e.target.value) : "")}
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3F3F46] mb-1">Maks. Potongan (Rp)</label>
                  <input
                    type="number"
                    placeholder="100000"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value ? Number(e.target.value) : "")}
                    className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#3F3F46] mb-1">Batas Penggunaan (Kuota)</label>
                <input
                  type="number"
                  placeholder="100"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E5E4DE] rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F1012] text-white rounded-xl font-bold"
                >
                  Simpan Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
