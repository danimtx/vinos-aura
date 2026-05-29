'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contacto() {
  const [formStatus, setFormStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      mensaje: formData.get('mensaje'),
    };
    // Placeholder for form submission logic
    console.log('Form submitted:', data);
    setFormStatus('Mensaje enviado con éxito');
    setTimeout(() => setFormStatus(null), 3000);
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-primary tracking-[0.3em] uppercase text-xs font-sans block mb-4">
            Estamos a tu disposición
          </span>
          <h1 className="text-5xl md:text-6xl font-serif font-light text-[#F5F5F0]">
            Ponte en <span className="italic text-primary">Contacto</span>
          </h1>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Map Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1 h-[500px] lg:h-auto rounded-sm overflow-hidden border border-white/10 relative"
          >
            <div className="absolute inset-0 bg-[#0a0a0a] animate-pulse"></div>
            <iframe
              src="https://maps.google.com/maps?q=-21.5369743454539,-64.74179026808974&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full relative z-10 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </motion.div>

          {/* Cards Section */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            
            {/* Contact Info Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-[#111] p-10 rounded-sm border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              
              <h3 className="text-2xl font-serif text-[#F5F5F0] mb-8 flex items-center gap-4">
                Información
                <span className="h-[1px] flex-grow bg-white/10"></span>
              </h3>
              
              <div className="space-y-6 font-sans font-light text-sm text-muted">
                <div className="flex flex-col">
                  <strong className="tracking-widest uppercase text-xs mb-1 text-[#F5F5F0]">Teléfono</strong>
                  <a href="tel:+1234567890" className="hover:text-primary transition-colors">+1 (234) 567-890</a>
                </div>
                <div className="flex flex-col">
                  <strong className="tracking-widest uppercase text-xs mb-1 text-[#F5F5F0]">Email</strong>
                  <a href="mailto:info@vinosaura.com" className="hover:text-primary transition-colors">info@vinosaura.com</a>
                </div>
                <div className="flex flex-col">
                  <strong className="tracking-widest uppercase text-xs mb-1 text-[#F5F5F0]">Dirección</strong>
                  <span>Calle Colón, Plazuela Sucre, Bolivia</span>
                </div>
                <div className="flex flex-col">
                  <strong className="tracking-widest uppercase text-xs mb-1 text-[#F5F5F0]">Horario</strong>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <span>Lunes a Viernes:</span> <span>9:00 - 18:00</span>
                    <span>Sábado:</span> <span>10:00 - 14:00</span>
                    <span>Domingo:</span> <span>Cerrado</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-[#111] p-10 rounded-sm border border-white/5 relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

              <h3 className="text-2xl font-serif text-[#F5F5F0] mb-8 flex items-center gap-4">
                Escríbenos
                <span className="h-[1px] flex-grow bg-white/10"></span>
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div>
                  <label htmlFor="nombre" className="block text-xs font-sans tracking-widest uppercase text-muted mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="w-full px-4 py-3 bg-[#151515] border border-white/10 text-[#F5F5F0] rounded-sm focus:outline-none focus:border-primary transition-colors font-sans"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-sans tracking-widest uppercase text-muted mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-[#151515] border border-white/10 text-[#F5F5F0] rounded-sm focus:outline-none focus:border-primary transition-colors font-sans"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mensaje" className="block text-xs font-sans tracking-widest uppercase text-muted mb-2">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={4}
                    className="w-full px-4 py-3 bg-[#151515] border border-white/10 text-[#F5F5F0] rounded-sm focus:outline-none focus:border-primary transition-colors font-sans"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-accent hover:bg-[#8B1313] text-white tracking-widest uppercase text-xs font-bold transition-all duration-300 rounded-sm"
                >
                  Enviar Mensaje
                </button>
                {formStatus && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm font-sans font-light text-[#D9C3A3] mt-4 p-3 border border-[#D9C3A3]/20 bg-[#D9C3A3]/5 rounded-sm"
                  >
                    {formStatus}
                  </motion.p>
                )}
              </form>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}