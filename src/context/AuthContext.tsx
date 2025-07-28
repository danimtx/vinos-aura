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
      // Usar las variables globales de Canvas
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
        apiKey: "AIzaSyDc6tTkgSRnF4mHWBQ_U_WWwRHgkOlO0GQ",
        authDomain: "vinos-aura.firebaseapp.com",
        projectId: "vinos-aura",
        storageBucket: "vinos-aura.firebasestorage.app",
        messagingSenderId: "134347867795",
        appId: "1:134347867795:web:0dcb50158867118df12f66"
      };

      firebaseApp = initializeApp(firebaseConfig);
      firebaseAuth = getAuth(firebaseApp);
      setAuth(firebaseAuth);

      // Manejar el token de autenticación inicial de Canvas
      const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
        if (currentUser) {
          setIsAuthenticated(true);
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName, // Firebase puede tener displayName
          });
          setUserId(currentUser.uid);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setUserId(null);

          // Si no hay usuario autenticado y hay un token inicial, intenta iniciar sesión con él
          if (initialAuthToken) {
            try {
              await signInWithCustomToken(firebaseAuth, initialAuthToken);
              console.log('Signed in with custom token from Canvas.');
            } catch (error) {
              console.error('Error signing in with custom token:', error);
              // Si falla el token, intenta con anónimo como fallback
              try {
                await signInAnonymously(firebaseAuth);
                console.log('Signed in anonymously as custom token failed or was not provided.');
              } catch (anonError) {
                console.error('Error signing in anonymously:', anonError);
              }
            }
          } else {
            // Si no hay token inicial, inicia sesión anónimamente por defecto
            try {
              await signInAnonymously(firebaseAuth);
              console.log('Signed in anonymously as no initial token was provided.');
            } catch (anonError) {
              console.error('Error signing in anonymously:', anonError);
            }
          }
        }
        setLoading(false); // La carga inicial ha terminado
      });

      return () => unsubscribe(); // Limpiar el listener al desmontar
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