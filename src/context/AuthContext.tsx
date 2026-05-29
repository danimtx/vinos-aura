// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously
} from 'firebase/auth';

// Importar la app de Firebase que ya está inicializada
import { app } from '@/lib/firebase';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { uid: string; email: string | null; name: string | null } | null;
  userId: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ uid: string; email: string | null; name: string | null } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    try {
      // Verificar si la app de Firebase se inicializó correctamente
      if (!app) {
        console.warn("Firebase no está configurado (falta .env.local).");
        setLoading(false);
        return;
      }

      // Si app existe, obtenemos la autenticación
      const firebaseAuth = getAuth(app);
      setAuth(firebaseAuth);

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
        if (currentUser) {
          setIsAuthenticated(true);
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName,
          });
          setUserId(currentUser.uid);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setUserId(null);
          // Opcional: Login anónimo si no hay usuario
          try {
            await signInAnonymously(firebaseAuth);
            console.log('Signed in anonymously as no user was provided.');
          } catch (anonError) {
            console.error('Error signing in anonymously:', anonError);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to initialize Firebase Auth:", error);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!auth) {
      console.error('Firebase Auth no está inicializado.');
      return false;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Inicio de sesión exitoso con Firebase.');
      return true;
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error.message);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    if (!auth) {
      console.error('Firebase Auth no está inicializado.');
      return false;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registro exitoso con Firebase.');
      return true;
    } catch (error: any) {
      console.error('Error al registrar usuario:', error.message);
      return false;
    }
  };

  const logout = async () => {
    if (!auth) {
      console.error('Firebase Auth no está inicializado.');
      return;
    }
    try {
      await signOut(auth);
      console.log('Sesión cerrada con Firebase.');
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    userId,
    login,
    register,
    logout,
    loading,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-muted bg-background">
        Cargando autenticación...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};