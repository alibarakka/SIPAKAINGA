import * as XLSX from 'xlsx';
import { LaporanKegiatan, PenyuluhProfile, KepalaKUAProfile, KelompokBinaanTetap } from '../types';

export function exportLaporanToExcel(
  laporanList: LaporanKegiatan[],
  penyuluh: PenyuluhProfile,
  kepalaKua: KepalaKUAProfile,
  kelompokList: KelompokBinaanTetap[],
  bulan = 'JULI',
  tahun = '2026'
): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: REKAPITULASI KINERJA BULANAN
  const rekapHeader = [
    ['KEMENTERIAN AGAMA REPUBLIK INDONESIA'],
    ['KANTOR KEMENTERIAN AGAMA KABUPATEN GOWA'],
    ['KANTOR URUSAN AGAMA (KUA) KECAMATAN SOMBA OPU'],
    [''],
    [`LAPORAN KINERJA PENYULUH AGAMA ISLAM BULAN ${bulan} TAHUN ${tahun}`],
    [''],
    ['Nama Penyuluh', `: ${penyuluh.nama}`],
    ['NIP / NIPA', `: ${penyuluh.nip} / ${penyuluh.nipa}`],
    ['Pangkat / Golongan', `: ${penyuluh.pangkatGol}`],
    ['Jabatan', `: ${penyuluh.jabatan}`],
    ['Wilayah Tugas', `: ${penyuluh.wilTugas}`],
    ['Unit Kerja', `: ${penyuluh.unitKerja}`],
    [''],
    ['No', 'Tanggal', 'Hari', 'Kelompok Sasaran', 'Jumlah Jamaah', 'Kategori Materi', 'Judul / Tema Materi', 'Lokasi', 'Status Verifikasi', 'Diverifikasi Oleh']
  ];

  const rekapRows = laporanList.map((lap, idx) => [
    idx + 1,
    lap.tanggalPelaksanaan,
    lap.hari,
    lap.kelompokSasaran,
    `${lap.jumlahPeserta} Orang`,
    lap.kategoriMateri,
    lap.judulMateri,
    lap.lokasiSpesifik,
    lap.statusVerifikasi === 'terverifikasi' ? 'TERVERIFIKASI' : lap.statusVerifikasi === 'draf_offline' ? 'DRAF OFFLINE' : 'MENUNGGU VERIFIKASI',
    lap.diverifikasiOleh || '-'
  ]);

  const wsRekap = XLSX.utils.aoa_to_sheet([...rekapHeader, ...rekapRows]);
  wsRekap['!cols'] = [
    { wch: 5 },  // No
    { wch: 14 }, // Tanggal
    { wch: 10 }, // Hari
    { wch: 35 }, // Kelompok
    { wch: 15 }, // Jumlah
    { wch: 30 }, // Kategori
    { wch: 40 }, // Judul
    { wch: 35 }, // Lokasi
    { wch: 20 }, // Status
    { wch: 30 }  // Verifikator
  ];
  XLSX.utils.book_append_sheet(wb, wsRekap, 'Laporan Kinerja Bulanan');

  // Sheet 2: DETAIL RINCIAN LAPORAN DENGAN GEOLOKASI & ENKRIPSI HASH
  const detailHeader = [
    [
      'ID Laporan',
      'No. Surat Tugas',
      'Tanggal',
      'Hari',
      'Jenis Laporan',
      'Kategori Materi',
      'Kelompok Sasaran',
      'Jumlah Peserta',
      'Lokasi Spesifik',
      'Kelurahan',
      'Kecamatan',
      'Latitude',
      'Longitude',
      'Akurasi GPS (m)',
      'Judul Materi',
      'Deskripsi Sintesis Kegiatan',
      'Deskripsi Tambahan Materi',
      'Status Verifikasi',
      'Enkripsi AES-256',
      'Hash Integritas SHA-256'
    ]
  ];

  const detailRows = laporanList.map(lap => [
    lap.id.toUpperCase(),
    lap.nomorSuratTugas || '-',
    lap.tanggalPelaksanaan,
    lap.hari,
    lap.jenisLaporan,
    lap.kategoriMateri,
    lap.kelompokSasaran,
    lap.jumlahPeserta,
    lap.lokasiSpesifik,
    lap.koordinat.kelurahan,
    lap.koordinat.kecamatan,
    lap.koordinat.latitude,
    lap.koordinat.longitude,
    lap.koordinat.accuracy,
    lap.judulMateri,
    lap.deskripsiKegiatan,
    lap.deskripsiSingkatMateri || '-',
    lap.statusVerifikasi,
    lap.isEncrypted ? 'Ya (AES-GCM-256)' : 'Tidak',
    lap.encryptedDataHash || '-'
  ]);

  const wsDetail = XLSX.utils.aoa_to_sheet([...detailHeader, ...detailRows]);
  XLSX.utils.book_append_sheet(wb, wsDetail, 'Detail Kegiatan & Koordinat');

  // Sheet 3: JADWAL KELOMPOK BINAAN TETAP
  const jadwalHeader = [
    ['JADWAL KEGIATAN TATAP MUKA PADA KELOMPOK SASARAN BINAAN TETAP'],
    [`KUA KECAMATAN SOMBA OPU - TAHUN ${tahun}`],
    [''],
    ['No', 'Hari', 'Nama Kelompok Sasaran', 'Pimpinan / Kontak', 'Alamat / Lokasi', 'Waktu Pelaksanaan', 'Keterangan Siklus']
  ];

  const jadwalRows = kelompokList.map((k, i) => [
    i + 1,
    k.hari,
    k.namaKelompok,
    `${k.pimpinan} (${k.kontak})`,
    k.alamat,
    k.waktu,
    k.keterangan
  ]);

  const wsJadwal = XLSX.utils.aoa_to_sheet([...jadwalHeader, ...jadwalRows]);
  wsJadwal['!cols'] = [
    { wch: 5 },
    { wch: 12 },
    { wch: 45 },
    { wch: 35 },
    { wch: 35 },
    { wch: 20 },
    { wch: 16 }
  ];
  XLSX.utils.book_append_sheet(wb, wsJadwal, 'Jadwal Binaan Tetap');

  // Sheet 4: STATISTIK & REKAP PER KATEGORI
  const kategoriCount: Record<string, number> = {};
  laporanList.forEach(l => {
    kategoriCount[l.kategoriMateri] = (kategoriCount[l.kategoriMateri] || 0) + 1;
  });

  const totalJamaah = laporanList.reduce((acc, curr) => acc + curr.jumlahPeserta, 0);
  const totalTerverifikasi = laporanList.filter(l => l.statusVerifikasi === 'terverifikasi').length;

  const statsHeader = [
    ['RINGKASAN STATISTIK KINERJA PENYULUH'],
    [''],
    ['Total Kegiatan Dilaporkan', laporanList.length],
    ['Total Jamaah / Masyarakat Terlayani', `${totalJamaah} Orang`],
    ['Laporan Terverifikasi Kepala KUA', `${totalTerverifikasi} Kegiatan`],
    ['Tingkat Kepatuhan Verifikasi', `${Math.round((totalTerverifikasi / (laporanList.length || 1)) * 100)}%`],
    [''],
    ['Sebaran Per Kategori Materi (18 Kategori Standar Kemenag):'],
    ['Kategori', 'Jumlah Kegiatan']
  ];

  const statsRows = Object.entries(kategoriCount).map(([cat, count]) => [cat, count]);
  const wsStats = XLSX.utils.aoa_to_sheet([...statsHeader, ...statsRows]);
  XLSX.utils.book_append_sheet(wb, wsStats, 'Statistik Kinerja');

  // Write and trigger download
  const filename = `SIPAKAINGA_Rekap_Kinerja_${penyuluh.nama.replace(/[^a-zA-Z0-9]/g, '_')}_${bulan}_${tahun}.xlsx`;
  XLSX.writeFile(wb, filename);
}
