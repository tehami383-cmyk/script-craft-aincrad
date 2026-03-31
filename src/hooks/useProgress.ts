import { useState, useEffect } from 'react';
import { curriculum } from '../data/curriculum';
import { auth, db, doc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot, serverTimestamp } from '../firebase';

export interface Progress {
  xp: number;
  completedExercises: string[];
}

export function getLevel(xp: number) {
  return Math.floor(xp / 100) + 1;
}

export function getLevelProgress(xp: number) {
  return (xp % 100) / 100;
}

export function getXpForNextLevel(level: number) {
  return level * 100;
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => {
    const saved = localStorage.getItem('aincrad_progress');
    if (saved) return JSON.parse(saved);
    return { xp: 0, completedExercises: [] };
  });

  const [loading, setLoading] = useState(true);

  // Sync with Firestore when logged in
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setProgress({
          xp: data.xp || 0,
          completedExercises: data.completedExercises || []
        });
      } else {
        // Initialize user profile in Firestore
        setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          xp: progress.xp,
          completedExercises: progress.completedExercises,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore sync error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  // Backup to localStorage
  useEffect(() => {
    localStorage.setItem('aincrad_progress', JSON.stringify(progress));
  }, [progress]);

  const addXp = async (amount: number) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        xp: progress.xp + amount,
        updatedAt: serverTimestamp()
      });
    } else {
      setProgress(p => ({ ...p, xp: p.xp + amount }));
    }
  };

  const completeExercise = async (exerciseId: string) => {
    if (progress.completedExercises.includes(exerciseId)) return;

    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        completedExercises: arrayUnion(exerciseId),
        xp: progress.xp + 50,
        updatedAt: serverTimestamp()
      });
    } else {
      setProgress(p => ({
        ...p,
        completedExercises: [...p.completedExercises, exerciseId],
        xp: p.xp + 50
      }));
    }
  };

  const saveCode = async (moduleId: string, exerciseId: string, code: string) => {
    const user = auth.currentUser;
    if (user) {
      const codeDocRef = doc(db, 'users', user.uid, 'code', exerciseId);
      await setDoc(codeDocRef, {
        uid: user.uid,
        moduleId,
        exerciseId,
        code,
        updatedAt: serverTimestamp()
      });
    }
    // Also save to localStorage for offline/quick access
    localStorage.setItem(`aincrad_code_${moduleId}_${exerciseId}`, code);
  };

  const getSavedCode = async (moduleId: string, exerciseId: string) => {
    const user = auth.currentUser;
    if (user) {
      const codeDocRef = doc(db, 'users', user.uid, 'code', exerciseId);
      const snapshot = await getDoc(codeDocRef);
      if (snapshot.exists()) {
        return snapshot.data().code;
      }
    }
    return localStorage.getItem(`aincrad_code_${moduleId}_${exerciseId}`) || '';
  };

  const isModuleUnlocked = (moduleId: string) => {
    const modIndex = curriculum.findIndex(m => m.id === moduleId);
    if (modIndex === 0) return true;
    
    const prevMod = curriculum[modIndex - 1];
    const allPrevCompleted = prevMod.exercises.every(e => progress.completedExercises.includes(e.id));
    return allPrevCompleted;
  };

  const getModuleProgress = (moduleId: string) => {
    const mod = curriculum.find(m => m.id === moduleId);
    if (!mod) return 0;
    
    const completed = mod.exercises.filter(e => progress.completedExercises.includes(e.id)).length;
    return completed / mod.exercises.length;
  };

  return { progress, loading, addXp, completeExercise, saveCode, getSavedCode, isModuleUnlocked, getModuleProgress };
}
