/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.app.goo.gl', // Dominio de Google Images para redirecciones
      'media.scoolinary.app', // Dominio de la imagen de ejemplo anterior (si aún lo usas)
      'lh3.googleusercontent.com', // ¡NUEVO! Dominio para imágenes de Google Drive
      // Añade aquí cualquier otro dominio de donde cargues imágenes externas
    ],
  },
};

module.exports = nextConfig;
