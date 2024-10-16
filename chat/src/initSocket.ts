import { Server } from 'socket.io';
import http from 'http';

export const initSocket = (server: http.Server): Server => {
    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:3001'],
            methods: ['GET', 'POST'],
            credentials: true 
        }
    });

    io.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);

        // Evento de envio de mensagem
        socket.on('sendMessage', (message) => {
            console.log('Mensagem recebida do cliente:', message);
            
            // Aqui você pode adicionar a lógica para processar a mensagem recebida
            // e retornar uma resposta ao cliente
            const serverResponse = `Resposta do servidor: ${message.text}`;
            
            // Emitindo a resposta de volta para o cliente
            socket.emit('receiveMessage', { text: serverResponse });
        });

        // Evento de desconexão
        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });

    return io;
};
