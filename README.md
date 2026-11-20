# 👕 Trifting Official — Modern Streetwear Thrift E-Commerce

Website e-commerce modern toko pakaian thrift & vintage streetwear kurasi, stylish, premium, minimalis, dan mobile-first.

---

## ⚡ Teknologi yang Digunakan

- **Frontend & Framework:** Next.js 14 (App Router, TypeScript, Server & Client Components)
- **Styling & UI:** Tailwind CSS, Lucide React (Ikon SVG Murni Anti-Emoticon Norak), Clean Human-Crafted Aesthetic
- **Database & Auth:** Supabase (PostgreSQL, Supabase Auth, Row Level Security / RLS, Storage Bucket `product-images`)
- **Payment Gateway:** Midtrans Snap (QRIS, VA Bank, GoPay, ShopeePay) + WhatsApp Direct CS
- **Deployment:** Vercel Ready

---

## 🚀 Fitur Unggulan

### 🛍️ Pengalaman Belanja Pelanggan (Customer)
1. **Beranda Estetik:** Hero banner terinspirasi gaya streetwear modern, hitung mundur *Drop Day*, kategori unggulan, katalog produk terbaru & kurasi grail, dan *trust badges*.
2. **Katalog & Filter Multi-Kriteria:** Pencarian instan teks, filter kategori, ukuran pakaian, grading kondisi thrift (*Grade A+, Grade A, Grade B+*), dan batas harga maksimum.
3. **Detail Produk Thrift Riil:** Galeri foto multi-angle, pengukuran centimeter riil (Panjang x Lebar) untuk mencegah salah ukuran, catatan minus fisik transparan, dan tombol *Tanya CS WhatsApp* otomatis.
4. **Stok Eksklusif (One-of-a-Kind):** Begitu dibayar, status barang otomatis beralih menjadi `SOLD OUT` dan terkunci agar tidak terjadi rebutan ganda (*anti-double booking*).
5. **Checkout & Ekspedisi:** Form alamat lengkap Indonesia (Provinsi, Kota, Kecamatan, Kode Pos), pilihan kurir resmi (JNE, SiCepat, J&T) dengan kalkulasi tarif ongkir otomatis.
6. **Pelacakan & Invoice:** Halaman nota resmi dengan nomor pesanan unik `TRF-YYYYMMDD-XXX`, status order, nomor resi pengiriman, dan tombol *Cetak Invoice*.

### 🛡️ Dashboard Khusus Super Admin
1. **Statistik Penjualan:** Metrik ringkas (Total Omset Penjualan, Total Pesanan Masuk, Rasio Stok Terjual vs Tersedia).
2. **Manajemen Produk (CRUD):** Tambah produk baru dengan upload foto, set ukuran PxL, grade kondisi, harga coret, serta toggle status stok (*Available / Sold Out*).
3. **Manajemen Logistik & Resi:** Update status pesanan (*Processing, Shipped, Delivered*), input nomor resi kurir, dan fitur cetak **Label Pengiriman Thermal**.
4. **Kupon Diskon (Voucher):** Buat kode voucher (persentase / potongan tetap) dengan limit penggunaan dan minimal belanja.
5. **Laporan Penjualan:** Rekapitulasi penjualan dengan filter rentang waktu dan fitur **Ekspor CSV** sekali klik.

---

## 🛠️ Panduan Menjalankan di Komputer Lokal

### 1. Masuk ke Folder Projek & Pastikan Dependensi Terpasang
```bash
npm install
```

### 2. Konfigurasi Database Supabase (Opsional tapi Direkomendasikan)
1. Buka [Supabase](https://supabase.com) dan buat projek baru.
2. Masuk ke menu **SQL Editor**, buka file `supabase/schema.sql` di projek ini, salin seluruh kodenya lalu klik **Run**.
3. Buka menu **Project Settings > API**, salin:
   - `Project URL`
   - `Project API Keys (anon public)`
   - `service_role secret` (hanya untuk backend)
4. Buat file `.env.local` di root direktori projek dan isi dengan nilai di atas (lihat contoh di `.env.example`).
5. Pada menu **Storage** di Supabase, buat bucket bernama `product-images` dan set sebagai **Public Bucket**.

*Catatan Cerdas:* Website ini dilengkapi mode fallback lokal (in-memory + browser localStorage). Sehingga jika belum mengisi kredensial Supabase, Anda tetap dapat mencoba seluruh alur belanja, checkout, hingga dashboard admin secara mulus!

### 3. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses alamat `http://localhost:3000`.

---

## 🌐 Panduan Deployment ke Vercel

1. Buat repositori baru di GitHub / GitLab, lalu push kode projek ini.
2. Buka dashboard [Vercel](https://vercel.com) dan pilih **Add New Project**.
3. Import repositori `trifting` Anda.
4. Pada bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`
   - `MIDTRANS_SERVER_KEY`
5. Klik tombol **Deploy**. Vercel akan secara otomatis membangun aplikasi Next.js Anda dan menyediakan domain publik HTTPS siap pakai.

---

## 🔑 Akun Demo Siap Pakai

Untuk menguji fitur tanpa registrasi manual, gunakan tombol **Login Cepat**:
- **Customer:** `dimas.customer@gmail.com`
- **Super Admin:** `admin@trifting.com` (akses langsung ke `/admin`)

---
(c) Trifting Official by Zettbos. All Rights Reserved.
