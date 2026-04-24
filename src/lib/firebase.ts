import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  initializeFirestore, 
  serverTimestamp, 
  enableNetwork,
  getDocFromServer
} from 'firebase/firestore';
// Multi-Platform Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || "(default)"
};

// Use configuration
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use initializeFirestore with explicit long-polling for stability
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

// Connection Watchdog
async function testConnection() {
  try {
    // Attempt a stateless server-side fetch to verify networking
    await getDocFromServer(doc(db, 'system', 'handshake'));
    console.log("Trace X: Intelligence Stream Online");
  } catch (error: any) {
    if (error?.code === 'unavailable') {
      console.warn("Trace X: Firestore backend unreachable. Check Vercel environment variables or internet connection.");
    }
  }
}

testConnection();

export const googleProvider = new GoogleAuthProvider();

// Standard Error Handler for CTI Operations
export const handleFirestoreError = (error: any, operationType: string, path: string | null = null) => {
  console.error(`Trace X Diagnostic [${operationType}]:`, error);
  
  if (error?.code === 'permission-denied') {
    throw new Error(`SENTINEL_ACCESS_DENIED: You do not have authorization for this ${operationType} at ${path || 'target'}.`);
  }
  
  if (error?.code === 'unavailable') {
    throw new Error("SENTINEL_OFFLINE: Intelligence stream is temporarily unreachable. Retrying in 30s...");
  }

  throw error;
};

export const firebaseService = {
  // Auth
  signInWithGoogle: () => {
    return signInWithPopup(auth, googleProvider);
  },
  logout: () => {
    return signOut(auth);
  },
  
  // User Profile
  createUserProfile: async (user: any) => {
    const userRef = doc(db, 'users', user.uid);
    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Anonymous',
          createdAt: serverTimestamp()
        });
      }
    } catch (e) {
      console.warn("Profile sync delayed:", e);
    }
  },

  // Searches
  saveSearch: async (userId: string, type: string, value: string, report: any) => {
    try {
      await addDoc(collection(db, 'searches'), {
        userId,
        type,
        value,
        threatLevel: report.threatLevel || report['threatLevel'] || 'Unknown',
        confidence: Number(report.confidenceScore || report['confidenceScore'] || 0),
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error("Audit log failed:", e);
    }
  },

  getRecentSearches: async (userId: string) => {
    try {
      const q = query(
        collection(db, 'searches'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        timestamp: d.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString()
      }));
    } catch (e) {
      console.warn("Recent history unavailable:", e);
      return [];
    }
  }
};
