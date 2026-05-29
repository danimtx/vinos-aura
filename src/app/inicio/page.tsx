'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const imagenesFondo = [
  '/fondo/fondo.jpg',
  '/fondo/fondo1.jpg',
  '/fondo/fondo2.jpg',
  '/fondo/fondo3.jpg',
];

export default function Inicio() {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 1) % imagenesFondo.length);
    }, 6000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Sección Hero Inmersiva */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Carrusel de Fondo con fundido elegante y zoom lento (Parallax feel) */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={indice}
            className="absolute inset-0 w-full h-full z-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          >
            <Image
              src={imagenesFondo[indice]}
              alt={`Vinos Aura Fondo ${indice + 1}`}
              fill
              className="object-cover"
              priority
            />
            {/* Overlay Oscuro para asegurar contraste de tipografía */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-[#080808]/70 to-[#080808]/40" />
          </motion.div>
        </AnimatePresence>

        {/* Contenido Central */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-5xl mt-20">
          
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            className="text-primary tracking-[0.3em] uppercase text-sm font-sans mb-6"
          >
            El Arte en cada botella
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-6xl md:text-8xl lg:text-[9rem] font-light leading-none mb-8 text-[#F5F5F0]"
            style={{ textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}
          >
            <span className="italic font-light">Vinos</span> Aura
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="text-muted text-lg md:text-xl font-sans max-w-2xl font-light mb-12"
          >
            Descubre la pasión detrás de cada botella. Una experiencia enológica diseñada para despertar los sentidos y redefinir la tradición.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <Link 
              href="/vinos"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-transparent text-primary font-sans tracking-widest uppercase text-sm overflow-hidden border border-primary/30 hover:border-primary transition-colors duration-500"
            >
              <span className="absolute inset-0 w-full h-full bg-primary/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></span>
              <span className="relative z-10 flex items-center gap-2">
                Explorar Catálogo
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Sección Secundaria Breve para incentivar scroll */}
      <section className="py-32 px-6 md:px-16 lg:px-32 bg-background relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h2 className="font-serif text-5xl md:text-6xl mb-6 text-foreground">
              Nuestra <span className="text-primary italic">Esencia</span>
            </h2>
            <p className="font-sans text-muted text-lg leading-relaxed mb-8 font-light">
              Cultivamos historias en cada viñedo. Vinos Aura nace de la obsesión por el detalle, 
              respetando los ciclos de la tierra y aplicando técnicas vanguardistas para ofrecer 
              caldos con una personalidad innegable y una textura sedosa que perdura en la memoria.
            </p>
            <Link href="/about" className="text-foreground hover:text-primary border-b border-primary/30 hover:border-primary pb-1 transition-colors font-sans uppercase tracking-widest text-xs">
              Conoce nuestra historia
            </Link>
          </motion.div>

          {/* Placeholder para una botella o imagen artística */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full aspect-video md:aspect-[16/9] relative bg-[#111] overflow-hidden group shadow-2xl"
          >
            <Image 
              src={imagenesFondo[2] || "/fondo/fondo.jpg"} 
              alt="Esencia Vinos Aura"
              fill
              className="object-cover opacity-60 group-hover:opacity-80 transition-all duration-1000 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 border border-primary/20 m-4 z-10 pointer-events-none transition-all duration-700 group-hover:m-2"></div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}