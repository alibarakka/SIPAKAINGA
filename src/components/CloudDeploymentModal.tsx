import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  Database, 
  Github, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  Globe 
} from 'lucide-react';
import { firebaseConfig, databaseId } from '../lib/firebase';
import { syncWithFirebase } from '../utils/storage';
import { LaporanKegiatan, NotifikasiAdmin } from '../types';

interface CloudDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete: (laporan: LaporanKegiatan[], notifikasi: NotifikasiAdmin[]) => void;
  showToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
}

export const CloudDeploymentModal: React.FC<CloudDeploymentModalProps> = ({
  isOpen,
  onClose,
  onSyncComplete,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'firebase' | 'vercel' | 'github'>('vercel');
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedGit, setCopiedGit] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const vercelEnvText = `VITE_FIREBASE_API_KEY=${firebaseConfig.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain}
VITE_FIREBASE_PROJECT_ID=${firebaseConfig.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId}
VITE_FIREBASE_APP_ID=${firebaseConfig.appId}
VITE_FIREBASE_DATABASE_ID=${databaseId}`;

  const gitCommandsText = `# 1. Inisialisasi Git pada proyek
git init

# 2. Tambahkan semua file dan buat komit awal
git add .
git commit -m "feat: inisialisasi SIPAKAINGA v2.6 dengan Firebase Firestore"

# 3. Ubah nama branch menjadi main
git branch -M main

# 4. Hubungkan ke repositori GitHub Anda (ganti USERNAME dan REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# 5. Unggah ke GitHub
git push -u origin main`;

  const copyToClipboard = (text: string, type: 'env' | 'git') => {
    navigator.clipboard.writeText(text);
    if (type === 'env') {
      setCopiedEnv(true);
      showToast('Environment variables Vercel disalin ke papan klip!', 'success');
      setTimeout(() => setCopiedEnv(false), 3000);
    } else {
      setCopiedGit(true);
      showToast('Perintah Git disalin ke papan klip!', 'success');
      setTimeout(() => setCopiedGit(false), 3000);
    }
  };

  const handleManualFirebaseSync = async () => {
    setIsSyncing(true);
    setLastSyncResult(null);
    try {
      const res = await syncWithFirebase();
      if (res.success) {
        onSyncComplete(res.laporan, res.notifikasi);
        setLastSyncResult(`Berhasil disinkronkan: ${res.laporan.length} laporan di Firestore.`);
        showToast('Sinkronisasi Firebase Firestore berhasil diperbarui!', 'success');
      } else {
        setLastSyncResult(`Catatan: ${res.error || 'Menggunakan cache lokal'}`);
        showToast(res.error || 'Gagal tersambung ke Firebase', 'warning');
      }
    } catch (err: any) {
      setLastSyncResult(`Gagal: ${err.message}`);
      showToast('Terjadi kendala saat sinkronisasi Firebase', 'warning');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Cloud className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide">
                Integrasi Cloud & Deployment
              </h2>
              <p className="text-xs text-emerald-200/90 font-medium">
                Firebase Firestore &bull; GitHub Repository &bull; Vercel Online
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-3 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('vercel')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'vercel'
                ? 'border-emerald-600 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            1. Onlinekan di Vercel (vercel.app)
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'github'
                ? 'border-emerald-600 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Github className="w-4 h-4 text-slate-800" />
            2. Konfigurasi GitHub
          </button>
          <button
            onClick={() => setActiveTab('firebase')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'firebase'
                ? 'border-emerald-600 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-amber-500" />
            3. Status Database Firebase
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
          {/* TAB 1: VERCEL */}
          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                <Zap className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-emerald-950">
                    Kesiapan Deployment Vercel
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    Berkas <strong>vercel.json</strong> telah disematkan di proyek ini untuk menangani routing SPA (Single Page Application) dan caching aset statis Vite agar aplikasi tidak mengalami error 404 saat di-refresh pada domain <code>.vercel.app</code>.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <h5 className="font-bold text-slate-900 text-xs flex items-center justify-between">
                  <span>Langkah Onlinekan di Vercel:</span>
                  <a
                    href="https://vercel.com/new"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-bold text-xs"
                  >
                    Buka Vercel Dashboard <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </h5>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 leading-relaxed">
                  <li>
                    Login ke <strong>vercel.com</strong> lalu klik tombol <strong>"Add New..." &gt; "Project"</strong>.
                  </li>
                  <li>
                    Pilih dan impor repositori GitHub yang telah Anda buat dari langkah kedua.
                  </li>
                  <li>
                    Pada kolom <strong>"Environment Variables"</strong> di Vercel, salin konfigurasi Firebase di bawah ini agar database tetap tersambung di domain produksi.
                  </li>
                  <li>
                    Klik <strong>"Deploy"</strong>. Dalam 1-2 menit, aplikasi SIPAKAINGA akan live di alamat seperti <code>https://sipakainga.vercel.app</code>!
                  </li>
                </ol>
              </div>

              {/* Environment Variables Block */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">
                    Environment Variables untuk Vercel:
                  </span>
                  <button
                    onClick={() => copyToClipboard(vercelEnvText, 'env')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                  >
                    {copiedEnv ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" /> Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Salin Semua Nilai
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed select-all">
                  <pre>{vercelEnvText}</pre>
                </div>
                <p className="text-[11px] text-slate-500">
                  Tip: Di halaman Vercel Environment Variables, Anda cukup mem-paste seluruh teks di atas sekaligus, Vercel akan otomatis mengenali semua kunci dan nilainya.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: GITHUB */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-start gap-3">
                <Github className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    Penyimpanan Kode Sumber ke GitHub
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Anda dapat mengekspor proyek ini ke repositori GitHub pribadi/organisasi agar Vercel dapat melakukan <em>Continuous Deployment</em> (setiap kali ada update, website terbarui otomatis).
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-emerald-700" /> Perintah Terminal Git:
                  </span>
                  <button
                    onClick={() => copyToClipboard(gitCommandsText, 'git')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-2xs"
                  >
                    {copiedGit ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" /> Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Salin Perintah Git
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-950 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
                  <pre>{gitCommandsText}</pre>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <strong>Opsi Praktis Ekspor AI Studio:</strong> Anda juga dapat mengunduh seluruh proyek dalam bentuk file <code>.ZIP</code> atau menautkan akun GitHub langsung melalui menu <strong>Pengaturan / Export</strong> di Google AI Studio Build.
              </div>
            </div>
          )}

          {/* TAB 3: FIREBASE */}
          {activeTab === 'firebase' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-emerald-950">
                    Firebase Firestore Aktif & Terlindungi
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    Database cloud Firestore telah terprovisi dan aturan keamanan (<code>firestore.rules</code>) telah berhasil di-deploy.
                  </p>
                </div>
              </div>

              {/* Status List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">
                    Project ID
                  </span>
                  <span className="font-mono font-bold text-slate-800 break-all">
                    {firebaseConfig.projectId}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">
                    Firestore Database ID
                  </span>
                  <span className="font-mono font-bold text-slate-800 break-all">
                    {databaseId}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">
                    Auth Domain
                  </span>
                  <span className="font-mono font-bold text-slate-800 break-all">
                    {firebaseConfig.authDomain}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">
                    Koleksi Firestore
                  </span>
                  <span className="font-semibold text-emerald-800">
                    laporan_kegiatan, notifikasi
                  </span>
                </div>
              </div>

              {/* Manual Trigger */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-xs text-slate-900">
                    Sinkronisasi Manual Firestore
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Perbarui data lokal dari server cloud Firebase atau buat dokumen awal jika masih kosong.
                  </p>
                  {lastSyncResult && (
                    <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                      {lastSyncResult}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleManualFirebaseSync}
                  disabled={isSyncing}
                  className="px-4 py-2 rounded-lg font-bold text-xs bg-emerald-800 hover:bg-emerald-700 text-white flex items-center gap-2 shrink-0 transition-colors shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            SIPAKAINGA v2.6 &bull; Cloud Ready
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
