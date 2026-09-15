import React from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  X, 
  FileCheck, 
  Send, 
  RefreshCw, 
  CheckCheck 
} from 'lucide-react';
import { NotifikasiAdmin } from '../types';

interface AdminNotificationModalProps {
  notifications: NotifikasiAdmin[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectLaporan?: (laporanId: string) => void;
}

export const AdminNotificationModal: React.FC<AdminNotificationModalProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectLaporan,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.dibaca).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700/80 flex items-center justify-center">
              <Bell className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Pusat Notifikasi Admin & KUA</h3>
              <p className="text-xs text-emerald-300">
                {unreadCount > 0 ? `${unreadCount} pemberitahuan baru belum dibaca` : 'Semua notifikasi telah dibaca'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-emerald-100 transition-colors"
                title="Tandai semua telah dibaca"
              >
                Tandai Dibaca
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-300 hover:bg-emerald-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of notifications */}
        <div className="p-3 overflow-y-auto divide-y divide-slate-100 grow space-y-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">Belum ada notifikasi masuk</p>
            </div>
          ) : (
            notifications.map((n) => {
              const isVerified = n.tipe === 'laporan_diverifikasi';
              const isSync = n.tipe === 'sinkronisasi_selesai';
              const isRevision = n.tipe === 'revisi_laporan';

              return (
                <div
                  key={n.id}
                  onClick={() => {
                    onMarkAsRead(n.id);
                    if (onSelectLaporan && n.laporanId) {
                      onSelectLaporan(n.laporanId);
                      onClose();
                    }
                  }}
                  className={`p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 hover:bg-slate-50 ${
                    !n.dibaca ? 'bg-emerald-50/50 border-l-4 border-emerald-600' : ''
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isVerified
                        ? 'bg-blue-100 text-blue-700'
                        : isSync
                        ? 'bg-emerald-100 text-emerald-700'
                        : isRevision
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isVerified ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isSync ? (
                      <RefreshCw className="w-4 h-4" />
                    ) : isRevision ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <FileCheck className="w-4 h-4" />
                    )}
                  </div>

                  <div className="grow">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900">{n.judul}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.pesan}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">{n.penyuluhNama}</span>
                      <span className="text-emerald-700 font-bold hover:underline">
                        Lihat Berkas →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Notifikasi terhubung secara real-time ke akun Admin Kemenag</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 font-medium text-slate-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
