# Panduan Deployment SIPAKAINGA (Firebase, GitHub & Vercel)

Aplikasi **SIPAKAINGA v2.6** (Sistem Pelaporan Kegiatan Penyuluhan Keagamaan dan Pembangunan - Kemenag RI & IPARI) telah sepenuhnya terintegrasi dengan **Firebase Firestore** dan siap di-deploy secara online ke **Vercel** (`vercel.app`) melalui **GitHub**.

---

## 1. Status Konfigurasi Firebase Firestore

Database Cloud Firestore telah berhasil dibuat dan diamankan dengan Security Rules:
- **Firebase Project ID**: `gen-lang-client-0798396105`
- **Firestore Database ID**: `ai-studio-sipakainga-bcab648b-634a-4ab1-9f53-744d154bbf31`
- **Collections**: `laporan_kegiatan`, `notifikasi`, `kelompok_binaan`
- **Security Rules**: Aktif (`firestore.rules`)
- **Fitur Sinkronisasi**: Mendukung pencatatan mode offline di lapangan dengan sinkronisasi otomatis ke cloud saat jaringan online pulih.

---

## 2. Langkah Menghubungkan Proyek ke GitHub

### Opsi A: Menggunakan Git Command Line
Jalankan perintah berikut di terminal komputer Anda:
```bash
# Inisialisasi Git
git init

# Tambahkan seluruh berkas proyek
git add .

# Buat commit awal
git commit -m "feat: inisialisasi SIPAKAINGA v2.6 dengan Firebase Firestore & Vercel"

# Atur branch utama ke main
git branch -M main

# Tautkan ke repository GitHub Anda (buat repo kosong terlebih dahulu di https://github.com/new)
git remote add origin https://github.com/NAMA_USER_GITHUB/sipakainga-kemenag.git

# Unggah kode ke GitHub
git push -u origin main
```

### Opsi B: Export Langsung dari Google AI Studio
1. Klik menu **Export / Settings** di panel Google AI Studio Build.
2. Pilih opsi **Export to GitHub** atau **Download ZIP**.
3. Jika memilih ZIP, ekstrak file di komputer Anda lalu buka terminal untuk menjalankan perintah Git di atas.

---

## 3. Langkah Deployment Online ke Vercel (`.vercel.app`)

1. **Buka Dashboard Vercel**: Masuk ke [https://vercel.com](https://vercel.com) dan login (disarankan menggunakan akun GitHub Anda).
2. **Import Project**:
   - Klik tombol **"Add New..."** lalu pilih **"Project"**.
   - Cari dan pilih repositori GitHub `sipakainga-kemenag` yang telah diunggah.
3. **Konfigurasi Build**:
   - Framework Preset: **Vite** (otomatis terdeteksi).
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   Tambahkan variabel lingkungan berikut di bagian **Environment Variables** di Vercel:

   | Kunci / Key | Nilai / Value |
   |---|---|
   | `VITE_FIREBASE_API_KEY` | `AIzaSyAaTnUuYZeBeHHmfcaDklBDUGA6ZpIaMiI` |
   | `VITE_FIREBASE_AUTH_DOMAIN` | `gen-lang-client-0798396105.firebaseapp.com` |
   | `VITE_FIREBASE_PROJECT_ID` | `gen-lang-client-0798396105` |
   | `VITE_FIREBASE_STORAGE_BUCKET` | `gen-lang-client-0798396105.firebasestorage.app` |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `527457918866` |
   | `VITE_FIREBASE_APP_ID` | `1:527457918866:web:1f76a04da53899b2a1eb4b` |
   | `VITE_FIREBASE_DATABASE_ID` | `ai-studio-sipakainga-bcab648b-634a-4ab1-9f53-744d154bbf31` |

5. **Klik "Deploy"**:
   Vercel akan mengompilasi aplikasi dalam hitungan detik. Setelah selesai, aplikasi Anda langsung aktif dan dapat diakses publik di URL seperti:
   `https://sipakainga.vercel.app` (atau nama custom domain yang Anda tentukan).

---

## 4. Keunggulan Konfigurasi Vercel & Firebase yang Disiapkan
- **Berkas `vercel.json` bawaan**: Memastikan rute SPA (Single Page Application) tidak mengalami 404 saat pengguna melakukan refresh atau membuka tautan dokumen secara langsung.
- **Cache Header Optimal**: Aset statis seperti CSS dan JS di-cache secara otomatis untuk kecepatan akses maksimal oleh para penyuluh di lapangan.
- **Offline-First Resilient**: Jika sinyal hilang di pelosok desa/kelurahan di Somba Opu Gowa, data tetap aman tersimpan di memori perangkat dan otomatis disinkronkan saat terhubung kembali.
