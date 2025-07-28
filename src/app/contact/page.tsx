'use client';

import { useState } from 'react';

export default function Contacto() {
  const [formStatus, setFormStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      mensaje: formData.get('mensaje'),
    };
    // Placeholder for form submission logic (e.g., API call)
    console.log('Form submitted:', data);
    setFormStatus('Mensaje enviado con éxito');
    setTimeout(() => setFormStatus(null), 3000);
  };

  return (
    <div
      className="font-['EB_Garamond'] min-h-screen"
      style={{
        color: '#3E3E3E',
        backgroundImage: 'url(/contactos2/contacto.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <style jsx>{`
        @keyframes slideIn {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .card {
          animation: slideIn 0.5s ease-out forwards;
        }
        .card:nth-child(2) {
          animation-delay: 0.2s;
        }
        .map-container {
          filter: none;
        }
        .title {
          animation: fadeInUp 1s ease-out forwards;
          position: relative;
          display: inline-block;
        }
        .title::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          bottom: -5px;
          left: 0;
          background-color: #C5A55B;
          transform: scaleX(0);
          transform-origin: bottom right;
          transition: transform 0.3s ease-in-out;
        }
        .title:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
        .backdrop-blur-md {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .status-message {
          animation: fadeInUp 0.5s ease-out forwards;
          color: #B31B1B;
          text-align: center;
          margin-top: 1rem;
        }
      `}</style>

      {/* Header Section */}
      <section className="relative w-full h-[350px] flex flex-col items-center justify-start pt-8">
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
        <div className="relative z-10 text-center">
          <h2
            className="text-5xl font-extrabold uppercase mb-6 title"
            style={{ color: '#B31B1B', textShadow: '3px 3px 8px #C5A55B' }}
          >
            CONTACTOS
          </h2>
          <img
            src="/logo/logo-blanco.png"
            alt="Vinos Aura Logo"
            className="mx-auto w-[140px] h-auto"
          />
        </div>
      </section>

      {/* Main Content with Blurred Background */}
      <section className="py-16 px-8 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-1 order-1 map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3787.615474496377!2d-65.260528!3d-19.046667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93fcdb0e3f5c6f1d%3A0x3e8f8d7b8c7b6e4!2sPlazuela%20Sucre%2C%20Sucre%2C%20Bolivia!5e0!3m2!1ses!2sbo!4v1697674567890!5m2!1ses!2sbo"
              className="w-full h-[550px] rounded-lg shadow-xl"
              style={{ border: '3px solid #B31B1B' }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>

          {/* Cards Section */}
          <div className="lg:col-span-1 order-2 flex flex-row flex-wrap gap-8 justify-end">
            {/* Contact Info Card */}
            <div
              className="card p-6 rounded-lg shadow-xl transition-transform transform hover:scale-105 w-full sm:w-[calc(50%-1rem)]"
              style={{
                background: 'linear-gradient(135deg, #D9C3A3 60%, #C5A55B 100%)',
                border: '1px solid #C5A55B',
              }}
            >
              <h3
                className="text-lg font-extrabold mb-3 uppercase text-center"
                style={{ color: '#B31B1B', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}
              >
                Información de Contacto
              </h3>
              <p className="text-sm leading-relaxed mb-2 text-center" style={{ color: '#3E3E3E' }}>
                <strong>Teléfono:</strong>{' '}
                <a
                  href="tel:+1234567890"
                  className="font-bold transition-colors duration-200"
                  style={{ color: '#B31B1B', textDecoration: 'none' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#A11212';
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#B31B1B';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  +1 (234) 567-890
                </a>
              </p>
              <p className="text-sm leading-relaxed mb-2 text-center" style={{ color: '#3E3E3E' }}>
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:info@vinosaura.com"
                  className="font-bold transition-colors duration-200"
                  style={{ color: '#B31B1B', textDecoration: 'none' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#A11212';
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#B31B1B';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  info@vinosaura.com
                </a>
              </p>
              <p className="text-sm leading-relaxed mb-2 text-center" style={{ color: '#3E3E3E' }}>
                <strong>Dirección:</strong> Calle Colón, <strong>Plazuela Sucre</strong>, Bolivia
              </p>
              <p className="text-sm leading-relaxed mb-2 text-center" style={{ color: '#3E3E3E' }}>
                <strong>Horario:</strong> <br />
                <strong>Lunes a Viernes:</strong> 9:00 - 18:00<br />
                <strong>Sábado:</strong> 10:00 - 14:00<br />
                <strong>Domingo:</strong> Cerrado
              </p>
              <p className="text-sm leading-relaxed text-center" style={{ color: '#3E3E3E' }}>
                <strong>Visítanos</strong> en nuestra <strong>vinícola</strong> para una experiencia única con <strong>VINOS AURA</strong>.
              </p>
            </div>

            {/* Form Card */}
            <div
              className="card p-6 rounded-lg shadow-xl transition-transform transform hover:scale-105 w-full sm:w-[calc(50%-1rem)]"
              style={{
                background: 'linear-gradient(135deg, #D9C3A3 60%, #C5A55B 100%)',
                border: '1px solid #C5A55B',
              }}
            >
              <h3
                className="text-lg font-extrabold mb-3 uppercase text-center"
                style={{ color: '#B31B1B', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}
              >
                Envíanos un Mensaje
              </h3>
              <form onSubmit={handleSubmit}>
                <label htmlFor="nombre" className="block text-sm mb-1 text-center" style={{ color: '#3E3E3E' }}>
                  Nombre:
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="w-full p-2 mb-2 border rounded-md font-['EB_Garamond'] focus:outline-none focus:ring-2 focus:ring-[#B31B1B]"
                  style={{ borderColor: '#3E3E3E', backgroundColor: '#FFF' }}
                  required
                />
                <label htmlFor="email" className="block text-sm mb-1 text-center" style={{ color: '#3E3E3E' }}>
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 mb-2 border rounded-md font-['EB_Garamond'] focus:outline-none focus:ring-2 focus:ring-[#B31B1B]"
                  style={{ borderColor: '#3E3E3E', backgroundColor: '#FFF' }}
                  required
                />
                <label htmlFor="mensaje" className="block text-sm mb-1 text-center" style={{ color: '#3E3E3E' }}>
                  Mensaje:
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={3}
                  className="w-full p-2 mb-2 border rounded-md font-['EB_Garamond'] focus:outline-none focus:ring-2 focus:ring-[#B31B1B]"
                  style={{ borderColor: '#3E3E3E', backgroundColor: '#FFF' }}
                  required
                ></textarea>
                <button
                  type="submit"
                  className="w-full p-2 rounded-md text-white font-['EB_Garamond'] font-bold transition-colors duration-200"
                  style={{ backgroundColor: '#B31B1B', boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#A11212')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#B31B1B')}
                >
                  Enviar
                </button>
                {formStatus && (
                  <p className="status-message">{formStatus}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section to Continue Background */}
      <section className="w-full h-[250px]"></section>
    </div>
  );
}