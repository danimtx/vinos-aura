'use client';

export default function Contacto() {
  return (
    <div className="font-['EB_Garamond'] bg-[#F5F5F5]" style={{ color: '#3E3E3E' }}>
      <section className="py-16 px-8 text-center bg-white">
        <h2
          className="text-4xl font-bold mb-8 uppercase"
          style={{ color: '#B31B1B' }}
        >
          CONTACTO
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-7xl mx-auto flex-wrap">
          {/* Map */}
          <div className="flex-1 min-w-[300px]">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3787.615474496377!2d-64.732338!3d-21.535275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDMyJzA3LjAiUyA2NMKwNDQnNTYuNCJX!5e0!3m2!1ses!2sbo!4v1697674567890!5m2!1ses!2sbo"
    className="w-full h-[300px] rounded-md"
    allowFullScreen
    loading="lazy"
  ></iframe>
</div>

          {/* Contact Info */}
          <div
            className="flex-1 min-w-[300px] text-left p-8 rounded-md"
            style={{ backgroundColor: '#D9C3A3' }}
          >
            <h3
              className="text-xl font-bold mb-4 uppercase"
              style={{ color: '#B31B1B' }}
            >
              Información de Contacto
            </h3>
            <p className="text-base leading-relaxed mb-4">
              <strong>Teléfono:</strong>{' '}
              <a
                href="tel:+1234567890"
                className="font-bold"
                style={{ color: '#B31B1B', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                +1 (234) 567-890
              </a>
            </p>
            <p className="text-base leading-relaxed mb-4">
              <strong>Email:</strong>{' '}
              <a
                href="mailto:info@vinosaura.com"
                className="font-bold"
                style={{ color: '#B31B1B', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                info@vinosaura.com
              </a>
            </p>
            <p className="text-base leading-relaxed mb-4">
              <strong>Dirección:</strong> Calle colon, <strong>Plazuela Sucre</strong>, Bolivia
            </p>
            <p className="text-base leading-relaxed mb-4">
              <strong>Horario:</strong> <br />
              <strong>Lunes a Viernes:</strong> 9:00 - 18:00<br />
              <strong>Sábado:</strong> 10:00 - 14:00<br />
              <strong>Domingo:</strong> Cerrado
            </p>
            <p className="text-base leading-relaxed">
              <strong>Visítanos</strong> en nuestra <strong>vinícola</strong> para una experiencia única con <strong>VINOS AURA</strong>.
            </p>
          </div>

          {/* Form */}
          <div
            className="flex-1 min-w-[300px] text-left p-8 rounded-md"
            style={{ backgroundColor: '#D9C3A3' }}
          >
            <h3
              className="text-xl font-bold mb-4 uppercase"
              style={{ color: '#B31B1B' }}
            >
              Envíanos un Mensaje
            </h3>
            <form>
              <label htmlFor="nombre" className="block text-base mb-2" style={{ color: '#3E3E3E' }}>
                Nombre:
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="w-full p-2 mb-4 border rounded-md font-['EB_Garamond']"
                style={{ borderColor: '#3E3E3E' }}
                required
              />
              <label htmlFor="email" className="block text-base mb-2" style={{ color: '#3E3E3E' }}>
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 mb-4 border rounded-md font-['EB_Garamond']"
                style={{ borderColor: '#3E3E3E' }}
                required
              />
              <label htmlFor="mensaje" className="block text-base mb-2" style={{ color: '#3E3E3E' }}>
                Mensaje:
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={4}
                className="w-full p-2 mb-4 border rounded-md font-['EB_Garamond']"
                style={{ borderColor: '#3E3E3E' }}
                required
              ></textarea>
              <button
                type="submit"
                className="p-2 rounded-md text-white font-['EB_Garamond']"
                style={{ backgroundColor: '#B31B1B' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#B31B1B')}
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}