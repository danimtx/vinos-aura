'use client';

import { FaceFrownIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer className="py-8 px-8 text-center" style={{ backgroundColor: '#C5A55B', color: '#FFF' }}>
      <div className="flex flex-col md:flex-row justify-around max-w-7xl mx-auto flex-wrap gap-8">
        {/* Contacto */}
        <div className="flex-1 min-w-[200px]">
          <h3
            className="text-xl font-bold mb-4 uppercase"
            style={{ color: '#B31B1B' }}
          >
            CONTACTO
          </h3>
          <p className="text-base leading-relaxed mb-2">
            Email:{' '}
            <a
              href="mailto:info@vinosaura.com"
              className="font-bold"
              style={{ color: '#FFF', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              info@vinosaura.com
            </a>
          </p>
          <p className="text-base leading-relaxed mb-2">
            Tel:{' '}
            <a
              href="tel:+1234567890"
              className="font-bold"
              style={{ color: '#FFF', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              +1 (234) 567-890
            </a>
          </p>
          <p className="text-base leading-relaxed">
            Dirección: Calle del Vino 123, Viña del Mar, Chile
          </p>
        </div>

        {/* Suscripción */}
        <div className="flex-1 min-w-[200px]">
          <h3
            className="text-xl font-bold mb-4 uppercase"
            style={{ color: '#B31B1B' }}
          >
            SUSCRÍBIRSE
          </h3>
          <p className="text-base leading-relaxed mb-2">
            Únete a nuestro boletín
          </p>
          <form className="flex flex-col sm:flex-row justify-center">
            <input
              type="email"
              placeholder="Email"
              className="p-2 mr-2 mb-2 sm:mb-0 rounded-md font-['EB_Garamond'] text-[#3E3E3E]"
              style={{ border: 'none' }}
              required
            />
            <button
              type="submit"
              className="p-2 rounded-md font-['EB_Garamond']"
              style={{ backgroundColor: '#B31B1B', color: '#FFF' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#B31B1B')}
            >
              Enviar
            </button>
          </form>
        </div>

        {/* Visítanos */}
        <div className="flex-1 min-w-[200px]">
          <h3
            className="text-xl font-bold mb-4 uppercase"
            style={{ color: '#B31B1B' }}
          >
            VISÍTANOS
          </h3>
          <p className="text-base leading-relaxed mb-2">Lun - Vie: 9:00 - 18:00</p>
          <p className="text-base leading-relaxed mb-2">Sáb: 10:00 - 14:00</p>
          <p className="text-base leading-relaxed">Dom: Cerrado</p>
        </div>

        {/* Síguenos */}
        <div className="flex-1 min-w-[200px]">
          <h3
            className="text-xl font-bold mb-4 uppercase"
            style={{ color: '#B31B1B' }}
          >
            SÍGUENOS
          </h3>
          <div className="flex justify-center gap-4">
            <a
              href="#"
              aria-label="Facebook"
              style={{ color: '#FFF' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#C5A55B')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#FFF')}
            >
              <FaceFrownIcon className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              style={{ color: '#FFF' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#C5A55B')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#FFF')}
            >
              <FaceFrownIcon className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              style={{ color: '#FFF' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#C5A55B')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#FFF')}
            >
              <FaceFrownIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-sm" style={{ color: '#FFF' }}>
        <p>© 2025 VINOS AURA. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}