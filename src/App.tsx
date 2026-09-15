/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Layers, 
  BarChart3, 
  FileText, 
  FileSpreadsheet, 
  Printer, 
  RefreshCw, 
  WifiOff, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Lock, 
  Info,
  Cloud 
} from 'lucide-react';
import { 
  LaporanKegiatan, 
  UserRole, 
  NotifikasiAdmin, 
  StatusVerifikasi,
  PenyuluhProfile,
  KecamatanGowa 
} from './types';
import { 
  CURRENT_PENYULUH, 
  KEPALA_KUA, 
  INITIAL_KELOMPOK_BINAAN 
} from './data/initialData';
import { 
  getKepalaKUA, 
  DEFAULT_PENYULUH_LIST 
} from './data/gowaData';
import { 
  getStoredLaporan, 
  saveStoredLaporan, 
  getOfflineQueue, 
  saveOfflineQueue, 
  getStoredNotifikasi, 
  saveStoredNotifikasi, 
  addLaporan, 
  updateStatusVerifikasi, 
  syncOfflineQueue,
  syncWithFirebase 
} from './utils/storage';
import { exportLaporanToExcel } from './utils/exportExcel';
import { Navbar } from './components/Navbar';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { ReportForm } from './components/ReportForm';
import { ReportList } from './components/ReportList';
import { OfficialDocumentViewer } from './components/OfficialDocumentViewer';
import { AdminNotificationModal } from './components/AdminNotificationModal';
import { EncryptionSecurityModal } from './components/EncryptionSecurityModal';
import { CloudDeploymentModal } from './components/CloudDeploymentModal';
import { ProfileRoleSelectorModal } from './components/ProfileRoleSelectorModal';

export default function App() {
  const [laporanList, setLaporanList] = useState<LaporanKegiatan[]>(() => getStoredLaporan());
  const [offlineQueue, setOfflineQueue] = useState<LaporanKegiatan[]>(() => getOfflineQueue());
  const [notifikasiList, setNotifikasiList] = useState<NotifikasiAdmin[]>(() => getStoredNotifikasi());
  const [currentRole, setCurrentRole] = useState<UserRole>('penyuluh');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Multi-tenant profile & KUA context state
  const [activePenyuluh, setActivePenyuluh] = useState<PenyuluhProfile>(() => CURRENT_PENYULUH);
  const [activeKecamatan, setActiveKecamatan] = useState<KecamatanGowa>(
    () => (CURRENT_PENYULUH.kecamatan as KecamatanGowa) || 'Somba Opu'
  );
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Current active Kepala KUA based on selected Kecamatan
  const activeKepalaKua = getKepalaKUA(activeKecamatan);

  // Views & modals
  const [activeView, setActiveView] = useState<'dashboard' | 'reports' | 'create_report' | 'official_docs'>('dashboard');
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isEncryptionModalOpen, setIsEncryptionModalOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [activeEncryptionReport, setActiveEncryptionReport] = useState<LaporanKegiatan | undefined>(undefined);
  const [selectedDocReportId, setSelectedDocReportId] = useState<string | undefined>(undefined);
  const [docInitialTab, setDocInitialTab] = useState<
    'cover' | 'surat_tugas' | 'jadwal' | 'surat_pernyataan' | 'rekap_tabel' | 'lembar_kegiatan'
  >('cover');

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Initial background sync with Firebase Firestore on mount
  useEffect(() => {
    if (navigator.onLine) {
      syncWithFirebase().then((res) => {
        if (res.success && res.laporan.length > 0) {
          setLaporanList(res.laporan);
          setNotifikasiList(res.notifikasi);
        }
      }).catch((err) => {
        console.warn('Initial Firebase sync warning:', err);
      });
    }
  }, []);

  // Sync network state
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Koneksi internet kembali online. Memeriksa antrian sinkronisasi...', 'info');
      handleSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast('Koneksi terputus. Mode offline diaktifkan secara otomatis.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync execution
  const handleSync = async () => {
    if (offlineQueue.length === 0) {
      showToast('Semua data laporan telah tersinkron sempurna dengan server Kemenag.', 'info');
      return;
    }

    setIsSyncing(true);
    try {
      const { syncedCount, updatedList } = await syncOfflineQueue();
      setLaporanList(updatedList);
      setOfflineQueue([]);
      setNotifikasiList(getStoredNotifikasi());
      showToast(`Sukses menyinkronkan ${syncedCount} laporan offline ke server Kemenag!`, 'success');
    } catch (err) {
      showToast('Gagal menyinkronkan data. Silakan coba kembali.', 'warning');
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle simulated online/offline
  const handleToggleOnline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (nextState) {
      showToast('Mode beralih ke Online. Memulai proses sinkronisasi...', 'info');
      handleSync();
    } else {
      showToast('Simulasi Mode Offline Aktif: Data akan disimpan di IndexedDB / LocalStorage perangkat.', 'warning');
    }
  };

  // Submit new report
  const handleReportSubmit = (newLaporan: LaporanKegiatan) => {
    const result = addLaporan(newLaporan, isOnline);
    setLaporanList(result.updatedList);
    setOfflineQueue(getOfflineQueue());
    setNotifikasiList(getStoredNotifikasi());

    if (result.isQueued) {
      showToast(
        'Laporan tersimpan di memori offline perangkat. Akan disinkron otomatis saat sinyal pulih.',
        'warning'
      );
    } else {
      showToast(
        `Laporan kegiatan berhasil terkirim ke KUA Kecamatan ${newLaporan.kecamatan || activeKecamatan} dan notifikasi admin otomatis dipicu!`,
        'success'
      );
    }

    setActiveView('reports');
  };

  // Verify report by Admin / Kepala KUA
  const handleVerifyReport = (laporanId: string, status: StatusVerifikasi, catatan?: string) => {
    const defaultCatatan = status === 'terverifikasi'
      ? `Disetujui dan diverifikasi secara digital oleh Kepala KUA Kecamatan ${activeKecamatan}.`
      : 'Mohon periksa kembali kelengkapan foto dokumentasi kegiatan.';

    const { updatedList } = updateStatusVerifikasi(
      laporanId,
      status,
      activeKepalaKua.nama,
      catatan || defaultCatatan
    );
    setLaporanList(updatedList);
    setNotifikasiList(getStoredNotifikasi());

    showToast(
      status === 'terverifikasi'
        ? `Laporan #${laporanId.toUpperCase()} berhasil diverifikasi & ditandatangani digital oleh Kepala KUA ${activeKecamatan} (${activeKepalaKua.nama})!`
        : `Laporan #${laporanId.toUpperCase()} dikembalikan untuk perbaikan.`,
      status === 'terverifikasi' ? 'success' : 'warning'
    );
  };

  // Open Document Viewer
  const handleOpenDocViewer = (
    laporanId?: string,
    tab: 'cover' | 'surat_tugas' | 'jadwal' | 'surat_pernyataan' | 'rekap_tabel' | 'lembar_kegiatan' = 'lembar_kegiatan'
  ) => {
    if (laporanId) {
      setSelectedDocReportId(laporanId);
    }
    setDocInitialTab(tab);
    setActiveView('official_docs');
  };

  // Notification actions
  const handleMarkNotifRead = (id: string) => {
    const updated = notifikasiList.map((n) => (n.id === id ? { ...n, dibaca: true } : n));
    setNotifikasiList(updated);
    saveStoredNotifikasi(updated);
  };

  const handleMarkAllNotifsRead = () => {
    const updated = notifikasiList.map((n) => ({ ...n, dibaca: true }));
    setNotifikasiList(updated);
    saveStoredNotifikasi(updated);
    showToast('Semua notifikasi telah ditandai dibaca.', 'info');
  };

  const unreadNotifsCount = notifikasiList.filter((n) => !n.dibaca).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 selection:bg-emerald-200">
      {/* Navbar with brand, status, and role switcher */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activePenyuluh={activePenyuluh}
        activeKecamatan={activeKecamatan}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
        offlineQueueCount={offlineQueue.length}
        onSyncNow={handleSync}
        isSyncing={isSyncing}
        unreadNotifsCount={unreadNotifsCount}
        onOpenNotifs={() => setIsNotifModalOpen(true)}
        onOpenEncryptionModal={() => {
          setActiveEncryptionReport(undefined);
          setIsEncryptionModalOpen(true);
        }}
        onOpenDocumentViewer={() => handleOpenDocViewer(undefined, 'cover')}
        onOpenCloudModal={() => setIsCloudModalOpen(true)}
        activeView={activeView}
        onNavigate={setActiveView}
      />

      {/* Main Content Area */}
      <main className="grow max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* Offline Banner Bar if offline */}
        {!isOnline && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl flex items-center justify-between shadow-xs text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-slate-950" />
              <span>
                Sedang beroperasi dalam <strong>Mode Offline Lapangan</strong>. Semua laporan, titik koordinat GPS, dan bukti foto tersimpan aman di perangkat lokal.
              </span>
            </div>
            <button
              onClick={handleToggleOnline}
              className="px-3 py-1 rounded bg-slate-900 text-white text-xs hover:bg-slate-800 transition-colors shrink-0 font-bold"
            >
              Simulasikan Online
            </button>
          </div>
        )}

        {/* View 1: Dasbor Analitik Produktivitas */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Dasbor Produktivitas Penyuluhan Keagamaan & Pembangunan
                </h2>
                <p className="text-xs text-slate-500">
                  Kabupaten Gowa &bull; Wilayah KUA Kecamatan {activeKecamatan} &bull; {activePenyuluh.nama} ({activePenyuluh.jabatan})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCloudModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 text-xs font-bold transition-all shadow-2xs border border-slate-700"
                >
                  <Cloud className="w-4 h-4 text-emerald-400" />
                  Onlinekan ke Vercel
                </button>

                <button
                  onClick={() =>
                    exportLaporanToExcel(
                      laporanList,
                      activePenyuluh,
                      activeKepalaKua,
                      INITIAL_KELOMPOK_BINAAN,
                      'JULI',
                      '2026'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  Rekap Excel (.xlsx)
                </button>

                <button
                  onClick={() => setActiveView('create_report')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  Buat Laporan Baru
                </button>
              </div>
            </div>

            <DashboardAnalytics
              laporanList={laporanList}
              activeKecamatan={activeKecamatan}
              currentRole={currentRole}
              onSelectReport={(id) => handleOpenDocViewer(id, 'lembar_kegiatan')}
            />
          </div>
        )}

        {/* View 2: Daftar Laporan Kegiatan */}
        {activeView === 'reports' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Daftar Laporan Kegiatan Lapangan
                </h2>
                <p className="text-xs text-slate-500">
                  Bimbingan tatap muka, layanan konseling perorangan, dan pengembangan model (18 Kecamatan Gowa)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportLaporanToExcel(
                      laporanList,
                      activePenyuluh,
                      activeKepalaKua,
                      INITIAL_KELOMPOK_BINAAN,
                      'JULI',
                      '2026'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  Ekspor Rekap Excel
                </button>

                <button
                  onClick={() => setActiveView('create_report')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  Tambah Laporan
                </button>
              </div>
            </div>

            <ReportList
              laporanList={laporanList}
              currentRole={currentRole}
              filterKecamatanDefault={currentRole === 'admin' ? activeKecamatan : 'all'}
              onSelectLaporan={(lap) => handleOpenDocViewer(lap.id, 'lembar_kegiatan')}
              onVerifyLaporan={handleVerifyReport}
              onOpenDocumentViewer={(id) => handleOpenDocViewer(id, 'lembar_kegiatan')}
              onOpenEncryptionModal={(lap) => {
                setActiveEncryptionReport(lap);
                setIsEncryptionModalOpen(true);
              }}
            />
          </div>
        )}

        {/* View 3: Input Laporan Baru (Field Ergonomics) */}
        {activeView === 'create_report' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Formulir Pelaporan Kegiatan Penyuluhan
                </h2>
                <p className="text-xs text-slate-500">
                  Lengkapi data kegiatan, unggah kolase album bukti foto & kunci koordinat GPS
                </p>
              </div>
              <button
                onClick={() => setActiveView('reports')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Kembali ke Daftar
              </button>
            </div>

            <ReportForm
              onSubmit={handleReportSubmit}
              isOnline={isOnline}
              onCancel={() => setActiveView('reports')}
              activePenyuluh={activePenyuluh}
              defaultKecamatan={activeKecamatan}
            />
          </div>
        )}

        {/* View 4: Dokumen Resmi Standar Kemenag & IPARI */}
        {activeView === 'official_docs' && (
          <OfficialDocumentViewer
            laporanList={laporanList}
            penyuluh={activePenyuluh}
            kepalaKua={activeKepalaKua}
            kelompokList={INITIAL_KELOMPOK_BINAAN}
            initialTab={docInitialTab}
            selectedLaporanId={selectedDocReportId}
            onClose={() => setActiveView('reports')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-950">SIPAKAINGA</span>
            <span>&bull;</span>
            <span>Kementerian Agama Kabupaten Gowa & IPARI</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Enkripsi AES-256 Aktif
            </span>
            <span>&bull;</span>
            <span className="text-slate-500">
              Kepdirjen Bimas Islam No. 794 Th. 2025
            </span>
          </div>
        </div>
      </footer>

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2.5 ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toast.type === 'warning'
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            ) : toast.type === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-amber-200 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-sky-300 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Admin Notification Modal */}
      <AdminNotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        notifications={notifikasiList}
        onMarkAsRead={handleMarkNotifRead}
        onMarkAllAsRead={handleMarkAllNotifsRead}
        onSelectLaporan={(laporanId) => {
          handleOpenDocViewer(laporanId, 'lembar_kegiatan');
        }}
      />

      {/* Encryption & Cryptographic Inspector Modal */}
      <EncryptionSecurityModal
        isOpen={isEncryptionModalOpen}
        onClose={() => setIsEncryptionModalOpen(false)}
        laporan={activeEncryptionReport || laporanList[0]}
      />

      {/* Cloud, GitHub & Vercel Deployment Modal */}
      <CloudDeploymentModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        onSyncComplete={(newLaporan, newNotifs) => {
          setLaporanList(newLaporan);
          setNotifikasiList(newNotifs);
        }}
        showToast={showToast}
      />

      {/* Profile & Multi-Kecamatan Role Selector Modal */}
      <ProfileRoleSelectorModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          showToast(
            `Mode dialihkan ke: ${
              role === 'admin'
                ? `Kepala KUA Kecamatan ${activeKecamatan} (Admin Verifikator)`
                : 'Penyuluh Agama Islam (Pelapor)'
            }`,
            'info'
          );
        }}
        activePenyuluh={activePenyuluh}
        onSelectPenyuluh={(penyuluh) => {
          setActivePenyuluh(penyuluh);
          setActiveKecamatan(penyuluh.kecamatan as KecamatanGowa);
          setCurrentRole('penyuluh');
          showToast(
            `Profil aktif dialihkan ke: ${penyuluh.nama} (${penyuluh.jabatan}) - KUA Kec. ${penyuluh.kecamatan}`,
            'success'
          );
        }}
        activeKecamatan={activeKecamatan}
        onSelectKecamatan={(kec) => {
          setActiveKecamatan(kec);
          // Check if there's a registered profile in default list for this kecamatan
          const match = DEFAULT_PENYULUH_LIST.find((p) => p.kecamatan === kec);
          if (match) {
            setActivePenyuluh(match);
          } else {
            setActivePenyuluh((prev) => ({
              ...prev,
              kecamatan: kec,
              wilTugas: `KUA Kec. ${kec}`,
              unitKerja: 'Kementerian Agama Kabupaten Gowa',
            }));
          }
          showToast(`Wilayah KUA berhasil dialihkan ke: KUA Kecamatan ${kec}`, 'info');
        }}
        showToast={showToast}
      />
    </div>
  );
}
