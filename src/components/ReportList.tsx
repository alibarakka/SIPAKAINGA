import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Lock, 
  WifiOff, 
  FileText, 
  ChevronRight, 
  ShieldCheck, 
  Eye, 
  ThumbsUp, 
  FileSpreadsheet, 
  Share2,
  Building2,
  Award
} from 'lucide-react';
import { LaporanKegiatan, StatusVerifikasi, KategoriMateri, UserRole, KecamatanGowa } from '../types';
import { KECAMATAN_GOWA_LIST, JENJANG_JABATAN_LIST } from '../data/gowaData';

interface ReportListProps {
  laporanList: LaporanKegiatan[];
  onSelectLaporan: (laporan: LaporanKegiatan) => void;
  onVerifyLaporan?: (laporanId: string, status: StatusVerifikasi, catatan?: string) => void;
  onOpenDocumentViewer: (laporanId: string) => void;
  onOpenEncryptionModal: (laporan: LaporanKegiatan) => void;
  currentRole: UserRole;
  filterKecamatanDefault?: string;
}

export const ReportList: React.FC<ReportListProps> = ({
  laporanList,
  onSelectLaporan,
  onVerifyLaporan,
  onOpenDocumentViewer,
  onOpenEncryptionModal,
  currentRole,
  filterKecamatanDefault = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedKategori, setSelectedKategori] = useState<string>('all');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>(filterKecamatanDefault);
  const [selectedJenjang, setSelectedJenjang] = useState<string>('all');

  const filteredReports = laporanList.filter((lap) => {
    const matchesSearch =
      lap.judulMateri.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lap.kelompokSasaran.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lap.lokasiSpesifik.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lap.penyuluhNama || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lap.kecamatan || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lap.koordinat?.kelurahan || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || lap.statusVerifikasi === selectedStatus;

    const matchesKategori =
      selectedKategori === 'all' || lap.kategoriMateri === selectedKategori;

    const matchesKecamatan =
      selectedKecamatan === 'all' || (lap.kecamatan || 'Somba Opu') === selectedKecamatan;

    const matchesJenjang =
      selectedJenjang === 'all' || lap.penyuluhJenjang === selectedJenjang;

    return matchesSearch && matchesStatus && matchesKategori && matchesKecamatan && matchesJenjang;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative grow w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama penyuluh, materi, binaan, kecamatan, atau kelurahan..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full md:w-auto">
            {/* Kecamatan Filter (18 Kecamatan Gowa) */}
            <select
              value={selectedKecamatan}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
              title="Filter Kecamatan di Kabupaten Gowa"
            >
              <option value="all">Semua Kecamatan (18)</option>
              {KECAMATAN_GOWA_LIST.map((kec) => (
                <option key={kec} value={kec}>
                  Kec. {kec}
                </option>
              ))}
            </select>

            {/* Jenjang Filter */}
            <select
              value={selectedJenjang}
              onChange={(e) => setSelectedJenjang(e.target.value)}
              className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
              title="Filter Jenjang Jabatan Fungsional"
            >
              <option value="all">Semua Jenjang</option>
              {JENJANG_JABATAN_LIST.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.singkatan}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="col-span-2 sm:col-span-1 text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="all">Semua Status</option>
              <option value="terverifikasi">Terverifikasi</option>
              <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
              <option value="draf_offline">Draf Offline</option>
              <option value="butuh_revisi">Butuh Revisi</option>
            </select>
          </div>
        </div>

        {/* Quick category filter tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 font-semibold shrink-0 text-[11px] mr-1">Filter Tema:</span>
          {['all', 'Keluarga Sakinah', 'Pengentasan Buta Huruf Baca Tulis Al Quran, Tahsin dan Tafsir', 'Aqidah Islam', 'Pemberdayaan Wakaf'].map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedKategori(cat)}
                className={`px-2.5 py-1 rounded-full shrink-0 text-[11px] font-medium transition-all ${
                  selectedKategori === cat
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'Semua Kategori' : cat.length > 25 ? cat.slice(0, 22) + '...' : cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Reports Count Badge */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Menampilkan {filteredReports.length} dari {laporanList.length} total laporan kegiatan</span>
        <span className="font-semibold text-emerald-800">
          Target Bulanan: {laporanList.filter((l) => l.statusVerifikasi === 'terverifikasi').length} / 26 Kegiatan
        </span>
      </div>

      {/* List of Report Cards */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-semibold text-slate-600">Tidak ada laporan yang cocok dengan filter</p>
            <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau bersihkan filter status</p>
          </div>
        ) : (
          filteredReports.map((lap) => {
            const isOffline = lap.statusVerifikasi === 'draf_offline';
            const isVerified = lap.statusVerifikasi === 'terverifikasi';
            const isPending = lap.statusVerifikasi === 'menunggu_verifikasi';

            return (
              <div
                key={lap.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-all p-4 shadow-2xs hover:shadow-xs space-y-3"
              >
                {/* Card Header */}
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="space-y-1.5">
                    {/* Top Badges: ID, Kategori, Kecamatan, Jenjang, Enkripsi */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                        #{lap.id.toUpperCase()}
                      </span>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        {lap.kategoriMateri}
                      </span>
                      <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-emerald-700" />
                        Kec. {lap.kecamatan || 'Somba Opu'}
                      </span>
                      {lap.penyuluhJenjang && (
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-600" />
                          {lap.penyuluhJenjang.replace('Penyuluh ', '')}
                        </span>
                      )}
                      {lap.isEncrypted && (
                        <button
                          onClick={() => onOpenEncryptionModal(lap)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-900 text-emerald-400 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
                          title="Klik untuk audit enkripsi AES-256 & hash integritas"
                        >
                          <Lock className="w-3 h-3" /> AES-256
                        </button>
                      )}
                    </div>

                    {/* Penyuluh Identity Line */}
                    <div className="text-xs text-slate-600 flex items-center gap-1.5">
                      <span className="font-bold text-slate-800">{lap.penyuluhNama || 'Dr. Hj. Masniati, S.Ag, M.Sos.I'}</span>
                      {lap.penyuluhNip && (
                        <span className="text-slate-400 font-mono text-[11px]">&bull; NIP: {lap.penyuluhNip}</span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {lap.judulMateri}
                    </h3>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        Terverifikasi KUA
                      </span>
                    ) : isPending ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Menunggu Verifikasi
                      </span>
                    ) : isOffline ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
                        <WifiOff className="w-3.5 h-3.5 text-purple-600" />
                        Draf Offline
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        Butuh Revisi
                      </span>
                    )}
                  </div>
                </div>

                {/* Deskripsi Sintesis (Kotak Rapi as in PDF requirement) */}
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs text-slate-700 leading-relaxed font-sans">
                  <span className="font-semibold text-slate-900 block mb-0.5">Deskripsi Resmi Kegiatan:</span>
                  <p>{lap.deskripsiKegiatan}</p>
                  {lap.deskripsiSingkatMateri && (
                    <p className="mt-1.5 text-slate-600 italic border-t border-slate-200/80 pt-1">
                      {lap.deskripsiSingkatMateri}
                    </p>
                  )}
                </div>

                {/* Metadata details row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{lap.hari}, {lap.tanggalPelaksanaan}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{lap.kelompokSasaran} ({lap.jumlahPeserta} org)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{lap.lokasiSpesifik}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-mono text-[11px]">
                    <span>GPS: {lap.koordinat?.latitude?.toFixed(4)}, {lap.koordinat?.longitude?.toFixed(4)}</span>
                  </div>
                </div>

                {/* Photo Collage Preview Thumbnail Row */}
                {lap.fotoList && lap.fotoList.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-500">Bukti Fisik:</span>
                    <div className="flex items-center gap-1.5">
                      {lap.fotoList.slice(0, 3).map((f) => (
                        <img
                          key={f.id}
                          src={f.url}
                          alt="Dokumentasi"
                          className="w-11 h-11 rounded-md object-cover border border-slate-200"
                        />
                      ))}
                      {lap.fotoList.length > 3 && (
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 w-11 h-11 rounded-md flex items-center justify-center border border-slate-200">
                          +{lap.fotoList.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Verification Note (if any) */}
                {lap.catatanVerifikasi && (
                  <div className="p-2 rounded bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                    <span>
                      <strong>Catatan Verifikator:</strong> {lap.catatanVerifikasi}
                    </span>
                    {lap.diverifikasiOleh && (
                      <span className="text-[10px] text-blue-700 italic">
                        oleh {lap.diverifikasiOleh}
                      </span>
                    )}
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenDocumentViewer(lap.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all border border-emerald-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Lihat Lembar Resmi (e-PA)
                    </button>

                    <button
                      onClick={() => onOpenEncryptionModal(lap)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs transition-colors"
                      title="Periksa Hash SHA-256 dan Kriptografi"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                      Integritas
                    </button>
                  </div>

                  {/* Admin Verification Quick Actions */}
                  {currentRole === 'admin' && !isVerified && onVerifyLaporan && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          onVerifyLaporan(
                            lap.id,
                            'terverifikasi',
                            `Disetujui dan diverifikasi secara digital oleh Kepala KUA Kecamatan ${lap.kecamatan || 'Somba Opu'}.`
                          )
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-bold shadow-xs active:scale-95 transition-all"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        Verifikasi Laporan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
