'use client';

import Image from 'next/image';
import fondo from '../../../public/fondo/fondo.png';

export default function Inicio() {
  return (
    <div className="font-['EB_Garamond'] bg-[#F5F5F5]" style={{ color: '#3E3E3E' }}>
      {/* Hero Section */}
      <section className="relative h-screen w-full">
        <Image
          src={fondo}
          alt="Vinos Aura Hero"
          className="absolute inset-0 w-full h-full object-cover"
          fill
          priority
        />
        <div className="relative z-10 flex items-center justify-center h-full bg-black bg-opacity-50">
          <div className="text-center p-8 max-w-4xl">
            <h1
              className="text-5xl font-bold mb-4 uppercase"
              style={{ color: '#B31B1B' }}
            >
              VINOS AURA
            </h1>
            <p className="text-xl mb-6 text-white leading-relaxed">
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
          </div>
        </div>
      </section>
    </div>
  );
}