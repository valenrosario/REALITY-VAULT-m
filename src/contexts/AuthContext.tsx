import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../../firebase';
import { User, AuthState } from '../../types';
import { AVATAR_OPTIONS } from '../../constants';

interface AuthContextType extends AuthState {
  logout: () => Promise<void>;
  updateUserData: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isReady: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setState({ user: userData, loading: false, isReady: true });
          } else {
            // Check if it's a guest user from current local storage
            const guestDataStr = localStorage.getItem('guest_user_data');
            if (guestDataStr) {
               const guestData = JSON.parse(guestDataStr);
               if (guestData.uid === firebaseUser.uid) {
                  setState({ user: guestData, loading: false, isReady: true });
                  return;
               }
            }
            
      // Fallback for new social login or similar
      const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Nuevo Usuario',
        avatar: AVATAR_OPTIONS[0],
        favorites: [],
        watchedEpisodes: [],
        isPremium: false,
      };
      // Persist the fallback profile so it's not missing next time
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
      }
      setState({ user: newUser, loading: false, isReady: true });
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          setState({ user: null, loading: false, isReady: true });
        }
      } else {
        // Check local storage for guest session
        const guestDataStr = localStorage.getItem('guest_user_data');
        if (guestDataStr) {
          try {
            const guestData = JSON.parse(guestDataStr);
            setState({ user: guestData, loading: false, isReady: true });
          } catch (e) {
            setState({ user: null, loading: false, isReady: true });
          }
        } else {
          setState({ user: null, loading: false, isReady: true });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await auth.signOut();
    localStorage.removeItem('guest_user_data');
    localStorage.removeItem('guest_uid');
    setState(prev => ({ ...prev, user: null }));
  };

  const updateUserData = async (data: Partial<User>) => {
    if (!state.user) return;
    
    const updatedUser = { ...state.user, ...data };
    
    // Optimistic update
    setState(prev => ({ ...prev, user: updatedUser }));

    if (!state.user.uid.startsWith('guest_')) {
      try {
        await setDoc(doc(db, 'users', state.user.uid), updatedUser, { merge: true });
      } catch (error) {
        // Rollback on error
        setState(prev => ({ ...prev, user: state.user }));
        handleFirestoreError(error, OperationType.UPDATE, `users/${state.user.uid}`);
      }
    } else {
      localStorage.setItem('guest_user_data', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
