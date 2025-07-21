'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const imagenesFondo = [
  '/fondo/fondo.jpg',
  '/fondo/fondo1.jpg',
  '/fondo/fondo2.jpg',
  '/fondo/fondo3.jpg',
];

export default function Inicio() {
  const [indice, setIndice] = useState(1);
  const [imagenAnterior, setImagenAnterior] = useState(imagenesFondo[0]);
  const [cambiando, setCambiando] = useState(false);
  const primeraTransicion = useRef(true);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setCambiando(true);

      setTimeout(() => {
        setImagenAnterior(imagenesFondo[indice]);
        setIndice((prev) => (prev + 1) % imagenesFondo.length);
        setCambiando(false);
        primeraTransicion.current = false;
      }, 2500);
    }, 5000);

    return () => clearInterval(intervalo);
  }, [indice]);

  return (
    <div className="font-['EB_Garamond'] bg-[#F5F5F5]" style={{ color: '#3E3E3E' }}>
      <section className="relative h-screen w-full overflow-hidden">
        {/* Imagen anterior */}
        <motion.div
          key={`anterior-${imagenAnterior}`}
          className="absolute inset-0 w-full h-full z-0"
          initial={{ opacity: 1, scale: 1 }}
          animate={cambiando ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
        >
          <Image
            src={imagenAnterior}
            alt="Imagen anterior"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Imagen nueva */}
        <motion.div
          key={`nueva-${imagenesFondo[indice]}`}
          className="absolute inset-0 w-full h-full z-10"
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 2.5,
            ease: 'easeInOut',
            delay: primeraTransicion.current ? 0 : 2.5,
          }}
        >
          <Image
            src={imagenesFondo[indice]}
            alt="Imagen nueva"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Contenido */}
        <div className="relative z-20 flex items-center justify-center h-full">
          <motion.div
            className="text-center p-8 max-w-4xl"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1
              className="text-7xl font-bold mb-4 uppercase"
              style={{
                color: '#B31B1B',
                textShadow: '3px 3px 6px rgba(0, 0, 0, 0.5)',
              }}
            >
              VINOS AURA
            </h1>
            <p
              className="text-2xl mb-6 text-white leading-relaxed font-semibold"
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '10px 20px',
                borderRadius: '8px',
              }}
            >
              Descubre la pasión detrás de cada botella. Explora nuestros vinos excepcionales y sumérgete en la experiencia única de VINOS AURA.
            </p>
            <a
              href="/vinos"
              className="inline-block px-6 py-3 rounded-md font-bold"
              style={{ backgroundColor: '#B31B1B', color: '#FFF', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#B31B1B')}
            >
              Explora Nuestros Vinos
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}