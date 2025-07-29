// src/app/blog/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, addDoc, query, where, onSnapshot, serverTimestamp, updateDoc, deleteDoc, runTransaction, orderBy } from 'firebase/firestore'; // <-- Asegúrate que 'orderBy' esté aquí
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { UserCircleIcon, HandThumbUpIcon, HandThumbDownIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

// Definición de interfaces
interface BlogPost {
  id: string;
  title: string;
  content: string;
  img: string;
  alt: string;
  createdAt: any; // Firebase Timestamp
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
  parentId?: string; // Para respuestas
  likes: number;
  dislikes: number;
  replies?: Comment[]; // Para anidar respuestas en el frontend
}

interface UserReaction {
  id: string; // userId_commentId
  commentId: string;
  userId: string;
  type: 'like' | 'dislike' | 'none';
  timestamp: any;
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
  const [userReactions, setUserReactions] = useState<{ [commentId: string]: 'like' | 'dislike' | 'none' }>({}); // Para saber la reacción del usuario actual

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

      // Construir una estructura jerárquica para las respuestas
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

    let unsubscribeReactions: () => void | undefined; // Puede ser undefined

    // --- INICIO DE LA CORRECCIÓN ---
    // Solo intentar cargar reacciones si el usuario está autenticado Y hay comentarios cargados
    if (isAuthenticated && user?.uid && comments.length > 0) {
      const commentIds = comments.map(c => c.id);
      
      // Firestore 'in' filter tiene un límite de 10 elementos.
      // Si tienes más de 10 comentarios, necesitarías hacer múltiples consultas
      // o cargar todas las reacciones del usuario y filtrarlas en el cliente.
      // Para simplificar, asumiremos que no excederá el límite de 10 para 'in' para este ejemplo.
      // Si esperas muchos comentarios, considera una colección de 'userReactions' por comentario,
      // o un enfoque diferente para el conteo de likes/dislikes.
      
      // ¡Asegurarse de que el array de IDs no esté vacío antes de la consulta 'in'!
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
        // Si no hay commentIds, no hay reacciones que cargar, así que limpiar el estado
        setUserReactions({});
      }
    } else {
      // Si el usuario no está autenticado o no hay user.uid, limpiar las reacciones del usuario
      setUserReactions({});
    }
    // --- FIN DE LA CORRECCIÓN ---


    return () => {
      unsubscribeComments();
      if (unsubscribeReactions) unsubscribeReactions();
    };
  }, [postId, isAuthenticated, user, comments.length]); // comments.length para re-evaluar reacciones si cambian los comentarios

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user || !newCommentContent.trim()) {
      toast.error("Debes iniciar sesión y escribir un comentario.");
      return;
    }

    try {
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
      toast.success('Comentario agregado con éxito!', {
        style: { background: colors.crimson, color: colors.white },
        iconTheme: { primary: colors.white, secondary: colors.crimson },
      });
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
      toast.error("Debes iniciar sesión para reaccionar.", {
        style: { background: colors.darkGray, color: colors.white },
        iconTheme: { primary: colors.white, secondary: colors.darkGray },
      });
      return;
    }

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
            // Si el usuario hace clic en el mismo tipo de reacción, la elimina (undo)
            if (type === 'like') newLikes--; else newDislikes--;
            transaction.delete(reactionRef); // Eliminar la reacción
            toast(`Tu ${type} ha sido retirado.`, { icon: '👋' });
          } else {
            // Si el usuario cambia de un tipo de reacción a otro
            if (existingReactionType === 'like') newLikes--; else newDislikes--;
            if (type === 'like') newLikes++; else newDislikes++;
            transaction.update(reactionRef, { type: type, timestamp: serverTimestamp() });
            toast(`Has cambiado tu reacción a ${type}.`, { icon: '🔄' });
          }
        } else {
          // No existe una reacción, el usuario está reaccionando por primera vez
          if (type === 'like') newLikes++; else newDislikes++;
          transaction.set(reactionRef, { commentId, userId: user.uid, type, timestamp: serverTimestamp() });
          toast(`Has dado ${type} a este comentario.`, {
            style: { background: colors.crimson, color: colors.white },
            iconTheme: { primary: colors.white, secondary: colors.crimson },
          });
        }
        
        // Actualizar el conteo de likes/dislikes en el comentario
        transaction.update(commentRef, { likes: newLikes, dislikes: newDislikes });
      });
    } catch (err: any) {
      console.error("Error al reaccionar al comentario:", err);
      toast.error(`Error al registrar tu reacción: ${err.message || err}.`);
    }
  };


  // Función auxiliar para renderizar comentarios y sus respuestas recursivamente
  const renderComment = (comment: Comment) => {
    const userReaction = userReactions[comment.id] || 'none'; // Obtener la reacción del usuario actual
    const isLiked = userReaction === 'like';
    const isDisliked = userReaction === 'dislike';

    return (
      <div key={comment.id} className={`mb-4 ${comment.parentId ? 'ml-8 border-l pl-4' : ''}`} style={{ borderColor: colors.warmBeige }}>
        <div className="flex items-start mb-2">
          <UserCircleIcon className="h-8 w-8 mr-3" style={{ color: colors.darkGray }} />
          <div>
            <p className="font-bold" style={{ color: colors.darkText }}>{comment.userName}</p>
            <p className="text-xs text-gray-500">
              {comment.createdAt?.toDate().toLocaleDateString('es-ES', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <p className="text-gray-700 mb-2">{comment.content}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <button
            onClick={() => handleLikeDislike(comment.id, 'like')}
            className={`flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isAuthenticated ? 'hover:text-crimson' : ''} ${isLiked ? 'text-crimson font-bold' : ''}`}
            disabled={!isAuthenticated}
          >
            <HandThumbUpIcon className="h-5 w-5 mr-1" /> {comment.likes}
          </button>
          <button
            onClick={() => handleLikeDislike(comment.id, 'dislike')}
            className={`flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isAuthenticated ? 'hover:text-crimson' : ''} ${isDisliked ? 'text-crimson font-bold' : ''}`}
            disabled={!isAuthenticated}
          >
            <HandThumbDownIcon className="h-5 w-5 mr-1" /> {comment.dislikes}
          </button>
          {isAuthenticated && (
            <button
              onClick={() => handleReplyClick(comment.id, comment.userName)}
              className="flex items-center hover:text-crimson transition-colors"
            >
              <ArrowUturnLeftIcon className="h-5 w-5 mr-1" /> Responder
            </button>
          )}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            {comment.replies.map(reply => renderComment(reply))}
          </div>
        )}
      </div>
    );
  };

  if (loadingPost || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: colors.lightGrayBg, color: colors.darkText }}>
        <p className="text-xl font-bold">Cargando publicación...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mt-4" style={{ borderColor: colors.crimson }}></div>
      </div>
    );
  }

  if (postError || !blogPost) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ backgroundColor: colors.lightGrayBg, color: colors.darkText }}>
        <h2 className="text-2xl font-bold text-red-600 mb-4">{postError || "Publicación no encontrada."}</h2>
        <Link href="/blog" passHref>
          <button
            className="px-6 py-3 rounded-md font-bold text-white transition-all duration-300 ease-in-out shadow-md"
            style={{ backgroundColor: colors.crimson }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
          >
            Volver al Blog
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="font-['EB_Garamond'] py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: colors.lightGrayBg, color: colors.darkText }}>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-600 mb-4">
          <Link href="/" className="hover:underline">Inicio</Link> /
          <Link href="/blog" className="hover:underline ml-1">Blog</Link> /
          <span className="ml-1 font-semibold">{blogPost.title}</span>
        </div>

        {/* Contenido de la Publicación */}
        <h1 className="text-4xl font-bold mb-4" style={{ color: colors.crimson }}>{blogPost.title}</h1>
        <p className="text-sm text-gray-600 mb-6">
          Por <span className="font-semibold">{blogPost.authorName}</span> el {blogPost.createdAt?.toDate().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <div className="relative w-full h-80 bg-gray-100 flex items-center justify-center overflow-hidden rounded-md mb-8">
          <Image
            src={blogPost.img || '/placeholder-blog.jpg'}
            alt={blogPost.alt || blogPost.title}
            fill
            sizes="100vw"
            className="object-cover rounded-md"
            priority
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-blog.jpg';
            }}
          />
        </div>
        <div className="prose max-w-none text-gray-800 leading-relaxed mb-12" dangerouslySetInnerHTML={{ __html: blogPost.content }} />

        {/* Sección de Comentarios */}
        <section className="mt-12 pt-8 border-t" style={{ borderColor: colors.warmBeige }}>
          <h2 className="text-3xl font-bold mb-6" style={{ color: colors.darkText }}>Comentarios</h2>

          {/* Formulario para agregar nuevo comentario */}
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="mb-8 p-6 rounded-lg shadow-inner" style={{ backgroundColor: colors.lightGrayBg }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: colors.darkText }}>
                {replyToCommentId ? `Responder a ${replyToUserName}` : 'Agregar un comentario'}
              </h3>
              <textarea
                id="comment-input"
                className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-crimson"
                rows={4}
                placeholder={replyToCommentId ? `Tu respuesta para @${replyToUserName}...` : "Escribe tu comentario aquí..."}
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                style={{ borderColor: colors.warmBeige, backgroundColor: colors.white, color: colors.darkText }}
              ></textarea>
              <div className="flex justify-end space-x-2">
                {replyToCommentId && (
                  <button
                    type="button"
                    onClick={() => { setReplyToCommentId(null); setReplyToUserName(null); setNewCommentContent(''); }}
                    className="px-4 py-2 rounded-md font-bold text-sm transition-all duration-300 ease-in-out"
                    style={{ backgroundColor: colors.darkGray, color: colors.white }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2E2E2E')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.darkGray)}
                  >
                    Cancelar Respuesta
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md font-bold text-white transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: colors.crimson }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
                  disabled={!newCommentContent.trim()}
                >
                  Publicar
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-6 rounded-lg text-center" style={{ backgroundColor: colors.warmBeige, color: colors.darkText }}>
              <p className="text-lg font-medium mb-4">Inicia sesión para dejar un comentario o responder.</p>
              <Link href="/login" passHref>
                <button
                  className="px-6 py-3 rounded-md font-bold text-white transition-all duration-300 ease-in-out"
                  style={{ backgroundColor: colors.crimson }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
                >
                  Iniciar Sesión
                </button>
              </Link>
            </div>
          )}

          {/* Lista de Comentarios */}
          {loadingComments ? (
            <div className="text-center py-10">
              <p className="text-lg mb-4">Cargando comentarios...</p>
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mt-4" style={{ borderColor: colors.darkGray }}></div>
            </div>
          ) : commentError ? (
            <div className="text-center py-10">
              <p className="text-lg text-red-600">{commentError}</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600">Sé el primero en comentar esta publicación.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map(comment => renderComment(comment))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
