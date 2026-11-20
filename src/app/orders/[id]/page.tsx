"use client";

import React, { useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  Printer, 
  ArrowLeft, 
  Truck, 
  Copy, 
  Package, 
  Clock, 
  ShieldCheck, 
  MessageCircle 
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function OrderReceiptPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const { orders } = useStore();
  const printRef = useRef<HTMLDivElement>(null);

  const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-[#0F1012]">Pesanan Tidak Ditemukan</h2>
        <p className="text-xs text-[#71717A] mt-2">ID Pesanan tidak valid atau belum tercatat di database.</p>
        <Link
          href="/catalog"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#0F1012] text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const copyResi = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      alert("Nomor resi disalin: " + order.trackingNumber);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between no-print">
        <Link
          href="/catalog"
          className="flex items-center gap-2 text-xs font-bold text-[#71717A] hover:text-[#0F1012]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E4DE] hover:border-[#0F1012] text-[#0F1012] font-bold text-xs rounded-xl shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Invoice</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div
        ref={printRef}
        className="bg-white rounded-3xl border border-[#E5E4DE] shadow-xl p-8 sm:p-12 space-y-8 print:border-none print:shadow-none print:p-0"
      >
        {/* Header Invoice */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-[#E5E4DE]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#0F1012] text-white flex items-center justify-center font-black text-2xl tracking-tighter">
              TF
            </div>
            <div>
              <span className="font-black text-2xl tracking-tighter text-[#0F1012] block leading-none">
                TRIFTING OFFICIAL
              </span>
              <span className="text-[11px] tracking-[0.25em] font-bold text-[#3A4D28] block mt-0.5">
                CURATED STREETWEAR VAULT
              </span>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#71717A] block">
              NOMOR PESANAN RESMI:
            </span>
            <span className="text-xl font-mono font-black text-[#0F1012] block">
              {order.orderNumber}
            </span>
            <span className="text-xs text-[#71717A] block mt-0.5">
              {formatDate(order.createdAt)}
            </span>
          </div>
        </div>

        {/* Order Status Badge & Timeline */}
        <div className="bg-[#FAF9F5] border border-[#E5E4DE] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm uppercase text-[#0F1012]">
                  Status: {order.orderStatus.toUpperCase()}
                </span>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">
                  {order.paymentStatus === "paid" ? "LUNAS (PAID)" : "PENDING"}
                </span>
              </div>
              <p className="text-xs text-[#71717A] mt-0.5">
                Pesanan sedang disiapkan, disetrika uap, dan dipacking oleh tim Trifting Official.
              </p>
            </div>
          </div>

          {/* Tracking Resi Info */}
          <div className="p-3 bg-white border border-[#E5E4DE] rounded-xl text-xs w-full md:w-auto">
            <span className="text-[#71717A] block text-[11px]">Nomor Resi Pengiriman:</span>
            {order.trackingNumber ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono font-bold text-sm text-[#0F1012]">
                  {order.trackingNumber}
                </span>
                <button
                  onClick={copyResi}
                  className="p-1 text-[#71717A] hover:text-[#0F1012] transition"
                  title="Salin Resi"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <span className="text-amber-700 font-medium italic block mt-0.5">
                Resi akan diupdate setelah paket di-pick up kurir
              </span>
            )}
          </div>
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E5E4DE] space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#3A4D28]">
              Tujuan Pengiriman
            </h4>
            <p className="font-black text-sm text-[#0F1012]">{order.customerName}</p>
            <p className="text-[#52525B] leading-relaxed">
              {order.shippingAddress.streetAddress}, {order.shippingAddress.district},{" "}
              {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p className="text-[#0F1012] font-semibold mt-1">
              WhatsApp: {order.customerPhone}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E5E4DE] space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#3A4D28]">
              Metode Ekspedisi & Bayar
            </h4>
            <div className="space-y-1">
              <p className="text-[#71717A]">
                Kurir: <strong className="text-[#0F1012]">{order.shippingCourier}</strong>
              </p>
              <p className="text-[#71717A]">
                Metode Pembayaran: <strong className="text-[#0F1012]">{order.paymentMethod}</strong>
              </p>
              <p className="text-[#71717A]">
                Email Notifikasi: <strong className="text-[#0F1012]">{order.customerEmail}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#71717A]">
            Rincian Item Pakaian Thrift
          </h4>
          <div className="border border-[#E5E4DE] rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF9F5] border-b border-[#E5E4DE] text-[#71717A] uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Produk</th>
                  <th className="p-3.5">Ukuran</th>
                  <th className="p-3.5 text-right">Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F0EB]">
                {order.items?.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF9F5]/50">
                    <td className="p-3.5 flex items-center gap-3">
                      {item.productImage && (
                        <img
                          src={item.productImage}
                          alt={item.productTitle}
                          className="w-10 h-10 object-cover rounded-lg border border-[#E5E4DE]"
                        />
                      )}
                      <div>
                        <span className="font-bold text-[#0F1012] block">{item.productTitle}</span>
                        <span className="text-[10px] text-[#3A4D28] font-bold uppercase">1-OF-1 THRIFT</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-[#52525B] font-mono">{item.productSize}</td>
                    <td className="p-3.5 text-right font-black text-[#0F1012]">
                      {formatRupiah(item.productPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculation Total */}
        <div className="flex justify-end pt-4">
          <div className="w-full sm:w-72 space-y-2 text-xs text-[#71717A]">
            <div className="flex justify-between">
              <span>Subtotal Produk:</span>
              <span className="font-semibold text-[#0F1012]">{formatRupiah(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Diskon Kupon:</span>
                <span>-{formatRupiah(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Ongkos Kirim:</span>
              <span className="font-semibold text-[#0F1012]">{formatRupiah(order.shippingCost)}</span>
            </div>
            <div className="pt-2 border-t border-[#E5E4DE] flex justify-between text-sm font-black text-[#0F1012]">
              <span>Grand Total:</span>
              <span className="text-lg">{formatRupiah(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Bottom Guarantee */}
        <div className="pt-6 border-t border-[#E5E4DE] flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717A] gap-4">
          <p>Terima kasih telah berbelanja dan mendukung sustainable fashion di Trifting Official.</p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-[#3A4D28] font-bold hover:underline"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Butuh bantuan terkait pesanan? Hubungi CS</span>
          </a>
        </div>
      </div>
    </div>
  );
}
