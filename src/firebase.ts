import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup as fbSignInWithPopup, signOut as fbSignOut, onAuthStateChanged as fbOnAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc as fbDoc, getDoc as fbGetDoc, setDoc as fbSetDoc, updateDoc as fbUpdateDoc, arrayUnion as fbArrayUnion, onSnapshot as fbOnSnapshot, serverTimestamp as fbServerTimestamp, getDocFromServer, collection as fbCollection, query as fbQuery, orderBy as fbOrderBy, limit as fbLimit, getDocs as fbGetDocs } from 'firebase/firestore';

// Try to load the config safely using Vite's import.meta.glob
const configModules = import.meta.glob('../firebase-applet-config.json', { eager: true });
const importedConfig: any = configModules['../firebase-applet-config.json'] || { default: null };

let firebaseConfig: any = importedConfig.default || {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

export const isFirebaseConfigured = !!firebaseConfig.apiKey;

let app: any = null;
let auth: any = { currentUser: null };
let db: any = null;
let googleProvider: any = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    
    // Connection test
    async function testConnection() {
      try {
        await getDocFromServer(fbDoc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client appears to be offline.");
        }
      }
    }
    testConnection();
  } catch (e) {
    console.error("Firebase initialization error", e);
  }
}

// Safe wrappers that don't crash if Firebase is not configured
export const onAuthStateChanged = (authInstance: any, callback: any) => {
  if (!isFirebaseConfigured || !authInstance?.app) {
    callback(null);
    return () => {}; // dummy unsubscribe
  }
  return fbOnAuthStateChanged(authInstance, callback);
};

export const signInWithPopup = async (authInstance: any, provider: any) => {
  if (!isFirebaseConfigured || !authInstance?.app) throw new Error("Firebase not configured");
  return fbSignInWithPopup(authInstance, provider);
};

export const signOut = async (authInstance: any) => {
  if (!isFirebaseConfigured || !authInstance?.app) return;
  return fbSignOut(authInstance);
};

export const doc = (...args: any[]) => {
  if (!isFirebaseConfigured || !db) return {} as any;
  return fbDoc(db, ...(args.slice(1) as [any, any]));
};

export const collection = (...args: any[]) => {
  if (!isFirebaseConfigured || !db) return {} as any;
  return fbCollection(db, ...(args.slice(1) as [any]));
};

export const getDoc = async (reference: any) => {
  if (!isFirebaseConfigured) return { exists: () => false, data: () => ({}) } as any;
  return fbGetDoc(reference);
};

export const setDoc = async (reference: any, data: any, options?: any) => {
  if (!isFirebaseConfigured) return;
  return fbSetDoc(reference, data, options);
};

export const updateDoc = async (reference: any, data: any) => {
  if (!isFirebaseConfigured) return;
  return fbUpdateDoc(reference, data);
};

export const onSnapshot = (reference: any, callback: any, errorCallback?: any) => {
  if (!isFirebaseConfigured) {
    // Return empty snapshot immediately
    callback({ exists: () => false, data: () => ({}), docs: [], forEach: () => {} });
    return () => {};
  }
  return fbOnSnapshot(reference, callback, errorCallback);
};

export const getDocs = async (query: any) => {
  if (!isFirebaseConfigured) return { docs: [], forEach: () => {}, empty: true } as any;
  return fbGetDocs(query);
};

export const query = (...args: any[]) => {
  if (!isFirebaseConfigured) return {} as any;
  return fbQuery(args[0], ...args.slice(1));
};

export const orderBy = fbOrderBy;
export const limit = fbLimit;
export const arrayUnion = fbArrayUnion;
export const serverTimestamp = fbServerTimestamp;

export { auth, db, googleProvider };
export type { User };