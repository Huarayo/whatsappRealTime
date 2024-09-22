let socket;

self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  // Permitir que el nuevo SW tome el control inmediatamente
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');

  // Conexión WebSocket al servidor
  socket = new WebSocket('ws://localhost:4000'); // Asegúrate de que el puerto coincida con el servidor

  socket.addEventListener('open', () => {
    console.log('Conexión WebSocket establecida');
  });

  socket.addEventListener('message', (event) => {
    
    if (event.data instanceof Blob) {
      event.data.text().then((text) => {

        const parsedData = JSON.parse(text);
        // Reenviar el mensaje a todas las pestañas controladas por el SW
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage(parsedData); // Enviar a las pestañas
          });
        });

      })
    }

  });

  socket.addEventListener('close', () => {
    console.log('Conexión WebSocket cerrada');
  });

  socket.addEventListener('error', (error) => {
    console.error('Error en WebSocket:', error);
  });
});

// Escuchar mensajes enviados desde las pestañas controladas por el SW
self.addEventListener('message', (event) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    // Enviar el mensaje recibido al servidor WebSocket
    socket.send(JSON.stringify(event.data));
  }

  //SI EL WEBSOCKET ANDA BIEN ENTONCES ESTO LO OMITIMOS PORQUE AHORA EL SERVICE WORKER ES UN INTERMEDIARIO DE ENVIAR DATOS AL DE LA PESTAÑA AL WEBSOCKET SERVIDOR PARA QUE SE LO ENVIE A TODOS LAS PESTAÑAS CONECTADAS NO SOLO A LA PESTAÑAS DEL DISPOSITIVO
  // self.clients.matchAll().then((clients)=>{
  //   clients.forEach(client => {
  //     client.postMessage(event.data)
  //   })
  // })
});
