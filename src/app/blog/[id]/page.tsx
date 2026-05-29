// src/app/blog/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, addDoc, query, where, onSnapshot, serverTimestamp, runTransaction, orderBy } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { UserCircleIcon, HandThumbUpIcon, HandThumbDownIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Definición de interfaces
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

interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: any;
  parentId?: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
}

interface UserReaction {
  id: string;
  commentId: string;
  userId: string;
  type: 'like' | 'dislike' | 'none';
  timestamp: any;
}

export default function BlogPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [postError, setPostError] = useState<string | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [userReactions, setUserReactions] = useState<{ [commentId: string]: 'like' | 'dislike' | 'none' }>({});

  const [newCommentContent, setNewCommentContent] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
  const [replyToUserName, setReplyToUserName] = useState<string | null>(null);

  // Cargar la publicación del blog
  useEffect(() => {
    if (!postId) {
      setLoadingPost(false);
      setPostError("ID de publicación no proporcionado.");
      return;
    }

    const fetchBlogPost = async () => {
      try {
        setLoadingPost(true);
        if (!db) {
          setPostError("Configuración de base de datos faltante.");
          return;
        }
        const postRef = doc(db, 'blogPosts', postId);
        const docSnap = await getDoc(postRef);

        if (docSnap.exists()) {
          setBlogPost({ id: docSnap.id, ...docSnap.data() } as BlogPost);
        } else {
          setPostError("Publicación no encontrada.");
        }
      } catch (err) {
        console.error("Error al cargar la publicación:", err);
        setPostError("Error al cargar los detalles de la publicación.");
      } finally {
        setLoadingPost(false);
      }
    };

    fetchBlogPost();
  }, [postId]);

  // Cargar comentarios y reacciones del usuario en tiempo real
  useEffect(() => {
    if (!postId) return;
    if (!db) {
      setCommentError("Base de datos no inicializada.");
      setLoadingComments(false);
      return;
    }

    setLoadingComments(true);
    setCommentError(null);

    const qComments = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribeComments = onSnapshot(qComments, async (snapshot) => {
      const fetchedComments: Comment[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Comment, 'id' | 'replies'>
      }));

      const commentsMap = new Map<string, Comment>();
      fetchedComments.forEach(comment => {
        commentsMap.set(comment.id, { ...comment, replies: [] });
      });

      const rootComments: Comment[] = [];
      fetchedComments.forEach(comment => {
        if (comment.parentId) {
          const parent = commentsMap.get(comment.parentId);
          if (parent) {
            parent.replies?.push(commentsMap.get(comment.id)!);
          }
        } else {
          rootComments.push(commentsMap.get(comment.id)!);
        }
      });

      setComments(rootComments);
      setLoadingComments(false);
    }, (err) => {
      console.error("Error al cargar los comentarios:", err);
      setCommentError("Error al cargar los comentarios. Inténtalo de nuevo.");
      setLoadingComments(false);
    });

    let unsubscribeReactions: () => void | undefined;

    if (isAuthenticated && user?.uid && comments.length > 0) {
      const commentIds = comments.map(c => c.id);
      
      if (commentIds.length > 0) { 
        const qReactions = query(
          collection(db, 'commentReactions'),
          where('userId', '==', user.uid),
          where('commentId', 'in', commentIds)
        );
        unsubscribeReactions = onSnapshot(qReactions, (snapshot) => {
          const reactionsMap: { [commentId: string]: 'like' | 'dislike' | 'none' } = {};
          snapshot.docs.forEach(doc => {
            const data = doc.data() as UserReaction;
            reactionsMap[data.commentId] = data.type;
          });
          setUserReactions(reactionsMap);
        }, (err) => {
          console.error("Error al cargar reacciones del usuario:", err);
        });
      } else {
        setUserReactions({});
      }
    } else {
      setUserReactions({});
    }

    return () => {
      unsubscribeComments();
      if (unsubscribeReactions) unsubscribeReactions();
    };
  }, [postId, isAuthenticated, user, comments.length]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user || !newCommentContent.trim()) {
      toast.error("Debes iniciar sesión y escribir un comentario.");
      return;
    }

    try {
      if (!db) throw new Error("Base de datos no inicializada");
      
      const commentData: Omit<Comment, 'id' | 'replies'> = {
        postId: postId,
        userId: user.uid,
        userName: user.name || user.email || 'Usuario Anónimo',
        content: newCommentContent.trim(),
        createdAt: serverTimestamp(),
        likes: 0,
        dislikes: 0,
        ...(replyToCommentId && { parentId: replyToCommentId })
      };

      await addDoc(collection(db, 'comments'), commentData);
      setNewCommentContent('');
      setReplyToCommentId(null);
      setReplyToUserName(null);
      toast.success('Comentario agregado con éxito!');
    } catch (err) {
      console.error("Error al agregar comentario:", err);
      toast.error("Error al agregar el comentario. Inténtalo de nuevo.");
    }
  };

  const handleReplyClick = (commentId: string, userName: string) => {
    setReplyToCommentId(commentId);
    setReplyToUserName(userName);
    setNewCommentContent(`@${userName} `);
    document.getElementById('comment-input')?.focus();
  };

  const handleLikeDislike = async (commentId: string, type: 'like' | 'dislike') => {
    if (!isAuthenticated || !user) {
      toast.error("Debes iniciar sesión para reaccionar.");
      return;
    }

    if (!db) return;

    const reactionDocId = `${user.uid}_${commentId}`;
    const reactionRef = doc(db, 'commentReactions', reactionDocId);
    const commentRef = doc(db, 'comments', commentId);

    try {
      await runTransaction(db, async (transaction) => {
        const commentDoc = await transaction.get(commentRef);
        if (!commentDoc.exists()) {
          throw "Comentario no encontrado.";
        }
        const currentCommentData = commentDoc.data() as Comment;
        let newLikes = currentCommentData.likes || 0;
        let newDislikes = currentCommentData.dislikes || 0;

        const reactionSnap = await transaction.get(reactionRef);

        if (reactionSnap.exists()) {
          const existingReactionType = reactionSnap.data().type;

          if (existingReactionType === type) {
            if (type === 'like') newLikes--; else newDislikes--;
            transaction.delete(reactionRef);
            toast(`Tu ${type} ha sido retirado.`, { icon: '👋' });
          } else {
            if (existingReactionType === 'like') newLikes--; else newDislikes--;
            if (type === 'like') newLikes++; else newDislikes++;
            transaction.update(reactionRef, { type: type, timestamp: serverTimestamp() });
            toast(`Has cambiado tu reacción a ${type}.`, { icon: '🔄' });
          }
        } else {
          if (type === 'like') newLikes++; else newDislikes++;
          transaction.set(reactionRef, { commentId, userId: user.uid, type, timestamp: serverTimestamp() });
          toast(`Has dado ${type} a este comentario.`);
        }
        
        transaction.update(commentRef, { likes: newLikes, dislikes: newDislikes });
      });
    } catch (err: any) {
      console.error("Error al reaccionar al comentario:", err);
      toast.error(`Error al registrar tu reacción: ${err.message || err}.`);
    }
  };

  const renderComment = (comment: Comment) => {
    const userReaction = userReactions[comment.id] || 'none';
    const isLiked = userReaction === 'like';
    const isDisliked = userReaction === 'dislike';

    return (
      <div key={comment.id} className={`mb-6 ${comment.parentId ? 'ml-8 md:ml-12 border-l border-white/10 pl-6' : ''}`}>
        <div className="flex items-start mb-3">
          <div className="w-10 h-10 rounded-full bg-[#151515] flex items-center justify-center mr-4 border border-white/5 flex-shrink-0">
            <UserCircleIcon className="h-6 w-6 text-muted" />
          </div>
          <div>
            <p className="font-serif text-[#F5F5F0] text-lg">{comment.userName}</p>
            <p className="font-sans font-light text-xs text-muted">
              {comment.createdAt?.toDate().toLocaleDateString('es-ES', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        
        <div className={`p-4 rounded-sm font-sans font-light text-sm leading-relaxed mb-3 ${comment.parentId ? 'bg-[#151515] border border-white/5' : 'bg-[#111] border border-white/5'}`}>
          <p className="text-muted">{comment.content}</p>
        </div>
        
        <div className="flex items-center space-x-6 text-xs font-sans tracking-widest uppercase text-muted ml-2">
          <button
            onClick={() => handleLikeDislike(comment.id, 'like')}
            className={`flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isAuthenticated ? 'hover:text-primary' : ''} ${isLiked ? 'text-primary' : ''}`}
            disabled={!isAuthenticated}
          >
            <HandThumbUpIcon className="h-4 w-4 mr-1.5" /> {comment.likes}
          </button>
          <button
            onClick={() => handleLikeDislike(comment.id, 'dislike')}
            className={`flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isAuthenticated ? 'hover:text-primary' : ''} ${isDisliked ? 'text-primary' : ''}`}
            disabled={!isAuthenticated}
          >
            <HandThumbDownIcon className="h-4 w-4 mr-1.5" /> {comment.dislikes}
          </button>
          {isAuthenticated && (
            <button
              onClick={() => handleReplyClick(comment.id, comment.userName)}
              className="flex items-center hover:text-primary transition-colors"
            >
              <ArrowUturnLeftIcon className="h-4 w-4 mr-1.5" /> Responder
            </button>
          )}
        </div>
        
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-6">
            {comment.replies.map(reply => renderComment(reply))}
          </div>
        )}
      </div>
    );
  };

  if (loadingPost || authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center opacity-70">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2 border-r-transparent mb-4"></div>
        <p className="font-sans font-light tracking-widest uppercase text-xs text-muted">Buscando historia...</p>
      </div>
    );
  }

  if (postError || !blogPost) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-serif text-accent mb-6">{postError || "Historia no encontrada."}</h2>
        <Link href="/blog" passHref>
          <button className="px-6 py-3 rounded-sm font-sans tracking-widest uppercase text-xs text-white bg-accent hover:bg-[#8B1313] transition-colors duration-300">
            Volver al Diario
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen pt-32 pb-24 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-sans tracking-widest uppercase text-muted mb-8 flex items-center gap-2"
        >
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary transition-colors">El Diario</Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-xs">{blogPost.title}</span>
        </motion.div>

        {/* Header Artículo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif font-light text-[#F5F5F0] mb-6 leading-tight">
            {blogPost.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-sans tracking-widest uppercase text-muted">Por</span>
              <span className="text-xs font-sans tracking-widest uppercase text-primary">{blogPost.authorName}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-primary/30"></span>
            <span className="text-xs font-sans tracking-widest uppercase text-muted">
              {blogPost.createdAt?.toDate().toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </motion.div>

        {/* Imagen Principal */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full aspect-[21/9] bg-[#0a0a0a] rounded-sm mb-12 overflow-hidden border border-white/5"
        >
          <Image
            src={blogPost.img || '/placeholder-blog.jpg'}
            alt={blogPost.alt || blogPost.title}
            fill
            sizes="100vw"
            className="object-cover opacity-80"
            priority
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-blog.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>
        </motion.div>

        {/* Contenido */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="prose prose-invert prose-lg max-w-none font-sans font-light leading-relaxed text-muted mb-20 prose-headings:font-serif prose-headings:font-light prose-headings:text-[#F5F5F0] prose-a:text-primary prose-a:no-underline hover:prose-a:underline" 
          dangerouslySetInnerHTML={{ __html: blogPost.content }} 
        />

        {/* Sección de Comentarios */}
        <section className="mt-16 pt-12 border-t border-white/10">
          <h2 className="text-3xl font-serif font-light text-[#F5F5F0] mb-8">Comentarios & Reflexiones</h2>

          {/* Formulario para agregar nuevo comentario */}
          {isAuthenticated ? (
            <div className="mb-12 bg-[#111] p-8 rounded-sm border border-white/5">
              <h3 className="text-sm font-sans tracking-widest uppercase text-muted mb-6">
                {replyToCommentId ? `Responder a ${replyToUserName}` : 'Deja una reflexión'}
              </h3>
              <form onSubmit={handleAddComment}>
                <textarea
                  id="comment-input"
                  className="w-full px-4 py-3 bg-[#151515] border border-white/10 text-[#F5F5F0] rounded-sm focus:outline-none focus:border-primary transition-colors font-sans mb-4"
                  rows={4}
                  placeholder={replyToCommentId ? `Tu respuesta para @${replyToUserName}...` : "Escribe tu comentario aquí..."}
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                ></textarea>
                <div className="flex justify-end space-x-4">
                  {replyToCommentId && (
                    <button
                      type="button"
                      onClick={() => { setReplyToCommentId(null); setReplyToUserName(null); setNewCommentContent(''); }}
                      className="px-6 py-3 bg-transparent border border-white/20 hover:border-white/50 text-foreground tracking-widest uppercase text-xs transition-all duration-300 rounded-sm"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-8 py-3 bg-accent hover:bg-[#8B1313] text-white tracking-widest uppercase text-xs font-bold transition-all duration-300 rounded-sm disabled:opacity-50"
                    disabled={!newCommentContent.trim()}
                  >
                    Publicar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="mb-12 p-8 bg-[#111] border border-white/5 rounded-sm text-center">
              <p className="font-sans font-light text-muted mb-6">Inicia sesión para compartir tus reflexiones.</p>
              <Link href="/login" passHref>
                <button className="px-8 py-3 bg-transparent border border-white/20 hover:border-primary text-foreground hover:text-primary tracking-widest uppercase text-xs transition-all duration-300 rounded-sm">
                  Identificarse
                </button>
              </Link>
            </div>
          )}

          {/* Lista de Comentarios */}
          {loadingComments ? (
            <div className="flex justify-center py-10 opacity-70">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-r-2 border-r-transparent"></div>
            </div>
          ) : commentError ? (
            <div className="text-center py-10 bg-[#111] border border-white/5 rounded-sm">
              <p className="font-serif text-accent">{commentError}</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 bg-[#111] border border-white/5 rounded-sm">
              <p className="font-sans font-light text-muted italic">Sé la primera persona en compartir sus pensamientos sobre esta historia.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {comments.map(comment => renderComment(comment))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
