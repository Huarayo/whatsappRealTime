//conexión al servidor WebSocket y manejar la comunicación entre el servidor y las pestañas
//Service Workers interceptaran los mensajes de las pestañas y lo enviará al servidor WebSocket
let socket;

self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  //permite que el nuevo sw tome el control inmediatamente, sin esperar a que las pestañas abiertas se cierren
  self.skipWaiting(); //hace que el SW esté activo de inmediato
})



self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');

  socket = new WebSocket('ws://localhost:3000');
  
  //Reenviar el mensaje a  todas las pestañas controladas por el SW
  socket.addEventListener('message', (event) => {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage(JSON.parse(event.data));
      })
    })
  });

  
  socket.addEventListener('open', () => {
    console.log('Conexión WeSocket establecida');
  })

  socket.addEventListener('close', () =>{
    console.log('Conexión WebSocket cerrada');
  })

  socket.addEventListener('error', (error)=> {
    console.log("Error en WebSocket:" + error)
  })
})


//Escucha mensajes enviados desde las pestañas que están controladas por el Service Worker. Cunado recibe un mensaje, envía al servidor
self.addEventListener('message', (event) => {
  //clients: instancias de las pestañas que están bajo el control de ese SW, cada vez que un sw se registra y activa puede controlar varias pestañas abiertas que han cargado el mismo origen
  //matchAll() obtiene una lista de todas las pestañas y contextos(como iframes) que estan controlados por sw, devuelve promesa que se resuelve con un arreglo de objetos
  // console.log("Mensaje recibido en SW:", event.data); 
  // self.clients.matchAll().then(clients => {
  //   clients.forEach(client => {
  //     //envia el mensaje recibido a cada pestaña
  //     client.postMessage(event.data);
  //   })
  // })

  if(socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(event.data))
  }

});

//E