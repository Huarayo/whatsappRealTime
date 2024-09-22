document.addEventListener("DOMContentLoaded", function(){
  const tabId = Date.now().toString();
  console.log(tabId)
  // const tabId = window.location.hash == '#tab1' ? 'tab1' : 'tab2'
  // Registrar Service Worker
  if('serviceWorker' in navigator) {//vericar si el navegador soporta service worker
    //registra el SW especificado en el archivo service-worker.js
    navigator.serviceWorker.register('service-worker.js').then(() => {
      console.log('Service Worker registrado');
    }).catch(() => {
      console.log('Error al registrar el Service Worker:', error);
    });
  }
  
  //Función para enviar mensaje INDIVIDUAL DE CADA PESTAÑA
  function sendMessage() {
    const message = document.getElementById('message').value.trim();
    
    //solo si tiene una letra
    if( message ) {
      //tabId de la pagina se envía
      const messageWithId = { text: message, id: tabId }; 
      //envia el mensaje al service worker activo
      navigator.serviceWorker.controller.postMessage(messageWithId);
      document.getElementById('message').value = "";
    }
  }
  
  //Recibir mensajes del Service Worker
  //ESCUCAH MENSAJES DEL SERVICE WORKER CONSTANTEMENTE
  //GRUPAL , VA HACIA TODAS LAS PESTAÑAS
  navigator.serviceWorker.addEventListener('message', event => {
    const messageList = document.getElementById('message-recived');
    const newMessage = document.createElement('li');
    newMessage.textContent = event.data.text;
  
    // Cambiar color de fondo según quién envió el mensaje
    // Pestaña de la proviene el mensaje === Pestaña en la que estoy SI SON LA MISMA PESTAÑA(EJ: 1 = 1)  ENTONCES VERDE SI NO SON LA MISMA PESTAÑA NEGRO 
  
    const isTheSameTab= event.data.id === tabId ? 'green' : 'black';
    newMessage.classList.add(isTheSameTab);
    newMessage.style.color = 'white';
    newMessage.style.marginLeft = event.data.id === tabId ? 'auto' : '10px'
   
    messageList.appendChild(newMessage);
  })
  
  document.querySelector('button').addEventListener('click',() => {
    sendMessage();
    messageInput.style.height = 'auto'
  })
  
  
  document.getElementById('message').addEventListener('keydown', event => {
    if( event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage()
    }
  })
  
  
  // AJUSTAR LA ALTURA DEL CHAT AUTOMATICAMENTE ESTILO WHATSAPP
  const messageInput = document.getElementById('message');
  //valor de un campo de entrada cambia en tiempo real
  messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto'; // Restablece la altura a auto para calcular el nuevo tamaño
    messageInput.style.height = messageInput.scrollHeight + 'px'; // Ajusta la altura según el contenido
  });
})

