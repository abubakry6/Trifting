"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  Lock,
  Tag 
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { formatRupiah, generateOrderNumber } from "@/lib/utils";
import { Order, OrderItem } from "@/types/database";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, appliedPromo, clearCart } = useCart();
  const { addOrder } = useStore();
  const { user } = useAuth();

  const [recipientName, setRecipientName] = useState(user?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [email, setEmail] = useState(user?.email || "");
  const [province, setProvince] = useState("DKI Jakarta");
  const [city, setCity] = useState("Jakarta Selatan");
  const [district, setDistrict] = useState("Tebet");
  const [postalCode, setPostalCode] = useState("12810");
  const [streetAddress, setStreetAddress] = useState("");
  const [notes, setNotes] = useState("");

  const couriers = [
    { id: "jne-reg", name: "JNE Regular (2-3 Hari)", cost: 18000 },
    { id: "sicepat-best", name: "SiCepat BEST (1-2 Hari)", cost: 24000 },
    { id: "jnt-express", name: "J&T Express (2-3 Hari)", cost: 20000 },
    { id: "gosend-sameday", name: "GoSend / GrabExpress Sameday", cost: 35000 },
  ];

  const [selectedCourier, setSelectedCourier] = useState(couriers[0]);
  const [paymentMethod, setPaymentMethod] = useState("Midtrans QRIS (Instan)");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMidtransModalOpen, setIsMidtransModalOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);

  if (items.length === 0 && !pendingOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-[#0F1012]">Keranjang Anda Kosong</h2>
        <p className="text-xs text-[#71717A] mt-2">Tidak ada item yang dapat di-checkout saat ini.</p>
        <Link
          href="/catalog"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#0F1012] text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Mulai Belanja di Katalog
        </Link>
      </div>
    );
  }

  const shippingCost = selectedCourier.cost;
  const grandTotal = Math.max(0, subtotal - discountAmount) + shippingCost;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !phoneNumber || !streetAddress) {
      alert("Mohon lengkapi nama penerima, nomor WhatsApp, dan alamat pengiriman.");
      return;
    }

    setIsProcessing(true);

    const orderNumber = generateOrderNumber();

    const orderItems: OrderItem[] = items.map((item) => ({
      id: "item-" + Math.random().toString(36).substring(7),
      orderId: "",
      productId: item.product.id,
      productTitle: item.product.title,
      productPrice: item.product.price,
      productSize: item.product.size,
      productImage: item.product.images[0] || "",
    }));

    const newOrderData: Omit<Order, "id" | "createdAt"> = {
      orderNumber,
      userId: user?.id || null,
      customerName: recipientName,
      customerEmail: email || "customer@trifting.com",
      customerPhone: phoneNumber,
      shippingAddress: {
        recipientName,
        phoneNumber,
        province,
        city,
        district,
        postalCode,
        streetAddress,
        notes,
      },
      shippingCourier: selectedCourier.name,
      shippingCost,
      subtotal,
      discountAmount,
      totalAmount: grandTotal,
      paymentStatus: "paid", // Simulasi otomatis lunas saat snap bayar
      orderStatus: "processing",
      paymentMethod,
      items: orderItems,
      notes,
    };

    // Open simulated Midtrans Snap Modal
    const createdOrder = await addOrder(newOrderData);
    setPendingOrder(createdOrder);
    setIsProcessing(false);
    setIsMidtransModalOpen(true);
  };

  const handleFinishPayment = () => {
    clearCart();
    setIsMidtransModalOpen(false);
    if (pendingOrder) {
      router.push(`/orders/${pendingOrder.id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E5E4DE]">
        <Link href="/catalog" className="flex items-center gap-2 text-xs font-bold text-[#71717A] hover:text-[#0F1012]">
          <ArrowLeft className="w-4 h-4" />
          <span>Lanjut Pilih Produk</span>
        </Link>
        <span className="flex items-center gap-1.5 text-xs text-[#3A4D28] font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit Encrypted Checkout</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8">
        
        {/* Left Column: Forms */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Data Penerima */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider text-[#0F1012] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3A4D28]" />
              1. Identitas Pembeli & Penerima
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#3F3F46] mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dimas Ardiansyah"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-lg p-2.5 text-[#0F1012] focus:border-[#3A4D28]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3F3F46] mb-1">Nomor WhatsApp Aktif *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 081234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-lg p-2.5 text-[#0F1012] focus:border-[#3A4D28]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#3F3F46] mb-1">Alamat Email (Untuk Bukti Nota) *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. dimas@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-lg p-2.5 text-[#0F1012] focus:border-[#3A4D28]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Alamat Pengiriman */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider text-[#0F1012] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#3A4D28]" />
              2. Alamat Lengkap Tujuan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#3F3F46] mb-1">Provinsi *</label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-lg p-2.5 text-[#0F1012]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3F3F46] mb-1">Kota / Kabupaten *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-lg p-2.5 text-[#0F1012]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3F3F46] mb-1">Kecamatan *</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-lg p-2.5 text-[#0F1012]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3F3F46] mb-1">Kode Pos *</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-lg p-2.5 text-[#0F1012]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#3F3F46] mb-1">Alamat Jalan, RT/RW, No. Rumah *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Jl. Tebet Barat Dalam Raya No. 42B, RT 05 / RW 03"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-lg p-2.5 text-[#0F1012] focus:border-[#3A4D28]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pilihan Kurir Ekspedisi */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider text-[#0F1012] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#3A4D28]" />
              3. Pilih Ekspedisi Pengiriman
            </h3>

            <div className="space-y-2 text-xs">
              {couriers.map((c) => (
                <label
                  key={c.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                    selectedCourier.id === c.id
                      ? "bg-[#FAF9F5] border-[#0F1012] shadow-sm font-bold"
                      : "bg-white border-[#E5E4DE] hover:border-[#A1A1AA]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="courier"
                      checked={selectedCourier.id === c.id}
                      onChange={() => setSelectedCourier(c)}
                      className="accent-[#3A4D28]"
                    />
                    <span className="text-[#0F1012]">{c.name}</span>
                  </div>
                  <span className="text-[#3A4D28] font-bold">{formatRupiah(c.cost)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 4: Metode Pembayaran */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider text-[#0F1012] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#3A4D28]" />
              4. Metode Pembayaran
            </h3>

            <div className="space-y-2.5 text-xs">
              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                  paymentMethod.includes("QRIS")
                    ? "bg-[#FAF9F5] border-[#0F1012] font-bold"
                    : "bg-white border-[#E5E4DE]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod.includes("QRIS")}
                    onChange={() => setPaymentMethod("Midtrans QRIS (Instan)")}
                    className="accent-[#3A4D28]"
                  />
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#3A4D28]" />
                    <span>Midtrans QRIS (Scan BCA, GoPay, OVO, ShopeePay)</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  OTOMATIS
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                  paymentMethod.includes("BCA Virtual")
                    ? "bg-[#FAF9F5] border-[#0F1012] font-bold"
                    : "bg-white border-[#E5E4DE]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod.includes("BCA Virtual")}
                    onChange={() => setPaymentMethod("BCA Virtual Account")}
                    className="accent-[#3A4D28]"
                  />
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#3A4D28]" />
                    <span>BCA Virtual Account (Verifikasi Otomatis)</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  24 JAM
                </span>
              </label>
            </div>
          </div>

          {/* Submit Checkout Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 bg-[#0F1012] hover:bg-[#27272A] text-white font-black text-sm tracking-wider uppercase rounded-xl shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Memproses Pesanan...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-[#4D6635]" />
                <span>Bayar Sekarang • {formatRupiah(grandTotal)}</span>
              </>
            )}
          </button>
        </form>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-4 sticky top-28">
            <h3 className="font-black text-sm text-[#0F1012] uppercase tracking-wider pb-3 border-b border-[#F1F0EB]">
              Ringkasan Pesanan ({items.length} Item Thrift)
            </h3>

            {/* Item list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map(({ product }) => (
                <div key={product.id} className="flex gap-3 text-xs">
                  <img
                    src={product.images[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200"}
                    alt={product.title}
                    className="w-14 h-14 object-cover rounded-lg border border-[#E5E4DE] bg-[#FAF9F5] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-[#0F1012] truncate">{product.title}</h5>
                    <p className="text-[11px] text-[#71717A]">{product.size}</p>
                    <p className="font-black text-[#0F1012] mt-1">{formatRupiah(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculation */}
            <div className="pt-4 border-t border-[#F1F0EB] space-y-2 text-xs text-[#71717A]">
              <div className="flex justify-between">
                <span>Subtotal Item</span>
                <span className="font-semibold text-[#0F1012]">{formatRupiah(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Diskon Kupon ({appliedPromo?.code})</span>
                  <span>-{formatRupiah(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Ongkos Kirim ({selectedCourier.name.split("(")[0].trim()})</span>
                <span className="font-semibold text-[#0F1012]">{formatRupiah(shippingCost)}</span>
              </div>
              <div className="pt-3 border-t border-[#E5E4DE] flex justify-between text-base font-black text-[#0F1012]">
                <span>Total Pembayaran</span>
                <span className="text-xl">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* Thrift Item Lock Notice */}
            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E4DE] text-[11px] text-[#71717A] leading-relaxed">
              <span className="font-bold text-[#0F1012] block mb-0.5">🔒 Perlindungan Rebutan Stok:</span>
              Item akan dikunci otomatis begitu Anda menekan tombol bayar agar tidak diserobot penikmat thrift lain.
            </div>
          </div>
        </div>

      </div>

      {/* Midtrans Snap Modal Simulator */}
      {isMidtransModalOpen && pendingOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-[#E5E4DE] text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#3A4D28] bg-[#FAF9F5] px-3 py-1 rounded-full border border-[#E5E4DE]">
                MIDTRANS SNAP GATEWAY
              </span>
              <h3 className="text-xl font-black text-[#0F1012] mt-3">
                Pembayaran Berhasil Diverifikasi!
              </h3>
              <p className="text-xs text-[#71717A] mt-1">
                Nomor Pesanan: <strong className="text-[#0F1012] font-mono">{pendingOrder.orderNumber}</strong>
              </p>
            </div>

            <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E5E4DE] text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#71717A]">Metode Bayar:</span>
                <span className="font-bold text-[#0F1012]">{pendingOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717A]">Total Dibayar:</span>
                <span className="font-black text-[#0F1012]">{formatRupiah(pendingOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717A]">Status Item:</span>
                <span className="font-bold text-red-600">SOLD OUT (Terkunci)</span>
              </div>
            </div>

            <button
              onClick={handleFinishPayment}
              className="w-full py-3.5 bg-[#0F1012] hover:bg-[#27272A] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
            >
              Lihat Nota & Resi Pesanan
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
