import { Server as SocketIOServer } from 'socket.io';
import { handleUserMessage } from './controllers/chatController';
export default function initSocket(server) {
    const io = new SocketIOServer(server, {
        cors: {
            origin: ['http://localhost:3000', 'http://192.168.102.211:3000'], // Verifique se o cliente está rodando nesta porta
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        },
    });
    io.on('connection', (socket) => {
        console.log('Usuário conectado:', socket.id);
        // Ouvindo mensagens do usuário
        socket.on('userMessage', async (userMessage) => {
            console.log("Mensagem recebida do usuário:", userMessage);
            // Processando a mensagem e obtendo a resposta do bot
            const botResponse = await handleUserMessage(userMessage);
            console.log("Resposta do bot gerada:", botResponse); // Log da resposta gerada
            // Enviando a resposta do bot de volta ao usuário
            socket.emit('botResponse', botResponse);
            console.log("Resposta enviada para o usuário:", botResponse);
        });
        socket.on('disconnect', () => {
            console.log('Usuário desconectado:', socket.id);
        });
    });
}
