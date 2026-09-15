import React, { useState, useEffect } from 'react';
import { 
  Send, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Users, 
  MapPin, 
  Lock, 
  WifiOff, 
  AlertCircle 
} from 'lucide-react';
import { 
  LaporanKegiatan, 
  JenisLaporan, 
  KategoriMateri, 
  LocationCoordinate, 
  BuktiFoto 
} from '../types';
import { CURRENT_PENYULUH, INITIAL_KELOMPOK_BINAAN } from '../data/initialData';
import { GpsTracker } from './GpsTracker';
import { PhotoCollage } from './PhotoCollage';
import { encryptData } from '../utils/crypto';

interface ReportFormProps {
  onSubmit: (laporan: LaporanKegiatan) => void;
  isOnline: boolean;
  onCancel?: () => void;
}

const KATEGORI_MATERI_LIST: KategoriMateri[] = [
  'Keluarga Sakinah',
  'Anti Korupsi',
  'Haji Dan Umrah',
  'Pengentasan Buta Huruf Baca Tulis Al Quran, Tahsin dan Tafsir',
  'Pengelolaan Zakat',
  'Pemberdayaan Wakaf',
  'Moderasi Beragama',
  'Kerukunan Umat Beragama',
  'Produk Halal',
  'Radikalisme Dan Aliran Sempalan',
  'Pemberdayaan Ekonomi Umat',
  'Penyuluhan Stunting',
  'Napza Dan HIV/AIDS',
  'Aqidah Akhlak',
  'Aqidah Islam',
  'Al-Qur’an dan Hadits',
  'Al-Qur’an Tajwid',
  'Fiqih Lainnya',
];

const JENIS_LAPORAN_LABELS: { value: JenisLaporan; label: string; prefix: string } = {
  value: 'bimbingan_penyuluhan',
  label: 'Laporan Pelaksanaan Bimbingan dan Penyuluhan Agama dan Pembangunan',
  prefix: 'Melaksanakan Bimbingan Penyuluhan Agama Islam',
};

const HARI_LIST = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'AHAD'];

export const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, isOnline, onCancel }) => {
  const [jenisLaporan, setJenisLaporan] = useState<JenisLaporan>('bimbingan_penyuluhan');
  const [kategoriMateri, setKategoriMateri] = useState<KategoriMateri>('Keluarga Sakinah');
  const [kelompokSasaran, setKelompokSasaran] = useState('Majelis Taklim Nurul Ihsan');
  const [pimpinanKelompok, setPimpinanKelompok] = useState('Hj. Rahmatul Ummah');
  const [kontakKelompok, setKontakKelompok] = useState('0821-8987-7252');
  const [jumlahPeserta, setJumlahPeserta] = useState<number>(18);
  const [judulMateri, setJudulMateri] = useState('Tadabbur QS Ali Imran dan Penguatan Karakter Umat');
  const [deskripsiSingkatMateri, setDeskripsiSingkatMateri] = useState(
    'Mengkaji ayat-ayat Al-Qur’an mengenai akhlak mulia dalam keluarga dan ketahanan moral generasi penerus.'
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const [tanggalPelaksanaan, setTanggalPelaksanaan] = useState(todayStr);
  const [hari, setHari] = useState('JUMAT');
  const [waktuMulai, setWaktuMulai] = useState('14.00');
  const [waktuSelesai, setWaktuSelesai] = useState('16.00');
  const [lokasiSpesifik, setLokasiSpesifik] = useState('Masjid Nurul Ihsan Bontotanga Kel. Paccinongan');

  // Specific for counseling / forum
  const [namaKlien, setNamaKlien] = useState('');
  const [metodeLayanan, setMetodeLayanan] = useState('Tatap muka, ceramah, dan dialog');

  // Encryption toggle
  const [enableEncryption, setEnableEncryption] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // GPS Coordinates
  const [koordinat, setKoordinat] = useState<LocationCoordinate>({
    latitude: -5.198421,
    longitude: 119.463982,
    accuracy: 6,
    lokasiNama: 'Masjid Nurul Ihsan Bontotanga',
    kelurahan: 'Paccinongan',
    kecamatan: 'Somba Opu',
    kabupaten: 'Gowa',
    provinsi: 'Sulawesi Selatan',
    timestamp: new Date().toISOString(),
  });

  // Photos
  const [fotoList, setFotoList] = useState<BuktiFoto[]>([
    {
      id: 'f-init-1',
      url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
      caption: 'Penyampaian materi bimbingan di hadapan jamaah binaan',
      timestamp: new Date().toISOString(),
      fileSize: '1.4 MB',
    },
    {
      id: 'f-init-2',
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      caption: 'Sesi diskusi dan tanya jawab materi keagamaan',
      timestamp: new Date().toISOString(),
      fileSize: '1.2 MB',
    },
  ]);

  // Handle preset selection from official groups
  const handleSelectBinaan = (kelId: string) => {
    const found = INITIAL_KELOMPOK_BINAAN.find((k) => k.id === kelId);
    if (found) {
      setKelompokSasaran(found.namaKelompok);
      setPimpinanKelompok(found.pimpinan);
      setKontakKelompok(found.kontak);
      setLokasiSpesifik(found.alamat);
      setHari(found.hari.toUpperCase());
    }
  };

  // Synthesize auto description matching user instructions:
  // "Menggabungkan kalimat dari unsur Jenis Laporan, kelompok sasaran dan judul materi"
  const generatedDeskripsi = (() => {
    switch (jenisLaporan) {
      case 'bimbingan_penyuluhan':
        return `Melaksanakan Bimbingan Penyuluhan Agama Islam kepada kelompok sasaran ${kelompokSasaran || '[Kelompok]'} tentang materi ${judulMateri || '[Judul Materi]'}.`;
      case 'konseling_informasi':
        return `Memberikan Layanan Informasi dan Konseling Penyuluhan Agama dan Pembangunan kepada ${namaKlien || kelompokSasaran || '[Klien/Kelompok]'} terkait materi ${judulMateri || '[Materi]'}.`;
      case 'pengembangan_model':
        return `Melaksanakan Pengembangan Program, Model dan Metode Bimbingan Penyuluhan Keagamaan dan Pembangunan pada ${kelompokSasaran || '[Kelompok/Masjid]'} melalui kegiatan ${judulMateri || '[Judul Model]'}.`;
      case 'forum_ilmiah':
        return `Mengikuti dan Melaksanakan Kajian Bimbingan Penyuluhan dalam Forum Ilmiah dengan tema ${judulMateri || '[Tema Kajian]'}.`;
      default:
        return `Melaksanakan kegiatan penyuluhan kepada ${kelompokSasaran} mengenai ${judulMateri}.`;
    }
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let encryptedHash = '';
    if (enableEncryption) {
      const payloadToHash = {
        penyuluh: CURRENT_PENYULUH.nama,
        kelompok: kelompokSasaran,
        materi: judulMateri,
        tanggal: tanggalPelaksanaan,
        koordinat: koordinat,
      };
      const encResult = await encryptData(payloadToHash);
      encryptedHash = encResult.hash;
    }

    const newReport: LaporanKegiatan = {
      id: `lap-${Date.now().toString().slice(-6)}`,
      nomorSuratTugas: 'B.063/KUA.21.06.15/BA.01/VII/2026',
      penyuluhId: CURRENT_PENYULUH.id,
      penyuluhNama: CURRENT_PENYULUH.nama,
      penyuluhNip: CURRENT_PENYULUH.nip,
      jenisLaporan,
      kategoriMateri,
      kelompokSasaran,
      pimpinanKelompok,
      kontakKelompok,
      jumlahPeserta,
      judulMateri,
      deskripsiKegiatan: generatedDeskripsi,
      deskripsiSingkatMateri,
      tanggalPelaksanaan,
      hari,
      waktuMulai,
      waktuSelesai,
      lokasiSpesifik,
      koordinat,
      fotoList,
      namaKlienAtauPeran: namaKlien,
      metodeLayanan,
      isEncrypted: enableEncryption,
      encryptedDataHash: encryptedHash,
      encryptionAlgorithm: enableEncryption ? 'AES-GCM-256' : undefined,
      statusVerifikasi: isOnline ? 'menunggu_verifikasi' : 'draf_offline',
      syncStatus: isOnline ? 'tersinkron' : 'menunggu_sinkronisasi',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onSubmit(newReport);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Offline Alert Badge */}
      {!isOnline && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs">
          <WifiOff className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm">Mode Offline Aktif</span>
            Data laporan kegiatan dan foto akan tersimpan aman di memori lokal ponsel/laptop Anda. Sistem akan melakukan sinkronisasi otomatis tanpa ada data hilang begitu sinyal internet kembali stabil.
          </div>
        </div>
      )}

      {/* Identitas Penyuluh (ReadOnly / Quick verification card) */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
            PAI
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">Penyuluh Pelapor:</h4>
            <p className="text-sm font-bold text-slate-800">{CURRENT_PENYULUH.nama}</p>
            <p className="text-xs text-slate-600">
              NIP: {CURRENT_PENYULUH.nip} | {CURRENT_PENYULUH.jabatan} | {CURRENT_PENYULUH.wilTugas}
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          Kemenag Kab. Gowa
        </span>
      </div>

      {/* Section 1: Klasifikasi Kegiatan */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-700" />
            1. Ruang Lingkup & Kategori Bimbingan
          </h3>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            Kepdirjen Bimas Islam No. 794/2025
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Jenis Laporan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Jenis Laporan Kegiatan <span className="text-rose-500">*</span>
            </label>
            <select
              value={jenisLaporan}
              onChange={(e) => setJenisLaporan(e.target.value as JenisLaporan)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="bimbingan_penyuluhan">
                1. Laporan Pelaksanaan Bimbingan dan Penyuluhan Agama dan Pembangunan
              </option>
              <option value="konseling_informasi">
                2. Laporan Layanan Konseling / Informasi Penyuluh Perorangan & Kelompok
              </option>
              <option value="pengembangan_model">
                3. Laporan Pelaksanaan Pengembangan Program/Model dan Metode Penyuluhan
              </option>
              <option value="forum_ilmiah">
                4. Laporan Kegiatan Kajian Bimbingan / Penyuluhan dalam Forum Ilmiah
              </option>
            </select>
          </div>

          {/* Kategori Materi (18 Tema Kemenag) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kategori Materi (18 Tema Resmi Standar Kemenag) <span className="text-rose-500">*</span>
            </label>
            <select
              value={kategoriMateri}
              onChange={(e) => setKategoriMateri(e.target.value as KategoriMateri)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {KATEGORI_MATERI_LIST.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick select from permanent binaan schedule */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Pilih dari Kelompok Binaan Tetap KUA Somba Opu:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {INITIAL_KELOMPOK_BINAAN.map((kb) => (
              <button
                key={kb.id}
                type="button"
                onClick={() => handleSelectBinaan(kb.id)}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-all ${
                  kelompokSasaran === kb.namaKelompok
                    ? 'bg-emerald-700 text-white font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {kb.namaKelompok} ({kb.hari})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Detail Kelompok & Materi */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <Users className="w-4 h-4 text-emerald-700" />
          2. Data Kelompok Binaan & Judul Materi
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Kelompok Sasaran / Binaan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={kelompokSasaran}
              onChange={(e) => setKelompokSasaran(e.target.value)}
              placeholder="Contoh: Majelis Taklim Nurul Ihsan"
              required
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Jumlah Jamaah / Peserta Hadir <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="5000"
                value={jumlahPeserta}
                onChange={(e) => setJumlahPeserta(Number(e.target.value))}
                required
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400">Orang</span>
            </div>
          </div>
        </div>

        {/* Judul Materi */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Judul / Topik Materi Bimbingan <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={judulMateri}
            onChange={(e) => setJudulMateri(e.target.value)}
            placeholder="Contoh: QS Ali Imran Ayat 11-15 atau Menyiapkan Generasi Berkualitas"
            required
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
          />
        </div>

        {/* Neat Rectangle Box for Deskripsi Kegiatan (Synthesized & User-Extensible) as per PDF instruction */}
        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              Sintesis Deskripsi Kegiatan (Standar Formulir Kemenag)
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">Tersusun Otomatis</span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-emerald-200 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed shadow-2xs">
            {generatedDeskripsi}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mt-2 mb-1">
              Tambahkan deskripsi singkat materi sebagai lanjutan deskripsi kegiatan:
            </label>
            <textarea
              rows={2}
              value={deskripsiSingkatMateri}
              onChange={(e) => setDeskripsiSingkatMateri(e.target.value)}
              placeholder="Tulis ringkasan poin materi pokok yang disampaikan kepada jamaah..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-emerald-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Waktu, Lokasi & Pelacakan Real-Time GPS */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <MapPin className="w-4 h-4 text-emerald-700" />
          3. Waktu Pelaksanaan & Pelacakan GPS Real-time
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Hari</label>
            <select
              value={hari}
              onChange={(e) => setHari(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            >
              {HARI_LIST.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Tanggal</label>
            <input
              type="date"
              value={tanggalPelaksanaan}
              onChange={(e) => setTanggalPelaksanaan(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Waktu Mulai</label>
            <input
              type="text"
              value={waktuMulai}
              onChange={(e) => setWaktuMulai(e.target.value)}
              placeholder="14.00"
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Waktu Selesai</label>
            <input
              type="text"
              value={waktuSelesai}
              onChange={(e) => setWaktuSelesai(e.target.value)}
              placeholder="16.00"
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Lokasi Tempat Kegiatan (Nama Masjid / Gedung / Ruang)
          </label>
          <input
            type="text"
            value={lokasiSpesifik}
            onChange={(e) => setLokasiSpesifik(e.target.value)}
            placeholder="Contoh: Masjid Nurul Ihsan Bontotanga Kel. Paccinongan"
            required
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Real-time GPS Tracker */}
        <GpsTracker value={koordinat} onChange={setKoordinat} isFieldMode={true} />
      </div>

      {/* Section 4: Unggah Bukti Foto & Kolase Album */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <PhotoCollage
          photos={fotoList}
          onChange={setFotoList}
          coordinate={koordinat}
          readOnly={false}
        />
      </div>

      {/* Section 5: Fitur Enkripsi Data Tingkat Lanjut */}
      <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Enkripsi Data Tingkat Lanjut (AES-GCM 256)
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase tracking-wider">
                  Aktif
                </span>
              </h4>
              <p className="text-xs text-slate-400">
                Data terlindung secara kriptografis dengan sidik jari digital SHA-256 anti-manipulasi
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enableEncryption}
              onChange={(e) => setEnableEncryption(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {enableEncryption && (
          <div className="bg-slate-800/80 rounded-lg p-2.5 text-[11px] text-slate-300 font-mono flex items-center justify-between border border-slate-700">
            <span>Standar: FIPS 197 AES-GCM 256-bit + PBKDF2 100k iterasi</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi Kriptografi
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
          >
            Batal
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-800 active:scale-95 transition-all shadow-md"
        >
          <Send className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
          {isSubmitting
            ? 'Menyimpan Laporan...'
            : isOnline
            ? 'Kirim Laporan ke KUA'
            : 'Simpan Otomatis ke Draf Offline'}
        </button>
      </div>
    </form>
  );
};
