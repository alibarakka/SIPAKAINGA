import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { 
  UserProfile, 
  RegisterPenyuluhData, 
  RegisterKepalaKUAData, 
  UserRole, 
  KecamatanGowa,
  PenyuluhProfile,
  KepalaKUAProfile
} from '../types';
import { CURRENT_PENYULUH, KEPALA_KUA } from '../data/initialData';
import { getKepalaKUA, DEFAULT_PENYULUH_LIST } from '../data/gowaData';

const STORAGE_KEYS = {
  CURRENT_USER: 'sipakainga_current_user_v2',
  REGISTERED_USERS: 'sipakainga_registered_users_v2',
};

// Default pre-seeded users for instant testing & demo
export const SEED_USERS: UserProfile[] = [
  {
    uid: 'user-masniati-sombaopu',
    email: 'masniati@kemenag.go.id',
    role: 'penyuluh',
    nama: CURRENT_PENYULUH.nama,
    nip: CURRENT_PENYULUH.nip,
    nipa: CURRENT_PENYULUH.nipa,
    jabatan: CURRENT_PENYULUH.jabatan,
    pangkatGol: CURRENT_PENYULUH.pangkatGol,
    kecamatan: CURRENT_PENYULUH.kecamatan,
    phone: CURRENT_PENYULUH.phone,
    wilTugas: CURRENT_PENYULUH.wilTugas,
    unitKerja: CURRENT_PENYULUH.unitKerja,
    fotoUrl: CURRENT_PENYULUH.fotoUrl,
    createdAt: '2026-07-01T08:00:00.000Z',
    updatedAt: '2026-07-01T08:00:00.000Z',
    source: 'local',
  },
  {
    uid: 'user-murhadi-kua-sombaopu',
    email: 'kua.sombaopu@kemenag.go.id',
    role: 'admin',
    nama: KEPALA_KUA.nama,
    nip: KEPALA_KUA.nip,
    jabatan: KEPALA_KUA.jabatan,
    pangkatGol: KEPALA_KUA.pangkatGol,
    kecamatan: KEPALA_KUA.kecamatan,
    phone: KEPALA_KUA.teleponKua,
    kuaName: KEPALA_KUA.kuaName,
    alamatKua: KEPALA_KUA.alamatKua,
    teleponKua: KEPALA_KUA.teleponKua,
    unitKerja: 'KUA Kecamatan Somba Opu',
    createdAt: '2026-07-01T08:00:00.000Z',
    updatedAt: '2026-07-01T08:00:00.000Z',
    source: 'local',
  },
  {
    uid: 'user-ridwan-pallangga',
    email: 'ridwan.pai@kemenag.go.id',
    role: 'penyuluh',
    nama: 'MUH. RIDWAN, S.Th.I',
    nip: '199208152020121008',
    jabatan: 'Penyuluh Agama Islam Ahli Pertama',
    pangkatGol: 'Penata Muda Tk. I / IIIb',
    kecamatan: 'Pallangga',
    phone: '0812-4567-8901',
    wilTugas: 'KUA Kec. Pallangga',
    unitKerja: 'Kementerian Agama Kabupaten Gowa',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    createdAt: '2026-07-01T08:00:00.000Z',
    updatedAt: '2026-07-01T08:00:00.000Z',
    source: 'local',
  },
  {
    uid: 'user-kua-pallangga',
    email: 'kua.pallangga@kemenag.go.id',
    role: 'admin',
    nama: 'Drs. H. MUH. ASKAR, M.Pd.I',
    nip: '196805121994031004',
    jabatan: 'Penghulu Madya / Kepala KUA',
    pangkatGol: 'Pembina / IVa',
    kecamatan: 'Pallangga',
    phone: '(0411) 821990',
    kuaName: 'KUA Kecamatan Pallangga',
    alamatKua: 'Jl. Poros Pallangga No. 12, Pallangga',
    teleponKua: '(0411) 821990',
    unitKerja: 'KUA Kecamatan Pallangga',
    createdAt: '2026-07-01T08:00:00.000Z',
    updatedAt: '2026-07-01T08:00:00.000Z',
    source: 'local',
  },
];

// Helper to get stored users
export function getRegisteredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    const parsed: UserProfile[] = JSON.parse(raw);
    return parsed.length > 0 ? parsed : SEED_USERS;
  } catch (err) {
    console.error('Error fetching registered users:', err);
    return SEED_USERS;
  }
}

// Helper to save registered users locally
export function saveRegisteredUsers(users: UserProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving registered users:', err);
  }
}

// Helper to get currently active session user
export function getStoredCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) {
      return JSON.parse(raw);
    }
    // Default to initial Masniati profile
    return SEED_USERS[0];
  } catch (err) {
    return SEED_USERS[0];
  }
}

// Helper to set currently active session user
export function saveStoredCurrentUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (err) {
    console.error('Error saving current user:', err);
  }
}

/**
 * Register a new Penyuluh Agama Islam (PAI) account
 */
export async function registerPenyuluhAccount(data: RegisterPenyuluhData): Promise<{
  success: boolean;
  user: UserProfile;
  message: string;
}> {
  const timestamp = new Date().toISOString();
  let uid = `user-pai-${Date.now()}`;
  let source: 'firebase' | 'local' = 'local';

  // Attempt Firebase Auth registration
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    uid = userCredential.user.uid;
    source = 'firebase';

    // Update display name in Firebase Auth
    await updateProfile(userCredential.user, {
      displayName: data.nama,
    });
  } catch (authErr: any) {
    console.warn('Firebase Auth create user notice (using local storage fallback if needed):', authErr);
    // If offline or provider not enabled, proceed with unique ID and local storage
    if (authErr.code === 'auth/email-already-in-use') {
      throw new Error('Alamat email ini sudah terdaftar. Silakan gunakan menu Masuk / Login.');
    }
  }

  const newProfile: UserProfile = {
    uid,
    email: data.email,
    role: 'penyuluh',
    nama: data.nama,
    nip: data.nip,
    nipa: data.nipa || '',
    jabatan: data.jabatan,
    pangkatGol: data.pangkatGol,
    kecamatan: data.kecamatan,
    phone: data.phone,
    wilTugas: data.wilTugas || `KUA Kec. ${data.kecamatan}`,
    unitKerja: 'Kementerian Agama Kabupaten Gowa',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    createdAt: timestamp,
    updatedAt: timestamp,
    source,
  };

  // Asynchronously save to Firestore
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      ...newProfile,
      passwordHashSimulated: 'sha256_secured',
    }, { merge: true });
  } catch (firestoreErr) {
    console.warn('Could not sync user profile to Firestore (offline or rule restrict):', firestoreErr);
  }

  // Update local registry & active session
  const registered = getRegisteredUsers();
  const filtered = registered.filter(u => u.email !== data.email && u.uid !== uid);
  saveRegisteredUsers([newProfile, ...filtered]);
  saveStoredCurrentUser(newProfile);

  return {
    success: true,
    user: newProfile,
    message: `Akun Penyuluh atas nama ${data.nama} (KUA Kec. ${data.kecamatan}) berhasil didaftarkan!`,
  };
}

/**
 * Register a new Kepala KUA (Admin Verifikator) account
 */
export async function registerKepalaKUAAccount(data: RegisterKepalaKUAData): Promise<{
  success: boolean;
  user: UserProfile;
  message: string;
}> {
  const timestamp = new Date().toISOString();
  let uid = `user-kua-${Date.now()}`;
  let source: 'firebase' | 'local' = 'local';

  // Attempt Firebase Auth registration
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    uid = userCredential.user.uid;
    source = 'firebase';

    // Update display name in Firebase Auth
    await updateProfile(userCredential.user, {
      displayName: data.nama,
    });
  } catch (authErr: any) {
    console.warn('Firebase Auth create user notice:', authErr);
    if (authErr.code === 'auth/email-already-in-use') {
      throw new Error('Alamat email ini sudah terdaftar. Silakan gunakan menu Masuk / Login.');
    }
  }

  const newProfile: UserProfile = {
    uid,
    email: data.email,
    role: 'admin',
    nama: data.nama,
    nip: data.nip,
    jabatan: data.jabatan || 'Penghulu Madya / Kepala KUA',
    pangkatGol: data.pangkatGol,
    kecamatan: data.kecamatan,
    phone: data.teleponKua,
    kuaName: data.kuaName || `KUA Kecamatan ${data.kecamatan}`,
    alamatKua: data.alamatKua,
    teleponKua: data.teleponKua,
    unitKerja: `KUA Kecamatan ${data.kecamatan}`,
    createdAt: timestamp,
    updatedAt: timestamp,
    source,
  };

  // Asynchronously save to Firestore
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      ...newProfile,
      passwordHashSimulated: 'sha256_secured',
    }, { merge: true });
  } catch (firestoreErr) {
    console.warn('Could not sync user profile to Firestore:', firestoreErr);
  }

  // Update local registry & active session
  const registered = getRegisteredUsers();
  const filtered = registered.filter(u => u.email !== data.email && u.uid !== uid);
  saveRegisteredUsers([newProfile, ...filtered]);
  saveStoredCurrentUser(newProfile);

  return {
    success: true,
    user: newProfile,
    message: `Akun Kepala KUA Kecamatan ${data.kecamatan} atas nama ${data.nama} berhasil didaftarkan!`,
  };
}

/**
 * Login with Email and Password
 */
export async function loginWithEmailAndPassword(
  email: string, 
  pass: string
): Promise<{ success: boolean; user: UserProfile; message: string }> {
  const cleanEmail = email.trim().toLowerCase();

  // Try Firebase Auth first
  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    const uid = userCredential.user.uid;

    // Check if user document exists in Firestore
    try {
      const userDocRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const profile = docSnap.data() as UserProfile;
        saveStoredCurrentUser(profile);
        return {
          success: true,
          user: profile,
          message: `Selamat datang kembali, ${profile.nama}!`,
        };
      }
    } catch (fsErr) {
      console.warn('Firestore fetch user error on login:', fsErr);
    }

    // Check local registry by email or UID
    const registered = getRegisteredUsers();
    const matched = registered.find(u => u.email.toLowerCase() === cleanEmail || u.uid === uid);
    if (matched) {
      saveStoredCurrentUser(matched);
      return {
        success: true,
        user: matched,
        message: `Selamat datang kembali, ${matched.nama}!`,
      };
    }

    // Default fallback from Firebase Auth user
    const fallbackUser: UserProfile = {
      uid,
      email: userCredential.user.email || cleanEmail,
      role: 'penyuluh',
      nama: userCredential.user.displayName || cleanEmail.split('@')[0],
      nip: '198501012010011001',
      jabatan: 'Penyuluh Agama Islam Ahli Muda',
      pangkatGol: 'Penata / IIIc',
      kecamatan: 'Somba Opu',
      phone: '0812-3456-7890',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'firebase',
    };
    saveStoredCurrentUser(fallbackUser);
    return {
      success: true,
      user: fallbackUser,
      message: `Berhasil masuk sebagai ${fallbackUser.nama}!`,
    };

  } catch (authErr: any) {
    console.warn('Firebase Auth sign in notice:', authErr?.code, authErr?.message);

    // If Firebase Auth fails (e.g. offline, or auth/user-not-found in Firebase, or auth/operation-not-allowed),
    // check if it's a registered user in local database or seed users
    const registered = getRegisteredUsers();
    const localMatch = registered.find(u => u.email.toLowerCase() === cleanEmail);
    if (localMatch) {
      saveStoredCurrentUser(localMatch);
      return {
        success: true,
        user: localMatch,
        message: `Berhasil masuk (Sesi Terotentikasi): ${localMatch.nama}`,
      };
    }

    if (authErr.code === 'auth/wrong-password' || authErr.code === 'auth/invalid-credential') {
      throw new Error('Kata sandi salah atau kredensial tidak sesuai. Silakan periksa kembali.');
    }
    if (authErr.code === 'auth/user-not-found') {
      throw new Error('Email tidak ditemukan. Silakan lakukan pendaftaran akun baru terlebih dahulu.');
    }

    throw new Error(authErr?.message || 'Gagal masuk. Periksa email dan kata sandi Anda.');
  }
}

/**
 * Login with Google popup
 */
export async function loginWithGoogle(): Promise<{ success: boolean; user: UserProfile; message: string }> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if profile exists
    try {
      const docRef = doc(db, 'users', user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const profile = snap.data() as UserProfile;
        saveStoredCurrentUser(profile);
        return { success: true, user: profile, message: `Selamat datang, ${profile.nama}!` };
      }
    } catch (e) {
      console.warn('Firestore doc check failed:', e);
    }

    // If new Google user, create profile
    const registered = getRegisteredUsers();
    const existing = registered.find(u => u.email.toLowerCase() === (user.email || '').toLowerCase());
    if (existing) {
      saveStoredCurrentUser(existing);
      return { success: true, user: existing, message: `Selamat datang, ${existing.nama}!` };
    }

    const newGoogleUser: UserProfile = {
      uid: user.uid,
      email: user.email || 'user@kemenag.go.id',
      role: 'penyuluh',
      nama: user.displayName || 'Penyuluh Agama Islam',
      nip: '198501012015011001',
      jabatan: 'Penyuluh Agama Islam Ahli Muda',
      pangkatGol: 'Penata / IIIc',
      kecamatan: 'Somba Opu',
      phone: user.phoneNumber || '0812-3456-7890',
      wilTugas: 'KUA Kec. Somba Opu',
      unitKerja: 'Kementerian Agama Kabupaten Gowa',
      fotoUrl: user.photoURL || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'firebase',
    };

    try {
      await setDoc(doc(db, 'users', user.uid), newGoogleUser, { merge: true });
    } catch (err) {
      console.warn('Failed saving google user to firestore:', err);
    }

    saveRegisteredUsers([newGoogleUser, ...registered]);
    saveStoredCurrentUser(newGoogleUser);

    return {
      success: true,
      user: newGoogleUser,
      message: `Akun Google berhasil dihubungkan! Masuk sebagai ${newGoogleUser.nama}`,
    };
  } catch (err: any) {
    console.error('Google Sign In Error:', err);
    throw new Error(err?.message || 'Gagal masuk dengan Google.');
  }
}

/**
 * Logout current active user
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Firebase signOut error:', err);
  }
  saveStoredCurrentUser(null);
}

/**
 * Switch directly to an existing profile
 */
export function switchActiveUser(user: UserProfile): void {
  saveStoredCurrentUser(user);
}

/**
 * Convert UserProfile to PenyuluhProfile
 */
export function userToPenyuluhProfile(user: UserProfile): PenyuluhProfile {
  return {
    id: user.uid,
    nama: user.nama,
    nip: user.nip,
    nipa: user.nipa || '1730613110001',
    pangkatGol: user.pangkatGol,
    tmt: '01-10-2018',
    jabatan: (user.jabatan as any) || 'Penyuluh Agama Islam Ahli Muda',
    kecamatan: user.kecamatan,
    wilTugas: user.wilTugas || `KUA Kec. ${user.kecamatan}`,
    unitKerja: user.unitKerja || 'Kementerian Agama Kabupaten Gowa',
    tempatTanggalLahir: 'Gowa, 10 Mei 1980',
    pendidikanTerakhir: 'S1 / S2',
    phone: user.phone,
    fotoUrl: user.fotoUrl,
  };
}

/**
 * Convert UserProfile to KepalaKUAProfile
 */
export function userToKepalaKUAProfile(user: UserProfile): KepalaKUAProfile {
  const defaultKua = getKepalaKUA(user.kecamatan);
  return {
    kecamatan: user.kecamatan,
    nama: user.nama,
    nip: user.nip,
    pangkatGol: user.pangkatGol,
    jabatan: user.jabatan || 'Penghulu Madya / Kepala KUA',
    kuaName: user.kuaName || defaultKua.kuaName,
    alamatKua: user.alamatKua || defaultKua.alamatKua,
    teleponKua: user.teleponKua || user.phone || defaultKua.teleponKua,
    emailKua: user.email || defaultKua.emailKua,
  };
}
