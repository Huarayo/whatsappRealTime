require('dotenv').config();
const WebSocket = require('ws');
const PORT = process.env.PORT || 4000;

// Iniciar servidor en el puerto configurado
const wss = new WebSocket.Server({ port: PORT });

// Cada vez que el cliente se conecta
wss.on('connection', (ws) => {
  console.log('Conexión WebSocket establecida');

  // Escuchar mensajes del cliente (cada conexión tiene su propio "ws")
  ws.on('message', (message) => {
    console.log('Mensaje recibido del cliente:', message);

    // Enviar el mensaje a todos los clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message); // Enviar el mensaje recibido a todos los clientes
      }
    });
  });

  // Manejar cierre de la conexión
  ws.on('close', () => {
    console.log('Conexión WebSocket cerrada');
  });
});

console.log(`Servidor WebSocket escuchando en ws://localhost:${PORT}`);
