// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext'; // Importa useAuth
import Link from 'next/link';

const colors = {
  crimson: '#B31B1B',
  warmBeige: '#D9C3A3',
  darkGray: '#3E3E3E',
  lightGrayBg: '#F5F5F5',
  white: '#FFFFFF',
  darkText: '#3E3E3E',
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga para el botón
  const router = useRouter();
  const { login } = useAuth(); // Obtiene la función login del contexto

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      router.push('/'); // Redirige a la página de inicio después de iniciar sesión
    } else {
      setError('Credenciales incorrectas o usuario no encontrado.'); // Mensaje de error más genérico
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12" style={{ backgroundColor: colors.lightGrayBg }}>
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md" style={{ color: colors.darkText }}>
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: colors.crimson }}>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-crimson focus:border-crimson sm:text-sm"
              style={{ borderColor: colors.warmBeige }}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-crimson focus:border-crimson sm:text-sm"
              style={{ borderColor: colors.warmBeige }}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-300 ease-in-out"
            style={{ backgroundColor: colors.crimson }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
            disabled={loading} // Deshabilita el botón durante la carga
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" passHref>
            <span className="font-medium hover:underline cursor-pointer" style={{ color: colors.crimson }}>
              Crea una aquí
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}