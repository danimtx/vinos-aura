'use client';

import Image from 'next/image';

export default function Vinos() {
  const products = [
    { name: 'VINO TINTO RESERVA', img: '/vinos/vino-pre.jpg', alt: 'Vino Tinto Reserva', price: '$25.00' },
    { name: 'VINO BLANCO SECO', img: '/vinos/vino-pre.jpg', alt: 'Vino Blanco Seco', price: '$20.00' },
    { name: 'VINO ROSÉ', img: '/vinos/vino-pre.jpg', alt: 'Vino Rosé', price: '$22.00' },
    { name: 'VINO TINTO GRAN RESERVA', img: '/vinos/vino-pre.jpg', alt: 'Vino Tinto Gran Reserva', price: '$30.00' },
    { name: 'VINO BLANCO DULCE', img: '/vinos/vino-pre.jpg', alt: 'Vino Blanco Dulce', price: '$18.00' },
    { name: 'VINO ESPUMOSO', img: '/vinos/vino-pre.jpg', alt: 'Vino Espumoso', price: '$28.00' },
    { name: 'VINO TINTO CRIANZA', img: '/vinos/vino-pre.jpg', alt: 'Vino Tinto Crianza', price: '$24.00' },
    { name: 'VINO BLANCO RESERVA', img: '/vinos/vino-pre.jpg', alt: 'Vino Blanco Reserva', price: '$26.00' },
    { name: 'VINO TINTO ROBLE', img: '/vinos/vino-pre.jpg', alt: 'Vino Tinto Roble', price: '$23.00' },
    { name: 'VINO ROSÉ DULCE', img: '/vinos/vino-pre.jpg', alt: 'Vino Rosé Dulce', price: '$21.00' },
    { name: 'VINO ESPUMOSO ROSÉ', img: '/vinos/vino-pre.jpg', alt: 'Vino Espumoso Rosé', price: '$29.00' },
    { name: 'VINO TINTO ESPECIAL', img: '/vinos/vino-pre.jpg', alt: 'Vino Tinto Especial', price: '$35.00' },
    { name: 'VINO BLANCO ORGÁNICO', img: '/vinos/vino-pre.jpg', alt: 'Vino Blanco Orgánico', price: '$27.00' },
    { name: 'VINO TINTO VINTAGE', img: '/vinos/vino-pre.jpg', alt: 'Vino Tinto Vintage', price: '$32.00' },
    { name: 'VINO ROSÉ ORGÁNICO', img: '/vinos/vino-pre.jpg', alt: 'Vino Rosé Orgánico', price: '$25.00' },
    { name: 'VINO ESPUMOSO DULCE', img: '/vinos/vino-pre.jpg', alt: 'Vino Espumoso Dulce', price: '$30.00' },
  ];

  return (
    <div className="font-['EB_Garamond'] bg-[#F5F5F5]" style={{ color: '#3E3E3E' }}>
      <section className="py-16 px-8 text-center bg-white">
        <h2
          className="text-4xl font-bold mb-8 uppercase"
          style={{ color: '#B31B1B' }}
        >
          VINOS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {products.map((product) => (
            <div
              key={product.name}
              className="p-4 rounded-md text-center"
              style={{ backgroundColor: '#D9C3A3' }}
            >
              <Image
                src={product.img}
                alt={product.alt}
                className="w-full h-auto rounded-md mb-4"
                width={200}
                height={300}
              />
              <h3
                className="text-lg font-bold mb-2 uppercase"
                style={{ color: '#B31B1B' }}
              >
                {product.name}
              </h3>
              <p
                className="text-base font-bold"
                style={{ color: '#3E3E3E' }}
              >
                {product.price}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}