"use client";

import React from "react";
import Link from "next/link";
import { 
  DollarSign, 
  ShoppingBag, 
  Shirt, 
  TrendingUp, 
  Package, 
  ArrowRight, 
  PlusCircle,
  AlertCircle 
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { products, orders } = useStore();

  // Metrics Calculations
  const grossSales = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalOrdersCount = orders.length;
  const soldProductsCount = products.filter((p) => p.status === "sold").length;
  const availableProductsCount = products.filter((p) => p.status === "available").length;

  const averageOrderValue =
    orders.length > 0 ? Math.round(grossSales / (orders.length || 1)) : 0;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E4DE]">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#3A4D28] block mb-1">
            STORE OVERVIEW
          </span>
          <h1 className="text-3xl font-black text-[#0F1012] tracking-tight">
            Dashboard Penjualan
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Statistik terkini inventaris dan performa transaksi Trifting Official.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F1012] hover:bg-[#27272A] text-white text-xs font-bold rounded-xl shadow-lg transition"
        >
          <PlusCircle className="w-4 h-4 text-[#4D6635]" />
          <span>Upload Produk Baru</span>
        </Link>
      </div>

      {/* Grid 3-Kolom Sesuai Pedoman Rekayasa ZettBOT (Anti-Tumpuk Vertikal) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Gross Sales */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#71717A] mb-4">
            <span className="text-xs uppercase font-bold tracking-wider">Total Omset Penjualan</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-[#0F1012] tracking-tight block">
              {formatRupiah(grossSales)}
            </span>
            <span className="text-[11px] text-[#3A4D28] font-bold mt-1 inline-flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Dari transaksi lunas
            </span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#71717A] mb-4">
            <span className="text-xs uppercase font-bold tracking-wider">Total Transaksi</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-[#0F1012] tracking-tight block">
              {totalOrdersCount} <span className="text-base text-[#71717A] font-normal">Pesanan</span>
            </span>
            <span className="text-[11px] text-[#71717A] mt-1 block">
              Rata-rata order: {formatRupiah(averageOrderValue)}
            </span>
          </div>
        </div>

        {/* Card 3: Inventory Thrift Ratio */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#71717A] mb-4">
            <span className="text-xs uppercase font-bold tracking-wider">Rasio Stok Thrift</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Shirt className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-red-600 tracking-tight">
                {soldProductsCount}
              </span>
              <span className="text-xs font-bold text-[#71717A] uppercase">Terjual</span>
              <span className="text-gray-300">/</span>
              <span className="text-2xl font-black text-[#0F1012] tracking-tight">
                {availableProductsCount}
              </span>
              <span className="text-xs font-bold text-[#3A4D28] uppercase">Tersedia</span>
            </div>
            <div className="w-full bg-[#E5E4DE] h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-red-600 h-full rounded-full transition-all"
                style={{
                  width: `${(soldProductsCount / (products.length || 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E5E4DE] shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F0EB]">
          <div>
            <h3 className="font-black text-base text-[#0F1012]">Transaksi Terbaru</h3>
            <p className="text-xs text-[#71717A]">5 pesanan terakhir yang masuk ke toko.</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#3A4D28] hover:underline flex items-center gap-1"
          >
            <span>Semua Pesanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#71717A]">
            Belum ada pesanan yang masuk. Pesanan dari checkout akan otomatis tampil di sini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF9F5] text-[#71717A] uppercase text-[10px] font-bold border-b border-[#E5E4DE]">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Pembeli</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Pembayaran</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F0EB]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF9F5]/60 transition">
                    <td className="p-3 font-mono font-bold text-[#0F1012]">{ord.orderNumber}</td>
                    <td className="p-3">
                      <span className="font-bold text-[#0F1012] block">{ord.customerName}</span>
                      <span className="text-[11px] text-[#71717A] block">{ord.customerPhone}</span>
                    </td>
                    <td className="p-3 font-black text-[#0F1012]">{formatRupiah(ord.totalAmount)}</td>
                    <td className="p-3">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#E5E4DE]">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/orders/${ord.id}`}
                        className="text-xs font-bold text-[#3A4D28] hover:underline"
                      >
                        Lihat Nota
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
