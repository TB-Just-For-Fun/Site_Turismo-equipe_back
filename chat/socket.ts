import { Server } from 'socket.io';

const initSocket = (server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Usuário conectado');

    socket.on('sendMessage', (message) => {
      io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('Usuário desconectado');
    });
  });
};

export default initSocket;
