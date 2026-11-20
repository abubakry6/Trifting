"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Package, ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function MyOrdersPage() {
  const { orders } = useStore();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const userOrders = orders.filter((o) => {
    if (filterStatus === "all") return true;
    return o.orderStatus === filterStatus;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="pb-6 border-b border-[#E5E4DE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#3A4D28] block mb-1">
            CUSTOMER PORTAL
          </span>
          <h1 className="text-3xl font-black text-[#0F1012] tracking-tight">
            Riwayat Pesanan Saya
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Pantau status proses pengemasan dan nomor resi kurir pesanan Anda.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E5E4DE] text-xs">
          {["all", "processing", "shipped", "delivered"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition ${
                filterStatus === status
                  ? "bg-[#0F1012] text-white"
                  : "text-[#71717A] hover:text-[#0F1012]"
              }`}
            >
              {status === "all" ? "Semua" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {userOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E5E4DE] p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF9F5] border border-[#E5E4DE] flex items-center justify-center mx-auto text-[#A1A1AA]">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#0F1012]">Belum Ada Pesanan Tercatat</h3>
          <p className="text-xs text-[#71717A] max-w-sm mx-auto">
            Temukan koleksi pakaian thrift vintage impian Anda dan dapatkan pengalaman belanja preloved premium.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F1012] text-white text-xs font-bold rounded-xl shadow-lg"
          >
            <span>Mulai Belanja di Katalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#E5E4DE] p-6 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F0EB] gap-2">
                <div>
                  <span className="font-mono font-bold text-sm text-[#0F1012]">
                    {order.orderNumber}
                  </span>
                  <span className="text-xs text-[#71717A] block sm:inline sm:ml-3">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#FAF9F5] border border-[#E5E4DE] text-[#0F1012]">
                    {order.orderStatus}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[11px] text-[#71717A] block mb-1">Item yang Dibeli:</span>
                  <p className="font-bold text-[#0F1012]">
                    {order.items?.map((i) => i.productTitle).join(", ") || "Item Thrift"}
                  </p>
                  <p className="text-[#71717A] mt-1">
                    Kurir: <strong>{order.shippingCourier}</strong>
                  </p>
                  {order.trackingNumber && (
                    <p className="text-[#3A4D28] font-bold mt-0.5">
                      Resi: {order.trackingNumber}
                    </p>
                  )}
                </div>

                <div className="sm:text-right flex flex-col justify-between items-start sm:items-end">
                  <div>
                    <span className="text-[11px] text-[#71717A] block">Total Pembayaran:</span>
                    <span className="text-base font-black text-[#0F1012]">
                      {formatRupiah(order.totalAmount)}
                    </span>
                  </div>

                  <Link
                    href={`/orders/${order.id}`}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#FAF9F5] hover:bg-[#0F1012] hover:text-white border border-[#E5E4DE] text-xs font-bold rounded-xl transition"
                  >
                    <span>Buka Nota & Resi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
