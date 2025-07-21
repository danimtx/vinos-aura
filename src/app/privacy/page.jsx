'use client';

export default function PoliticaPrivacidad() {
  return (
    <div className="font-['EB_Garamond'] bg-[#F5F5F5]" style={{ color: '#3E3E3E' }}>
      <section className="py-16 px-8 md:px-4 text-center max-w-7xl mx-auto bg-white">
        <h2
          className="text-4xl font-bold mb-8 uppercase"
          style={{ color: '#B31B1B' }}
        >
          POLÍTICA DE PRIVACIDAD
        </h2>
        <div
          className="text-left p-8 md:p-4 rounded-md"
          style={{ backgroundColor: '#D9C3A3' }}
        >
          <h2
            className="text-2xl font-bold mb-4 uppercase"
            style={{ color: '#B31B1B' }}
          >
            Última Actualización: 21 de Julio de 2025
          </h2>
          <p className="text-base leading-relaxed mb-4">
            Bienvenido a la <strong>Política de Privacidad</strong> de <strong>VINOS AURA</strong>. Nos comprometemos a proteger tu privacidad y a manejar tu información personal de manera responsable. Esta política describe cómo recopilamos, usamos, divulgamos y protegemos tu información cuando interactúas con nuestro sitio web.
          </p>

          <h3
            className="text-xl font-bold mt-6 mb-2 uppercase"
            style={{ color: '#B31B1B' }}
          >
            1. Información que Recopilamos
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Recopilamos la siguiente información:
          </p>
          <ul className="list-disc ml-8 mb-4">
            <li className="text-base leading-relaxed mb-2">
              <strong>Información Personal:</strong> Nombre, email y otros datos que proporciones al contactarnos.
            </li>
            <li className="text-base leading-relaxed mb-2">
              <strong>Datos de Uso:</strong> Información sobre cómo navegas en nuestro sitio, como direcciones IP y páginas visitadas.
            </li>
          </ul>

          <h3
            className="text-xl font-bold mt-6 mb-2 uppercase"
            style={{ color: '#B31B1B' }}
          >
            2. Cómo Usamos tu Información
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Utilizamos tu información para:
          </p>
          <ul className="list-disc ml-8 mb-4">
            <li className="text-base leading-relaxed mb-2">
              Proporcionar y mejorar nuestros servicios y productos de <strong>VINOS AURA</strong>.
            </li>
            <li className="text-base leading-relaxed mb-2">
              Procesar tus solicitudes y responder a tus consultas.
            </li>
            <li className="text-base leading-relaxed mb-2">
              Enviar comunicaciones de marketing, si has dado tu consentimiento.
            </li>
          </ul>

          <h3
            className="text-xl font-bold mt-6 mb-2 uppercase"
            style={{ color: '#B31B1B' }}
          >
            3. Compartir tu Información
          </h3>
          <p className="text-base leading-relaxed mb-4">
            No compartimos tu información personal con terceros, excepto:
          </p>
          <ul className="list-disc ml-8 mb-4">
            <li className="text-base leading-relaxed mb-2">
              Con proveedores de servicios que nos ayudan a operar nuestro sitio.
            </li>
            <li className="text-base leading-relaxed mb-2">
              Cuando sea requerido por ley o para proteger nuestros derechos.
            </li>
          </ul>

          <h3
            className="text-xl font-bold mt-6 mb-2 uppercase"
            style={{ color: '#B31B1B' }}
          >
            4. Seguridad de los Datos
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Implementamos medidas de seguridad para proteger tu información contra accesos no autorizados, pérdidas o alteraciones. Sin embargo, ninguna transmisión por internet es completamente segura.
          </p>

          <h3
            className="text-xl font-bold mt-6 mb-2 uppercase"
            style={{ color: '#B31B1B' }}
          >
            5. Tus Derechos
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Tienes derecho a:
          </p>
          <ul className="list-disc ml-8 mb-4">
            <li className="text-base leading-relaxed mb-2">
              Acceder, corregir o eliminar tu información personal.
            </li>
            <li className="text-base leading-relaxed mb-2">
              Oponerte al uso de tu información para fines de marketing.
            </li>
          </ul>
          <p className="text-base leading-relaxed mb-4">
            Para ejercer estos derechos, contáctanos a{' '}
            <a
              href="mailto:info@vinosaura.com"
              className="font-bold"
              style={{ color: '#B31B1B', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              info@vinosaura.com
            </a>.
          </p>

          <h3
            className="text-xl font-bold mt-6 mb-2 uppercase"
            style={{ color: '#B31B1B' }}
          >
            6. Cambios a esta Política
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Podemos actualizar esta <strong>Política de Privacidad</strong> periódicamente. Te notificaremos sobre cambios significativos publicando la nueva versión en esta página con la fecha de actualización.
          </p>

          <p className="text-base leading-relaxed">
            Si tienes preguntas, contáctanos en{' '}
            <a
              href="mailto:info@vinosaura.com"
              className="font-bold"
              style={{ color: '#B31B1B', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              info@vinosaura.com
            </a>{' '}
            o llama al{' '}
            <a
              href="tel:+1234567890"
              className="font-bold"
              style={{ color: '#B31B1B', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              +1 (234) 567-890
            </a>.
          </p>
        </div>
      </section>
    </div>
  );
}