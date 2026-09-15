import React from 'react';
import { 
  Bell, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  ShieldCheck, 
  FileText, 
  FileSpreadsheet, 
  UserCheck, 
  PlusCircle, 
  BarChart3, 
  Layers, 
  Check, 
  HelpCircle,
  Cloud,
  Building2,
  User,
  SlidersHorizontal
} from 'lucide-react';
import { UserRole, PenyuluhProfile, KecamatanGowa } from '../types';
import { LogoKemenag, LogoIpari, LogoEPA } from './Logos';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activePenyuluh: PenyuluhProfile;
  activeKecamatan: KecamatanGowa;
  onOpenProfileModal: () => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  offlineQueueCount: number;
  onSyncNow: () => void;
  isSyncing: boolean;
  unreadNotifsCount: number;
  onOpenNotifs: () => void;
  onOpenEncryptionModal: () => void;
  onOpenDocumentViewer: () => void;
  onOpenCloudModal: () => void;
  activeView: 'dashboard' | 'reports' | 'create_report' | 'official_docs';
  onNavigate: (view: 'dashboard' | 'reports' | 'create_report' | 'official_docs') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activePenyuluh,
  activeKecamatan,
  onOpenProfileModal,
  isOnline,
  onToggleOnline,
  offlineQueueCount,
  onSyncNow,
  isSyncing,
  unreadNotifsCount,
  onOpenNotifs,
  onOpenEncryptionModal,
  onOpenDocumentViewer,
  onOpenCloudModal,
  activeView,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      {/* Top Banner with Kemenag & IPARI Identifiers */}
      <div className="bg-emerald-900 text-white px-3 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <LogoKemenag size={26} />
              <LogoIpari size={26} />
            </div>
            <div className="border-l border-emerald-700/80 pl-2.5">
              <span className="font-bold tracking-wide uppercase block text-[11px] sm:text-xs">
                Kementerian Agama RI &bull; IPARI Kab. Gowa
              </span>
              <span className="text-[10px] text-emerald-200 hidden sm:inline">
                {currentRole === 'penyuluh' ? (
                  <>KUA Kec. {activePenyuluh.kecamatan} &bull; {activePenyuluh.jabatan}</>
                ) : currentRole === 'admin' ? (
                  <>Kantor KUA Kec. {activeKecamatan} (Admin Kepala KUA)</>
                ) : (
                  <>Kantor Kementerian Agama Kabupaten Gowa (Supervisi 18 Kecamatan)</>
                )}
              </span>
            </div>
          </div>

          {/* Quick status badges */}
          <div className="flex items-center gap-2">
            {/* Online / Offline status badge with interactive toggle */}
            <button
              onClick={onToggleOnline}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                isOnline
                  ? 'bg-emerald-800/90 text-emerald-200 border border-emerald-600 hover:bg-emerald-700'
                  : 'bg-amber-500 text-slate-950 font-bold border border-amber-400 hover:bg-amber-400'
              }`}
              title="Klik untuk simulasi online/offline"
            >
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <Wifi className="w-3 h-3" /> Online
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" /> Offline Mode
                </>
              )}
            </button>

            {/* Offline sync button if queue has items */}
            {offlineQueueCount > 0 && (
              <button
                onClick={onSyncNow}
                disabled={isSyncing}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-amber-950 hover:bg-amber-300 transition-all shadow-xs"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{offlineQueueCount} Antrian Sync</span>
              </button>
            )}

            {/* Encryption badge */}
            <button
              onClick={onOpenEncryptionModal}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-emerald-300 border border-slate-700 hover:bg-slate-700 transition-all"
              title="Audit Enkripsi Data AES-256"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">AES-256</span>
            </button>

            {/* Cloud, GitHub & Vercel Deployment status */}
            <button
              onClick={onOpenCloudModal}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-200 border border-emerald-500/50 hover:bg-emerald-800 transition-all"
              title="Integrasi Firebase, GitHub, dan Vercel"
            >
              <Cloud className="w-3.5 h-3.5 text-emerald-300" />
              <span>Cloud &amp; Vercel</span>
            </button>

            {/* Admin Notification Bell */}
            <button
              onClick={onOpenNotifs}
              className="relative p-1.5 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white transition-colors"
              title="Pusat Notifikasi Admin"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation & App Branding */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <LogoEPA className="h-9" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-emerald-950">
                SIPAKAINGA
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-widest">
                v2.6
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Sistem Pelaporan Kegiatan Penyuluhan Keagamaan dan Pembangunan
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 text-xs">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all ${
              activeView === 'dashboard'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Dasbor Analitik
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all ${
              activeView === 'reports'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            Daftar Laporan
          </button>

          <button
            onClick={() => onNavigate('create_report')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all ${
              activeView === 'create_report'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Input Laporan Baru
          </button>

          <button
            onClick={() => onNavigate('official_docs')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all ${
              activeView === 'official_docs'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            Dokumen Resmi Kemenag
          </button>
        </nav>

        {/* User Role Switcher & Multi-Kecamatan Profile Selector */}
        <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-3 pt-2 sm:pt-0 w-full sm:w-auto justify-between sm:justify-start">
          {/* Active Profile Info & Switcher Button */}
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left group"
            title="Klik untuk ganti Kecamatan atau Profil Penyuluh/Admin KUA"
          >
            {currentRole === 'penyuluh' ? (
              <img
                src={activePenyuluh.fotoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'}
                alt={activePenyuluh.nama}
                className="w-7 h-7 rounded-full object-cover border border-emerald-600 shadow-2xs"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                <Building2 className="w-4 h-4" />
              </div>
            )}
            <div className="hidden lg:block">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider leading-none">
                {currentRole === 'penyuluh' ? `PAI Kec. ${activePenyuluh.kecamatan}` : `KUA Kec. ${activeKecamatan}`}
              </span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 leading-tight block truncate max-w-[140px]">
                {currentRole === 'penyuluh' ? activePenyuluh.nama.split(',')[0] : `Kepala KUA`}
              </span>
            </div>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 ml-0.5" />
          </button>

          {/* Quick Role Toggle */}
          <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
            <button
              onClick={() => onRoleChange('penyuluh')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                currentRole === 'penyuluh'
                  ? 'bg-white text-emerald-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Penyuluh
            </button>
            <button
              onClick={() => onRoleChange('admin')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                currentRole === 'admin'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Kepala KUA
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
