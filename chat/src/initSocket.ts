import { Server } from 'socket.io';
import http from 'http';

export const initSocket = (server: http.Server): Server => {
    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000', 'http://192.168.193.251:3000', 'http://192.168.193.211:3000'],
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);

        // Escutar mensagens enviadas pelo cliente
        socket.on('sendMessage', (message) => {
            console.log('Mensagem recebida do cliente:', message);
            io.emit('receiveMessage', { text: `Usuário ${socket.id} disse: ${message.text}` });
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });

    return io;
};
