'use client';

export default function Footer() {
  return (
    <footer className="py-4 px-8 text-center" style={{ backgroundColor: '#3E3E3E', color: '#FFF' }}>
      <div className="mt-4 text-xs font-semibold" style={{ color: '#FFF' }}>
        <p>© 2025 VINOS AURA. Todos los derechos reservados.</p>
        <p>
          <a
            href="/politicas/PoliticadePrivacidad.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="font-extrabold transition-all duration-200"
            style={{ color: '#FFF', textDecoration: 'none' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
              e.currentTarget.style.color = '#C5A55B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
              e.currentTarget.style.color = '#FFF';
            }}
            data-testid="privacy-policy-link"
          >
            Políticas de Privacidad
          </a>
        </p>
      </div>
      <div className="flex justify-center gap-4 mt-2">
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
            className="h-6 w-6 transition-transform duration-200"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.632.074-3.355.414-4.615 1.674-1.26 1.26-1.6 2.983-1.674 4.615-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.074 1.632.414 3.355 1.674 4.615 1.26 1.26 2.983 1.6 4.615 1.674 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.632-.074 3.355-.414 4.615-1.674 1.26-1.26 1.6-2.983 1.674-4.615.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.074-1.632-.414-3.355-1.674-4.615-1.26-1.26-2.983-1.6-4.615-1.674-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.441s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.441-1.441-1.441z" />
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
            className="h-6 w-6 transition-transform duration-200"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2.04c-5.523 0-10 4.477-10 10 0 4.991 3.657 9.128 8.437 9.878v-6.987h-2.54v-2.891h2.54v-2.203c0-2.506 1.492-3.891 3.777-3.891 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.877h2.773l-.443 2.891h-2.33v6.987c4.78-.75 8.437-4.887 8.437-9.878 0-5.523-4.477-10-10-10z" />
          </svg>
        </a>
        <a
          href="https://wa.me/1234567890"
          aria-label="WhatsApp"
          style={{ color: '#FFF' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#C5A55B';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#FFF';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          data-testid="whatsapp-link"
        >
          <svg
            className="h-6 w-6 transition-transform duration-200"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.87.51 3.65 1.43 5.19L2 22l4.81-1.43A9.95 9.95 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm3.88 15.44c-.41.12-1.23.39-2.34.24-1.81-.24-3.3-1.43-4.03-3.03-.51-1.13-.79-2.45-.79-3.85 0-1.39.27-2.71.79-3.84.73-1.6 2.22-2.79 4.03-3.03 1.11-.15 1.93.12 2.34.24.41.12.74.39.92.79l.58 1.74c.12.36.03.76-.24 1.03l-.97.97c-.27.27-.36.67-.24 1.03.24.73.67 1.4 1.2 2.01.54.61 1.15 1.07 1.88 1.31.36.12.76.03 1.03-.24l.97-.97c.27-.27.67-.36 1.03-.24l1.74.58c.39.18.67.51.79.92.15.41-.03.92-.24 1.23-1.11 1.71-2.79 2.79-4.65 3.12z"/>
          </svg>
        </a>
        <a
          href="https://www.tiktok.com/@vinosaura"
          aria-label="TikTok"
          style={{ color: '#FFF' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#C5A55B';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#FFF';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          data-testid="tiktok-link"
        >
          <svg
            className="h-6 w-6 transition-transform duration-200"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.589 6.686a4.993 4.993 0 0 0-3.773-3.773v7.516a2.506 2.506 0 0 1-2.5 2.5h-6.75v-2.5h6.75a2.506 2.506 0 0 0 2.5-2.5V2.502a5.001 5.001 0 0 0-7.508 4.293c0 3.14 2.256 5.737 5.25 6.406v2.5c-3.972-.64-7-3.736-7-7.906a7.506 7.506 0 0 1 12.992-5.203 7.528 7.528 0 0 1 2.04 5.203v2.258a5.573 5.573 0 0 1-2.252-1.1v-4.281z"/>
          </svg>
        </a>
      </div>
    </footer>
  );
}