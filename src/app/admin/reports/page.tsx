"use client";

import React, { useState } from "react";
import { Download, BarChart2, TrendingUp, Calendar, FileSpreadsheet } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function AdminReportsPage() {
  const { orders } = useStore();
  const [period, setPeriod] = useState<"all" | "month" | "week">("all");

  const filteredOrders = orders.filter((o) => {
    if (period === "all") return true;
    const orderDate = new Date(o.createdAt);
    const now = new Date();
    if (period === "week") {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return orderDate >= sevenDaysAgo;
    }
    if (period === "month") {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return orderDate >= thirtyDaysAgo;
    }
    return true;
  });

  const totalOmset = filteredOrders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalItemsSold = filteredOrders.reduce((sum, o) => sum + (o.items?.length || 1), 0);

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    const headers = [
      "Order Number",
      "Tanggal",
      "Nama Pelanggan",
      "No Telepon",
      "Email",
      "Kota Pengiriman",
      "Kurir",
      "Nomor Resi",
      "Subtotal",
      "Ongkos Kirim",
      "Diskon",
      "Total Pembayaran",
      "Status Bayar",
      "Status Order",
    ];

    const rows = filteredOrders.map((o) => [
      `"${o.orderNumber}"`,
      `"${formatDate(o.createdAt)}"`,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.customerEmail}"`,
      `"${o.shippingAddress.city}"`,
      `"${o.shippingCourier}"`,
      `"${o.trackingNumber || "-"}"`,
      o.subtotal,
      o.shippingCost,
      o.discountAmount,
      o.totalAmount,
      `"${o.paymentStatus}"`,
      `"${o.orderStatus}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Penjualan_Trifting_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E4DE]">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#3A4D28] block mb-1">
            ANALYTICS & FINANCIALS
          </span>
          <h1 className="text-3xl font-black text-[#0F1012] tracking-tight">
            Laporan Penjualan
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Rekapitulasi keuangan transaksi dan performa pengiriman toko.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5E4DE] text-xs">
            <button
              onClick={() => setPeriod("all")}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                period === "all" ? "bg-[#0F1012] text-white" : "text-[#71717A]"
              }`}
            >
              Semua Waktu
            </button>
            <button
              onClick={() => setPeriod("month")}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                period === "month" ? "bg-[#0F1012] text-white" : "text-[#71717A]"
              }`}
            >
              30 Hari
            </button>
            <button
              onClick={() => setPeriod("week")}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                period === "week" ? "bg-[#0F1012] text-white" : "text-[#71717A]"
              }`}
            >
              7 Hari
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#3A4D28] hover:bg-[#2D3B22] text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm">
          <span className="text-xs font-bold uppercase text-[#71717A] tracking-wider block mb-2">
            Total Omset Lunas
          </span>
          <span className="text-3xl font-black text-[#0F1012]">{formatRupiah(totalOmset)}</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm">
          <span className="text-xs font-bold uppercase text-[#71717A] tracking-wider block mb-2">
            Pesanan Masuk
          </span>
          <span className="text-3xl font-black text-[#0F1012]">
            {filteredOrders.length} <span className="text-sm font-normal text-[#71717A]">Order</span>
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm">
          <span className="text-xs font-bold uppercase text-[#71717A] tracking-wider block mb-2">
            Item Thrift Terdistribusi
          </span>
          <span className="text-3xl font-black text-[#3A4D28]">
            {totalItemsSold} <span className="text-sm font-normal text-[#71717A]">Pcs</span>
          </span>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-[#E5E4DE] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF9F5] text-[#71717A] uppercase text-[10px] font-bold border-b border-[#E5E4DE]">
              <tr>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Tanggal</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Kota</th>
                <th className="p-3.5">Kurir</th>
                <th className="p-3.5">Diskon</th>
                <th className="p-3.5">Total</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F0EB]">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#FAF9F5]/60 transition">
                  <td className="p-3.5 font-mono font-bold text-[#0F1012]">{ord.orderNumber}</td>
                  <td className="p-3.5 text-[#71717A]">{formatDate(ord.createdAt)}</td>
                  <td className="p-3.5 font-bold text-[#0F1012]">{ord.customerName}</td>
                  <td className="p-3.5 text-[#52525B]">{ord.shippingAddress.city}</td>
                  <td className="p-3.5 text-[#52525B]">{ord.shippingCourier.split("(")[0]}</td>
                  <td className="p-3.5 text-emerald-700 font-bold">
                    {ord.discountAmount > 0 ? `-${formatRupiah(ord.discountAmount)}` : "-"}
                  </td>
                  <td className="p-3.5 font-black text-[#0F1012]">{formatRupiah(ord.totalAmount)}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {ord.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
