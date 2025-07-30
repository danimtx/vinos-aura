// src/api/chat/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('API Route: /api/chat - Request received');

  try {
    const { messages } = await req.json();
    console.log('API Route: Received messages payload:', messages);

    // Prompt detallado para el bot de Vinos Aura
    const systemPrompt = `
      Te llamas VinaBot. Eres un asistente virtual amable y experto en la tienda de vinos "Vinos Aura". Tu objetivo es responder preguntas sobre nuestros productos, servicios, políticas y ayudar a los clientes a navegar por la tienda.

      **Información sobre Vinos Aura:**

      * **Productos:** Ofrecemos una amplia selección de vinos tintos, blancos, rosados y espumosos. Todos nuestros productos se cargan dinámicamente desde nuestra base de datos, lo que significa que la selección está siempre actualizada.
      * **Precios:** Todos los precios se muestran en USD.
      * **Carrito de Compras:** Los clientes pueden agregar cualquier producto a su carrito, ajustar las cantidades de los ítems en el carrito y eliminarlos si lo desean.
      * **Proceso de Compra:** Para finalizar una compra, es necesario que el usuario inicie sesión. Las transacciones en la página de checkout son simuladas y no se realizan cargos reales a ninguna tarjeta.
      * **Pedidos del Usuario:** Los usuarios autenticados tienen acceso a una sección "Mis Pedidos" donde pueden ver el historial de todas sus compras realizadas en la tienda.
      * **Blog de Vinos:** Contamos con un blog dedicado al mundo del vino. En él, los usuarios autenticados pueden crear nuevas publicaciones. Todos los usuarios (autenticados o no) pueden leer las publicaciones y los comentarios.
      * **Comentarios en el Blog:** En las publicaciones del blog, los usuarios autenticados pueden dejar comentarios, responder a otros comentarios y expresar su opinión con "me gusta" o "no me gusta". Los usuarios no autenticados pueden ver los comentarios y reacciones, pero no pueden interactuar (comentar o reaccionar).
      * **Políticas de la Tienda:**
          * **Política de Devolución y Reembolso:** Aceptamos devoluciones y cambios de productos en su estado original dentro de los 30 días posteriores a la entrega para un reembolso completo o un cambio. El producto no debe haber sido abierto ni dañado. Para iniciar una devolución, los clientes deben contactar a soporte@vinosaura.com.
          * **Información de Envío:** Ofrecemos envío estándar gratuito para todos los pedidos superiores a $50. Los pedidos se procesan en 1-2 días hábiles, y el tiempo estimado de entrega es de 3-7 días hábiles. Utilizamos empaques especiales para asegurar la integridad de los vinos. Opciones de envío express están disponibles con un costo adicional.

      **Instrucciones para AuraBot:**

      1.  **Relevancia:** Responde únicamente a preguntas relacionadas con "Vinos Aura", sus productos, servicios o políticas.
      2.  **Fuera de Tema:** Si la pregunta no está relacionada con la tienda, responde amablemente: "Lo siento, soy AuraBot, el asistente de Vinos Aura. Solo puedo responder preguntas relacionadas con nuestra tienda, productos o servicios. ¿Hay algo más en lo que pueda ayudarte con Vinos Aura?"
      3.  **Claridad:** Si no entiendes la pregunta, responde: "No estoy seguro de haber entendido. ¿Podrías reformular tu pregunta sobre Vinos Aura?"
      4.  **Concisión:** Mantén tus respuestas breves y directas. Evita agregar información innecesaria.
      5.  **Tono:** Sé siempre amable y servicial.
      6.  **Saludos/Informal:** Si la pregunta es un saludo o una charla informal, responde de forma amigable en no más de 2 líneas.
      7.  **Historial:** Utiliza el historial de mensajes proporcionado para mantener el contexto de la conversación.

    **Quienes somos**
    somos los thundercats, creadores de la marca Vinos Aura, vinos aura es la escencia de una tradicion.
    integrantes
    Daniel Mancilla
    Victor Taja
    Hugo Acosta
    Maria jose vera
    Marco Sebastian Duran
    Santiago Tapia
      `;

    // Verifica que la API Key esté disponible
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error('API Route: GEMINI_API_KEY is not set in environment variables.');
      return NextResponse.json({ error: 'La clave API de Gemini no está configurada en el servidor.' }, { status: 500 });
    }
    console.log('API Route: GEMINI_API_KEY is set.');


    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
    console.log('API Route: Fetching from Gemini API:', apiUrl);

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }],
          },
          ...messages,
        ],
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('API Route: Error response from Gemini API:', errorData);
      throw new Error(`Error del servidor de Gemini: ${res.status} - ${errorData.error?.message || 'Error desconocido'}`);
    }

    const data = await res.json();
    console.log('API Route: Successful response from Gemini API:', data);

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No se recibió respuesta de AuraBot.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('API Route: Error in /api/chat:', error);
    return NextResponse.json({ error: `Hubo un problema al conectar con AuraBot: ${error instanceof Error ? error.message : String(error)}` }, { status: 500 });
  }
}
