'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function About() {
  // Team Members Data
  const teamMembers = [
    { 
      name: 'DANIEL MANCILLA', 
      img: '/integrantes/daniel.png', 
      alt: 'Daniel Mancilla', 
      experience: '12 años como sommelier, guiando experiencias de cata para clientes premium en eventos globales.', 
      role: 'Sommelier y Asesor de Catas', 
      whatsapp: 'https://wa.me/59171168130', 
      cvLink: 'https://www.linkedin.com/in/daniel-mancilla-tejerina-126b07307?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' 
    },
    { 
      name: 'MARIA JOSE VERA', 
      img: '/integrantes/majo.jpg', 
      alt: 'Maria Jose Vera', 
      experience: '10 años liderando proyectos de enología y viticultura, especializándose en la creación de vinos únicos.', 
      role: 'Enóloga Principal', 
      whatsapp: 'https://wa.me/59163783487', 
      cvLink: 'https://www.linkedin.com/in/maria-jose-vera-256352374?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app' 
    },
    { 
      name: 'MARCO DURAN', 
      img: '/integrantes/marco.jpeg', 
      alt: 'Marco Duran', 
      experience: '8 años diseñando campañas de marketing que han posicionado marcas vinícolas en mercados internacionales.', 
      role: 'Director de Marketing', 
      whatsapp: 'https://wa.me/59163796968', 
      cvLink: 'https://www.linkedin.com/in/sebastian-duran-583a88325/' 
    },
    { 
      name: 'SANTIAGO TAPIA', 
      img: '/integrantes/santi.jpeg', 
      alt: 'Santiago Tapia', 
      experience: '15 años supervisando la producción de vinos, asegurando estándares de calidad excepcionales.', 
      role: 'Jefe de Producción', 
      whatsapp: 'https://wa.me/59168690966', 
      cvLink: 'https://www.linkedin.com/in/santiago-tapia-flores-3a1824371?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app' 
    },
    { 
      name: 'HUGO ACOSTA', 
      img: '/integrantes/hugo.jpeg', 
      alt: 'Hugo Acosta', 
      experience: '7 años desarrollando sistemas tecnológicos para la gestión eficiente de bodegas.', 
      role: 'Desarrollador de Sistemas', 
      whatsapp: 'https://wa.me/59175143175', 
      cvLink: '#' 
    },
    { 
      name: 'VICTOR TAJA', 
      img: '/integrantes/vic.jpeg', 
      alt: 'Victor Taja', 
      experience: '9 años optimizando la logística y distribución de vinos a nivel global.', 
      role: 'Coordinador de Logística', 
      whatsapp: 'https://wa.me/5917543673', 
      cvLink: 'https://www.linkedin.com/in/victor-joel-taja-fern%C3%A1ndez-88232136a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' 
    },
  ];

  // State Management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [year, setYear] = useState<number>(2022);

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

  const timelineData = {
    2022: { title: 'Viñedos', img: '/viñedos/viñedo1.jpg', text: 'En 2022, comenzamos con el cultivo de nuestros viñedos, seleccionando las mejores tierras para dar vida a nuestra pasión por el vino.' },
    2023: { title: 'Creación del Vino Aura Terruña', img: '/viñedos/vino-pre.jpg', text: 'En 2023, creamos el Vino Aura Terruña, uniendo tradición e innovación en cada botella con un sabor único.' },
    2024: { title: 'Bodegas de Aura Terruña', img: '/viñedos/bodega1.jpg', text: 'En 2024, inauguramos las Bodegas de Aura Terruña, un espacio emblemático para la producción y envejecimiento de nuestros vinos premium.' },
    2025: { title: 'Creación del Logo', img: '/viñedos/logo-color.png', text: 'En 2025, diseñamos el logo de Aura Terruña, un símbolo que encapsula nuestra identidad y legado vinícola.' },
  };

  return (
    <div className="bg-background text-foreground min-h-screen relative z-10 overflow-hidden">
      {/* Video Section */}
      <section className="w-full h-[70vh] relative overflow-hidden flex items-center justify-center">
        <video
          className="w-full h-full object-cover absolute top-0 left-0 z-0 opacity-40 mix-blend-luminosity"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/video/video1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background z-10"></div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.p 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-2xl md:text-4xl font-serif font-light mb-4 leading-relaxed"
          >
            Descubre un espacio de calidad donde la <span className="text-primary italic">pasión</span> por el vino cobra vida.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-lg md:text-xl font-sans text-muted tracking-widest uppercase text-xs"
          >
            "La esencia de una tradición"
          </motion.p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 md:px-16 lg:px-32 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <span className="text-primary tracking-[0.3em] uppercase text-xs font-sans block mb-4">
            Nuestro Legado
          </span>
          <h2 className="text-5xl md:text-6xl font-serif font-light text-[#F5F5F0]">
            Acerca de <span className="italic text-primary">Vinos Aura</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-sans font-light text-muted text-lg leading-relaxed space-y-6"
          >
            <p>
              Bienvenidos a Vinos Aura, donde la tradición y la pasión se fusionan para crear experiencias únicas. Nos dedicamos a cultivar los mejores viñedos y elaborar vinos que reflejan la esencia de la tierra con un toque de innovación artesanal.
            </p>
            <p>
              Nuestro compromiso es ofrecer calidad excepcional, desde la selección de uvas hasta el envejecimiento en bodegas de clase mundial. Únete a nosotros en este viaje de sabores y descubra la historia detrás de cada botella.
            </p>
            <div className="w-16 h-[1px] bg-primary/50 mt-8"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2 }}
            className="relative w-full aspect-[4/3] rounded-sm overflow-hidden border border-white/5 shadow-2xl group"
          >
            <Image
              src="/img/vinos-estanteria.jpg"
              alt="Estantería de vinos"
              fill
              className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
              priority
            />
            <div className="absolute inset-0 border border-primary/20 m-4 pointer-events-none z-10 transition-all duration-700 group-hover:m-2"></div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6 md:px-16 bg-[#0a0a0a] border-y border-white/5 relative">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-light mb-16 text-[#F5F5F0]"
          >
            Nuestra <span className="italic text-primary">Historia</span>
          </motion.h2>

          <div className="relative mb-20 max-w-3xl mx-auto">
            <div className="flex justify-between items-end mb-6 relative z-10">
              {[2022, 2023, 2024, 2025].map((y) => (
                <div key={y} className="flex flex-col items-center cursor-pointer group" onClick={() => setYear(y)}>
                  <span className={`text-sm md:text-lg font-serif transition-colors duration-300 mb-4 ${year === y ? 'text-primary text-xl' : 'text-muted group-hover:text-white'}`}>
                    {y}
                  </span>
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 border border-background ${year === y ? 'bg-primary scale-150 shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-white/20 group-hover:bg-primary/50'}`}></div>
                </div>
              ))}
            </div>
            {/* Track */}
            <div className="absolute bottom-[5px] left-0 w-full h-[2px] bg-white/10 z-0">
              <motion.div 
                className="h-full bg-primary"
                animate={{ width: `${((year - 2022) / 3) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center gap-12 text-left"
            >
              <div className={`w-full md:w-1/2 relative aspect-square md:aspect-[4/3] rounded-sm overflow-hidden border border-white/5 ${year === 2025 ? 'bg-white/5' : 'bg-[#111]'}`}>
                <Image
                  src={(timelineData as any)[year].img}
                  alt={(timelineData as any)[year].title}
                  fill
                  className={`opacity-80 hover:opacity-100 transition-opacity duration-500 ${year === 2022 || year === 2024 ? 'object-cover' : 'object-contain p-4'}`}
                />
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-3xl font-serif font-light mb-6 text-foreground">
                  {(timelineData as any)[year].title}
                </h3>
                <p className="font-sans font-light text-muted text-lg leading-relaxed">
                  {(timelineData as any)[year].text}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 px-6 md:px-16 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/contactos/contactos1.webp')] bg-cover bg-center bg-fixed opacity-10 mix-blend-screen pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <span className="text-primary tracking-[0.3em] uppercase text-xs font-sans block mb-4">
              Las manos detrás del vino
            </span>
            <h2 className="text-5xl md:text-6xl font-serif font-light text-[#F5F5F0]">
              Nuestro <span className="italic text-primary">Equipo</span>
            </h2>
          </motion.div>

          <div className="relative w-full max-w-sm md:max-w-xl lg:max-w-4xl mx-auto">
            <div className="overflow-hidden pb-12">
              <motion.div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {teamMembers.map((member, index) => (
                  <div key={member.name} className="flex-none w-full px-4 lg:w-1/2">
                    <div 
                      className="group relative bg-[#111] border border-white/5 p-8 rounded-sm hover:border-primary/30 transition-all duration-500 cursor-pointer h-full flex flex-col items-center text-center"
                      onClick={() => handleImageClick(index)}
                    >
                      <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border border-white/10 group-hover:border-primary transition-colors duration-500 relative">
                        <Image
                          src={member.img}
                          alt={member.alt}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                      </div>
                      <h3 className="font-serif text-2xl mb-1 text-foreground">{member.name}</h3>
                      <p className="font-sans text-xs uppercase tracking-widest text-primary mb-4">{member.role}</p>
                      
                      <AnimatePresence>
                        {selectedMember === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="font-sans font-light text-muted text-sm leading-relaxed mb-6">
                              {member.experience}
                            </p>
                            <div className="flex justify-center gap-4">
                              <a href={member.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2 border border-white/10 rounded-full hover:border-primary hover:text-primary transition-colors text-muted">
                                WhatsApp
                              </a>
                              <a href={member.cvLink} target="_blank" rel="noopener noreferrer" className="p-2 border border-white/10 rounded-full hover:border-primary hover:text-primary transition-colors text-muted">
                                LinkedIn
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all duration-300"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all duration-300"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}