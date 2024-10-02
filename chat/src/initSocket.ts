import { Server } from 'socket.io';
import express from "express";
import http from "http";

const  app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors:{
    origin:"*",
  },
});

const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });


  io.on('connection', (socket) => {
    console.log('Usuário conectado', socket.id);

   
    socket.on('sendMessage', (message) => {
      console.log(`Mensagem recebida: ${message}`);

      const botReply = `Resposta do Bot: Você disse "${message}"`;
      

      io.emit('receiveMessage', message);
    });

 
    socket.on('disconnect', () => {
      console.log('Usuário desconectado', socket.id);

      server.listen(8080, () => {
        console.log('servidor rodando na porta 8080');
      })
    });
  });
};

export default initSocket;
