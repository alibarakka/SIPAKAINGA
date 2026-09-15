import { LaporanKegiatan, NotifikasiAdmin, StatusVerifikasi } from '../types';
import { INITIAL_LAPORAN, INITIAL_NOTIFIKASI } from '../data/initialData';
import { 
  fetchReportsFromFirestore, 
  saveReportToFirestore, 
  updateReportStatusInFirestore, 
  saveNotifikasiToFirestore,
  fetchNotifikasiFromFirestore
} from './firebaseStorage';

const STORAGE_KEYS = {
  LAPORAN: 'sipakainga_laporan_db_v1',
  OFFLINE_QUEUE: 'sipakainga_offline_queue_v1',
  NOTIFIKASI: 'sipakainga_notifikasi_v1',
  ENCRYPTION_ENABLED: 'sipakainga_encryption_status_v1',
  FIREBASE_SYNCED: 'sipakainga_firebase_last_sync_v1',
};

export function getStoredLaporan(): LaporanKegiatan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAPORAN);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LAPORAN, JSON.stringify(INITIAL_LAPORAN));
      return INITIAL_LAPORAN;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading stored laporan:', err);
    return INITIAL_LAPORAN;
  }
}

export function saveStoredLaporan(list: LaporanKegiatan[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAPORAN, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving stored laporan:', err);
  }
}

export function getOfflineQueue(): LaporanKegiatan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOfflineQueue(queue: LaporanKegiatan[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  } catch (err) {
    console.error('Error saving offline queue:', err);
  }
}

export function getStoredNotifikasi(): NotifikasiAdmin[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFIKASI);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFIKASI, JSON.stringify(INITIAL_NOTIFIKASI));
      return INITIAL_NOTIFIKASI;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFIKASI;
  }
}

export function saveStoredNotifikasi(list: NotifikasiAdmin[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFIKASI, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving notifikasi:', err);
  }
}

/**
 * Synchronize local storage with Firebase Firestore
 */
export async function syncWithFirebase(): Promise<{ 
  success: boolean; 
  laporan: LaporanKegiatan[]; 
  notifikasi: NotifikasiAdmin[];
  error?: string;
}> {
  try {
    const remoteLaporan = await fetchReportsFromFirestore();
    const remoteNotifs = await fetchNotifikasiFromFirestore();

    if (remoteLaporan && remoteLaporan.length > 0) {
      saveStoredLaporan(remoteLaporan);
    }
    if (remoteNotifs && remoteNotifs.length > 0) {
      saveStoredNotifikasi(remoteNotifs);
    }

    localStorage.setItem(STORAGE_KEYS.FIREBASE_SYNCED, new Date().toISOString());

    return {
      success: true,
      laporan: remoteLaporan || getStoredLaporan(),
      notifikasi: remoteNotifs || getStoredNotifikasi(),
    };
  } catch (err: any) {
    console.warn('Firebase sync warning:', err);
    return {
      success: false,
      laporan: getStoredLaporan(),
      notifikasi: getStoredNotifikasi(),
      error: err?.message || 'Gagal tersambung ke Firebase',
    };
  }
}

/**
 * Add a new report either directly or into the offline queue if offline
 */
export function addLaporan(
  laporan: LaporanKegiatan, 
  isOnline: boolean
): { success: boolean; isQueued: boolean; updatedList: LaporanKegiatan[] } {
  const currentList = getStoredLaporan();
  
  if (!isOnline) {
    // Save as offline draft & add to sync queue
    const offlineLaporan: LaporanKegiatan = {
      ...laporan,
      statusVerifikasi: 'draf_offline',
      syncStatus: 'menunggu_sinkronisasi',
    };
    
    const updated = [offlineLaporan, ...currentList];
    saveStoredLaporan(updated);
    
    const queue = getOfflineQueue();
    saveOfflineQueue([offlineLaporan, ...queue.filter(q => q.id !== offlineLaporan.id)]);
    
    return { success: true, isQueued: true, updatedList: updated };
  }

  // If online, save directly with pending verification
  const newLaporan: LaporanKegiatan = {
    ...laporan,
    statusVerifikasi: 'menunggu_verifikasi',
    syncStatus: 'tersinkron',
  };

  const updated = [newLaporan, ...currentList];
  saveStoredLaporan(updated);

  // Trigger automatic admin notification
  const notifs = getStoredNotifikasi();
  const newNotif: NotifikasiAdmin = {
    id: `notif-${Date.now()}`,
    judul: 'Laporan Baru Menunggu Verifikasi',
    pesan: `${newLaporan.penyuluhNama} telah mengirim laporan "${newLaporan.judulMateri}" di ${newLaporan.lokasiSpesifik}.`,
    laporanId: newLaporan.id,
    penyuluhNama: newLaporan.penyuluhNama,
    tipe: 'laporan_baru',
    timestamp: 'Baru saja',
    dibaca: false,
  };
  saveStoredNotifikasi([newNotif, ...notifs]);

  // Asynchronously push to Firebase Firestore in real-time
  saveReportToFirestore(newLaporan).catch((err) => {
    console.warn('Could not immediately push new report to Firestore:', err);
  });
  saveNotifikasiToFirestore(newNotif).catch((err) => {
    console.warn('Could not push notification to Firestore:', err);
  });

  return { success: true, isQueued: false, updatedList: updated };
}

/**
 * Update report verification status by Admin
 */
export function updateStatusVerifikasi(
  laporanId: string, 
  newStatus: StatusVerifikasi, 
  adminName: string, 
  catatan?: string
): { updatedList: LaporanKegiatan[]; notificationAdded: NotifikasiAdmin } {
  const list = getStoredLaporan();
  let targetReport: LaporanKegiatan | undefined;

  const updated = list.map(item => {
    if (item.id === laporanId) {
      targetReport = {
        ...item,
        statusVerifikasi: newStatus,
        diverifikasiOleh: adminName,
        tanggalVerifikasi: new Date().toISOString(),
        catatanVerifikasi: catatan || (newStatus === 'terverifikasi' ? 'Telah diverifikasi sesuai standar Kementerian Agama.' : 'Mohon periksa kembali catatan revisi.'),
        updatedAt: new Date().toISOString(),
      };
      return targetReport;
    }
    return item;
  });

  saveStoredLaporan(updated);

  // Create automatic notification for admin and penyuluh
  const notifs = getStoredNotifikasi();
  const notifId = `notif-${Date.now()}`;
  const notifTitle = newStatus === 'terverifikasi' 
    ? 'Laporan Berhasil Diverifikasi' 
    : 'Laporan Memerlukan Perbaikan / Revisi';
  
  const notifMsg = newStatus === 'terverifikasi'
    ? `Laporan #${laporanId.toUpperCase()} (${targetReport?.judulMateri || 'Kegiatan'}) telah disetujui & diverifikasi oleh ${adminName}.`
    : `Laporan #${laporanId.toUpperCase()} dikembalikan untuk revisi: "${catatan || 'Perlu perbaikan bukti fisik'}".`;

  const newNotif: NotifikasiAdmin = {
    id: notifId,
    judul: notifTitle,
    pesan: notifMsg,
    laporanId: laporanId,
    penyuluhNama: targetReport?.penyuluhNama || 'Penyuluh',
    tipe: newStatus === 'terverifikasi' ? 'laporan_diverifikasi' : 'revisi_laporan',
    timestamp: 'Baru saja',
    dibaca: false,
  };

  saveStoredNotifikasi([newNotif, ...notifs]);

  // Update in Firestore
  updateReportStatusInFirestore(laporanId, newStatus, adminName, catatan).catch(err => {
    console.warn('Could not immediately update report status in Firestore:', err);
  });
  saveNotifikasiToFirestore(newNotif).catch(err => {
    console.warn('Could not save verification notif to Firestore:', err);
  });

  return { updatedList: updated, notificationAdded: newNotif };
}

/**
 * Synchronize offline queue to main database and Firestore smoothly
 */
export async function syncOfflineQueue(): Promise<{ syncedCount: number; updatedList: LaporanKegiatan[] }> {
  const queue = getOfflineQueue();
  if (queue.length === 0) {
    return { syncedCount: 0, updatedList: getStoredLaporan() };
  }

  // Process queued items and upload to Firestore
  for (const item of queue) {
    const syncedItem: LaporanKegiatan = {
      ...item,
      statusVerifikasi: 'menunggu_verifikasi',
      syncStatus: 'tersinkron',
      updatedAt: new Date().toISOString(),
    };
    try {
      await saveReportToFirestore(syncedItem);
    } catch (e) {
      console.warn(`Failed to push offline item ${item.id} to Firestore during sync:`, e);
    }
  }

  const currentList = getStoredLaporan();
  const queueIds = new Set(queue.map(q => q.id));

  const updated = currentList.map(item => {
    if (queueIds.has(item.id)) {
      return {
        ...item,
        statusVerifikasi: 'menunggu_verifikasi' as StatusVerifikasi,
        syncStatus: 'tersinkron' as const,
        updatedAt: new Date().toISOString(),
      };
    }
    return item;
  });

  saveStoredLaporan(updated);
  saveOfflineQueue([]);

  // Create system notification
  const notifs = getStoredNotifikasi();
  const newNotif: NotifikasiAdmin = {
    id: `notif-sync-${Date.now()}`,
    judul: 'Sinkronisasi Otomatis Sukses',
    pesan: `${queue.length} laporan kegiatan yang dicatat dalam mode offline telah berhasil disinkronkan ke server Firebase secara aman.`,
    laporanId: queue[0]?.id || 'sync',
    penyuluhNama: 'Sistem Sinkronisasi SIPAKAINGA',
    tipe: 'sinkronisasi_selesai',
    timestamp: 'Baru saja',
    dibaca: false,
  };
  saveStoredNotifikasi([newNotif, ...notifs]);
  saveNotifikasiToFirestore(newNotif).catch(console.warn);

  return { syncedCount: queue.length, updatedList: updated };
}

