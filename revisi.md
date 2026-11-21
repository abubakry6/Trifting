# RENCANA IMPLEMENTASI REVISI (revisi.md)
# Topik: Penguncian Keamanan Kredensial & Kata Sandi Khusus Super Admin

================================================================================
1. AKAR MASALAH (ROOT CAUSE ANALYSIS)
================================================================================
Saat ini di halaman `/admin/login`:
1. **Validasi Terlalu Longgar:** Sistem hanya mengecek apakah email mengandung kata "admin" dan panjang kata sandi minimal 6 karakter (`password.length >= 6`).
2. **Tidak Ada Pengecekan Kata Sandi Riil:** Siapapun yang memasukkan email apa saja yang ada kata "admin" (misal: `siapapunadmin@gmail.com`) dengan kata sandi sembarang (misal: `123456`) bisa langsung masuk dan mengelola dashboard admin.
3. **Kata Sandi Belum Ditetapkan:** Belum ada kredensial pasti (*fixed master credentials*) atau verifikasi server-side untuk memastikan hanya pemilik toko sah yang memiliki kunci masuk.

================================================================================
2. FILE YANG AKAN DIBUAT & DIUBAH (AFFECTED FILES)
================================================================================
1. `src/app/api/admin/login/route.ts` (FILE BARU):
   Endpoint API Server-Side untuk memverifikasi email dan kata sandi admin secara aman di server (mencegah kata sandi bocor di kode browser client-side).
2. `.env.local` & `.env.example`:
   Menambahkan variabel konfigurasi kredensial admin resmi:
   - `ADMIN_EMAIL` (Default: `admin@trifting.com` / email pemilik)
   - `ADMIN_PASSWORD` (Default: `TriftingMaster#2024` atau kata sandi kustom pilihan pemilik toko)
3. `src/app/admin/login/page.tsx`:
   Mengubah form login agar memverifikasi ke `/api/admin/login`. Jika email atau kata sandi tidak cocok 100%, akses ditolak secara mutlak dengan pesan peringatan keamanan.
4. `src/context/AuthContext.tsx`:
   Memperbarui fungsi login admin agar hanya menyimpan sesi admin jika telah tervalidasi secara resmi.

================================================================================
3. LANGKAH-LANGKAH TEKNIS IMPLEMENTASI
================================================================================
- [x] **Langkah 1:** Tambahkan variabel kredensial admin resmi di `.env.local` dan `.env.example`.
- [x] **Langkah 2:** Buat API Route server-side `src/app/api/admin/login/route.ts` dengan enkripsi & validasi pencocokan kata sandi.
- [x] **Langkah 3:** Modifikasi `src/app/admin/login/page.tsx` untuk memanggil API route dan menolak kredensial sembarangan.
- [x] **Langkah 4:** Jalankan `npx tsc --noEmit` untuk memastikan integritas tipe data bebas error.
- [x] **Langkah 5:** Commit dan push ke GitHub agar Vercel otomatis memperbarui sistem keamanan.

================================================================================
4. ESTIMASI DAMPAK & RISIKO
================================================================================
- **Keamanan Total (Zero Vulnerability):** Orang lain tidak akan bisa lagi menebak atau masuk sembarangan ke portal admin.
- Pemilik toko memiliki kendali penuh untuk mengganti email dan kata sandi admin kapan saja melalui Vercel / file `.env.local`.
- Tidak ada dampak negatif terhadap pembeli biasa di katalog atau proses checkout.
