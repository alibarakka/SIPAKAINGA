import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  MapPin, 
  TrendingUp, 
  BarChart3, 
  Award, 
  Calendar, 
  Sparkles, 
  Clock, 
  PieChart as PieChartIcon, 
  ShieldAlert, 
  Building2 
} from 'lucide-react';
import { LaporanKegiatan } from '../types';

interface DashboardAnalyticsProps {
  laporanList: LaporanKegiatan[];
  onSelectReport?: (reportId: string) => void;
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ laporanList }) => {
  const [filterKelurahan, setFilterKelurahan] = useState<string>('all');

  // Compute metrics
  const totalKegiatan = laporanList.length;
  const totalJamaah = laporanList.reduce((acc, curr) => acc + (curr.jumlahPeserta || 0), 0);
  const terverifikasiList = laporanList.filter((l) => l.statusVerifikasi === 'terverifikasi');
  const terverifikasiCount = terverifikasiList.length;
  const verifikasiRate = totalKegiatan > 0 ? Math.round((terverifikasiCount / totalKegiatan) * 100) : 0;
  const menungguVerifikasiCount = laporanList.filter((l) => l.statusVerifikasi === 'menunggu_verifikasi').length;
  const offlineDraftCount = laporanList.filter((l) => l.statusVerifikasi === 'draf_offline').length;

  // Group by Kelurahan / Wilayah
  const wilayahMap: Record<string, { kegiatan: number; jamaah: number }> = {};
  laporanList.forEach((l) => {
    const kel = l.koordinat?.kelurahan || 'Paccinongan';
    if (!wilayahMap[kel]) {
      wilayahMap[kel] = { kegiatan: 0, jamaah: 0 };
    }
    wilayahMap[kel].kegiatan += 1;
    wilayahMap[kel].jamaah += l.jumlahPeserta || 0;
  });

  const wilayahEntries = Object.entries(wilayahMap).sort((a, b) => b[1].kegiatan - a[1].kegiatan);

  // Group by Kategori Materi
  const kategoriMap: Record<string, number> = {};
  laporanList.forEach((l) => {
    kategoriMap[l.kategoriMateri] = (kategoriMap[l.kategoriMateri] || 0) + 1;
  });

  const kategoriEntries = Object.entries(kategoriMap).sort((a, b) => b[1] - a[1]);

  // Group by Kelompok Sasaran
  const kelompokMap: Record<string, { count: number; jamaah: number }> = {};
  laporanList.forEach((l) => {
    const groupName = l.kelompokSasaran;
    if (!kelompokMap[groupName]) {
      kelompokMap[groupName] = { count: 0, jamaah: 0 };
    }
    kelompokMap[groupName].count += 1;
    kelompokMap[groupName].jamaah += l.jumlahPeserta || 0;
  });

  const kelompokEntries = Object.entries(kelompokMap).sort((a, b) => b[1].count - a[1].count);

  return (
    <div className="space-y-6">
      {/* Top Banner with Performance Indicator */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Evaluasi Kinerja Fungsional PAI Ahli Muda
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Dasbor Produktivitas & Kinerja Penyuluhan Real-Time
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Monitoring capaian kinerja tatap muka, sebaran wilayah binaan, dan verifikasi dokumen resmi KUA Somba Opu.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 block font-semibold">Tingkat Capaian</span>
              <span className="text-2xl font-black text-emerald-300">{verifikasiRate}%</span>
              <span className="text-[10px] text-slate-300 block">Sangat Memuaskan</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-400 flex items-center justify-center bg-emerald-900/50">
              <Award className="w-6 h-6 text-emerald-300" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Kegiatan</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-slate-800">{totalKegiatan}</div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> Target bulanan terpenuhi (26x)
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Jamaah Binaan</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-slate-800">{totalJamaah.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Masyarakat & warga binaan terlayani</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Terverifikasi Kepala KUA</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-blue-700">{terverifikasiCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {menungguVerifikasiCount > 0 ? `${menungguVerifikasiCount} menunggu verifikasi` : 'Semua berkas tervalidasi'}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Wilayah Jangkauan</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-slate-800">{wilayahEntries.length} Kel/Desa</div>
            <div className="text-[11px] text-amber-700 font-medium mt-0.5">Kec. Somba Opu & sekitar</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Regional Productivity & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Productivity by Sub-district / Region */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                Produktivitas Penyuluhan per Wilayah Kelurahan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sebaran frekuensi kegiatan dan kehadiran jamaah binaan
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              KUA Kec. Somba Opu
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {wilayahEntries.map(([kel, data]) => {
              const maxKegiatan = Math.max(...wilayahEntries.map((w) => w[1].kegiatan), 1);
              const percentage = Math.round((data.kegiatan / maxKegiatan) * 100);

              return (
                <div key={kel} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      Kel. {kel}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono">{data.jamaah} jamaah</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        {data.kegiatan} Kegiatan
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick summary note */}
          <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Analisis Produktivitas Wilayah:</span> Kelurahan Paccinongan dan Sungguminasa menunjukkan frekuensi penyuluhan tertinggi dengan bimbingan rutin majelis taklim serta layanan konsultasi pranikah di aula KUA.
            </div>
          </div>
        </div>

        {/* Right Column: Top Target Groups */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-700" />
              Kelompok Sasaran Terbina
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribusi binaan majelis taklim, lapas, kampus, dan TPQ
            </p>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {kelompokEntries.slice(0, 7).map(([nama, data], idx) => (
              <div
                key={nama}
                className="p-2.5 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-slate-50/80 transition-all flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 max-w-[210px] sm:max-w-[260px]">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-slate-800 truncate" title={nama}>
                    {nama}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-slate-800 block">{data.count}x Pertemuan</span>
                  <span className="text-[10px] text-slate-400">{data.jamaah} jamaah</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 18 Official Kemenag Topic Coverage Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-emerald-700" />
              Cakupan 18 Kategori Materi Standar Kementerian Agama
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoring variasi topik bimbingan keagamaan dan pembangunan nasional
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full w-fit">
            {kategoriEntries.length} dari 18 Kategori Terisi
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {kategoriEntries.map(([cat, count]) => (
            <div
              key={cat}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-emerald-50/40 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <span className="text-xs font-medium text-slate-700 line-clamp-2" title={cat}>
                {cat}
              </span>
              <div className="mt-3 flex items-baseline justify-between border-t border-slate-200/60 pt-1.5">
                <span className="text-lg font-black text-emerald-700">{count}</span>
                <span className="text-[10px] text-slate-400 font-medium">Laporan</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
