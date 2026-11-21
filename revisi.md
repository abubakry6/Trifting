# RENCANA IMPLEMENTASI REVISI (revisi.md)
# Topik: Sinkronisasi Data Transaksi Pesanan (Orders) ke Dashboard Admin & Supabase

================================================================================
1. AKAR MASALAH (ROOT CAUSE ANALYSIS)
================================================================================
Pengguna telah melakukan pembelian (checkout) di website/HP, namun transaksi belum muncul di Dashboard Admin (`/admin` dan `/admin/orders`).
Setelah dilakukan audit teknis mendalam terhadap kode dan koneksi Supabase, ditemukan 3 akar penyebab utama:

1. **Format ID Transaksi Bukan UUID:**
   Di `StoreContext.tsx`, order dibuat dengan `id: "ord-" + Date.now()`. Sedangkan di database Supabase Postgres (`supabase/schema.sql`), kolom `orders.id` bertipe `UUID`. Akibatnya Postgres menolak penyimpanan dengan error `invalid input syntax for type uuid`.
2. **Struktur Relasi Order vs Order Items:**
   Payload order yang dikirim ke `supabase.from("orders").insert([newOrder])` menyertakan array `items: [...]`. Kolom `items` tidak ada di tabel `orders` karena dipecah ke tabel relasional `public.orderitems`. Hal ini menyebabkan PostgREST menolak request.
3. **Kebijakan Row Level Security (RLS) Supabase:**
   RLS bawaan pada tabel `orders` membatasi pembacaan (`SELECT`) hanya untuk `auth.uid() = userId OR public.is_admin()`. Karena portal admin toko menggunakan sesi web lokal (kunci publik anon), Supabase mengembalikan data kosong (`0 orders`) saat dashboard dibuka.
4. **Data Tertahan di Penyimpanan Lokal (LocalStorage) HP:**
   Karena pengiriman ke Supabase sempat gagal secara diam-diam, data order hanya tersimpan di memori browser HP pembeli dan tidak tersinkronisasi ke komputer admin.

================================================================================
2. FILE YANG AKAN DIUBAH (AFFECTED FILES)
================================================================================
- `src/lib/utils.ts` :
  Menambahkan fungsi pembantu generator UUID v4 standar (`generateUUID()`) dan validator UUID (`isValidUUID()`).
- `src/context/StoreContext.tsx` :
  1. Memperbaiki fungsi `addOrder`:
     - Membuat `id` order berstandar UUID v4.
     - Memisahkan data induk `orders` dan data rincian `orderitems`.
     - Memastikan `userId` diset ke `null` jika bukan UUID resmi (mendukung guest checkout).
     - Menyimpan relasi produk ke tabel `orderitems`.
  2. Memperbaiki fungsi `loadData`:
     - Memetakan relasi `orderitems` kembali ke properti `items` pada setiap pesanan.
     - Mencegah data lokal ter-overwrite jika data remote kosong sementara.
  3. Memperbaiki fungsi `addProduct` agar ID menggunakan UUID v4.
- `supabase/schema.sql` :
  Memperbarui kebijakan RLS `orders` dan `orderitems` agar dapat dibaca dan ditulis oleh publik & dashboard admin secara real-time.

================================================================================
3. LANGKAH-LANGKAH TEKNIS IMPLEMENTASI
================================================================================
- [x] **Langkah 1:** Tambahkan fungsi `generateUUID` dan `isValidUUID` di `src/lib/utils.ts`.
- [x] **Langkah 2:** Perbaiki logika sinkronisasi `addOrder`, `loadData`, dan `addProduct` di `src/context/StoreContext.tsx`.
- [x] **Langkah 3:** Perbarui definisi RLS policies di `supabase/schema.sql`.
- [x] **Langkah 4:** Jalankan `npx tsc --noEmit` untuk verifikasi TypeScript.
- [x] **Langkah 5:** Commit dan push ke GitHub agar Vercel otomatis mengupdate production.
- [x] **Langkah 6:** Berikan instruksi 1x klik SQL sederhana untuk dijalankan pengguna di Supabase SQL Editor agar RLS langsung aktif.

================================================================================
4. ESTIMASI DAMPAK & RISIKO
================================================================================
- Semua transaksi checkout dari HP/Desktop langsung tersimpan rapi di Supabase Postgres.
- Dashboard admin di komputer/laptop langsung mendeteksi pesanan baru, omset pendapatan, dan jumlah transaksi secara real-time.
- Nol risiko terhadap UI checkout atau data katalog yang sudah ada.
