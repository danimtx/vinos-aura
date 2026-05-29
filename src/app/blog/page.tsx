// src/app/blog/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  img: string;
  alt: string;
  createdAt: any;
  authorId: string;
  authorName: string;
}

export default function Blog() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImg, setNewPostImg] = useState('');
  const [newPostAlt, setNewPostAlt] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  useEffect(() => {
    setLoadingPosts(true);
    setPostsError(null);

    if (!db) {
      setPostsError("Configuración de base de datos faltante.");
      setLoadingPosts(false);
      return;
    }

    const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData: BlogPost[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<BlogPost, 'id'>
      }));
      setBlogPosts(postsData);
      setLoadingPosts(false);
    }, (err) => {
      console.error("Error al cargar las publicaciones del blog:", err);
      setPostsError("Error al cargar las publicaciones.");
      setLoadingPosts(false);
    });

    return () => unsubscribe();
  }, []);

  const handleNewPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user || isSubmittingPost) {
      toast.error("Debes iniciar sesión para crear una publicación.");
      return;
    }
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.error("El título y el contenido no pueden estar vacíos.");
      return;
    }

    setIsSubmittingPost(true);
    try {
      if (!db) throw new Error("Base de datos no inicializada.");
      const postData: Omit<BlogPost, 'id'> = {
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        img: newPostImg.trim() || '/placeholder-blog.jpg',
        alt: newPostAlt.trim() || newPostTitle.trim(),
        createdAt: serverTimestamp(),
        authorId: user.uid,
        authorName: user.name || user.email || 'Usuario Anónimo',
      };

      await addDoc(collection(db, 'blogPosts'), postData);
      toast.success('Publicación creada con éxito!');
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostImg('');
      setNewPostAlt('');
      setShowNewPostForm(false);
    } catch (err) {
      console.error("Error al crear la publicación:", err);
      toast.error("Error al crear la publicación.");
    } finally {
      setIsSubmittingPost(false);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen pt-32 pb-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-primary tracking-[0.3em] uppercase text-xs font-sans block mb-4">
            Historias y Saberes
          </span>
          <h1 className="text-5xl md:text-6xl font-serif font-light text-[#F5F5F0]">
            El Diario de <span className="italic text-primary">Aura</span>
          </h1>
        </motion.div>

        {/* Botón Nueva Publicación */}
        {isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12 flex justify-end"
          >
            <button
              onClick={() => setShowNewPostForm(!showNewPostForm)}
              className="px-6 py-3 bg-transparent border border-white/20 hover:border-primary text-foreground hover:text-primary tracking-widest uppercase text-xs transition-all duration-300 rounded-sm flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              {showNewPostForm ? 'Cancelar' : 'Escribir Artículo'}
            </button>
          </motion.div>
        )}

        {/* Formulario Nueva Publicación */}
        {isAuthenticated && showNewPostForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-16 bg-[#111] border border-white/5 p-8 rounded-sm overflow-hidden"
          >
            <h3 className="text-2xl font-serif text-[#F5F5F0] mb-6">Nuevo Artículo</h3>
            <form onSubmit={handleNewPostSubmit} className="space-y-6">
              <div>
                <label htmlFor="postTitle" className="block text-xs font-sans tracking-widest uppercase text-muted mb-2">Título</label>
                <input
                  type="text"
                  id="postTitle"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#151515] border border-white/10 text-[#F5F5F0] rounded-sm focus:outline-none focus:border-primary transition-colors font-sans"
                  required
                />
              </div>
              <div>
                <label htmlFor="postContent" className="block text-xs font-sans tracking-widest uppercase text-muted mb-2">Contenido</label>
                <textarea
                  id="postContent"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full px-4 py-3 bg-[#151515] border border-white/10 text-[#F5F5F0] rounded-sm focus:outline-none focus:border-primary transition-colors font-sans"
                  rows={8}
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="postImg" className="block text-xs font-sans tracking-widest uppercase text-muted mb-2">URL de Imagen (Opcional)</label>
                  <input
                    type="text"
                    id="postImg"
                    value={newPostImg}
                    onChange={(e) => setNewPostImg(e.target.value)}
                    className="w-full px-4 py-3 bg-[#151515] border border-white/10 text-[#F5F5F0] rounded-sm focus:outline-none focus:border-primary transition-colors font-sans"
                    placeholder="/img/ejemplo.jpg"
                  />
                </div>
                <div>
                  <label htmlFor="postAlt" className="block text-xs font-sans tracking-widest uppercase text-muted mb-2">Texto Alternativo (Opcional)</label>
                  <input
                    type="text"
                    id="postAlt"
                    value={newPostAlt}
                    onChange={(e) => setNewPostAlt(e.target.value)}
                    className="w-full px-4 py-3 bg-[#151515] border border-white/10 text-[#F5F5F0] rounded-sm focus:outline-none focus:border-primary transition-colors font-sans"
                  />
                </div>
              </div>
              <div className="text-right pt-4">
                <button
                  type="submit"
                  disabled={isSubmittingPost}
                  className="px-8 py-3 bg-accent hover:bg-[#8B1313] text-white tracking-widest uppercase text-xs font-bold transition-all duration-300 rounded-sm disabled:opacity-50"
                >
                  {isSubmittingPost ? 'Publicando...' : 'Publicar Artículo'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Lista de Posts */}
        {loadingPosts ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-70">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2 border-r-transparent mb-4"></div>
            <p className="font-sans font-light tracking-widest uppercase text-xs text-muted">Buscando historias...</p>
          </div>
        ) : postsError ? (
          <div className="text-center py-20 bg-[#111] border border-white/5 rounded-sm">
            <p className="font-serif text-accent text-xl">{postsError}</p>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-20 bg-[#111] border border-white/5 rounded-sm">
            <p className="font-sans font-light text-muted text-lg mb-4">Aún no hay historias escritas.</p>
            <p className="font-sans font-light text-muted text-sm italic">Las mejores cosechas toman tiempo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                key={post.id}
                className="group bg-[#111] border border-white/5 rounded-sm overflow-hidden flex flex-col hover:border-primary/30 transition-all duration-500"
              >
                <div className="relative h-64 w-full overflow-hidden bg-[#0a0a0a]">
                  <Image
                    src={post.img || '/placeholder-blog.jpg'}
                    alt={post.alt || post.title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-blog.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow relative">
                  <div className="absolute top-0 right-8 -mt-6">
                    <div className="w-12 h-1 bg-primary"></div>
                  </div>
                  
                  <h3 className="text-2xl font-serif text-[#F5F5F0] mb-4 leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-xs font-sans tracking-widest uppercase text-muted">
                      Por {post.authorName}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-primary/50"></span>
                    <span className="text-xs font-sans tracking-widest uppercase text-muted">
                      {post.createdAt?.toDate().toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <p 
                    className="font-sans font-light text-muted text-sm leading-relaxed mb-8 flex-grow"
                    dangerouslySetInnerHTML={{ __html: post.content.substring(0, 120) + (post.content.length > 120 ? '...' : '') }}
                  />
                  
                  <Link href={`/blog/${post.id}`} className="mt-auto inline-block">
                    <span className="text-xs font-sans tracking-widest uppercase text-primary border-b border-primary/30 pb-1 group-hover:border-primary transition-colors">
                      Leer Artículo Completo
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}