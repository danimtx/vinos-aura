// src/components/Chatbot.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatBubbleBottomCenterTextIcon, XMarkIcon, PaperAirplaneIcon, UserCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: inputMessage.trim() }] };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage('');

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener respuesta del bot.');
      }

      const data = await response.json();
      const botReply: ChatMessage = { role: 'model', parts: [{ text: data.reply }] };
      setMessages((prevMessages) => [...prevMessages, botReply]);
    } catch (error: any) {
      console.error('Error al enviar mensaje al chatbot:', error);
      toast.error(`Error de VinaBot: ${error.message || 'No se pudo obtener respuesta.'}`);
      setMessages((prevMessages) => [...prevMessages, { role: 'model', parts: [{ text: 'Lo siento, hubo un problema al conectar con el asistente. Por favor, inténtalo de nuevo más tarde.' }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[1000] p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 bg-accent text-white border border-white/10 hover:border-primary/50"
      >
        {isOpen ? (
          <XMarkIcon className="h-7 w-7" />
        ) : (
          <ChatBubbleBottomCenterTextIcon className="h-7 w-7" />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-[#0a0a0a] rounded-sm shadow-2xl flex flex-col z-[999] animate-slideInUp border border-white/10 overflow-hidden">
          
          {/* Header */}
          <div className="p-4 bg-[#111] text-foreground flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-primary" />
              <span className="font-serif text-lg tracking-wider">Vinos Aura <span className="italic text-primary">Bot</span></span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/5 text-muted hover:text-white transition-colors">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#0a0a0a] to-[#111]">
            {messages.length === 0 && !isLoading && (
              <div className="text-center mt-10 px-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <SparklesIcon className="h-8 w-8 text-primary" />
                </div>
                <p className="font-serif text-lg text-[#F5F5F0] mb-2">Bienvenido a Vinos Aura</p>
                <p className="font-sans font-light text-sm text-muted">¿En qué podemos ayudarte a encontrar el vino perfecto para ti?</p>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start mb-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 border border-white/10 flex-shrink-0">
                    <SparklesIcon className="h-4 w-4 text-primary" />
                  </div>
                )}
                
                <div
                  className={`p-4 max-w-[80%] font-sans font-light text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary/10 text-[#F5F5F0] rounded-2xl rounded-tr-sm border border-primary/20'
                      : 'bg-[#151515] text-[#F5F5F0] rounded-2xl rounded-tl-sm border border-white/5'
                  }`}
                >
                  {msg.parts.map((part, pIdx) => (
                    <p key={pIdx}>{part.text}</p>
                  ))}
                </div>
                
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-[#151515] flex items-center justify-center ml-3 border border-white/10 flex-shrink-0">
                    <UserCircleIcon className="h-5 w-5 text-muted" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start items-center mb-6">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 border border-white/10 flex-shrink-0">
                  <SparklesIcon className="h-4 w-4 text-primary" />
                </div>
                <div className="p-4 bg-[#151515] rounded-2xl rounded-tl-sm border border-white/5 flex space-x-2 items-center">
                  <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-4 bg-[#111] border-t border-white/5">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Pregunta sobre nuestros vinos..."
                className="flex-1 p-3 bg-[#1a1a1a] border border-white/10 rounded-sm focus:outline-none focus:border-primary/50 text-[#F5F5F0] font-sans text-sm transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="p-3 bg-accent hover:bg-[#8B1313] text-white rounded-sm transition-colors disabled:opacity-50 flex items-center justify-center"
                disabled={!inputMessage.trim() || isLoading}
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}