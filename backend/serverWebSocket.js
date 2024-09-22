const WebSocket = require('ws');

//iniciar servidor en el puerto 8080
const wss = new WebSocket.Server({ port: 3000 });

//cada vez que el cliente se conecte
wss.on('connection', (ws) => {
  console.log('conexión WebSocket establecida')

  //Escuchar mensajes del cliente
  //Escucha mensajes que llegan a través de una conexión WebSocket de un cliente(que podría ser el Service Worker o cualquier otro cliente WebSocket)
  wss.on('message', (event) => {
    console.log('Mensaje recibido en el SW desde una pestaña: ', event.data);
   
    // Enviar el mensaje a todos los clientes conectados
    wss.clients.forEach((client) => {
      console.log('readyState: ', client.readyState);
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  
  })

  //cuando el cliente se desconecta
  wss.on('close', () => {
    console.log('Conexión WebSocket cerrada');
  })
  
})



console.log('Servidor WebSocket escuchando en ws://localhost:3000')