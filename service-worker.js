self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  //permite que el nuevo sw tome el control inmediatamente, sin esperar a que las pestañas abiertas se cierren
  self.skipWaiting(); //hace que el SW esté activo de inmediato
})

// 
self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');
})

//escucha mensajes enviados al services worker desde las pestañas
self.addEventListener('message', (event) => {
  //clients: instancias de las pestañas que están bajo el control de ese SW, cada vez que un sw se registra y activa puede controlar varias pestañas abiertas que han cargado el mismo origen
  //matchAll() obtiene una lista de todas las pestañas y contextos(como iframes) que estan controlados por sw, devuelve promesa que se resuelve con un arreglo de objetos
  console.log("Mensaje recibido en SW:", event.data); 
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      //envia el mensaje recibido a cada pestaña
      client.postMessage(event.data);
    })
  })

});