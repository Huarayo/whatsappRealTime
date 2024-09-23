let socket;

function connectWebSocket() {
  // Verificar el estado del socket y conectarse si es necesario
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket('ws://localhost:4000');

    socket.addEventListener('open', () => {
      console.log('Conexión WebSocket establecida dentro del SW');
    });

    //La función handleServerMessage se encarga de procesar los mensajes recibidos del servidor y convertirlos a JSON si son de tipo Blob
    socket.addEventListener('message', handleMessage);
    socket.addEventListener('close', () => {
      console.log('Conexión WebSocket cerrada dentro del SW');
    });
    socket.addEventListener('error', (error) => {
      console.error('Error en WebSocket dentro del SW:', error);
    });
  }
}

async function handleMessage(event) {
  console.log('Mensaje recibido del WebSocket:', event.data);

  try {
    // Manejar el mensaje, verificando si es un Blob
    const text = event.data instanceof Blob ? await event.data.text() : event.data;
    const parsedData = JSON.parse(text);

    // Enviar el mensaje a todas las pestañas controladas
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({ source: 'webSocket', ...parsedData });
    });
  } catch (error) {
    console.error('Error al procesar el mensaje:', error);
  }
}

self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  self.skipWaiting(); // Permitir que el nuevo SW tome el control inmediatamente
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');
  connectWebSocket(); // Conexión WebSocket al servidor
});

// Escuchar mensajes enviados desde las pestañas controladas por el SW
self.addEventListener('message', (event) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(event.data)); // Enviar el mensaje al servidor WebSocket
  } else {
    console.log('El WebSocket no está conectado. Intentando reconectar...');
    connectWebSocket(); // Intentar reconectar si el socket no está disponible
  }
});
