'use client';

import Image from 'next/image';

export default function Blog() {
  const posts = [
    {
      title: 'LA ARTE DE LA CATA DE VINOS',
      img: '/img/vinos-estanteria.jpg',
      alt: 'Cata de Vinos',
      date: '21 de Julio de 2025',
      content: 'Descubre los secretos detrás de una buena cata de vinos con <strong>VINOS AURA</strong>. Aprende a identificar aromas, sabores y texturas en cada sorbo.',
      link: '#',
    },
    {
      title: 'HISTORIA DEL VINO EN CHILE',
      img: '/img/historia.jpg',
      alt: 'Historia del Vino',
      date: '20 de Julio de 2025',
      content: 'Explora la rica tradición vitivinícola de Chile y cómo <strong>VINOS AURA</strong> contribuye a su legado con vinos de calidad excepcional.',
      link: '#',
    },
    {
      title: 'EL MARIDAJE PERFECTO',
      img: '/img/vinos-estanteria.jpg',
      alt: 'Maridaje Perfecto',
      date: '19 de Julio de 2025',
      content: 'Encuentra las mejores combinaciones de alimentos y vinos con consejos de nuestros expertos en <strong>VINOS AURA</strong>.',
      link: '#',
    },
    {
      title: 'SOSTENIBILIDAD EN LA VINICULTURA',
      img: '/img/vinos-estanteria.jpg',
      alt: 'Sostenibilidad',
      date: '18 de Julio de 2025',
      content: 'Conoce las prácticas sostenibles que <strong>VINOS AURA</strong> implementa para cuidar el medio ambiente y producir vinos orgánicos.',
      link: '#',
    },
  ];

  return (
    <div className="font-['EB_Garamond'] bg-[#F5F5F5]" style={{ color: '#3E3E3E' }}>
      <section className="py-16 px-8 text-center bg-white">
        <h2
          className="text-4xl font-bold mb-8 uppercase"
          style={{ color: '#B31B1B' }}
        >
          BLOG
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {posts.map((post) => (
            <div
              key={post.title}
              className="p-8 rounded-md text-left"
              style={{ backgroundColor: '#D9C3A3' }}
            >
              <Image
                src={post.img}
                alt={post.alt}
                className="w-full h-auto rounded-md mb-4"
                width={600}
                height={400}
              />
              <h3
                className="text-xl font-bold mb-2 uppercase"
                style={{ color: '#B31B1B' }}
              >
                {post.title}
              </h3>
              <p
                className="text-base mb-4"
                style={{ color: '#C5A55B' }}
              >
                {post.date}
              </p>
              <p
                className="text-base leading-relaxed mb-4"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              <a
                href={post.link}
                className="font-bold"
                style={{ color: '#B31B1B', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                Leer más
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}