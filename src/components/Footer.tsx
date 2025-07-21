'use client';

export default function Footer() {
  return (
    <footer className="py-8 px-8 text-center" style={{ backgroundColor: '#C5A55B', color: '#FFF' }}>
      <div className="flex flex-col md:flex-row justify-around max-w-7xl mx-auto flex-wrap gap-8">
        {/* Contacto */}
        <div className="flex-1 min-w-[200px]">
          <h3
            className="text-2xl font-extrabold mb-4 uppercase"
            style={{ 
              color: '#B31B1B', 
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' 
            }}
          >
            CONTACTO
          </h3>
          <p className="text-lg leading-relaxed mb-2 font-semibold" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
            Email:{' '}
            <a
              href="mailto:info@vinosaura.com"
              className="font-extrabold transition-all duration-200"
              style={{ 
                color: '#FFF', 
                textDecoration: 'none',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
                e.currentTarget.style.color = '#C5A55B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
                e.currentTarget.style.color = '#FFF';
              }}
              data-testid="email-link"
            >
              info@vinosaura.com
            </a>
          </p>
          <p className="text-lg leading-relaxed mb-2 font-semibold" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
            Tel:{' '}
            <a
              href="tel:+1234567890"
              className="font-extrabold transition-all duration-200"
              style={{ 
                color: '#FFF', 
                textDecoration: 'none',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
                e.currentTarget.style.color = '#C5A55B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
                e.currentTarget.style.color = '#FFF';
              }}
              data-testid="phone-link"
            >
              +1 (234) 567-890
            </a>
          </p>
          <p 
            className="text-lg leading-relaxed font-semibold" 
            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}
          >
            Dirección: Calle del Vino 123, Viña del Mar, Chile
          </p>
        </div>

        {/* Suscripción */}
        <div className="flex-1 min-w-[200px]">
          <h3
            className="text-2xl font-extrabold mb-4 uppercase"
            style={{ 
              color: '#B31B1B', 
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' 
            }}
          >
            SUSCRÍBIRSE
          </h3>
          <p 
            className="text-lg leading-relaxed mb-2 font-semibold" 
            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}
          >
            Únete a nuestro boletín
          </p>
          <form className="flex flex-col sm:flex-row justify-center">
            <input
              type="email"
              placeholder="Email"
              className="p-2 mr-2 mb-2 sm:mb-0 rounded-md font-['EB_Garamond'] text-[#3E3E3E] text-lg"
              style={{ border: 'none' }}
              required
              data-testid="email-input"
            />
            <button
              type="submit"
              className="p-2 rounded-md font-['EB_Garamond'] font-extrabold text-lg transition-all duration-200"
              style={{ 
                backgroundColor: '#B31B1B', 
                color: '#FFF',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#B31B1B')}
              data-testid="submit-button"
            >
              Enviar
            </button>
          </form>
        </div>

        {/* Visítanos */}
        <div className="flex-1 min-w-[200px]">
          <h3
            className="text-2xl font-extrabold mb-4 uppercase"
            style={{ 
              color: '#B31B1B', 
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' 
            }}
          >
            VISÍTANOS
          </h3>
          <p 
            className="text-lg leading-relaxed mb-2 font-semibold" 
            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}
          >
            Lun - Vie: 9:00 - 18:00
          </p>
          <p 
            className="text-lg leading-relaxed mb-2 font-semibold" 
            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}
          >
            Sáb: 10:00 - 14:00
          </p>
          <p 
            className="text-lg leading-relaxed font-semibold" 
            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}
          >
            Dom: Cerrado
          </p>
        </div>

        {/* Síguenos */}
        <div className="flex-1 min-w-[200px]">
          <h3
            className="text-2xl font-extrabold mb-4 uppercase"
            style={{ 
              color: '#B31B1B', 
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' 
            }}
          >
            SÍGUENOS
          </h3>
          <div className="flex justify-center gap-4">
            <a
              href="https://m.me/vinosaura"
              aria-label="Messenger"
              style={{ color: '#FFF' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#C5A55B';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#FFF';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              data-testid="messenger-link"
            >
              <svg
                className="h-10 w-10 transition-transform duration-200"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2c5.514 0 10 4.336 10 9.69 0 5.354-4.486 9.69-10 9.69-1.662 0-3.223-.396-4.595-1.101l-4.388 1.144 1.144-4.388C3.396 14.913 3 13.351 3 11.69 3 6.336 7.486 2 12 2zm0 2c-4.411 0-8 3.589-8 8 0 1.341.332 2.604.923 3.721l.231.447-1.2 4.572 4.572-1.2.447.231c1.117.591 2.38.923 3.721.923 4.411 0 8-3.589 8-8s-3.589-8-8-8zm4.297 6.293l-3.293 2.586-2.586-1.293L7.703 14.88l3.293-2.586 2.586 1.293 2.715-3.294z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/vinosaura"
              aria-label="Facebook"
              style={{ color: '#FFF' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#C5A55B';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#FFF';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              data-testid="facebook-link"
            >
              <svg
                className="h-8 w-8 transition-transform duration-200"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.04c-5.523 0-10 4.477-10 10 0 4.991 3.657 9.128 8.437 9.878v-6.987h-2.54v-2.891h2.54v-2.203c0-2.506 1.492-3.891 3.777-3.891 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.877h2.773l-.443 2.891h-2.33v6.987c4.78-.75 8.437-4.887 8.437-9.878 0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/vinosaura"
              aria-label="Instagram"
              style={{ color: '#FFF' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#C5A55B';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#FFF';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              data-testid="instagram-link"
            >
              <svg
                className="h-8 w-8 transition-transform duration-200"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.632.074-3.355.414-4.615 1.674-1.26 1.26-1.6 2.983-1.674 4.615-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.074 1.632.414 3.355 1.674 4.615 1.26 1.26 2.983 1.6 4.615 1.674 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.632-.074 3.355-.414 4.615-1.674 1.26-1.26 1.6-2.983 1.674-4.615.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.074-1.632-.414-3.355-1.674-4.615-1.26-1.26-2.983-1.6-4.615-1.674-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.441s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.441-1.441-1.441z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-sm font-semibold" style={{ color: '#FFF', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
        <p>© 2025 VINOS AURA. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}