"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Truck, 
  Check, 
  Printer, 
  X, 
  FileText, 
  Search,
  ExternalLink 
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Order, OrderStatus } from "@/types/database";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedOrderForResi, setSelectedOrderForResi] = useState<Order | null>(null);
  const [resiInput, setResiInput] = useState("");
  const [shippingLabelOrder, setShippingLabelOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "all" && o.orderStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  const handleOpenResiModal = (ord: Order) => {
    setSelectedOrderForResi(ord);
    setResiInput(ord.trackingNumber || "");
  };

  const handleSaveResi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForResi) return;

    await updateOrderStatus(
      selectedOrderForResi.id,
      "shipped",
      resiInput.trim().toUpperCase()
    );

    setSelectedOrderForResi(null);
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E4DE]">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#3A4D28] block mb-1">
            LOGISTICS & DISPATCH
          </span>
          <h1 className="text-3xl font-black text-[#0F1012] tracking-tight">
            Kelola Pesanan & Resi
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Pantau status pesanan, input nomor resi kurir, dan cetak label pengiriman.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E4DE] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#71717A]" />
          <input
            type="text"
            placeholder="Cari Order ID, Nama, No HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl pl-10 pr-4 py-2 text-xs text-[#0F1012]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {["all", "processing", "shipped", "delivered", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize font-bold transition whitespace-nowrap ${
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

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E5E4DE] shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#71717A]">
            Tidak ada pesanan yang sesuai dengan filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF9F5] text-[#71717A] uppercase text-[10px] font-bold border-b border-[#E5E4DE]">
                <tr>
                  <th className="p-3.5">Order ID & Tanggal</th>
                  <th className="p-3.5">Penerima & Ekspedisi</th>
                  <th className="p-3.5">Item Thrift</th>
                  <th className="p-3.5">Total & Bayar</th>
                  <th className="p-3.5">Nomor Resi</th>
                  <th className="p-3.5">Status Order</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F0EB]">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF9F5]/60 transition">
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-[#0F1012] block">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-[#71717A] block">
                        {formatDate(ord.createdAt)}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-[#0F1012] block">{ord.customerName}</span>
                      <span className="text-[11px] text-[#3A4D28] font-semibold block">
                        {ord.shippingCourier}
                      </span>
                      <span className="text-[10px] text-[#71717A] block">
                        WA: {ord.customerPhone}
                      </span>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <span className="text-[#0F1012] font-medium block truncate">
                        {ord.items?.map((i) => i.productTitle).join(", ") || "Item Thrift"}
                      </span>
                      <span className="text-[10px] text-[#71717A]">
                        {ord.items?.length || 1} item
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-black text-[#0F1012] block">
                        {formatRupiah(ord.totalAmount)}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 inline-block mt-0.5">
                        {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="p-3.5">
                      {ord.trackingNumber ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[#0F1012]">
                            {ord.trackingNumber}
                          </span>
                          <button
                            onClick={() => handleOpenResiModal(ord)}
                            className="text-[10px] text-[#3A4D28] underline font-bold"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenResiModal(ord)}
                          className="px-2.5 py-1 bg-[#FAF9F5] border border-[#E5E4DE] hover:border-[#0F1012] text-[#0F1012] font-bold text-[10px] rounded-lg transition"
                        >
                          + Input Resi
                        </button>
                      )}
                    </td>

                    <td className="p-3.5">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                        className="bg-[#FAF9F5] border border-[#E5E4DE] rounded-lg px-2 py-1 text-xs font-bold text-[#0F1012]"
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setShippingLabelOrder(ord)}
                        className="p-1.5 bg-[#FAF9F5] hover:bg-[#0F1012] hover:text-white border border-[#E5E4DE] rounded-lg transition"
                        title="Cetak Label Thermal"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        href={`/orders/${ord.id}`}
                        className="inline-block p-1.5 bg-[#FAF9F5] hover:bg-[#0F1012] hover:text-white border border-[#E5E4DE] rounded-lg transition"
                        title="Buka Nota"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Input Resi Modal */}
      {selectedOrderForResi && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E5E4DE] space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E4DE]">
              <h3 className="font-black text-sm text-[#0F1012]">
                Input Resi Pengiriman
              </h3>
              <button
                onClick={() => setSelectedOrderForResi(null)}
                className="p-1 text-[#71717A] hover:text-[#0F1012]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveResi} className="space-y-4 text-xs">
              <div>
                <p className="text-[#71717A] mb-1">
                  Kurir: <strong className="text-[#0F1012]">{selectedOrderForResi.shippingCourier}</strong>
                </p>
                <p className="text-[#71717A] mb-3">
                  Penerima: <strong className="text-[#0F1012]">{selectedOrderForResi.customerName}</strong>
                </p>
                <label className="block font-bold text-[#3F3F46] mb-1">
                  Nomor Resi (Tracking Number) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JNE0019283719"
                  value={resiInput}
                  onChange={(e) => setResiInput(e.target.value)}
                  className="w-full uppercase font-mono bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-2.5 text-[#0F1012] font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForResi(null)}
                  className="px-4 py-2 border border-[#E5E4DE] rounded-xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F1012] text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Simpan & Set Shipped
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Thermal Shipping Label Modal */}
      {shippingLabelOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-black space-y-4 animate-fade-in font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <span className="font-black text-sm uppercase">LABEL PENGIRIMAN EKSPEDISI</span>
              <button
                onClick={() => setShippingLabelOrder(null)}
                className="no-print p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Label Body */}
            <div className="border-2 border-black p-4 space-y-3">
              <div className="flex justify-between border-b border-black pb-2">
                <div>
                  <span className="font-black text-base">TRIFTING OFFICIAL</span>
                  <span className="block text-[10px]">Jakarta Selatan • 081234567890</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-sm">{shippingLabelOrder.shippingCourier}</span>
                  <span className="block text-[10px] font-bold">{shippingLabelOrder.orderNumber}</span>
                </div>
              </div>

              {shippingLabelOrder.trackingNumber && (
                <div className="text-center py-2 bg-gray-100 border border-black font-black text-sm tracking-widest">
                  RESI: {shippingLabelOrder.trackingNumber}
                </div>
              )}

              <div className="space-y-1">
                <span className="font-bold text-[10px] uppercase">PENERIMA:</span>
                <p className="font-black text-sm">{shippingLabelOrder.customerName}</p>
                <p className="text-[11px] leading-tight">
                  {shippingLabelOrder.shippingAddress.streetAddress},{" "}
                  {shippingLabelOrder.shippingAddress.district},{" "}
                  {shippingLabelOrder.shippingAddress.city},{" "}
                  {shippingLabelOrder.shippingAddress.province}{" "}
                  {shippingLabelOrder.shippingAddress.postalCode}
                </p>
                <p className="font-bold text-xs mt-1">WA: {shippingLabelOrder.customerPhone}</p>
              </div>

              <div className="border-t border-black pt-2 text-[10px]">
                <span className="font-bold">ISI PAKET: </span>
                {shippingLabelOrder.items?.map((i) => i.productTitle).join(", ")}
              </div>
            </div>

            <div className="flex justify-end gap-2 no-print pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-[#0F1012] text-white font-bold rounded-xl flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Label Thermal</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
