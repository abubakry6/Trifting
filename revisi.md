# RENCANA IMPLEMENTASI REVISI (revisi.md)
# Topik: Sinkronisasi Produk Admin ke Tampilan Pelanggan (Homepage & Katalog) via Supabase RLS

================================================================================
1. AKAR MASALAH (ROOT CAUSE ANALYSIS)
================================================================================
Pengguna telah berhasil menambahkan produk di dashboard admin (`/admin/products`), namun produk tersebut belum muncul di tampilan pelanggan (beranda toko `/` dan katalog `/catalog`).

Penyebab Teknis:
1. **Kebijakan Row Level Security (RLS) pada Tabel `products`:**
   Di Supabase, aturan tabel `products` saat ini adalah:
   `CREATE POLICY "Products manageable by admin" ON public.products FOR ALL USING (public.is_admin());`
   Fungsi `public.is_admin()` mengecek `auth.uid() = admin`. Karena koneksi website menggunakan kunci publik (`anon key`), `auth.uid()` bernilai kosong (null). Akibatnya, Supabase menolak penyimpanan produk ke database Supabase.
2. **Produk Hanya Masuk ke Memori Tab Admin:**
   Karena penyimpanan ke Supabase sempat tertolak oleh RLS, produk baru tersebut hanya tersimpan di memori browser admin lokal (sehingga terlihat di tabel admin), tetapi **tidak tersimpan di cloud Supabase**.
3. **Akibat di Sisi Pelanggan (HP / Tab Lain):**
   Ketika halaman pelanggan dibuka di HP atau tab lain, website mengambil data dari Supabase. Karena Supabase belum menerima produk baru tersebut, halaman pelanggan belum menampilkan produk yang baru ditambahkan.

================================================================================
2. FILE YANG AKAN DIUBAH (AFFECTED FILES)
================================================================================
- `supabase/schema.sql` :
  Memperbarui kebijakan RLS `products` dan `categories` agar mengizinkan penambahan (*INSERT*), pengeditan (*UPDATE*), dan penghapusan (*DELETE*) produk dari portal admin toko.
- `src/context/StoreContext.tsx` :
  Menyempurnakan sinkronisasi data produk agar setelah `addProduct` berhasil, data produk langsung di-refresh ke seluruh komponen toko.

================================================================================
3. LANGKAH-LANGKAH TEKNIS IMPLEMENTASI
================================================================================
- [ ] **Langkah 1:** Perbarui RLS policy di `supabase/schema.sql` untuk `products` dan `categories`.
- [ ] **Langkah 2:** Berikan instruksi 1x klik SQL sederhana untuk dijalankan pengguna di Supabase SQL Editor agar izin simpan produk langsung aktif di Supabase.
- [ ] **Langkah 3:** Sinkronkan pembaruan ke GitHub & Vercel.

================================================================================
4. ESTIMASI DAMPAK & RISIKO
================================================================================
- Setiap produk baru yang ditambahkan dari admin akan langsung tersimpan di cloud Supabase.
- Beranda pelanggan (`/`) dan Katalog (`/catalog`) di HP maupun laptop pembeli akan langsung menampilkan produk baru tersebut secara real-time.
