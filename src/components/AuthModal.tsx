import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Building2, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Award, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Eye,
  EyeOff,
  Users,
  Sparkles
} from 'lucide-react';
import { 
  UserProfile, 
  RegisterPenyuluhData, 
  RegisterKepalaKUAData, 
  KecamatanGowa, 
  JenjangJabatan 
} from '../types';
import { 
  KECAMATAN_GOWA_LIST, 
  JENJANG_JABATAN_LIST, 
  GOLONGAN_OPTIONS,
  getKepalaKUA 
} from '../data/gowaData';
import { 
  registerPenyuluhAccount, 
  registerKepalaKUAAccount, 
  loginWithEmailAndPassword, 
  loginWithGoogle, 
  logoutUser, 
  getRegisteredUsers, 
  switchActiveUser,
  SEED_USERS
} from '../services/authService';
import { LogoKemenag, LogoIpari } from './Logos';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUserChange: (user: UserProfile | null) => void;
  showToast: (msg: string, type: 'success' | 'warning' | 'info') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'accounts'>('login');
  const [registerRole, setRegisterRole] = useState<'penyuluh' | 'admin'>('penyuluh');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Penyuluh Registration State
  const [paiNama, setPaiNama] = useState('');
  const [paiNip, setPaiNip] = useState('');
  const [paiNipa, setPaiNipa] = useState('');
  const [paiJenjang, setPaiJenjang] = useState<JenjangJabatan>('Penyuluh Agama Islam Ahli Muda');
  const [paiPangkat, setPaiPangkat] = useState('Penata / IIIc');
  const [paiKecamatan, setPaiKecamatan] = useState<KecamatanGowa>('Somba Opu');
  const [paiWilTugas, setPaiWilTugas] = useState('KUA Kec. Somba Opu');
  const [paiPhone, setPaiPhone] = useState('');
  const [paiEmail, setPaiEmail] = useState('');
  const [paiPassword, setPaiPassword] = useState('');
  const [paiConfirmPassword, setPaiConfirmPassword] = useState('');

  // Kepala KUA Registration State
  const [kuaNama, setKuaNama] = useState('');
  const [kuaNip, setKuaNip] = useState('');
  const [kuaJabatan, setKuaJabatan] = useState('Penghulu Madya / Kepala KUA');
  const [kuaPangkat, setKuaPangkat] = useState('Pembina / IVa');
  const [kuaKecamatan, setKuaKecamatan] = useState<KecamatanGowa>('Somba Opu');
  const [kuaNamaKantor, setKuaNamaKantor] = useState('KUA Kecamatan Somba Opu');
  const [kuaAlamat, setKuaAlamat] = useState('Jl. Masjid Raya No. 24 Sungguminasa');
  const [kuaTelepon, setKuaTelepon] = useState('(0411) 865195');
  const [kuaEmail, setKuaEmail] = useState('');
  const [kuaPassword, setKuaPassword] = useState('');
  const [kuaConfirmPassword, setKuaConfirmPassword] = useState('');

  if (!isOpen) return null;

  const registeredUsers = getRegisteredUsers();

  // Handle auto-fill KUA details when kecamatan changes
  const handleKuaKecamatanChange = (kec: KecamatanGowa) => {
    setKuaKecamatan(kec);
    const def = getKepalaKUA(kec);
    setKuaNamaKantor(def.kuaName);
    setKuaAlamat(def.alamatKua);
    setKuaTelepon(def.teleponKua);
    if (!kuaEmail) {
      setKuaEmail(def.emailKua);
    }
  };

  // Handle Penyuluh Kecamatan change
  const handlePaiKecamatanChange = (kec: KecamatanGowa) => {
    setPaiKecamatan(kec);
    setPaiWilTugas(`KUA Kec. ${kec}`);
  };

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!loginEmail || !loginPassword) {
      setErrorMessage('Harap isi alamat email dan kata sandi.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginWithEmailAndPassword(loginEmail, loginPassword);
      onUserChange(res.user);
      showToast(res.message, 'success');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const res = await loginWithGoogle();
      onUserChange(res.user);
      showToast(res.message, 'success');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk dengan Google.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Quick Login with registered/demo account
  const handleQuickLogin = (user: UserProfile) => {
    switchActiveUser(user);
    onUserChange(user);
    showToast(`Berhasil masuk sebagai ${user.nama} (${user.role === 'admin' ? 'Kepala KUA' : 'Penyuluh PAI'})`, 'success');
    onClose();
  };

  // Handle Penyuluh Registration submission
  const handleRegisterPai = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!paiNama.trim()) {
      setErrorMessage('Nama lengkap dan gelar wajib diisi.');
      return;
    }
    if (!paiNip.trim()) {
      setErrorMessage('NIP / NIK wajib diisi.');
      return;
    }
    if (!paiEmail.trim() || !paiEmail.includes('@')) {
      setErrorMessage('Alamat email tidak valid.');
      return;
    }
    if (paiPassword.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }
    if (paiPassword !== paiConfirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: RegisterPenyuluhData = {
        nama: paiNama.trim(),
        nip: paiNip.trim(),
        nipa: paiNipa.trim(),
        jabatan: paiJenjang,
        pangkatGol: paiPangkat,
        kecamatan: paiKecamatan,
        wilTugas: paiWilTugas.trim() || `KUA Kec. ${paiKecamatan}`,
        phone: paiPhone.trim(),
        email: paiEmail.trim().toLowerCase(),
        password: paiPassword,
      };

      const res = await registerPenyuluhAccount(payload);
      onUserChange(res.user);
      showToast(res.message, 'success');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mendaftarkan akun penyuluh.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Kepala KUA Registration submission
  const handleRegisterKua = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!kuaNama.trim()) {
      setErrorMessage('Nama Kepala KUA wajib diisi.');
      return;
    }
    if (!kuaNip.trim()) {
      setErrorMessage('NIP Kepala KUA wajib diisi.');
      return;
    }
    if (!kuaEmail.trim() || !kuaEmail.includes('@')) {
      setErrorMessage('Alamat email KUA tidak valid.');
      return;
    }
    if (kuaPassword.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }
    if (kuaPassword !== kuaConfirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: RegisterKepalaKUAData = {
        nama: kuaNama.trim(),
        nip: kuaNip.trim(),
        jabatan: kuaJabatan.trim() || 'Penghulu Madya / Kepala KUA',
        pangkatGol: kuaPangkat,
        kecamatan: kuaKecamatan,
        kuaName: kuaNamaKantor.trim() || `KUA Kecamatan ${kuaKecamatan}`,
        alamatKua: kuaAlamat.trim(),
        teleponKua: kuaTelepon.trim(),
        email: kuaEmail.trim().toLowerCase(),
        password: kuaPassword,
      };

      const res = await registerKepalaKUAAccount(payload);
      onUserChange(res.user);
      showToast(res.message, 'success');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mendaftarkan akun Kepala KUA.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      onUserChange(null);
      showToast('Sesi Anda telah berhasil keluar.', 'info');
      setActiveTab('login');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-4 sm:p-5 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-lg border border-white/20">
              <LogoKemenag size={28} />
              <LogoIpari size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight">
                  SIPAKAINGA &bull; Portal Akun
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 uppercase">
                  Auth Kemenag
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Pendaftaran &amp; Masuk Akun Penyuluh Agama Islam &amp; Kepala KUA se-Kabupaten Gowa
              </p>
            </div>
          </div>

          {/* Current User Session Bar if logged in */}
          {currentUser && (
            <div className="mt-3 bg-emerald-800/80 border border-emerald-600/60 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-emerald-600 border border-white/40 flex items-center justify-center text-white font-bold shrink-0">
                  {currentUser.role === 'admin' ? <Building2 className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white truncate flex items-center gap-1.5">
                    <span>{currentUser.nama}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-400 text-emerald-950 font-extrabold uppercase">
                      {currentUser.role === 'admin' ? 'Kepala KUA' : 'Penyuluh PAI'}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-200 truncate">
                    NIP: {currentUser.nip} &bull; KUA Kec. {currentUser.kecamatan}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 shadow-xs transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mt-4 bg-emerald-950/70 p-1 rounded-xl border border-emerald-800/80">
            <button
              onClick={() => { setActiveTab('login'); setErrorMessage(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'login'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Akun</span>
            </button>
            <button
              onClick={() => { setActiveTab('register'); setErrorMessage(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'register'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar Akun Baru</span>
            </button>
            <button
              onClick={() => { setActiveTab('accounts'); setErrorMessage(null); }}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'accounts'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Daftar Akun</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-800 text-[10px]">
                {registeredUsers.length}
              </span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Error Alert Box */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
              <button 
                onClick={() => setErrorMessage(null)} 
                className="text-rose-500 hover:text-rose-700 text-xs font-bold ml-1"
              >
                &times;
              </button>
            </div>
          )}

          {/* ================= TAB 1: LOGIN ================= */}
          {activeTab === 'login' && (
            <div className="space-y-5">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Email Kemenag / Pribadi <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="contoh: masniati@kemenag.go.id atau email@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Masukkan kata sandi Anda"
                      className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-emerald-700 hover:text-emerald-900 font-semibold underline underline-offset-2"
                  >
                    Belum punya akun? Daftar sekarang
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  <span>Masuk ke Akun Resmi</span>
                </button>
              </form>

              {/* Google One-Click Login */}
              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-[11px] text-slate-400 font-semibold uppercase">
                  Atau Opsi Lainnya
                </span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2.5 transition-colors shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Masuk Cepat dengan Akun Google</span>
              </button>

              {/* Quick Profile Selector for Seamless Demo & Testing */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Pilihan Akun Uji Coba Cepat (1-Klik):
                  </span>
                  <span className="text-[10px] text-slate-500">Tanpa ketik password</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SEED_USERS.slice(0, 4).map((u) => (
                    <button
                      key={u.uid}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className="p-2 text-left rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center gap-2 group"
                    >
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {u.role === 'admin' ? <Building2 className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 truncate">
                          {u.nama}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {u.role === 'admin' ? `Kepala KUA Kec. ${u.kecamatan}` : `PAI Kec. ${u.kecamatan}`}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: REGISTER ================= */}
          {activeTab === 'register' && (
            <div className="space-y-5">
              {/* Role Picker for Registration */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Pilih Jenis Akun yang Ingin Didaftarkan:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => { setRegisterRole('penyuluh'); setErrorMessage(null); }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      registerRole === 'penyuluh'
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${registerRole === 'penyuluh' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Penyuluh Agama Islam (PAI)</h4>
                      <p className="text-[10px] text-slate-500 leading-snug mt-0.5">
                        Pelapor kegiatan bimbingan, penyuluhan, konseling &amp; model
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRegisterRole('admin'); setErrorMessage(null); }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      registerRole === 'admin'
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${registerRole === 'admin' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Kepala KUA Kecamatan</h4>
                      <p className="text-[10px] text-slate-500 leading-snug mt-0.5">
                        Admin verifikator resmi laporan kegiatan wilayah KUA
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* FORM PENDAFTARAN PENYULUH */}
              {registerRole === 'penyuluh' && (
                <form onSubmit={handleRegisterPai} className="space-y-4">
                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Formulir Pendaftaran Akun Fungsional Penyuluh Agama Islam (18 Kecamatan Gowa)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nama Lengkap Beserta Gelar <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={paiNama}
                        onChange={(e) => setPaiNama(e.target.value)}
                        placeholder="contoh: Muhammad Yusuf, S.Ag, M.Pd"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        NIP / NIK Pegawai <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={paiNip}
                        onChange={(e) => setPaiNip(e.target.value)}
                        placeholder="198505142010011002"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Jenjang Jabatan Fungsional <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={paiJenjang}
                        onChange={(e) => setPaiJenjang(e.target.value as JenjangJabatan)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 bg-white"
                      >
                        {JENJANG_JABATAN_LIST.map((j) => (
                          <option key={j.id} value={j.id}>
                            {j.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pangkat &amp; Golongan Ruang <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={paiPangkat}
                        onChange={(e) => setPaiPangkat(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 bg-white"
                      >
                        {GOLONGAN_OPTIONS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        KUA Kecamatan Penugasan <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={paiKecamatan}
                        onChange={(e) => handlePaiKecamatanChange(e.target.value as KecamatanGowa)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 bg-white"
                      >
                        {KECAMATAN_GOWA_LIST.map((kec) => (
                          <option key={kec} value={kec}>
                            Kecamatan {kec}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Wilayah Binaan / Desa / Kelurahan
                      </label>
                      <input
                        type="text"
                        value={paiWilTugas}
                        onChange={(e) => setPaiWilTugas(e.target.value)}
                        placeholder="contoh: Kel. Sungguminasa & Tombolo"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nomor Handphone / WhatsApp <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={paiPhone}
                        onChange={(e) => setPaiPhone(e.target.value)}
                        placeholder="0812-3456-7890"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        NIPA (Nomor Induk Penyuluh Agama)
                      </label>
                      <input
                        type="text"
                        value={paiNipa}
                        onChange={(e) => setPaiNipa(e.target.value)}
                        placeholder="1730613110001 (opsional)"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Alamat Email untuk Login <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={paiEmail}
                        onChange={(e) => setPaiEmail(e.target.value)}
                        placeholder="penyuluh@kemenag.go.id atau email@gmail.com"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Kata Sandi Akun <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={paiPassword}
                        onChange={(e) => setPaiPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Konfirmasi Kata Sandi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={paiConfirmPassword}
                        onChange={(e) => setPaiConfirmPassword(e.target.value)}
                        placeholder="Ulangi kata sandi"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      {isLoading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                      <span>Daftarkan Akun Penyuluh Agama Islam</span>
                    </button>
                  </div>
                </form>
              )}

              {/* FORM PENDAFTARAN KEPALA KUA */}
              {registerRole === 'admin' && (
                <form onSubmit={handleRegisterKua} className="space-y-4">
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Formulir Pendaftaran Akun Kepala KUA (Admin Verifikator 18 Wilayah Kecamatan)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nama Kepala KUA Beserta Gelar <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={kuaNama}
                        onChange={(e) => setKuaNama(e.target.value)}
                        placeholder="contoh: H. Syamsuddin, S.Ag, M.H"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        NIP Kepala KUA <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={kuaNip}
                        onChange={(e) => setKuaNip(e.target.value)}
                        placeholder="197304152003121002"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Wilayah KUA Kecamatan <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={kuaKecamatan}
                        onChange={(e) => handleKuaKecamatanChange(e.target.value as KecamatanGowa)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 bg-white"
                      >
                        {KECAMATAN_GOWA_LIST.map((kec) => (
                          <option key={kec} value={kec}>
                            KUA Kecamatan {kec}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pangkat &amp; Golongan Ruang
                      </label>
                      <select
                        value={kuaPangkat}
                        onChange={(e) => setKuaPangkat(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 bg-white"
                      >
                        {GOLONGAN_OPTIONS.slice(2).map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Jabatan Resmi
                      </label>
                      <input
                        type="text"
                        value={kuaJabatan}
                        onChange={(e) => setKuaJabatan(e.target.value)}
                        placeholder="Penghulu Madya / Kepala KUA"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        No. Telepon / Kontak Kantor KUA
                      </label>
                      <input
                        type="text"
                        value={kuaTelepon}
                        onChange={(e) => setKuaTelepon(e.target.value)}
                        placeholder="(0411) 865195 atau 0812-xxxx"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Alamat Kantor KUA
                      </label>
                      <input
                        type="text"
                        value={kuaAlamat}
                        onChange={(e) => setKuaAlamat(e.target.value)}
                        placeholder="Jl. Poros Kantor Camat..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Alamat Email Akun KUA untuk Login <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={kuaEmail}
                        onChange={(e) => setKuaEmail(e.target.value)}
                        placeholder="kua.nama@kemenag.go.id"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Kata Sandi Akun <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={kuaPassword}
                        onChange={(e) => setKuaPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Konfirmasi Kata Sandi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={kuaConfirmPassword}
                        onChange={(e) => setKuaConfirmPassword(e.target.value)}
                        placeholder="Ulangi kata sandi"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      {isLoading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <Building2 className="w-4 h-4" />
                      )}
                      <span>Daftarkan Akun Kepala KUA (Admin Verifikator)</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ================= TAB 3: REGISTERED ACCOUNTS ================= */}
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Daftar Akun Terdaftar di Sistem SIPAKAINGA
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Pilih akun untuk beralih profil kerja atau verifikasi laporan secara instan
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {registeredUsers.length} Akun
                </span>
              </div>

              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {registeredUsers.map((user) => {
                  const isActive = currentUser?.uid === user.uid || currentUser?.email === user.email;
                  return (
                    <div
                      key={user.uid}
                      className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isActive
                          ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                          user.role === 'admin' ? 'bg-amber-600 text-white' : 'bg-emerald-800 text-white'
                        }`}>
                          {user.role === 'admin' ? <Building2 className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-slate-900">{user.nama}</span>
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                              user.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                            }`}>
                              {user.role === 'admin' ? 'Kepala KUA' : 'Penyuluh PAI'}
                            </span>
                            {isActive && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-700 text-white font-bold">
                                Sedang Aktif
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            KUA Kec. {user.kecamatan} &bull; NIP: {user.nip}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Email: {user.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 px-2 py-1 bg-emerald-100 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Aktif
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleQuickLogin(user)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Gunakan Akun</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Kemenag Kabupaten Gowa &bull; Database Cloud Firestore Terintegrasi</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
