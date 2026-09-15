import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  FileSpreadsheet, 
  ChevronLeft, 
  ChevronRight, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  Calendar, 
  User, 
  MapPin, 
  Layers 
} from 'lucide-react';
import { LaporanKegiatan, PenyuluhProfile, KepalaKUAProfile, KelompokBinaanTetap } from '../types';
import { LogoKemenag, LogoIpari, LogoEPA } from './Logos';
import { exportLaporanToExcel } from '../utils/exportExcel';

interface OfficialDocumentViewerProps {
  laporanList: LaporanKegiatan[];
  penyuluh: PenyuluhProfile;
  kepalaKua: KepalaKUAProfile;
  kelompokList: KelompokBinaanTetap[];
  initialTab?: 'cover' | 'surat_tugas' | 'jadwal' | 'surat_pernyataan' | 'rekap_tabel' | 'lembar_kegiatan';
  selectedLaporanId?: string;
  onClose?: () => void;
}

export const OfficialDocumentViewer: React.FC<OfficialDocumentViewerProps> = ({
  laporanList,
  penyuluh,
  kepalaKua,
  kelompokList,
  initialTab = 'cover',
  selectedLaporanId,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    'cover' | 'surat_tugas' | 'jadwal' | 'surat_pernyataan' | 'rekap_tabel' | 'lembar_kegiatan'
  >(initialTab);

  const [currentLaporanId, setCurrentLaporanId] = useState<string>(
    selectedLaporanId || laporanList[0]?.id || ''
  );

  const activeLaporan = laporanList.find((l) => l.id === currentLaporanId) || laporanList[0];

  const handlePrint = () => {
    window.print();
  };

  const handleExcelExport = () => {
    exportLaporanToExcel(laporanList, penyuluh, kepalaKua, kelompokList, 'JULI', '2026');
  };

  // QR Code element component
  const renderQrStamp = () => (
    <div className="inline-block p-1.5 border border-slate-300 rounded bg-white text-center">
      <div className="w-16 h-16 bg-slate-900 flex items-center justify-center p-1 rounded-xs">
        <QrCode className="w-14 h-14 text-white" />
      </div>
      <span className="text-[8px] font-mono text-slate-500 block mt-0.5">TTE KEMENAG</span>
    </div>
  );

  return (
    <div className="bg-slate-100 min-h-screen p-3 sm:p-6 text-slate-900">
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print max-w-5xl mx-auto mb-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              title="Kembali ke Aplikasi"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Pratinjau Dokumen Resmi Standar Kemenag & IPARI
            </h2>
            <p className="text-xs text-slate-500">
              Format Kepdirjen Bimas Islam No. 794/2025 & e-PA Kemenag RI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExcelExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-bold transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Ekspor Excel (.xlsx)
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 text-xs font-bold transition-all shadow-xs"
          >
            <Printer className="w-4 h-4" />
            Cetak / Ekspor PDF
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Document Tab Navigation (hidden when printing) */}
      <div className="no-print max-w-5xl mx-auto mb-6 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-1">
        {[
          { id: 'cover', label: '1. Cover Laporan' },
          { id: 'surat_tugas', label: '2. Surat Tugas KUA' },
          { id: 'jadwal', label: '3. Jadwal Binaan' },
          { id: 'surat_pernyataan', label: '4. Surat Pernyataan' },
          { id: 'rekap_tabel', label: '5. Rekap Kinerja Bulanan' },
          { id: 'lembar_kegiatan', label: '6. Lembar Pelaksanaan' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === t.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main A4-proportioned Document Sheet Canvas */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-300 shadow-lg rounded-sm p-8 sm:p-14 text-slate-900 min-h-[1050px] relative font-serif">
        {/* ======================= 1. COVER ======================= */}
        {activeTab === 'cover' && (
          <div className="flex flex-col items-center justify-between min-h-[920px] text-center">
            {/* Header Titles */}
            <div className="space-y-4 pt-10">
              <h1 className="text-2xl font-bold tracking-wider uppercase font-sans">
                LAPORAN KINERJA
              </h1>
              <h2 className="text-xl font-bold tracking-wide uppercase font-sans">
                PENYULUH AGAMA ISLAM
              </h2>
              <div className="w-24 h-1 bg-emerald-700 mx-auto mt-2"></div>
              <p className="text-base font-semibold text-slate-700 uppercase tracking-widest pt-2">
                BULAN JULI TAHUN 2026
              </p>
            </div>

            {/* Official Center Logos: e-PA, IPARI, Kemenag */}
            <div className="my-12 flex flex-col items-center gap-6">
              <LogoEPA className="h-16 text-3xl" />
              <div className="flex items-center justify-center gap-8 my-4">
                <LogoKemenag size={100} />
                <LogoIpari size={100} />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
                Sistem Pelaporan Kegiatan Penyuluhan Keagamaan dan Pembangunan (SIPAKAINGA)
              </span>
            </div>

            {/* Data Penyuluh Box */}
            <div className="w-full max-w-lg text-left bg-slate-50/80 p-6 rounded-lg border border-slate-200 font-sans text-sm space-y-2">
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 font-bold text-slate-700">NAMA</span>
                <span className="col-span-1">:</span>
                <span className="col-span-7 font-bold text-slate-900">{penyuluh.nama}</span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 font-bold text-slate-700">NIP / NIPA</span>
                <span className="col-span-1">:</span>
                <span className="col-span-7 font-mono">{penyuluh.nip} / {penyuluh.nipa}</span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 font-bold text-slate-700">PANGKAT/GOL</span>
                <span className="col-span-1">:</span>
                <span className="col-span-7">{penyuluh.pangkatGol}</span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 font-bold text-slate-700">JABATAN</span>
                <span className="col-span-1">:</span>
                <span className="col-span-7">{penyuluh.jabatan}</span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 font-bold text-slate-700">WIL. TUGAS</span>
                <span className="col-span-1">:</span>
                <span className="col-span-7">{penyuluh.wilTugas}</span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 font-bold text-slate-700">UNIT KERJA</span>
                <span className="col-span-1">:</span>
                <span className="col-span-7">{penyuluh.unitKerja}</span>
              </div>
            </div>

            {/* Footer Institution */}
            <div className="pt-10 font-sans text-center">
              <p className="font-bold tracking-widest text-slate-900 uppercase">
                KEMENTERIAN AGAMA KABUPATEN GOWA
              </p>
              <p className="text-sm font-semibold text-slate-700">2026</p>
            </div>
          </div>
        )}

        {/* ======================= 2. SURAT TUGAS ======================= */}
        {activeTab === 'surat_tugas' && (
          <div className="space-y-6 font-sans text-xs sm:text-sm">
            {/* Kop Surat Resmi KUA */}
            <div className="flex items-center gap-4 border-b-2 border-slate-900 pb-3 text-center">
              <LogoKemenag size={65} className="shrink-0" />
              <div className="grow text-center">
                <h3 className="font-bold text-xs uppercase tracking-wide">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h3>
                <h4 className="font-bold text-xs uppercase">KANTOR KABUPATEN GOWA</h4>
                <h2 className="font-extrabold text-sm sm:text-base uppercase tracking-tight text-emerald-950">
                  {kepalaKua.kuaName || `KANTOR URUSAN AGAMA ( KUA ) KEC. ${penyuluh.kecamatan?.toUpperCase() || 'SOMBA OPU'}`}
                </h2>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {kepalaKua.alamatKua || 'Kabupaten Gowa, Sulawesi Selatan'} &bull; Telp: {kepalaKua.teleponKua || '(0411)'}
                </p>
                <p className="text-[10px] text-slate-500 italic">Email: {kepalaKua.emailKua || 'kua.gowa@kemenag.go.id'}</p>
              </div>
            </div>

            {/* Surat Tugas Title */}
            <div className="text-center pt-2">
              <h2 className="font-bold text-base underline tracking-wider uppercase">SURAT TUGAS</h2>
              <p className="text-xs font-mono mt-1">Nomor : B.063/KUA.21.06/BA.01/VII/2026</p>
            </div>

            <p className="leading-relaxed">
              Kepala {kepalaKua.kuaName || `Kantor Urusan Agama ( KUA ) Kecamatan ${penyuluh.kecamatan || 'Somba Opu'}`} dengan berdasar pada:
            </p>

            <div className="grid grid-cols-12 gap-2 pl-2 text-xs">
              <span className="col-span-2 font-bold">Dasar :</span>
              <div className="col-span-10 space-y-1">
                <p>1. Peraturan Presiden Nomor 63 Tahun 2011 tentang organisasi dan tata kerja instansi vertikal kementerian agama</p>
                <p>2. Keputusan bersama Menteri Agama dan Kepala BKN No. 574 dan 178</p>
                <p>3. PERMEN PAN RB Nomor 9 Tahun 2021 tentang Jabatan Fungsional Penyuluh Agama.</p>
                <p>4. Keputusan Direktur Jenderal Bimbingan Masyarakat Islam Nomor 794 Tahun 2025.</p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 pl-2 text-xs border-t border-slate-200 pt-3">
              <span className="col-span-2 font-bold">Memberi tugas kepada :</span>
              <div className="col-span-10 space-y-1">
                <div className="grid grid-cols-12">
                  <span className="col-span-3">Nama</span>
                  <span className="col-span-9 font-bold">: {penyuluh.nama}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-3">Nip.</span>
                  <span className="col-span-9 font-mono">: {penyuluh.nip}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-3">Pangkat/Gol</span>
                  <span className="col-span-9">: {penyuluh.pangkatGol}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-3">Jabatan</span>
                  <span className="col-span-9">: {penyuluh.jabatan}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-3">Unit Kerja</span>
                  <span className="col-span-9">: {penyuluh.unitKerja}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold mb-2">
                Untuk melaksanakan kegiatan dan pengembangan bimbingan atau penyuluhan Agama pada kelompok sasaran binaan Majelis Taklim sebagai berikut :
              </p>

              <table className="w-full border-collapse border border-slate-400 text-xs">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-400 p-1.5 w-8">No</th>
                    <th className="border border-slate-400 p-1.5">Nama Kelompok</th>
                    <th className="border border-slate-400 p-1.5">Alamat</th>
                    <th className="border border-slate-400 p-1.5">Pimpinan / Hp</th>
                  </tr>
                </thead>
                <tbody>
                  {kelompokList.slice(0, 8).map((k, i) => (
                    <tr key={k.id}>
                      <td className="border border-slate-400 p-1.5 text-center">{i + 1}.</td>
                      <td className="border border-slate-400 p-1.5 font-medium">{k.namaKelompok}</td>
                      <td className="border border-slate-400 p-1.5">{k.alamat}</td>
                      <td className="border border-slate-400 p-1.5">{k.pimpinan} / {k.kontak}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-xs">
              <p className="font-semibold">Waktu : 01 – 31 JULI 2026</p>
              <p className="mt-1">Demikian surat Tugas ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
            </div>

            {/* Signature Area */}
            <div className="pt-4 flex justify-end">
              <div className="text-center w-64 space-y-1">
                <p>Gowa, 01 JULI 2026</p>
                <p className="font-bold">Kepala {kepalaKua.kuaName || `KUA Kec. ${penyuluh.kecamatan || 'Somba Opu'}`}</p>
                <div className="py-2 flex justify-center">{renderQrStamp()}</div>
                <p className="font-bold underline">{kepalaKua.nama}</p>
                <p className="text-xs font-mono">Nip. {kepalaKua.nip}</p>
              </div>
            </div>
          </div>
        )}

        {/* ======================= 3. JADWAL BINAAN TETAP ======================= */}
        {activeTab === 'jadwal' && (
          <div className="space-y-6 font-sans text-xs sm:text-sm">
            <div className="text-center space-y-1 border-b border-slate-300 pb-3">
              <div className="flex justify-center mb-2">
                <LogoKemenag size={55} />
              </div>
              <h3 className="font-bold text-xs uppercase">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h3>
              <h4 className="font-bold text-xs uppercase">KEMENTERIAN AGAMA KABUPATEN GOWA</h4>
              <h2 className="font-bold text-sm uppercase">{kepalaKua.kuaName?.toUpperCase() || `KUA KECAMATAN ${penyuluh.kecamatan?.toUpperCase() || 'SOMBA OPU'}`}</h2>
              <p className="text-[11px] text-slate-600">{kepalaKua.alamatKua || 'Kabupaten Gowa, Sulawesi Selatan'}</p>
            </div>

            <div className="text-center pt-2">
              <h2 className="font-bold text-sm sm:text-base uppercase tracking-wider">
                JADWAL KEGIATAN TATAP MUKA PADA KELOMPOK SASARAN BINAAN TETAP
              </h2>
            </div>

            <table className="w-full border-collapse border border-slate-400 text-xs mt-4">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-400 p-1.5 w-8">NO</th>
                  <th className="border border-slate-400 p-1.5 w-16">HARI</th>
                  <th className="border border-slate-400 p-1.5">NAMA KELOMPOK SASARAN</th>
                  <th className="border border-slate-400 p-1.5">PIMPINAN KLP</th>
                  <th className="border border-slate-400 p-1.5 w-32">WAKTU</th>
                  <th className="border border-slate-400 p-1.5 w-20">KET</th>
                </tr>
              </thead>
              <tbody>
                {kelompokList.map((k) => (
                  <tr key={k.id}>
                    <td className="border border-slate-400 p-1.5 text-center">{k.no}.</td>
                    <td className="border border-slate-400 p-1.5 font-bold">{k.hari}</td>
                    <td className="border border-slate-400 p-1.5 font-medium">{k.namaKelompok}</td>
                    <td className="border border-slate-400 p-1.5">{k.pimpinan}</td>
                    <td className="border border-slate-400 p-1.5 text-center">{k.waktu}</td>
                    <td className="border border-slate-400 p-1.5 text-center font-semibold">{k.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Double signature */}
            <div className="pt-8 grid grid-cols-2 text-center text-xs">
              <div className="space-y-1">
                <p>Mengetahui</p>
                <p className="font-bold">Kepala KUA Kec. Somba Opu</p>
                <div className="py-2 flex justify-center">{renderQrStamp()}</div>
                <p className="font-bold underline">{kepalaKua.nama}</p>
                <p className="font-mono">Nip. {kepalaKua.nip}</p>
              </div>

              <div className="space-y-1">
                <p>Gowa, 01 JUNI 2026</p>
                <p className="font-bold">Penyuluh Agama Islam</p>
                <div className="h-16 flex items-center justify-center italic text-emerald-800 font-serif text-lg">
                  ( Masniati )
                </div>
                <p className="font-bold underline">{penyuluh.nama}</p>
                <p className="font-mono">Nip. {penyuluh.nip}</p>
              </div>
            </div>
          </div>
        )}

        {/* ======================= 4. SURAT PERNYATAAN ======================= */}
        {activeTab === 'surat_pernyataan' && (
          <div className="space-y-6 font-sans text-xs sm:text-sm">
            <div className="text-center space-y-1 border-b border-slate-300 pb-3">
              <div className="flex justify-center mb-2">
                <LogoKemenag size={55} />
              </div>
              <h3 className="font-bold text-xs uppercase">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h3>
              <h4 className="font-bold text-xs uppercase">KEMENTERIAN AGAMA KABUPATEN GOWA</h4>
              <h2 className="font-bold text-sm uppercase">{kepalaKua.kuaName?.toUpperCase() || `KUA KECAMATAN ${penyuluh.kecamatan?.toUpperCase() || 'SOMBA OPU'}`}</h2>
              <p className="text-[11px] text-slate-600">{kepalaKua.alamatKua || 'Kabupaten Gowa, Sulawesi Selatan'}</p>
            </div>

            <div className="text-center pt-1">
              <h2 className="font-bold text-sm sm:text-base uppercase tracking-wider underline">
                SURAT PERNYATAAN MELAKSANAKAN KEGIATAN PENYULUHAN AGAMA ISLAM SECARA TATAP MUKA
              </h2>
            </div>

            <p className="leading-relaxed text-xs">
              Yang bertanda tangan di bawah ini, Kepala {kepalaKua.kuaName || `Kantor Urusan Agama (KUA) Kec. ${penyuluh.kecamatan || 'Somba Opu'}`},
            </p>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1">
              <div className="grid grid-cols-12">
                <span className="col-span-3 font-semibold">Nama</span>
                <span className="col-span-9 font-bold">: {kepalaKua.nama}</span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-3">Nip.</span>
                <span className="col-span-9 font-mono">: {kepalaKua.nip}</span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-3">Pangkat/Gol</span>
                <span className="col-span-9">: {kepalaKua.pangkatGol}</span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-3">Jabatan</span>
                <span className="col-span-9">: {kepalaKua.jabatan}</span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-3">Unit Kerja</span>
                <span className="col-span-9">: {penyuluh.wilTugas}</span>
              </div>
            </div>

            <p className="text-xs font-semibold">Menyatakan bahwa :</p>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1">
              <div className="grid grid-cols-12">
                <span className="col-span-3 font-semibold">Nama</span>
                <span className="col-span-9 font-bold">: {penyuluh.nama}</span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-3">Nip.</span>
                <span className="col-span-9 font-mono">: {penyuluh.nip}</span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-3">Pangkat/Gol</span>
                <span className="col-span-9">: {penyuluh.pangkatGol}</span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-3">Jabatan</span>
                <span className="col-span-9">: {penyuluh.jabatan}</span>
              </div>
            </div>

            <p className="text-xs">
              Telah melaksanakan kegiatan penyuluhan Agama Islam secara tatap muka pada kelompok sasaran binaan sebagai berikut:
            </p>

            <table className="w-full border-collapse border border-slate-400 text-xs">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-400 p-1.5 w-20">BULAN</th>
                  <th className="border border-slate-400 p-1.5 w-8">NO</th>
                  <th className="border border-slate-400 p-1.5">NAMA KLP SASARAN / ALAMAT</th>
                  <th className="border border-slate-400 p-1.5 w-24">JML TEMU</th>
                  <th className="border border-slate-400 p-1.5 w-16">KET</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan={10} className="border border-slate-400 p-2 text-center font-bold align-middle bg-slate-50">
                    JULI 2026
                  </td>
                  <td className="border border-slate-400 p-1 text-center">1.</td>
                  <td className="border border-slate-400 p-1">Majelis Taklim Nurul Ihsan / Jln Bontotanga Kel. Paccinongan</td>
                  <td className="border border-slate-400 p-1 text-center font-semibold">5 kali</td>
                  <td className="border border-slate-400 p-1 text-center">Lengkap</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1 text-center">2.</td>
                  <td className="border border-slate-400 p-1">Majelis Taklim AL-HAMID / Hertasning Kel. Paccinongan</td>
                  <td className="border border-slate-400 p-1 text-center font-semibold">3 kali</td>
                  <td className="border border-slate-400 p-1 text-center">Lengkap</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1 text-center">3.</td>
                  <td className="border border-slate-400 p-1">Majelis Taklim Nurul Mujaddid / Kel. Tombolo</td>
                  <td className="border border-slate-400 p-1 text-center font-semibold">3 kali</td>
                  <td className="border border-slate-400 p-1 text-center">Lengkap</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1 text-center">4.</td>
                  <td className="border border-slate-400 p-1">Kelompok Cendekia Mahasiswa UINAM</td>
                  <td className="border border-slate-400 p-1 text-center font-semibold">3 kali</td>
                  <td className="border border-slate-400 p-1 text-center">Lengkap</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1 text-center">5.</td>
                  <td className="border border-slate-400 p-1">Kelompok TPQ Al-Ihsan</td>
                  <td className="border border-slate-400 p-1 text-center font-semibold">2 kali</td>
                  <td className="border border-slate-400 p-1 text-center">Lengkap</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1 text-center">6.</td>
                  <td className="border border-slate-400 p-1">Kelompok BIMWIN Mandiri, BRUN dan BRUS KUA Somba Opu</td>
                  <td className="border border-slate-400 p-1 text-center font-semibold">4 kali</td>
                  <td className="border border-slate-400 p-1 text-center">Lengkap</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1 text-center">7.</td>
                  <td className="border border-slate-400 p-1">MT BANATUL MUHAJIRIN KALEGOWA</td>
                  <td className="border border-slate-400 p-1 text-center font-semibold">1 kali</td>
                  <td className="border border-slate-400 p-1 text-center">Lengkap</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1 text-center">8.</td>
                  <td className="border border-slate-400 p-1">Lapas NARKOTIKA dan PEREMPUAN BOLLANGI</td>
                  <td className="border border-slate-400 p-1 text-center font-semibold">3 kali</td>
                  <td className="border border-slate-400 p-1 text-center">Lengkap</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1 text-center">9.</td>
                  <td className="border border-slate-400 p-1">MT Al-Muhajirin Kel Tombolo / SDI Bontoramba</td>
                  <td className="border border-slate-400 p-1 text-center font-semibold">2 kali</td>
                  <td className="border border-slate-400 p-1 text-center">Lengkap</td>
                </tr>
                <tr className="bg-slate-100 font-bold">
                  <td colSpan={2} className="border border-slate-400 p-1.5 text-center">JUMLAH</td>
                  <td className="border border-slate-400 p-1.5 text-center text-emerald-800 text-sm">26 kali</td>
                  <td className="border border-slate-400 p-1.5 text-center">Tercapai</td>
                </tr>
              </tbody>
            </table>

            <div className="pt-6 flex justify-end text-xs">
              <div className="text-center w-64 space-y-1">
                <p>Gowa, 31 JULI 2026</p>
                <p className="font-bold">Kepala {kepalaKua.kuaName || `KUA Kec. ${penyuluh.kecamatan || 'Somba Opu'}`}</p>
                <div className="py-2 flex justify-center">{renderQrStamp()}</div>
                <p className="font-bold underline">{kepalaKua.nama}</p>
                <p className="font-mono">Nip. {kepalaKua.nip}</p>
              </div>
            </div>
          </div>
        )}

        {/* ======================= 5. REKAP TABEL BULANAN ======================= */}
        {activeTab === 'rekap_tabel' && (
          <div className="space-y-4 font-sans text-xs">
            <div className="text-center space-y-0.5">
              <h2 className="font-bold text-sm uppercase">LAPORAN KINERJA PENYULUH AGAMA ISLAM</h2>
              <p className="font-semibold text-slate-700">BULAN JULI TAHUN 2026</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded border border-slate-200">
              <div>
                <p><span className="font-semibold">NAMA:</span> {penyuluh.nama}</p>
                <p><span className="font-semibold">NIP/NIPA:</span> {penyuluh.nip} / {penyuluh.nipa}</p>
                <p><span className="font-semibold">PROPINSI:</span> Sulawesi Selatan</p>
              </div>
              <div>
                <p><span className="font-semibold">KABUPATEN:</span> Gowa</p>
                <p><span className="font-semibold">KECAMATAN:</span> Somba Opu</p>
                <p><span className="font-semibold">JABATAN:</span> {penyuluh.jabatan}</p>
              </div>
            </div>

            <h3 className="font-bold text-xs pt-2">A. Laporan Penyuluhan</h3>
            <table className="w-full border-collapse border border-slate-400 text-[11px]">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-400 p-1 w-7">No</th>
                  <th className="border border-slate-400 p-1 w-18">Tanggal</th>
                  <th className="border border-slate-400 p-1">Nama Kelompok Sasaran</th>
                  <th className="border border-slate-400 p-1 w-16">Jumlah Jamaah</th>
                  <th className="border border-slate-400 p-1">Tema / Judul Materi</th>
                  <th className="border border-slate-400 p-1 w-14">Status</th>
                </tr>
              </thead>
              <tbody>
                {laporanList.map((l, i) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="border border-slate-400 p-1 text-center">{i + 1}.</td>
                    <td className="border border-slate-400 p-1 text-center font-mono">{l.tanggalPelaksanaan}</td>
                    <td className="border border-slate-400 p-1">{l.kelompokSasaran}</td>
                    <td className="border border-slate-400 p-1 text-center font-medium">{l.jumlahPeserta} Orang</td>
                    <td className="border border-slate-400 p-1">{l.judulMateri}</td>
                    <td className="border border-slate-400 p-1 text-center font-bold text-[10px] text-emerald-700">
                      {l.statusVerifikasi === 'terverifikasi' ? 'TERVALIDASI' : 'DRAFT'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ======================= 6. LEMBAR PELAKSANAAN DENGAN KOLASE FOTO ======================= */}
        {activeTab === 'lembar_kegiatan' && (
          <div className="space-y-4 font-sans text-xs sm:text-sm">
            {/* Laporan Picker for user */}
            <div className="no-print bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Pilih Lembar Kegiatan:
              </span>
              <select
                value={currentLaporanId}
                onChange={(e) => setCurrentLaporanId(e.target.value)}
                className="text-xs px-2.5 py-1 rounded border border-emerald-300 bg-white font-medium"
              >
                {laporanList.map((l, i) => (
                  <option key={l.id} value={l.id}>
                    #{i + 1} - {l.tanggalPelaksanaan} : {l.kelompokSasaran} ({l.judulMateri.substring(0, 30)}...)
                  </option>
                ))}
              </select>
            </div>

            <div className="text-center space-y-0.5 border-b border-slate-300 pb-2">
              <h2 className="font-bold text-sm uppercase">LAPORAN PELAKSANAAN</h2>
              <h3 className="font-bold text-xs uppercase text-slate-800">
                BIMBINGAN DAN PENYULUHAN AGAMA DAN PEMBANGUNAN
              </h3>
              <p className="text-xs font-semibold text-slate-600">
                KEMENAG KAB. GOWA {kepalaKua.kuaName?.toUpperCase() || `KEC. ${penyuluh.kecamatan?.toUpperCase() || 'SOMBA OPU'}`}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <h4 className="font-bold text-xs uppercase bg-slate-100 p-1 border border-slate-200">
                I. DATA PENYULUH AGAMA DAN KELOMPOK BINAAN
              </h4>

              {/* Data Penyuluh */}
              <div className="pl-3 space-y-1 text-xs">
                <p className="font-bold text-slate-800">A. PENYULUH AGAMA</p>
                <div className="grid grid-cols-12 gap-1 pl-2">
                  <span className="col-span-4">Nama Lengkap</span>
                  <span className="col-span-8 font-bold">: {penyuluh.nama}</span>

                  <span className="col-span-4">Tempat dan Tanggal Lahir</span>
                  <span className="col-span-8">: {penyuluh.tempatTanggalLahir}</span>

                  <span className="col-span-4">Nip / Nomor Seri Karpeg</span>
                  <span className="col-span-8 font-mono">: {penyuluh.nip}</span>

                  <span className="col-span-4">Pendidikan Terakhir</span>
                  <span className="col-span-8">: {penyuluh.pendidikanTerakhir}</span>

                  <span className="col-span-4">Pangkat/Golongan/TMT</span>
                  <span className="col-span-8">: {penyuluh.pangkatGol} / {penyuluh.tmt}</span>

                  <span className="col-span-4">Unit Kerja</span>
                  <span className="col-span-8">: {penyuluh.unitKerja}</span>

                  <span className="col-span-4">Wilayah tugas</span>
                  <span className="col-span-8">: {penyuluh.wilTugas}</span>
                </div>
              </div>

              {/* Data Kelompok Binaan */}
              <div className="pl-3 space-y-1 text-xs border-t border-slate-200 pt-2">
                <p className="font-bold text-slate-800">B. KELOMPOK BINAAN</p>
                <div className="grid grid-cols-12 gap-1 pl-2">
                  <span className="col-span-4 font-semibold">Nama Kelompok Sasaran</span>
                  <span className="col-span-8 font-bold text-slate-900">: {activeLaporan.kelompokSasaran}</span>

                  <span className="col-span-4">Kategori Materi</span>
                  <span className="col-span-8">: {activeLaporan.kategoriMateri}</span>

                  <span className="col-span-4">Judul Materi</span>
                  <span className="col-span-8 font-semibold">: {activeLaporan.judulMateri}</span>

                  <span className="col-span-4">Hari/ Tanggal</span>
                  <span className="col-span-8 font-bold">
                    : {activeLaporan.hari}, {activeLaporan.tanggalPelaksanaan}
                  </span>

                  <span className="col-span-4">Lokasi</span>
                  <span className="col-span-8">: {activeLaporan.lokasiSpesifik}</span>

                  <span className="col-span-4">Jumlah Peserta</span>
                  <span className="col-span-8 font-semibold">: {activeLaporan.jumlahPeserta} Orang</span>
                </div>
              </div>

              {/* Deskripsi dalam Rectangle Kotak Rapi (as required in PDF page 2) */}
              <div className="pl-3 space-y-1 text-xs pt-1">
                <span className="font-semibold text-slate-700 block">Deskripsi Kegiatan:</span>
                <div className="border-2 border-slate-400 p-3 rounded bg-white text-xs leading-relaxed text-slate-900 font-sans shadow-2xs">
                  <p className="font-medium">{activeLaporan.deskripsiKegiatan}</p>
                  {activeLaporan.deskripsiSingkatMateri && (
                    <p className="mt-2 pt-2 border-t border-slate-200 text-slate-700 italic">
                      Ringkasan Materi: {activeLaporan.deskripsiSingkatMateri}
                    </p>
                  )}
                </div>
              </div>

              {/* Foto Kegiatan Kolase Album */}
              <div className="pl-3 space-y-1 pt-2">
                <span className="font-semibold text-xs text-slate-700 block">Foto Kegiatan & Bukti Fisik:</span>
                <div className="border border-slate-300 p-2 rounded bg-slate-50">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {activeLaporan.fotoList.map((f, idx) => (
                      <div key={f.id} className="relative aspect-4/3 overflow-hidden rounded border border-slate-300 bg-slate-800">
                        <img src={f.url} alt={f.caption || 'Dokumentasi'} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 inset-x-0 bg-black/70 p-1 text-[9px] text-white">
                          <p className="truncate">{f.caption || `Foto #${idx + 1}`}</p>
                          <p className="text-[8px] text-emerald-400 font-mono">
                            {activeLaporan.koordinat.latitude?.toFixed(4)}, {activeLaporan.koordinat.longitude?.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Signature Area */}
              <div className="pt-6 grid grid-cols-2 text-center text-xs">
                <div className="space-y-1">
                  <p>Mengetahui</p>
                  <p className="font-bold">Kepala {kepalaKua.kuaName || `KUA Kec. ${penyuluh.kecamatan || 'Somba Opu'}`}</p>
                  <div className="py-2 flex justify-center">{renderQrStamp()}</div>
                  <p className="font-bold underline">{kepalaKua.nama}</p>
                  <p className="font-mono">Nip. {kepalaKua.nip}</p>
                </div>

                <div className="space-y-1">
                  <p>Penyuluh Agama Islam</p>
                  <div className="h-20 flex items-center justify-center italic text-emerald-800 font-serif text-lg">
                    ( {penyuluh.nama.split(',')[0]} )
                  </div>
                  <p className="font-bold underline">{penyuluh.nama}</p>
                  <p className="font-mono">Nip. {penyuluh.nip}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
