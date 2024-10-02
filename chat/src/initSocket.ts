import { Server } from 'socket.io';

const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });


  io.on('connection', (socket) => {
    console.log('Usuário conectado');

   
    socket.on('sendMessage', (message) => {
      console.log(`Mensagem recebida: ${message}`);

      const botReply = `Resposta do Bot: Você disse "${message}"`;
      

      socket.emit('receiveMessage', botReply);
    });

 
    socket.on('disconnect', () => {
      console.log('Usuário desconectado');
    });
  });
};

export default initSocket;
