// src/components/Chatbot.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatBubbleBottomCenterTextIcon, XMarkIcon, PaperAirplaneIcon, UserCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast'; // Para notificaciones

// Definición de tipos para los mensajes del chat, compatible con la API de Gemini
interface ChatMessage {
  role: 'user' | 'model'; // 'user' para el usuario, 'model' para el bot
  parts: { text: string }[];
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

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]); // Historial de chat
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Para hacer scroll automático

  // Función para hacer scroll al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Cada vez que los mensajes cambian, hacemos scroll

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: inputMessage.trim() }] };
    setMessages((prevMessages) => [...prevMessages, userMessage]); // Añadir mensaje del usuario al historial
    setInputMessage(''); // Limpiar input

    setIsLoading(true);

    try {
      // Enviar todo el historial de chat a la API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }), // ¡Aquí se envía el historial completo!
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener respuesta del bot.');
      }

      const data = await response.json();
      const botReply: ChatMessage = { role: 'model', parts: [{ text: data.reply }] };
      setMessages((prevMessages) => [...prevMessages, botReply]); // Añadir respuesta del bot
    } catch (error: any) {
      console.error('Error al enviar mensaje al chatbot:', error);
      toast.error(`Error de AuraBot: ${error.message || 'No se pudo obtener respuesta.'}`, {
        style: { background: colors.crimson, color: colors.white },
        iconTheme: { primary: colors.white, secondary: colors.crimson },
      });
      setMessages((prevMessages) => [...prevMessages, { role: 'model', parts: [{ text: 'Lo siento, hubo un problema al conectar con el asistente. Por favor, inténtalo de nuevo más tarde.' }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante para abrir/cerrar el chatbot */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[1000] p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
        style={{ backgroundColor: colors.crimson, color: colors.white }}
      >
        {isOpen ? (
          <XMarkIcon className="h-8 w-8" />
        ) : (
          <ChatBubbleBottomCenterTextIcon className="h-8 w-8" />
        )}
      </button>

      {/* Ventana del Chatbot */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-6 w-80 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-[999] animate-slideInUp"
          style={{ borderColor: colors.warmBeige, color: colors.darkText }}
        >
          {/* Encabezado del Chatbot */}
          <div className="p-4 rounded-t-lg text-white font-bold text-lg flex items-center justify-between" style={{ backgroundColor: colors.crimson }}>
            <span>VinaBot</span>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-crimson-dark transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar" style={{ backgroundColor: colors.lightGrayBg }}>
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-gray-500 mt-10">
                <SparklesIcon className="h-12 w-12 mx-auto mb-2" style={{ color: colors.golden }} />
                <p>¡Hola! Soy VinaBot, tu asistente de Vinos Aura. ¿En qué puedo ayudarte hoy?</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <SparklesIcon className="h-6 w-6 mr-2 flex-shrink-0" style={{ color: colors.golden }} />
                )}
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-crimson text-white rounded-br-none'
                      : 'bg-warmBeige text-darkText rounded-bl-none'
                  }`}
                >
                  {msg.parts.map((part, pIdx) => (
                    <p key={pIdx}>{part.text}</p>
                  ))}
                </div>
                {msg.role === 'user' && (
                  <UserCircleIcon className="h-6 w-6 ml-2 flex-shrink-0" style={{ color: colors.darkGray }} />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-center mb-4">
                <SparklesIcon className="h-6 w-6 mr-2 flex-shrink-0" style={{ color: colors.golden }} />
                <div className="p-3 rounded-lg rounded-bl-none" style={{ backgroundColor: colors.warmBeige, color: colors.darkText }}>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-darkText rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-darkText rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-darkText rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Elemento para el scroll */}
          </div>

          {/* Área de Input */}
          <form onSubmit={sendMessage} className="p-4 border-t" style={{ borderColor: colors.warmBeige, backgroundColor: colors.white }}>
            <div className="flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-crimson"
                style={{ borderColor: colors.warmBeige, color: colors.darkText }}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="ml-2 p-2 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: colors.crimson, color: colors.white }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
                disabled={!inputMessage.trim() || isLoading}
              >
                <PaperAirplaneIcon className="h-6 w-6" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}