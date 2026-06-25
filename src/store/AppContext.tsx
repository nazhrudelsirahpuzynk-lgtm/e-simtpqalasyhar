import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Santri, Attendance, Evaluation, Announcement } from '../types';
import { db, auth, secondaryAuth } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

interface AppState {
  currentUser: User | null;
  users: User[];
  santri: Santri[];
  attendance: Attendance[];
  evaluations: Evaluation[];
  announcements: Announcement[];
  loading: boolean;
}

interface AppContextType extends AppState {
  login: (phone: string, pin: string) => Promise<User | null>;
  logout: () => Promise<void>;
  addSantri: (santri: Santri) => Promise<void>;
  updateSantri: (santri: Santri) => Promise<void>;
  deleteSantri: (id: string) => Promise<void>;
  addUser: (user: User) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addAttendance: (attendance: Attendance) => Promise<void>;
  addEvaluation: (evaluation: Evaluation) => Promise<void>;
  addAnnouncement: (announcement: Announcement) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    users: [],
    santri: [],
    attendance: [],
    evaluations: [],
    announcements: [],
    loading: true,
  });

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setState(s => ({ ...s, users: snap.docs.map(d => ({ id: d.id, ...d.data() }) as User) }));
    });
    const unsubSantri = onSnapshot(collection(db, 'santri'), (snap) => {
      setState(s => ({ ...s, santri: snap.docs.map(d => ({ id: d.id, ...d.data() }) as Santri) }));
    });
    const unsubAtt = onSnapshot(collection(db, 'attendance'), (snap) => {
      setState(s => ({ ...s, attendance: snap.docs.map(d => ({ id: d.id, ...d.data() }) as Attendance) }));
    });
    const unsubEval = onSnapshot(collection(db, 'evaluations'), (snap) => {
      setState(s => ({ ...s, evaluations: snap.docs.map(d => ({ id: d.id, ...d.data() }) as Evaluation) }));
    });
    const unsubAnn = onSnapshot(collection(db, 'announcements'), (snap) => {
      setState(s => ({ ...s, announcements: snap.docs.map(d => ({ id: d.id, ...d.data() }) as Announcement) }));
    });
    
    return () => {
      unsubUsers(); unsubSantri(); unsubAtt(); unsubEval(); unsubAnn();
    };
  }, []);

  useEffect(() => {
    if (state.users.length > 0) {
      const storedId = localStorage.getItem('tpq_user_id');
      if (storedId) {
        const user = state.users.find(u => u.id === storedId);
        if (user) {
          setState(s => ({ ...s, currentUser: user, loading: false }));
        } else {
          setState(s => ({ ...s, loading: false }));
        }
      } else {
        setState(s => ({ ...s, loading: false }));
      }
    } else {
       // if no users
       setState(s => ({ ...s, loading: false }));
    }
  }, [state.users]);

  const login = async (phone: string, pin: string) => {
    try {
      let user = state.users.find(u => u.phone === phone && u.password === pin);
      
      if (!user && state.users.length === 0 && phone === '08111' && pin === 'password') {
        const adminRef = doc(collection(db, 'users'));
        const adminUser: User = {
          id: adminRef.id,
          name: 'Administrator',
          phone: '08111',
          password: 'password',
          role: 'admin',
          isActive: true,
        };
        await setDoc(adminRef, adminUser);
        user = adminUser;
      }

      if (user) {
        localStorage.setItem('tpq_user_id', user.id);
        setState(s => ({ ...s, currentUser: user }));
        return user;
      }
      return null;
    } catch (e: any) {
      console.error(e);
      return null;
    }
  };

  const logout = async () => {
    localStorage.removeItem('tpq_user_id');
    setState(s => ({ ...s, currentUser: null }));
  };

  const addSantri = async (newSantri: Santri) => {
    const ref = doc(collection(db, 'santri'));
    newSantri.id = ref.id;
    await setDoc(ref, newSantri);
  };

  const updateSantri = async (updatedSantri: Santri) => {
    await setDoc(doc(db, 'santri', updatedSantri.id), updatedSantri);
  };

  const deleteSantri = async (id: string) => {
    await deleteDoc(doc(db, 'santri', id));
  };
  
  const addUser = async (user: User) => {
    try {
      const existing = state.users.find(u => u.phone === user.phone);
      if (existing) return;

      const ref = doc(collection(db, 'users'));
      const newUser = { ...user, id: ref.id };
      await setDoc(ref, newUser);
    } catch (e) {
      console.error(e);
    }
  };

  const updateUser = async (user: User) => {
    await setDoc(doc(db, 'users', user.id), user, { merge: true });
  };

  const deleteUser = async (id: string) => {
    await deleteDoc(doc(db, 'users', id));
  };

  const addAttendance = async (att: Attendance) => {
    const existing = state.attendance.find(a => a.santriId === att.santriId && a.date === att.date);
    if (existing) {
       await setDoc(doc(db, 'attendance', existing.id), att);
    } else {
       const ref = doc(collection(db, 'attendance'));
       att.id = ref.id;
       await setDoc(ref, att);
    }
  };

  const addEvaluation = async (ev: Evaluation) => {
    const ref = doc(collection(db, 'evaluations'));
    ev.id = ref.id;
    await setDoc(ref, ev);
  };

  const addAnnouncement = async (an: Announcement) => {
    const ref = doc(collection(db, 'announcements'));
    an.id = ref.id;
    await setDoc(ref, an);
  };

  return (
    <AppContext.Provider value={{
      ...state,
      login, logout, addSantri, updateSantri, deleteSantri, addUser, updateUser, deleteUser, addAttendance, addEvaluation, addAnnouncement
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
