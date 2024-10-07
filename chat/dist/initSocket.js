import { Server } from 'socket.io';
export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000', 'http://192.168.43.54:8080', 'http://192.168.43.40:3000'],
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
