import { Server } from 'socket.io';
// Função para iniciar o WebSocket
export const initSocket = (server) => {
    // Criação da instância do Socket.io atrelada ao servidor HTTP
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        }
    });
    // Lógica de conexão WebSocket
    io.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);
        // Ouvindo o evento 'sendMessage' vindo do cliente
        socket.on('sendMessage', (message) => {
            console.log('Mensagem recebida via WebSocket:', message);
            // Envia a mensagem para todos os clientes conectados
            io.emit('receiveMessage', { text: `Bot responde: Recebido "${message.text}"` });
        });
        // Ouvindo a desconexão do cliente
        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });
};
