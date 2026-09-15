import React, { useState } from 'react';
import { 
  X, 
  User, 
  Shield, 
  Building2, 
  Check, 
  MapPin, 
  Award, 
  Briefcase, 
  UserCheck, 
  CheckCircle2, 
  PlusCircle, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  UserRole, 
  KecamatanGowa, 
  JenjangJabatan, 
  PenyuluhProfile, 
  KepalaKUAProfile 
} from '../types';
import { 
  KECAMATAN_GOWA_LIST, 
  JENJANG_JABATAN_LIST, 
  DEFAULT_PENYULUH_LIST, 
  getKepalaKUA,
  KUA_DATABASE,
  createNewPenyuluh 
} from '../data/gowaData';

interface ProfileRoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activePenyuluh: PenyuluhProfile;
  onSelectPenyuluh: (penyuluh: PenyuluhProfile) => void;
  activeKecamatan: KecamatanGowa;
  onSelectKecamatan: (kec: KecamatanGowa) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ProfileRoleSelectorModal: React.FC<ProfileRoleSelectorModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onRoleChange,
  activePenyuluh,
  onSelectPenyuluh,
  activeKecamatan,
  onSelectKecamatan,
  showToast
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [selectedKec, setSelectedKec] = useState<KecamatanGowa>(activeKecamatan);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Custom penyuluh input form
  const [customNama, setCustomNama] = useState<string>('');
  const [customNip, setCustomNip] = useState<string>('');
  const [customJabatan, setCustomJabatan] = useState<JenjangJabatan>('Penyuluh Agama Islam Ahli Pertama');
  const [customKecamatan, setCustomKecamatan] = useState<KecamatanGowa>('Pallangga');
  const [customGolongan, setCustomGolongan] = useState<string>('Penata Muda / IIIa');
  const [customPhone, setCustomPhone] = useState<string>('0812-');

  if (!isOpen) return null;

  const handleApplyRole = () => {
    onRoleChange(selectedRole);
    onSelectKecamatan(selectedKec);

    if (selectedRole === 'admin') {
      const kua = getKepalaKUA(selectedKec);
      showToast(`Aktif sebagai Admin: Kepala ${kua.kuaName} (${kua.nama})`, 'success');
    } else if (selectedRole === 'kemenag_kabupaten') {
      showToast('Aktif sebagai Administrator Kemenag Kabupaten Gowa (Monitoring 18 Kecamatan)', 'success');
    } else {
      showToast(`Aktif sebagai Penyuluh: ${activePenyuluh.nama} (${activePenyuluh.jabatan})`, 'success');
    }
    onClose();
  };

  const handleSelectPredefinedPenyuluh = (p: PenyuluhProfile) => {
    onSelectPenyuluh(p);
    setSelectedKec(p.kecamatan);
    showToast(`Beralih ke profil: ${p.nama} (${p.jabatan})`, 'info');
  };

  const handleCreateCustomProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNama.trim() || !customNip.trim()) {
      showToast('Mohon lengkapi Nama dan NIP Penyuluh', 'warning');
      return;
    }

    const newP = createNewPenyuluh(
      customNama,
      customNip,
      customJabatan,
      customKecamatan,
      customGolongan,
      customPhone
    );

    onSelectPenyuluh(newP);
    setSelectedKec(customKecamatan);
    setIsCustomMode(false);
    showToast(`Profil Penyuluh ${newP.nama} berhasil dibuat & diaktifkan!`, 'success');
  };

  const currentKepalaKua = getKepalaKUA(selectedKec);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Ganti Pengguna &amp; Wilayah Tugas</h2>
              <p className="text-xs text-emerald-200/80">
                Mendukung 18 KUA Kecamatan &amp; 3 Jenjang Jabatan se-Kabupaten Gowa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Step 1: Pilih Peran */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              1. Pilih Hak Akses / Peran Anda
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Role: Penyuluh */}
              <button
                type="button"
                onClick={() => setSelectedRole('penyuluh')}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  selectedRole === 'penyuluh'
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                {selectedRole === 'penyuluh' && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-3" />
                  </span>
                )}
                <div className="flex items-center gap-2 mb-1.5">
                  <User className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-sm text-slate-900">Penyuluh Agama</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  Membuat laporan lapangan, upload foto GPS, dan cetak dokumen resmi Kemenag.
                </p>
                <div className="mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md inline-block">
                  Ahli Pertama, Muda, Madya
                </div>
              </button>

              {/* Role: Admin Kepala KUA */}
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  selectedRole === 'admin'
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                {selectedRole === 'admin' && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-3" />
                  </span>
                )}
                <div className="flex items-center gap-2 mb-1.5">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-sm text-slate-900">Kepala KUA (Admin)</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  Verifikator resmi laporan kegiatan di kecamatan masing-masing.
                </p>
                <div className="mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md inline-block">
                  Admin 18 Kecamatan Gowa
                </div>
              </button>

              {/* Role: Kemenag Kab. Gowa */}
              <button
                type="button"
                onClick={() => setSelectedRole('kemenag_kabupaten')}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  selectedRole === 'kemenag_kabupaten'
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                {selectedRole === 'kemenag_kabupaten' && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-3" />
                  </span>
                )}
                <div className="flex items-center gap-2 mb-1.5">
                  <Shield className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-sm text-slate-900">Kemenag Kab. Gowa</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  Super Admin pemantauan rekapitulasi kinerja seluruh KUA se-Kabupaten.
                </p>
                <div className="mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md inline-block">
                  Monitoring Kabupaten
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Konfigurasi berdasarkan Peran */}

          {/* KONDISI A: JIKA MEMILIH KEPALA KUA (ADMIN KECAMATAN) */}
          {selectedRole === 'admin' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Pilih Kantor Urusan Agama (KUA) Kecamatan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Setiap Kepala KUA bertindak sebagai Admin dan Verifikator di wilayahnya
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  18 Kecamatan Tersedia
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Kecamatan di Kabupaten Gowa:
                </label>
                <select
                  value={selectedKec}
                  onChange={(e) => setSelectedKec(e.target.value as KecamatanGowa)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {KECAMATAN_GOWA_LIST.map((kec) => (
                    <option key={kec} value={kec}>
                      KUA Kecamatan {kec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Info Box Kepala KUA Terpilih */}
              <div className="p-4 bg-white rounded-lg border border-emerald-200 shadow-2xs space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                    {currentKepalaKua.nama.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{currentKepalaKua.nama}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                        Admin Resmi
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      NIP: {currentKepalaKua.nip} &bull; {currentKepalaKua.pangkatGol}
                    </p>
                    <p className="text-xs font-semibold text-emerald-800">
                      {currentKepalaKua.jabatan} - {currentKepalaKua.kuaName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      📍 {currentKepalaKua.alamatKua} &bull; 📞 {currentKepalaKua.teleponKua}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* KONDISI B: JIKA MEMILIH PENYULUH AGAMA */}
          {selectedRole === 'penyuluh' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Pilih Profil Penyuluh atau Buat Profil Anda Sendiri
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tersedia jenjang Ahli Pertama, Ahli Muda, dan Ahli Madya
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  {isCustomMode ? 'Pilih dari Daftar' : '+ Buat Profil Baru'}
                </button>
              </div>

              {/* Form Buat Profil Baru jika isCustomMode */}
              {isCustomMode ? (
                <form onSubmit={handleCreateCustomProfile} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                    Form Data Penyuluh Agama Baru
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Nama Lengkap &amp; Gelar:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: AHMAD FAUZI, S.Ag"
                        value={customNama}
                        onChange={(e) => setCustomNama(e.target.value)}
                        className="w-full p-2 text-xs rounded border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        NIP:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 198501012010011005"
                        value={customNip}
                        onChange={(e) => setCustomNip(e.target.value)}
                        className="w-full p-2 text-xs rounded border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Jenjang Jabatan:
                      </label>
                      <select
                        value={customJabatan}
                        onChange={(e) => {
                          const j = e.target.value as JenjangJabatan;
                          setCustomJabatan(j);
                          const meta = JENJANG_JABATAN_LIST.find(item => item.id === j);
                          if (meta) setCustomGolongan(meta.golonganDefault);
                        }}
                        className="w-full p-2 text-xs rounded border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      >
                        {JENJANG_JABATAN_LIST.map((j) => (
                          <option key={j.id} value={j.id}>
                            {j.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Kecamatan Tugas:
                      </label>
                      <select
                        value={customKecamatan}
                        onChange={(e) => setCustomKecamatan(e.target.value as KecamatanGowa)}
                        className="w-full p-2 text-xs rounded border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      >
                        {KECAMATAN_GOWA_LIST.map((kec) => (
                          <option key={kec} value={kec}>
                            Kecamatan {kec}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Pangkat / Golongan:
                      </label>
                      <input
                        type="text"
                        value={customGolongan}
                        onChange={(e) => setCustomGolongan(e.target.value)}
                        className="w-full p-2 text-xs rounded border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCustomMode(false)}
                      className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-200"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
                    >
                      Simpan &amp; Aktifkan Profil
                    </button>
                  </div>
                </form>
              ) : (
                /* Daftar Pilihan Profil Terdaftar */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {DEFAULT_PENYULUH_LIST.map((p) => {
                    const isSelected = activePenyuluh.id === p.id;
                    const jenjangMeta = JENJANG_JABATAN_LIST.find(j => j.id === p.jabatan);

                    return (
                      <div
                        key={p.id}
                        onClick={() => handleSelectPredefinedPenyuluh(p)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <img
                            src={p.fotoUrl}
                            alt={p.nama}
                            className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0 mt-0.5"
                          />
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                              {p.nama}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              NIP: {p.nip}
                            </p>
                            <div className="flex items-center gap-1.5 pt-0.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${jenjangMeta?.badgeClass || 'bg-slate-100 text-slate-700'}`}>
                                {jenjangMeta?.singkatan || p.jabatan}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                {p.wilTugas}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-3" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* KONDISI C: JIKA MEMILIH KEMENAG KABUPATEN GOWA */}
          {selectedRole === 'kemenag_kabupaten' && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Mode Pemantauan Terpusat Kabupaten Gowa</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Anda memiliki hak akses untuk memantau performa dan rekapitulasi laporan kegiatan penyuluh dari seluruh <strong>18 Kecamatan</strong> di Kabupaten Gowa (Biringbulu s.d. Somba Opu) serta seluruh jenjang jabatan (Ahli Pertama, Ahli Muda, dan Ahli Madya).
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 hidden sm:block">
            Status: <span className="font-semibold text-slate-700">{selectedRole.toUpperCase()}</span> &bull; Wilayah:{' '}
            <span className="font-semibold text-slate-700">Kec. {selectedKec}</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleApplyRole}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>Terapkan Pilihan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
