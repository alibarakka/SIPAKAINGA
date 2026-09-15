import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy,
  writeBatch 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LaporanKegiatan, NotifikasiAdmin, StatusVerifikasi } from '../types';
import { INITIAL_LAPORAN, INITIAL_NOTIFIKASI } from '../data/initialData';

const COLLECTIONS = {
  LAPORAN: 'laporan_kegiatan',
  NOTIFIKASI: 'notifikasi',
};

/**
 * Fetch all reports from Firestore with local fallback
 */
export async function fetchReportsFromFirestore(): Promise<LaporanKegiatan[]> {
  try {
    const colRef = collection(db, COLLECTIONS.LAPORAN);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      // If collection is empty, seed initial data to Firestore
      console.log('Firestore laporan collection is empty. Seeding initial data...');
      await seedReportsToFirestore(INITIAL_LAPORAN);
      return INITIAL_LAPORAN;
    }

    const list: LaporanKegiatan[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as LaporanKegiatan);
    });

    // Sort by tanggalPelaksanaan descending or id
    return list;
  } catch (err) {
    console.warn('Firestore fetch failed (offline or network error), using local cache:', err);
    throw err;
  }
}

/**
 * Save or update a single report document in Firestore
 */
export async function saveReportToFirestore(laporan: LaporanKegiatan): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.LAPORAN, laporan.id);
    await setDoc(docRef, {
      ...laporan,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.error('Error saving report to Firestore:', err);
    throw err;
  }
}

/**
 * Update verification status in Firestore
 */
export async function updateReportStatusInFirestore(
  laporanId: string,
  status: StatusVerifikasi,
  adminName: string,
  catatan?: string
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.LAPORAN, laporanId);
    await updateDoc(docRef, {
      statusVerifikasi: status,
      diverifikasiOleh: adminName,
      catatanVerifikasi: catatan || (status === 'terverifikasi' ? 'Telah diverifikasi sesuai standar Kementerian Agama.' : 'Mohon periksa kembali catatan revisi.'),
      tanggalVerifikasi: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error updating report status in Firestore:', err);
    throw err;
  }
}

/**
 * Seed initial reports in batches to Firestore
 */
export async function seedReportsToFirestore(reports: LaporanKegiatan[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const r of reports) {
      const docRef = doc(db, COLLECTIONS.LAPORAN, r.id);
      batch.set(docRef, r);
    }
    await batch.commit();
    console.log(`Successfully seeded ${reports.length} reports to Firestore.`);
  } catch (err) {
    console.error('Error batch seeding reports to Firestore:', err);
  }
}

/**
 * Fetch notifications from Firestore
 */
export async function fetchNotifikasiFromFirestore(): Promise<NotifikasiAdmin[]> {
  try {
    const colRef = collection(db, COLLECTIONS.NOTIFIKASI);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      // Seed initial notifs
      await seedNotifikasiToFirestore(INITIAL_NOTIFIKASI);
      return INITIAL_NOTIFIKASI;
    }

    const list: NotifikasiAdmin[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as NotifikasiAdmin);
    });
    return list;
  } catch (err) {
    console.warn('Firestore notifikasi fetch error:', err);
    throw err;
  }
}

/**
 * Save notification to Firestore
 */
export async function saveNotifikasiToFirestore(notif: NotifikasiAdmin): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.NOTIFIKASI, notif.id);
    await setDoc(docRef, notif, { merge: true });
  } catch (err) {
    console.error('Error saving notifikasi to Firestore:', err);
  }
}

/**
 * Seed initial notifications
 */
export async function seedNotifikasiToFirestore(notifs: NotifikasiAdmin[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const n of notifs) {
      const docRef = doc(db, COLLECTIONS.NOTIFIKASI, n.id);
      batch.set(docRef, n);
    }
    await batch.commit();
  } catch (err) {
    console.error('Error seeding notifikasi to Firestore:', err);
  }
}
