'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function About() {
  // Team Members Data
  const teamMembers = [
    { 
      name: 'MARIA JOSE VERA', 
      img: '/integrantes/majo.jpg', 
      alt: 'Maria Jose Vera', 
      experience: '10 años liderando proyectos de enología y viticultura, especializándose en la creación de vinos únicos.', 
      role: 'Enóloga Principal', 
      whatsapp: 'https://wa.me/1234567890', 
      cvLink: '#' 
    },
    { 
      name: 'MARCO DURAN', 
      img: '/integrantes/marco.jpeg', 
      alt: 'Marco Duran', 
      experience: '8 años diseñando campañas de marketing que han posicionado marcas vinícolas en mercados internacionales.', 
      role: 'Director de Marketing', 
      whatsapp: 'https://wa.me/1234567891', 
      cvLink: '#' 
    },
    { 
      name: 'DANIEL MANCILLA', 
      img: '/integrantes/dani.jpeg', 
      alt: 'Daniel Mancilla', 
      experience: '12 años como sommelier, guiando experiencias de cata para clientes premium en eventos globales.', 
      role: 'Sommelier y Asesor de Catas', 
      whatsapp: 'https://wa.me/1234567892', 
      cvLink: '#' 
    },
    { 
      name: 'SANTIAGO TAPIA', 
      img: '/integrantes/santi.jpeg', 
      alt: 'Santiago Tapia', 
      experience: '15 años supervisando la producción de vinos, asegurando estándares de calidad excepcionales.', 
      role: 'Jefe de Producción', 
      whatsapp: 'https://wa.me/1234567893', 
      cvLink: '#' 
    },
    { 
      name: 'HUGO ACOSTA', 
      img: '/integrantes/hugo.jpeg', 
      alt: 'Hugo Acosta', 
      experience: '7 años desarrollando sistemas tecnológicos para la gestión eficiente de bodegas.', 
      role: 'Desarrollador de Sistemas', 
      whatsapp: 'https://wa.me/1234567894', 
      cvLink: '#' 
    },
    { 
      name: 'VICTOR TAJA', 
      img: '/integrantes/vic.jpeg', 
      alt: 'Victor Taja', 
      experience: '9 años optimizando la logística y distribución de vinos a nivel global.', 
      role: 'Coordinador de Logística', 
      whatsapp: 'https://wa.me/1234567895', 
      cvLink: '#' 
    },
  ];

  // State Management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [year, setYear] = useState<number>(2022);
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  // Event Handlers
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));
    setSelectedMember(null);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1));
    setSelectedMember(null);
  };

  const handleImageClick = (index: number) => {
    setSelectedMember(selectedMember === index ? null : index);
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
  };

  // Animation for About Image and History on Scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleScroll = () => {
      const aboutSection = document.querySelector('section:nth-of-type(2)');
      const historySection = document.querySelector('section:nth-of-type(3)');
      if (aboutSection && !hasAnimated) {
        const rect = aboutSection.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          setIsImageVisible(true);
          setHasAnimated(true);
        }
      }
      if (historySection && !isHistoryVisible) {
        const rect = historySection.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          setIsHistoryVisible(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated, isHistoryVisible]);

  return (
    <div className="font-['EB_Garamond'] bg-[#F5F5F5] bg-opacity-90" style={{ color: '#3E3E3E' }}>
      {/* Video Section */}
      <section className="w-full h-96 relative overflow-hidden" style={{ backgroundColor: '#B31B1B' }}>
        <video
          className="w-full h-full object-cover absolute top-0 left-0 z-0"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/video/video1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 flex items-center justify-center text-center text-white z-10">
          <div>
            <p className="text-2xl font-bold mb-2 shoot-in-left">Descubre un espacio de calidad donde la pasión por el vino cobra vida.</p>
            <p className="text-lg italic shoot-in-right">"La esencia de una tradición"</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="flex flex-col md:flex-row items-start py-16 px-8" style={{ backgroundColor: '#D9C3A3' }}>
        <div className="w-full max-w-7xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-10 text-center" style={{ color: '#B31B1B', textShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)', letterSpacing: '2px' }}>
            ACERCA DE VINOS AURA
          </h1>
          <div className="flex flex-col md:flex-row items-start">
            <div className="flex-1 p-8 text-left md:pr-8">
              <p className="text-lg leading-relaxed mb-4 max-w-md">
                Bienvenidos a Vinos Aura, donde la tradición y la pasión se fusionan para crear experiencias únicas. Nos dedicamos a cultivar los mejores viñedos y elaborar vinos que reflejan la esencia de la tierra con un toque de innovación artesanal.
              </p>
              <p className="text-lg leading-relaxed mb-4 max-w-md">
                Nuestro compromiso es ofrecer calidad excepcional, desde la selección de uvas hasta el envejecimiento en bodegas de clase mundial. Únete a nosotros en este viaje de sabores y descubra la historia detrás de cada botella.
              </p>
            </div>
            <div className="flex-1 w-full p-4">
              <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg border-4 border-[#B31B1B]">
                <Image
                  src="/img/vinos-estanteria.jpg"
                  alt="Estantería de vinos"
                  className={`w-full h-full object-cover ${hasAnimated ? 'opacity-100 scale-100' : isImageVisible ? 'opacity-100 scale-100 animate-slideIn' : 'opacity-0 scale-90'}`}
                  width={600}
                  height={384}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#B31B1B] to-transparent opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
          {/* Separator Line */}
          <div className="w-1/2 mx-auto h-0.5 bg-gray-400 rounded-full mt-8 opacity-50"></div>
        </div>
      </section>

      {/* Nuestra Historia Section */}
      <section className="py-16 px-8" style={{ backgroundColor: '#A68B5B' }}>
        <div className="w-full max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-10" style={{ color: '#B31B1B', textShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)', letterSpacing: '2px', animation: 'fadeInUp 1s ease-out' }}>
            NUESTRA HISTORIA
          </h2>
          <h3 className="text-2xl font-semibold mb-10" style={{ color: '#D9C3A3', textShadow: '3px 3px 6px rgba(0, 0, 0, 0.2)', letterSpacing: '1px', animation: 'fadeInUp 1.2s ease-out' }}>
            LÍNEA DE TIEMPO
          </h3>
          <div className="relative mb-12">
            <div className="flex justify-between items-start mb-6">
              {['2022', '2023', '2024', '2025'].map((y) => (
                <div key={y} className="text-center">
                  <span
                    className="block text-xl font-semibold mb-2"
                    style={{ color: year === parseInt(y) ? '#B31B1B' : '#D9C3A3', transition: 'color 0.3s' }}
                  >
                    {y}
                  </span>
                  <div
                    onClick={() => handleYearChange(parseInt(y))}
                    className={`w-5 h-5 rounded-full cursor-pointer ${year === parseInt(y) ? 'bg-[#B31B1B] scale-150' : 'bg-[#D9C3A3]'} transition-all duration-300 hover:scale-125`}
                  ></div>
                </div>
              ))}
            </div>
            <div className="w-full h-2 bg-beige rounded-lg overflow-hidden border-2 border-[#B31B1B] shadow-md">
              <div
                className="h-2 bg-gradient-to-r from-[#D9C3A3] via-[#C5A55B] to-[#B31B1B] rounded-lg transition-all duration-1000 ease-in-out"
                style={{ width: `${((year - 2022) / 3) * 100}%`, boxShadow: '0 0 15px rgba(179, 27, 27, 0.6)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'linear-gradient(to right, #D9C3A3, #C5A55B, #A68B5B)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(to right, #D9C3A3, #C5A55B, #B31B1B)')}
              ></div>
            </div>
          </div>
          <div className="text-center mb-8 timeline-content" key={year}>
            <h3 className={`text-3xl font-bold mb-4 ${isHistoryVisible ? 'fade-in' : ''}`} style={{ color: '#B31B1B', textShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)' }}>
              {year === 2022 && 'Viñedos'}
              {year === 2023 && 'Creación del Vino Aura Terruña'}
              {year === 2024 && 'Bodegas de Aura Terruña'}
              {year === 2025 && 'Creación del Logo'}
            </h3>
            <div className={`rounded-lg overflow-hidden shadow-xl flex justify-center items-center ${isHistoryVisible ? 'fade-in' : ''}`} style={{ height: '300px', margin: '0 auto' }}>
              <Image
                src={
                  year === 2022 ? '/viñedos/viñedo1.jpg' :
                  year === 2023 ? '/viñedos/vino-pre.jpg' :
                  year === 2024 ? '/viñedos/bodega1.jpg' :
                  '/viñedos/logo-color.png'
                }
                alt={`Imagen ${year}`}
                className={`object-cover transition-transform duration-500`}
                width={300}
                height={300}
                style={{ maxWidth: '100%', height: '100%' }}
              />
            </div>
            <p className={`mt-6 text-lg leading-relaxed max-w-lg mx-auto text-[#3E3E3E] p-4 rounded-lg shadow-md ${isHistoryVisible ? 'fade-in-text' : ''}`} style={{ backgroundColor: 'rgba(217, 195, 163, 0.8)' }}>
              {year === 2022 && 'En 2022, comenzamos con el cultivo de nuestros viñedos, seleccionando las mejores tierras para dar vida a nuestra pasión por el vino.'}
              {year === 2023 && 'En 2023, creamos el Vino Aura Terruña, uniendo tradición e innovación en cada botella con un sabor único.'}
              {year === 2024 && 'En 2024, inauguramos las Bodegas de Aura Terruña, un espacio emblemático para la producción y envejecimiento de nuestros vinos premium.'}
              {year === 2025 && 'En 2025, diseñamos el logo de Aura Terruña, un símbolo que encapsula nuestra identidad y legado vinícola.'}
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        className="py-16 px-8 text-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/contactos/contactos1.webp)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#3E3E3E'
        }}
      >
        <h2
          className="text-7xl font-extrabold mb-8 uppercase relative inline-block transition-all duration-300"
          style={{
            color: '#D9C3A3',
            textShadow: '6px 6px 12px rgba(0, 0, 0, 0.6), 0 0 10px rgba(217, 195, 163, 0.7)',
            letterSpacing: '2px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#E0D0B0';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#D9C3A3';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          EQUIPO
          <span
            className="absolute left-0 bottom-0 h-1 w-full"
            style={{
              backgroundColor: '#C7B39A',
              transform: 'scaleX(0)',
              transformOrigin: 'bottom right',
              transition: 'transform 0.3s ease-in-out',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scaleX(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scaleX(0)')}
          ></span>
        </h2>
        <div className="relative w-full max-w-md mx-auto">
          <div className="relative w-full overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {teamMembers.map((member, index) => (
                <div
                  key={member.name}
                  className="flex-none w-full cursor-pointer relative hover:scale-102 transition-transform duration-300"
                  onClick={() => handleImageClick(index)}
                >
                  <div className="relative w-80 h-80 mx-auto">
                    <div
                      className="absolute inset-0 rounded-lg shadow-lg"
                      style={{
                        backgroundColor: '#D9C3A3',
                        border: '2px solid #B31B1B',
                        transform: 'rotate(-2deg)',
                        transition: 'transform 0.3s ease-in-out',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      }}
                    ></div>
                    <Image
                      src={member.img}
                      alt={member.alt}
                      className="relative w-full h-full object-cover rounded-lg border-2 border-[#B31B1B] shadow-md hover:scale-105 transition-transform duration-300"
                      width={320}
                      height={320}
                    />
                  </div>
                  <h3 className="text-lg font-bold mt-4 mb-1" style={{ color: '#D9C3A3', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
                    {member.name}
                  </h3>
                  <p
                    className="text-base font-extrabold leading-relaxed transition-all duration-200 relative inline-block px-2 py-1 rounded"
                    style={{
                      color: '#C5A55B',
                      textShadow: '3px 3px 6px rgba(0, 0, 0, 0.4)',
                      backgroundColor: 'rgba(217, 195, 163, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#D9C3A3';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#C5A55B';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {member.role}
                  </p>

                  {selectedMember === index && (
                    <div
                      className="absolute inset-0 rounded-lg p-6 flex flex-col items-center justify-center shadow-xl transition-all duration-500 ease-in-out"
                      style={{
                        backgroundColor: '#C5A55B',
                        animation: 'cardPop 0.5s ease-in-out',
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
                      }}
                    >
                      <div className="relative w-48 h-48 mb-4">
                        <div
                          className="absolute inset-0 rounded-full shadow-lg"
                          style={{
                            backgroundColor: 'rgba(199, 179, 154, 0.7)',
                            border: '2px solid #B31B1B',
                            transform: 'rotate(-2deg)',
                            transition: 'transform 0.3s ease-in-out',
                          }}
                        ></div>
                        <Image
                          src={member.img}
                          alt={member.alt}
                          className="relative w-full h-full object-cover rounded-full border-2 border-[#B31B1B] shadow-md"
                          width={192}
                          height={192}
                        />
                      </div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#D9C3A3', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
                        Nombre: {member.name}
                      </h3>
                      <p className="text-sm leading-relaxed mb-2 text-center" style={{ color: '#3E3E3E', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
                        Experiencia: {member.experience}
                      </p>
                      <p
                        className="text-base font-extrabold leading-relaxed mb-4 text-center transition-all duration-200 relative inline-block px-2 py-1 rounded"
                        style={{
                          color: '#C5A55B',
                          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.4)',
                          backgroundColor: 'rgba(217, 195, 163, 0.2)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#D9C3A3';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#C5A55B';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        Cargo: {member.role}
                      </p>
                      <div className="flex gap-2">
                        <a
                          href={member.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full hover:bg-[#C5A55B] transition-colors"
                          style={{ backgroundColor: '#B31B1B' }}
                        >
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.87.51 3.65 1.43 5.19L2 22l4.81-1.43A9.95 9.95 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm3.88 15.44c-.41.12-1.23.39-2.34.24-1.81-.24-3.3-1.43-4.03-3.03-.51-1.13-.79-2.45-.79-3.85 0-1.39.27-2.71.79-3.84.73-1.6 2.22-2.79 4.03-3.03 1.11-.15 1.93.12 2.34.24.41.12.74.39.92.79l.58 1.74c.12.36.03.76-.24 1.03l-.97.97c-.27.27-.36.67-.24 1.03.24.73.67 1.4 1.2 2.01.54.61 1.15 1.07 1.88 1.31.36.12.76.03 1.03-.24l.97-.97c.27-.27.67-.36 1.03-.24l1.74.58c.39.18.67.51.79.92.15.41-.03.92-.24 1.23-1.11 1.71-2.79 2.79-4.65 3.12z"/>
                          </svg>
                        </a>
                        <a
                          href={member.cvLink}
                          className="p-2 rounded-full hover:bg-[#C5A55B] transition-colors"
                          style={{ backgroundColor: '#B31B1B' }}
                        >
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full hover:bg-[#D9C3A3] hover:scale-110 transition-all duration-300 opacity-70 hover:opacity-100 hover:shadow-xl"
            style={{ backgroundColor: 'rgba(217, 195, 163, 0.5)' }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full hover:bg-[#D9C3A3] hover:scale-110 transition-all duration-300 opacity-70 hover:opacity-100 hover:shadow-xl"
            style={{ backgroundColor: 'rgba(217, 195, 163, 0.5)' }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Keyframe Animations */}
      <style jsx>{`
        @keyframes cardPop {
          0% {
            transform: scale(0) rotate(-5deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(2deg);
            opacity: 0.7;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        @keyframes shootInLeft {
          0% {
            transform: translateX(-100vw);
            opacity: 0;
          }
          70% {
            transform: translateX(20px);
            opacity: 0.7;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes shootInRight {
          0% {
            transform: translateX(100vw);
            opacity: 0;
          }
          70% {
            transform: translateX(-20px);
            opacity: 0.7;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-100px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInText {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes timelineTransition {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .shoot-in-left {
          animation: shootInLeft 1s ease-out forwards;
        }
        .shoot-in-right {
          animation: shootInRight 1s ease-out forwards;
          animation-delay: 0.3s;
        }
        h2:hover span {
          transform: scaleX(1);
        }
        .fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        .fade-in-scale {
          animation: fadeInScale 1s ease-out forwards;
        }
        .animate-slideIn {
          animation: slideIn 1s ease-out forwards;
        }
        .fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .fade-in-text {
          animation: fadeInText 0.5s ease-out forwards;
        }
        .timeline-content {
          animation: timelineTransition 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}