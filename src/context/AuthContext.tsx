// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  signInWithCustomToken, // Importar para el token inicial de Canvas
  signInAnonymously // Importar para inicio de sesión anónimo si no hay token
} from 'firebase/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { uid: string; email: string | null; name: string | null } | null;
  userId: string | null; // Añadimos userId para facilitar el acceso
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>; // Añadimos función de registro
  logout: () => void;
  loading: boolean; // Para indicar si la autenticación inicial está cargando
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ uid: string; email: string | null; name: string | null } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Estado de carga inicial de Firebase
  const [auth, setAuth] = useState<Auth | null>(null); // Instancia de Auth de Firebase

  useEffect(() => {
    let firebaseApp: FirebaseApp;
    let firebaseAuth: Auth;

    try {
      // Configuración directa de Firebase (sin variables globales)
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET , // Corrige el dominio aquí
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      };

      firebaseApp = initializeApp(firebaseConfig);
      firebaseAuth = getAuth(firebaseApp);
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
          // Si quieres login anónimo por defecto:
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
      console.error("Failed to initialize Firebase:", error);
      setLoading(false);
    }
  }, []); // Array de dependencias vacío para ejecutar solo una vez al montar

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
      // Opcional: Actualizar el perfil del usuario con el nombre
      if (userCredential.user) {
        // await updateProfile(userCredential.user, { displayName: name }); // Requires updateProfile from 'firebase/auth'
      }
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

  // Muestra un estado de carga mientras Firebase se inicializa y autentica
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px', color: colors.darkText }}>
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

// Definición de colores para el estado de carga
const colors = {
  crimson: '#B31B1B',
  warmBeige: '#D9C3A3',
  darkGray: '#3E3E3E',
  lightGrayBg: '#F5F5F5',
  white: '#FFFFFF',
  darkText: '#3E3E3E',
  golden: '#C5A55B',
};