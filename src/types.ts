export type UserRole = 'penyuluh' | 'admin' | 'kemenag_kabupaten';

export type KecamatanGowa =
  | 'Biringbulu'
  | 'Bungaya'
  | 'Bontolempangan'
  | 'Bajeng'
  | 'Bajeng Barat'
  | 'Bontonompo'
  | 'Bontonompo Selatan'
  | 'Barombong'
  | 'Bontomarannu'
  | 'Parangloe'
  | 'Pattallassang'
  | 'Parigi'
  | 'Pallangga'
  | 'Tompobulu'
  | 'Tinggimoncong'
  | 'Tombolopao'
  | 'Manuju'
  | 'Somba Opu';

export type JenjangJabatan = 
  | 'Penyuluh Agama Islam Ahli Pertama'
  | 'Penyuluh Agama Islam Ahli Muda'
  | 'Penyuluh Agama Islam Ahli Madya'
  | 'Penyuluh Agama Islam Ahli Utama';

export interface PenyuluhProfile {
  id: string;
  nama: string;
  nip: string;
  nipa: string;
  pangkatGol: string;
  tmt: string;
  jabatan: JenjangJabatan;
  kecamatan: KecamatanGowa;
  wilTugas: string;
  unitKerja: string;
  tempatTanggalLahir: string;
  pendidikanTerakhir: string;
  phone: string;
  fotoUrl?: string;
}

export interface KepalaKUAProfile {
  kecamatan: KecamatanGowa;
  nama: string;
  nip: string;
  pangkatGol: string;
  jabatan: string;
  kuaName: string;
  alamatKua: string;
  teleponKua: string;
  emailKua: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  nama: string;
  nip: string;
  nipa?: string;
  jabatan: string;
  pangkatGol: string;
  kecamatan: KecamatanGowa;
  phone: string;
  wilTugas?: string;
  unitKerja?: string;
  kuaName?: string;
  alamatKua?: string;
  teleponKua?: string;
  fotoUrl?: string;
  createdAt: string;
  updatedAt: string;
  source: 'firebase' | 'local';
}

export interface RegisterPenyuluhData {
  nama: string;
  nip: string;
  nipa?: string;
  jabatan: JenjangJabatan;
  pangkatGol: string;
  kecamatan: KecamatanGowa;
  wilTugas: string;
  phone: string;
  email: string;
  password: string;
}

export interface RegisterKepalaKUAData {
  nama: string;
  nip: string;
  pangkatGol: string;
  jabatan: string;
  kecamatan: KecamatanGowa;
  kuaName: string;
  alamatKua: string;
  teleponKua: string;
  email: string;
  password: string;
}

export type JenisLaporan =
  | 'bimbingan_penyuluhan' // LAPORAN PELAKSANAAN BIMBINGAN DAN PENYULUHAN AGAMA DAN PEMBANGUNAN
  | 'konseling_informasi' // LAPORAN LAYANAN KONSELING / INFORMASI PENYULUH AGAMA ISLAM PERORANGAN DAN KELOMPOK
  | 'pengembangan_model' // LAPORAN PELAKSANAAN PENGEMBANGAN PROGRAM/MODEL DAN METODE PENYULUHAN AGAMA DAN PEMBANGUNAN
  | 'forum_ilmiah'; // LAPORAN KEGIATAN KAJIAN BIMBINGAN ATAU PENYULUHAN DALAM FORUM ILMIAH

export type KategoriMateri =
  | 'Keluarga Sakinah'
  | 'Anti Korupsi'
  | 'Haji Dan Umrah'
  | 'Pengentasan Buta Huruf Baca Tulis Al Quran, Tahsin dan Tafsir'
  | 'Pengelolaan Zakat'
  | 'Pemberdayaan Wakaf'
  | 'Moderasi Beragama'
  | 'Kerukunan Umat Beragama'
  | 'Produk Halal'
  | 'Radikalisme Dan Aliran Sempalan'
  | 'Pemberdayaan Ekonomi Umat'
  | 'Penyuluhan Stunting'
  | 'Napza Dan HIV/AIDS'
  | 'Aqidah Akhlak'
  | 'Aqidah Islam'
  | 'Al-Qur’an dan Hadits'
  | 'Al-Qur’an Tajwid'
  | 'Fiqih Lainnya';

export type LaporanHarianLainnya =
  | 'Pengumpulan Data Bahan Dan Informasi BP'
  | 'Memetakan Isu Aktual Keagamaan Dan Pembangunan'
  | 'Pembentukan Kelompok Sasaran'
  | 'Pelayanan Informasi Terkait BP'
  | 'Publikasi BP'
  | 'Kajian Terkait Bimbingan dan Penyuluhan'
  | 'Pelayanan Konsultasi Keagamaan Dan Pembangunan'
  | 'Pendampingan Dan Mediasi Keagamaan Dan Pembangunan'
  | 'Pendampingan Konflik Sosial Berdimensi Keagamaan'
  | 'Kerja Sama Lintas Sektoral'
  | 'Pengembangan Model, Program Dan Metode Bimbingan dan Penyuluhan'
  | 'Menyusun Karya Tulis Ilmiyah, Modul, Pedoman Dan Makalah Terkait Bimbingan dan Penyuluhan';

export interface LocationCoordinate {
  latitude: number;
  longitude: number;
  accuracy: number;
  lokasiNama: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  timestamp: string;
}

export interface BuktiFoto {
  id: string;
  url: string;
  caption?: string;
  timestamp: string;
  fileSize?: string;
}

export type StatusVerifikasi = 'draf_offline' | 'menunggu_verifikasi' | 'terverifikasi' | 'butuh_revisi';
export type SyncStatus = 'tersinkron' | 'menunggu_sinkronisasi' | 'gagal_sinkronisasi';

export interface LaporanKegiatan {
  id: string;
  nomorSuratTugas?: string;
  penyuluhId: string;
  penyuluhNama: string;
  penyuluhNip: string;
  penyuluhJenjang?: JenjangJabatan;
  penyuluhPangkatGol?: string;
  kecamatan?: KecamatanGowa;
  jenisLaporan: JenisLaporan;
  kategoriMateri: KategoriMateri;
  
  // Kelompok Binaan / Sasaran
  kelompokSasaran: string;
  pimpinanKelompok?: string;
  kontakKelompok?: string;
  jumlahPeserta: number;
  
  // Rincian Materi
  judulMateri: string;
  deskripsiKegiatan: string; // generated synthesis
  deskripsiSingkatMateri?: string; // additional detail
  
  // Waktu & Tempat
  tanggalPelaksanaan: string; // YYYY-MM-DD
  hari: string; // SENIN, SELASA, etc.
  waktuMulai?: string;
  waktuSelesai?: string;
  lokasiSpesifik: string;
  
  // Geolocation
  koordinat: LocationCoordinate;
  
  // Bukti Dokumentasi
  fotoList: BuktiFoto[];
  
  // Konseling / Forum Spesifik (jika berlaku)
  namaKlienAtauPeran?: string;
  kontakKlien?: string;
  metodeLayanan?: string; // Tatap muka, diskusi, wawancara, zoom
  narasumberForum?: string;
  penyelenggaraForum?: string;
  
  // Keamanan & Enkripsi
  isEncrypted: boolean;
  encryptedDataHash?: string;
  encryptionAlgorithm?: string;
  
  // Alur Kerja
  statusVerifikasi: StatusVerifikasi;
  catatanVerifikasi?: string;
  diverifikasiOleh?: string;
  tanggalVerifikasi?: string;
  
  // Status Offline & Sync
  syncStatus: SyncStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NotifikasiAdmin {
  id: string;
  judul: string;
  pesan: string;
  laporanId: string;
  penyuluhNama: string;
  tipe: 'laporan_baru' | 'laporan_diverifikasi' | 'revisi_laporan' | 'sinkronisasi_selesai';
  timestamp: string;
  dibaca: boolean;
}

export interface KelompokBinaanTetap {
  id: string;
  no: number;
  hari: string;
  namaKelompok: string;
  pimpinan: string;
  kontak: string;
  alamat: string;
  waktu: string;
  keterangan: string; // e.g. 1x sepekan, 2x sebulan
}

export interface EncryptionConfig {
  algorithm: 'AES-GCM';
  keyLength: 256;
  enabled: boolean;
  autoEncryptSensitive: boolean;
}
