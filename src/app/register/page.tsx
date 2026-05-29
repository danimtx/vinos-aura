// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    setLoading(true);

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    const success = await register(email, password, name);
    setLoading(false);

    if (success) {
      setMessage('Cuenta creada con éxito. Redirigiendo...');
      setMessageType('success');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setMessage('Error al crear la cuenta. Inténtalo de nuevo.');
      setMessageType('error');
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-8 bg-[#111] border border-white/5 p-10 rounded-sm shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        
        <div>
          <span className="text-primary tracking-[0.3em] uppercase text-xs font-sans block mb-2 text-center">
            Únete a Vinos Aura
          </span>
          <h2 className="text-center text-4xl font-serif font-light text-[#F5F5F0]">
            Crear <span className="italic text-primary">Cuenta</span>
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="block text-xs font-sans tracking-widest uppercase text-muted mb-2">
                Nombre Completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-[#151515] text-[#F5F5F0] rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm font-sans font-light transition-colors"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-sans tracking-widest uppercase text-muted mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-[#151515] text-[#F5F5F0] rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm font-sans font-light transition-colors"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-sans tracking-widest uppercase text-muted mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-[#151515] text-[#F5F5F0] rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm font-sans font-light transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-sans tracking-widest uppercase text-muted mb-2">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-[#151515] text-[#F5F5F0] rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm font-sans font-light transition-colors"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div className={`text-sm font-sans font-light text-center border py-2 rounded-sm ${messageType === 'error' ? 'text-accent border-accent/20 bg-accent/5' : 'text-[#D9C3A3] border-[#D9C3A3]/20 bg-[#D9C3A3]/5'}`}>
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-xs tracking-widest uppercase font-bold rounded-sm text-white bg-accent hover:bg-[#8B1313] focus:outline-none transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>
        
        <div className="text-center border-t border-white/5 pt-6 mt-6">
          <p className="font-sans font-light text-sm text-muted">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-[#f5f5f0] transition-colors border-b border-primary/30 hover:border-[#f5f5f0]">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}