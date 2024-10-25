// src/initSocket.ts
import { Server } from 'socket.io';
import { replyChat as handleUserMessage } from './controllers/chatController';
import connectDatabase from './database/db';
export default function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000', 'http://192.168.72.211:3000'],
            methods: ['GET', 'POST'],
            credentials: true,
        }
    });
    connectDatabase().then(() => {
        console.log('Conectado ao MongoDB no Socket.IO');
    }).catch((err) => {
        console.error('Erro ao conectar ao MongoDB:', err);
    });
    io.on('connection', (socket) => {
        console.log('Um usuário se conectou:', socket.id);
        socket.on('userMessage', async (message) => {
            console.log("Mensagem recebida do usuário:", message);
            if (message && message.text) {
                try {
                    const responseMessage = await handleUserMessage(message);
                    console.log("Resposta enviada ao usuário:", responseMessage);
                    socket.emit('receiveMessage', responseMessage);
                }
                catch (error) {
                    console.error("Erro ao processar a mensagem do usuário:", error);
                    socket.emit('receiveMessage', "Erro ao processar sua mensagem.");
                }
            }
            else {
                console.log("Mensagem do usuário estava vazia.");
                socket.emit('receiveMessage', "Mensagem não pode ser vazia.");
            }
        });
        socket.on('disconnect', () => {
            console.log('Usuário desconectou:', socket.id);
        });
    });
    return io;
}
