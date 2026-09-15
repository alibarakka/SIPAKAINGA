import { KecamatanGowa, JenjangJabatan, KepalaKUAProfile, PenyuluhProfile, LaporanKegiatan } from '../types';

export const KECAMATAN_GOWA_LIST: KecamatanGowa[] = [
  'Biringbulu',
  'Bungaya',
  'Bontolempangan',
  'Bajeng',
  'Bajeng Barat',
  'Bontonompo',
  'Bontonompo Selatan',
  'Barombong',
  'Bontomarannu',
  'Parangloe',
  'Pattallassang',
  'Parigi',
  'Pallangga',
  'Tompobulu',
  'Tinggimoncong',
  'Tombolopao',
  'Manuju',
  'Somba Opu'
];

export const JENJANG_JABATAN_LIST: {
  id: JenjangJabatan;
  label: string;
  golonganDefault: string;
  singkatan: string;
  badgeClass: string;
}[] = [
  {
    id: 'Penyuluh Agama Islam Ahli Pertama',
    label: 'Penyuluh Ahli Pertama',
    golonganDefault: 'Penata Muda / IIIa',
    singkatan: 'Ahli Pertama',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-300'
  },
  {
    id: 'Penyuluh Agama Islam Ahli Muda',
    label: 'Penyuluh Ahli Muda',
    golonganDefault: 'Penata Tk. I / IIId',
    singkatan: 'Ahli Muda',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300'
  },
  {
    id: 'Penyuluh Agama Islam Ahli Madya',
    label: 'Penyuluh Ahli Madya',
    golonganDefault: 'Pembina Tk. I / IVb',
    singkatan: 'Ahli Madya',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-300'
  }
];

export const KUA_DATABASE: Record<KecamatanGowa, KepalaKUAProfile> = {
  'Somba Opu': {
    kecamatan: 'Somba Opu',
    nama: 'H. MURHADI MUCHTAR, S.Ag. MH',
    nip: '19720622200511005',
    pangkatGol: 'Pembina Tk. I / IVb',
    jabatan: 'Penghulu Madya / Kepala KUA',
    kuaName: 'KUA Kecamatan Somba Opu',
    alamatKua: 'Jl. Masjid Raya No. 24 Sungguminasa, Somba Opu, Gowa 92111',
    teleponKua: '(0411) 865195',
    emailKua: 'kua.sombaopu@kemenag.go.id'
  },
  'Pallangga': {
    kecamatan: 'Pallangga',
    nama: 'Drs. H. MUH. ASKAR, M.Pd.I',
    nip: '196803151994031004',
    pangkatGol: 'Pembina / IVa',
    jabatan: 'Penghulu Madya / Kepala KUA',
    kuaName: 'KUA Kecamatan Pallangga',
    alamatKua: 'Jl. Poros Pallangga No. 45, Pallangga, Kab. Gowa',
    teleponKua: '(0411) 821334',
    emailKua: 'kua.pallangga@kemenag.go.id'
  },
  'Bajeng': {
    kecamatan: 'Bajeng',
    nama: 'H. SYAMSUDDIN, S.Ag. MH',
    nip: '197011081997031002',
    pangkatGol: 'Pembina / IVa',
    jabatan: 'Penghulu Madya / Kepala KUA',
    kuaName: 'KUA Kecamatan Bajeng',
    alamatKua: 'Jl. Poros Limbung No. 12, Limbung, Bajeng, Kab. Gowa',
    teleponKua: '(0411) 861204',
    emailKua: 'kua.bajeng@kemenag.go.id'
  },
  'Bajeng Barat': {
    kecamatan: 'Bajeng Barat',
    nama: 'MUHAMMAD ARSYAD, S.Ag',
    nip: '197405102002121003',
    pangkatGol: 'Penata Tk. I / IIId',
    jabatan: 'Penghulu Muda / Kepala KUA',
    kuaName: 'KUA Kecamatan Bajeng Barat',
    alamatKua: 'Jl. Poros Gentungang, Bajeng Barat, Kab. Gowa',
    teleponKua: '0812-4211-9081',
    emailKua: 'kua.bajengbarat@kemenag.go.id'
  },
  'Barombong': {
    kecamatan: 'Barombong',
    nama: 'H. MUSTAPA KAMAL, S.Ag. M.Pd.I',
    nip: '197304192000031003',
    pangkatGol: 'Pembina / IVa',
    jabatan: 'Penghulu Madya / Kepala KUA',
    kuaName: 'KUA Kecamatan Barombong',
    alamatKua: 'Jl. Poros Kanjilo, Barombong, Kab. Gowa',
    teleponKua: '0813-4219-5561',
    emailKua: 'kua.barombong@kemenag.go.id'
  },
  'Bontomarannu': {
    kecamatan: 'Bontomarannu',
    nama: 'Drs. H. SUARDI, M.Ag',
    nip: '196908121998031005',
    pangkatGol: 'Pembina Tk. I / IVb',
    jabatan: 'Penghulu Madya / Kepala KUA',
    kuaName: 'KUA Kecamatan Bontomarannu',
    alamatKua: 'Jl. Poros Malino Km. 16, Borongloe, Bontomarannu, Kab. Gowa',
    teleponKua: '0852-5566-7788',
    emailKua: 'kua.bontomarannu@kemenag.go.id'
  },
  'Pattallassang': {
    kecamatan: 'Pattallassang',
    nama: 'H. ABDULLAH, S.Ag. M.Si',
    nip: '197109202001121002',
    pangkatGol: 'Pembina / IVa',
    jabatan: 'Penghulu Madya / Kepala KUA',
    kuaName: 'KUA Kecamatan Pattallassang',
    alamatKua: 'Jl. Poros Pattallassang, Kab. Gowa',
    teleponKua: '0813-5599-4433',
    emailKua: 'kua.pattallassang@kemenag.go.id'
  },
  'Tinggimoncong': {
    kecamatan: 'Tinggimoncong',
    nama: 'H. MUH. AMIN, S.Ag',
    nip: '197003051996031001',
    pangkatGol: 'Pembina / IVa',
    jabatan: 'Penghulu Madya / Kepala KUA',
    kuaName: 'KUA Kecamatan Tinggimoncong',
    alamatKua: 'Jl. Sultan Hasanuddin No. 10 Malino, Tinggimoncong, Kab. Gowa',
    teleponKua: '(0417) 21045',
    emailKua: 'kua.tinggimoncong@kemenag.go.id'
  },
  'Tombolopao': {
    kecamatan: 'Tombolopao',
    nama: 'H. SYAHRUL, S.Ag',
    nip: '197508152003121004',
    pangkatGol: 'Penata Tk. I / IIId',
    jabatan: 'Penghulu Muda / Kepala KUA',
    kuaName: 'KUA Kecamatan Tombolopao',
    alamatKua: 'Jl. Poros Erelembang, Tombolopao, Kab. Gowa',
    teleponKua: '0852-4411-2233',
    emailKua: 'kua.tombolopao@kemenag.go.id'
  },
  'Parangloe': {
    kecamatan: 'Parangloe',
    nama: 'Drs. MUHAMMAD RASYID',
    nip: '196712011993031002',
    pangkatGol: 'Pembina / IVa',
    jabatan: 'Penghulu Madya / Kepala KUA',
    kuaName: 'KUA Kecamatan Parangloe',
    alamatKua: 'Jl. Poros Malino Km. 42 Lanna, Parangloe, Kab. Gowa',
    teleponKua: '0812-4100-3322',
    emailKua: 'kua.parangloe@kemenag.go.id'
  },
  'Manuju': {
    kecamatan: 'Manuju',
    nama: 'MUHAMMAD YUSUF, S.Ag',
    nip: '197602142005011006',
    pangkatGol: 'Penata Tk. I / IIId',
    jabatan: 'Penghulu Muda / Kepala KUA',
    kuaName: 'KUA Kecamatan Manuju',
    alamatKua: 'Jl. Poros Moncongloe, Manuju, Kab. Gowa',
    teleponKua: '0853-9988-1122',
    emailKua: 'kua.manuju@kemenag.go.id'
  },
  'Bontonompo': {
    kecamatan: 'Bontonompo',
    nama: 'H. MAS\'UD, S.Ag. M.Pd.I',
    nip: '197105021998031004',
    pangkatGol: 'Pembina / IVa',
    jabatan: 'Penghulu Madya / Kepala KUA',
    kuaName: 'KUA Kecamatan Bontonompo',
    alamatKua: 'Jl. Poros Takalar No. 88, Bontonompo, Kab. Gowa',
    teleponKua: '(0418) 321456',
    emailKua: 'kua.bontonompo@kemenag.go.id'
  },
  'Bontonompo Selatan': {
    kecamatan: 'Bontonompo Selatan',
    nama: 'Drs. H. HAMZAH',
    nip: '196806141995031003',
    pangkatGol: 'Pembina / IVa',
    jabatan: 'Penghulu Madya / Kepala KUA',
    kuaName: 'KUA Kecamatan Bontonompo Selatan',
    alamatKua: 'Jl. Poros Sengka, Bontonompo Selatan, Kab. Gowa',
    teleponKua: '0813-5488-9900',
    emailKua: 'kua.bonsel@kemenag.go.id'
  },
  'Bungaya': {
    kecamatan: 'Bungaya',
    nama: 'MANSYUR, S.Ag',
    nip: '197407112003121002',
    pangkatGol: 'Penata Tk. I / IIId',
    jabatan: 'Penghulu Muda / Kepala KUA',
    kuaName: 'KUA Kecamatan Bungaya',
    alamatKua: 'Jl. Poros Sapaya, Bungaya, Kab. Gowa',
    teleponKua: '0852-9900-1144',
    emailKua: 'kua.bungaya@kemenag.go.id'
  },
  'Biringbulu': {
    kecamatan: 'Biringbulu',
    nama: 'H. KAMARUDDIN, S.Ag',
    nip: '197204182001121001',
    pangkatGol: 'Pembina / IVa',
    jabatan: 'Penghulu Madya / Kepala KUA',
    kuaName: 'KUA Kecamatan Biringbulu',
    alamatKua: 'Jl. Poros Tonrorita, Biringbulu, Kab. Gowa',
    teleponKua: '0812-4299-8877',
    emailKua: 'kua.biringbulu@kemenag.go.id'
  },
  'Bontolempangan': {
    kecamatan: 'Bontolempangan',
    nama: 'H. JAMALUDDIN, S.Ag',
    nip: '197308222002121003',
    pangkatGol: 'Penata Tk. I / IIId',
    jabatan: 'Penghulu Muda / Kepala KUA',
    kuaName: 'KUA Kecamatan Bontolempangan',
    alamatKua: 'Jl. Poros Bontolempangan, Kab. Gowa',
    teleponKua: '0853-4122-3344',
    emailKua: 'kua.bontolempangan@kemenag.go.id'
  },
  'Tompobulu': {
    kecamatan: 'Tompobulu',
    nama: 'H. SYARIFUDDIN, S.Ag',
    nip: '197101151999031002',
    pangkatGol: 'Pembina / IVa',
    jabatan: 'Penghulu Madya / Kepala KUA',
    kuaName: 'KUA Kecamatan Tompobulu',
    alamatKua: 'Jl. Poros Malakaji, Tompobulu, Kab. Gowa',
    teleponKua: '0813-4355-6677',
    emailKua: 'kua.tompobulu@kemenag.go.id'
  },
  'Parigi': {
    kecamatan: 'Parigi',
    nama: 'Drs. H. ALIMUDDIN',
    nip: '196905101996031003',
    pangkatGol: 'Pembina / IVa',
    jabatan: 'Penghulu Madya / Kepala KUA',
    kuaName: 'KUA Kecamatan Parigi',
    alamatKua: 'Jl. Poros Majannang, Parigi, Kab. Gowa',
    teleponKua: '0852-5677-8899',
    emailKua: 'kua.parigi@kemenag.go.id'
  }
};

export function getKepalaKUA(kecamatan: KecamatanGowa): KepalaKUAProfile {
  return KUA_DATABASE[kecamatan] || KUA_DATABASE['Somba Opu'];
}

// Pre-registered list of Penyuluh representing Ahli Pertama, Ahli Muda, and Ahli Madya across various kecamatan
export const DEFAULT_PENYULUH_LIST: PenyuluhProfile[] = [
  // 1. Dr. Hj. Masniati (Ahli Muda - Somba Opu)
  {
    id: 'p-01',
    nama: 'Dr. Hj. MASNIATI, S.Ag. M.Pd.I',
    nip: '197104172009012001',
    nipa: '1730613110001',
    pangkatGol: 'Penata Tk. I / IIId',
    tmt: '01-10-2018',
    jabatan: 'Penyuluh Agama Islam Ahli Muda',
    kecamatan: 'Somba Opu',
    wilTugas: 'KUA Kec. Somba Opu',
    unitKerja: 'Kementerian Agama Kabupaten Gowa',
    tempatTanggalLahir: 'Bone, 17 April 1971',
    pendidikanTerakhir: 'S3 / Doktor',
    phone: '0852-5343-2604',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  },
  // 2. Muh. Ridwan (Ahli Pertama - Pallangga)
  {
    id: 'p-02',
    nama: 'MUH. RIDWAN, S.Th.I',
    nip: '199208152020121008',
    nipa: '1730613110012',
    pangkatGol: 'Penata Muda Tk. I / IIIb',
    tmt: '01-04-2022',
    jabatan: 'Penyuluh Agama Islam Ahli Pertama',
    kecamatan: 'Pallangga',
    wilTugas: 'KUA Kec. Pallangga',
    unitKerja: 'Kementerian Agama Kabupaten Gowa',
    tempatTanggalLahir: 'Gowa, 15 Agustus 1992',
    pendidikanTerakhir: 'S1 / Sarjana Agama',
    phone: '0813-4122-3344',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  // 3. Dra. Hj. Maryam (Ahli Madya - Bontonompo)
  {
    id: 'p-03',
    nama: 'Dra. Hj. MARYAM, M.Si',
    nip: '196603121992032001',
    nipa: '1730613110005',
    pangkatGol: 'Pembina Utama Muda / IVc',
    tmt: '01-04-2020',
    jabatan: 'Penyuluh Agama Islam Ahli Madya',
    kecamatan: 'Bontonompo',
    wilTugas: 'KUA Kec. Bontonompo',
    unitKerja: 'Kementerian Agama Kabupaten Gowa',
    tempatTanggalLahir: 'Gowa, 12 Maret 1966',
    pendidikanTerakhir: 'S2 / Magister Sains',
    phone: '0812-4455-6677',
    fotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  },
  // 4. Nurul Hidayah (Ahli Pertama - Tinggimoncong)
  {
    id: 'p-04',
    nama: 'NURUL HIDAYAH, S.Ag',
    nip: '199505202023212015',
    nipa: '1730613110025',
    pangkatGol: 'Penata Muda / IIIa',
    tmt: '01-03-2023',
    jabatan: 'Penyuluh Agama Islam Ahli Pertama',
    kecamatan: 'Tinggimoncong',
    wilTugas: 'KUA Kec. Tinggimoncong',
    unitKerja: 'Kementerian Agama Kabupaten Gowa',
    tempatTanggalLahir: 'Malino, 20 Mei 1995',
    pendidikanTerakhir: 'S1 / Sarjana Agama',
    phone: '0852-9988-7711',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  // 5. H. Abd. Rahman (Ahli Madya - Somba Opu)
  {
    id: 'p-05',
    nama: 'H. ABD. RAHMAN, S.Ag. M.Pd',
    nip: '196811201994031003',
    nipa: '1730613110002',
    pangkatGol: 'Pembina Tk. I / IVb',
    tmt: '01-10-2019',
    jabatan: 'Penyuluh Agama Islam Ahli Madya',
    kecamatan: 'Somba Opu',
    wilTugas: 'KUA Kec. Somba Opu',
    unitKerja: 'Kementerian Agama Kabupaten Gowa',
    tempatTanggalLahir: 'Gowa, 20 November 1968',
    pendidikanTerakhir: 'S2 / Magister Pendidikan',
    phone: '0813-5566-7788',
    fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
  },
  // 6. Ahmad Fauzi (Ahli Pertama - Bajeng)
  {
    id: 'p-06',
    nama: 'AHMAD FAUZI, S.Sos',
    nip: '199310102022031002',
    nipa: '1730613110030',
    pangkatGol: 'Penata Muda / IIIa',
    tmt: '01-04-2022',
    jabatan: 'Penyuluh Agama Islam Ahli Pertama',
    kecamatan: 'Bajeng',
    wilTugas: 'KUA Kec. Bajeng',
    unitKerja: 'Kementerian Agama Kabupaten Gowa',
    tempatTanggalLahir: 'Limbung, 10 Oktober 1993',
    pendidikanTerakhir: 'S1 / Sarjana Sosial',
    phone: '0821-9900-1122',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
  // 7. Fatmawati (Ahli Muda - Bontomarannu)
  {
    id: 'p-07',
    nama: 'FATMAWATI, S.Ag. M.Ag',
    nip: '197607142007012014',
    nipa: '1730613110018',
    pangkatGol: 'Penata Tk. I / IIId',
    tmt: '01-10-2021',
    jabatan: 'Penyuluh Agama Islam Ahli Muda',
    kecamatan: 'Bontomarannu',
    wilTugas: 'KUA Kec. Bontomarannu',
    unitKerja: 'Kementerian Agama Kabupaten Gowa',
    tempatTanggalLahir: 'Gowa, 14 Juli 1976',
    pendidikanTerakhir: 'S2 / Magister Agama',
    phone: '0852-4411-9988',
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  },
  // 8. Drs. H. Muh. Syahrir (Ahli Muda - Barombong)
  {
    id: 'p-08',
    nama: 'Drs. H. MUH. SYAHRIR, M.Pd.I',
    nip: '197009182005011005',
    nipa: '1730613110022',
    pangkatGol: 'Penata / IIIc',
    tmt: '01-04-2020',
    jabatan: 'Penyuluh Agama Islam Ahli Muda',
    kecamatan: 'Barombong',
    wilTugas: 'KUA Kec. Barombong',
    unitKerja: 'Kementerian Agama Kabupaten Gowa',
    tempatTanggalLahir: 'Gowa, 18 September 1970',
    pendidikanTerakhir: 'S2 / Magister Pendidikan Islam',
    phone: '0812-4255-6677',
    fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  }
];

// Helper to create a custom new profile on the fly
export function createNewPenyuluh(
  nama: string,
  nip: string,
  jabatan: JenjangJabatan,
  kecamatan: KecamatanGowa,
  pangkatGol?: string,
  phone?: string
): PenyuluhProfile {
  const jenjangMeta = JENJANG_JABATAN_LIST.find(j => j.id === jabatan);
  return {
    id: `penyuluh-${Date.now()}`,
    nama: nama.trim().toUpperCase(),
    nip: nip.trim(),
    nipa: `173061311${Math.floor(1000 + Math.random() * 9000)}`,
    pangkatGol: pangkatGol || jenjangMeta?.golonganDefault || 'Penata Muda / IIIa',
    tmt: '01-04-2023',
    jabatan,
    kecamatan,
    wilTugas: `KUA Kec. ${kecamatan}`,
    unitKerja: 'Kementerian Agama Kabupaten Gowa',
    tempatTanggalLahir: `Kab. Gowa, 01 Januari 1985`,
    pendidikanTerakhir: jabatan === 'Penyuluh Agama Islam Ahli Madya' ? 'S2' : 'S1',
    phone: phone || '0812-3456-7890',
  };
}
