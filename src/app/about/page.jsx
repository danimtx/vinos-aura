'use client';

import Image from 'next/image';

export default function About() {
  return (
    <div className="font-['EB_Garamond'] bg-[#F5F5F5]" style={{ color: '#3E3E3E' }}>
      {/* About Section */}
      <section className="flex flex-col md:flex-row items-center py-16 px-8 bg-white">
        <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto">
          <div className="flex-1 p-8 text-left">
            <h2
              className="text-lg uppercase mb-2"
              style={{ color: '#B31B1B' }}
            >
              ACERCA DE
            </h2>
            <h1
              className="text-5xl font-bold mb-6 leading-tight"
              style={{ color: '#B31B1B' }}
            >
              VINOS AURA
            </h1>
            <p className="text-base leading-relaxed mb-4 max-w-md">
              Párrafo. Haz clic aquí para agregar tu propio texto y editarlo. Es fácil. Haz clic en "Editar texto" o doble clic aquí para agregar tu propio contenido y cambiar la fuente. Puedes arrastrarlo y soltarlo en cualquier lugar de la página.
            </p>
            <p className="text-base leading-relaxed mb-4 max-w-md">
              Este es un buen espacio para contar más sobre tu compañía y servicios. Puedes usar este espacio para incorporar más detalles sobre tu empresa. Escribe sobre tu equipo y los servicios que ofreces.
            </p>
          </div>
          <div className="flex-1 w-full">
            <Image
              src="/img/vinos-estanteria.jpg"
              alt="Estantería de vinos"
              className="w-full h-auto object-cover"
              width={600}
              height={400}
              priority
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-8 text-center" style={{ backgroundColor: '#D9C3A3' }}>
        <h2
          className="text-4xl font-bold mb-8 uppercase"
          style={{ color: '#B31B1B' }}
        >
          EQUIPO
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 flex-wrap">
          {[
            { name: 'MARIA JOSE VERA', img: '/nosotros/perfil-predeterminado.jpeg', alt: 'Maria Jose Vera' },
            { name: 'MARCO DURAN', img: '/nosotros/perfil-predeterminado.jpeg', alt: 'Marco Duran' },
            { name: 'DANIEL MANCILLA', img: '/nosotros/perfil-predeterminado.jpeg', alt: 'Daniel Mancilla' },
            { name: 'SANTIAGO TAPIA', img: '/nosotros/perfil-predeterminado.jpeg', alt: 'Santiago Tapia' },
            { name: 'HUGO ACOSTA', img: '/nosotros/perfil-predeterminado.jpeg', alt: 'Hugo Acosta' },
            { name: 'VICTOR TAJA', img: '/nosotros/perfil-predeterminado.jpeg', alt: 'Victor Taja' },
          ].map((member) => (
            <div key={member.name} className="max-w-xs">
              <Image
                src={member.img}
                alt={member.alt}
                className="w-full rounded-md mb-4"
                width={200}
                height={200}
              />
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: '#B31B1B' }}
              >
                {member.name}
              </h3>
              <p className="text-base leading-relaxed">
                Párrafo. Haz clic aquí para agregar tu texto y editar. Permite que tus usuarios te conozcan.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}