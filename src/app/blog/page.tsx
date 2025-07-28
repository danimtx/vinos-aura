// src/app/blog/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext'; // Importar useAuth para saber si el usuario está autenticado
import toast from 'react-hot-toast'; // Para notificaciones
import { PlusIcon } from '@heroicons/react/24/outline'; // Icono para el botón de nueva publicación

// Definición de la interfaz para una publicación de blog
interface BlogPost {
  id: string;
  title: string;
  content: string; // Contenido completo o un resumen
  img: string;
  alt: string;
  createdAt: any; // Firebase Timestamp
  authorId: string;
  authorName: string;
}

const colors = {
  crimson: '#B31B1B',
  warmBeige: '#D9C3A3',
  darkGray: '#3E3E3E',
  lightGrayBg: '#F5F5F5',
  white: '#FFFFFF',
  darkText: '#3E3E3E',
  golden: '#C5A55B',
};

export default function Blog() {
  const { user, isAuthenticated, loading: authLoading } = useAuth(); // Obtener estado de autenticación
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  // Estados para el formulario de nueva publicación
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImg, setNewPostImg] = useState(''); // Para la URL de la imagen
  const [newPostAlt, setNewPostAlt] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Cargar publicaciones del blog en tiempo real
  useEffect(() => {
    setLoadingPosts(true);
    setPostsError(null);

    const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData: BlogPost[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<BlogPost, 'id'>
      }));
      setBlogPosts(postsData);
      setLoadingPosts(false);
      console.log("Publicaciones de blog cargadas:", postsData);
    }, (err) => {
      console.error("Error al cargar las publicaciones del blog:", err);
      setPostsError("Error al cargar las publicaciones. Por favor, inténtalo de nuevo más tarde.");
      setLoadingPosts(false);
    });

    return () => unsubscribe(); // Limpiar el listener al desmontar
  }, []);

  const handleNewPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user || isSubmittingPost) {
      toast.error("Debes iniciar sesión para crear una publicación.");
      return;
    }
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.error("El título y el contenido de la publicación no pueden estar vacíos.");
      return;
    }

    setIsSubmittingPost(true);
    try {
      const postData: Omit<BlogPost, 'id'> = {
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        img: newPostImg.trim() || '/placeholder-blog.jpg', // Usar placeholder si no se proporciona imagen
        alt: newPostAlt.trim() || newPostTitle.trim(),
        createdAt: serverTimestamp(),
        authorId: user.uid,
        authorName: user.name || user.email || 'Usuario Anónimo',
      };

      await addDoc(collection(db, 'blogPosts'), postData);
      toast.success('Publicación creada con éxito!');
      // Resetear formulario
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostImg('');
      setNewPostAlt('');
      setShowNewPostForm(false); // Ocultar formulario después de enviar
    } catch (err) {
      console.error("Error al crear la publicación:", err);
      toast.error("Error al crear la publicación. Inténtalo de nuevo.");
    } finally {
      setIsSubmittingPost(false);
    }
  };

  return (
    <div className="font-['EB_Garamond']" style={{ backgroundColor: colors.lightGrayBg, color: colors.darkText }}>
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-white">
        <h2
          className="text-4xl font-bold mb-8 uppercase"
          style={{ color: colors.crimson }}
        >
          BLOG DE VINOS AURA
        </h2>

        {/* Botón para abrir el formulario de nueva publicación (solo para usuarios autenticados) */}
        {isAuthenticated && (
          <div className="mb-8 text-right">
            <button
              onClick={() => setShowNewPostForm(!showNewPostForm)}
              className="px-6 py-3 rounded-md font-bold text-white transition-all duration-300 ease-in-out flex items-center justify-center ml-auto"
              style={{ backgroundColor: colors.crimson }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              {showNewPostForm ? 'Ocultar Formulario' : 'Crear Nueva Publicación'}
            </button>
          </div>
        )}

        {/* Formulario de Nueva Publicación (condicional) */}
        {isAuthenticated && showNewPostForm && (
          <div className="max-w-3xl mx-auto mb-12 p-8 rounded-lg shadow-xl" style={{ backgroundColor: colors.warmBeige }}>
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.darkText }}>Crear Nueva Publicación</h3>
            <form onSubmit={handleNewPostSubmit} className="space-y-4 text-left">
              <div>
                <label htmlFor="postTitle" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  id="postTitle"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-crimson"
                  style={{ borderColor: colors.darkGray, backgroundColor: colors.white, color: colors.darkText }}
                  required
                />
              </div>
              <div>
                <label htmlFor="postContent" className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                <textarea
                  id="postContent"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-crimson"
                  rows={6}
                  style={{ borderColor: colors.darkGray, backgroundColor: colors.white, color: colors.darkText }}
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="postImg" className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen (Opcional)</label>
                <input
                  type="text"
                  id="postImg"
                  value={newPostImg}
                  onChange={(e) => setNewPostImg(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-crimson"
                  placeholder="Ej: /img/mi-nueva-imagen.jpg"
                  style={{ borderColor: colors.darkGray, backgroundColor: colors.white, color: colors.darkText }}
                />
              </div>
              <div>
                <label htmlFor="postAlt" className="block text-sm font-medium text-gray-700 mb-1">Texto Alternativo de Imagen (Opcional)</label>
                <input
                  type="text"
                  id="postAlt"
                  value={newPostAlt}
                  onChange={(e) => setNewPostAlt(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-crimson"
                  placeholder="Ej: Descripción de la imagen"
                  style={{ borderColor: colors.darkGray, backgroundColor: colors.white, color: colors.darkText }}
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-md font-bold text-white transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: colors.crimson }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
                  disabled={isSubmittingPost}
                >
                  {isSubmittingPost ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Publicaciones */}
        {loadingPosts ? (
          <div className="text-center py-10">
            <p className="text-xl font-medium" style={{ color: colors.darkText }}>Cargando publicaciones...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mt-4" style={{ borderColor: colors.crimson }}></div>
          </div>
        ) : postsError ? (
          <div className="text-center py-10">
            <p className="text-xl font-medium text-red-600">{postsError}</p>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl font-medium" style={{ color: colors.darkText }}>No hay publicaciones en el blog en este momento. ¡Sé el primero en crear una!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="p-8 rounded-md text-left shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
                style={{ backgroundColor: colors.warmBeige }}
              >
                <div className="relative w-full h-60 bg-gray-100 flex items-center justify-center overflow-hidden rounded-md mb-4">
                  <Image
                    src={post.img || '/placeholder-blog.jpg'}
                    alt={post.alt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover rounded-md"
                    priority
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-blog.jpg';
                    }}
                  />
                </div>
                <h3
                  className="text-2xl font-bold mb-2 uppercase"
                  style={{ color: colors.crimson }}
                >
                  {post.title}
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: colors.darkGray }}
                >
                  Por <span className="font-semibold">{post.authorName}</span> el {post.createdAt?.toDate().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p
                  className="text-base leading-relaxed mb-4 text-gray-700"
                  dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '') }} // Mostrar un resumen
                />
                <Link href={`/blog/${post.id}`} passHref>
                  <button
                    className="font-bold text-white px-4 py-2 rounded-md transition-all duration-300 ease-in-out"
                    style={{ backgroundColor: colors.crimson }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
                  >
                    Leer más
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}