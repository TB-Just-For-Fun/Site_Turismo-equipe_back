import { Server } from 'socket.io';
import { keywordResponses } from './seed';
import { responses } from './models/responseModel'; // Importando o responseModel
const responseModel = responses;
const intents = responseModel;
async function findResponse(userMessage) {
    const normalizedMessage = userMessage.toLowerCase();
    console.log('Mensagem do usuário:', normalizedMessage);
    // Verifica se a mensagem corresponde a uma saudação
    const greetings = ["oi", "olá", "oi!"];
    for (const greeting of greetings) {
        if (normalizedMessage.includes(greeting)) {
            console.log("Resposta de saudação encontrada.");
            return responseModel.greetings[0]; // Utiliza a saudação do responseModel
        }
    }
    // Verifica se a mensagem corresponde a palavra-chave "turismo"
    const tourismKeywords = ["turismo", "pontos turísticos", "lugares para visitar"];
    for (const keyword of tourismKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de turismo encontrada.");
            return responseModel.tourism[0]; // Resposta do responseModel para turismo
        }
    }
    // Verifica se a mensagem corresponde à palavra-chave "localização"
    const locationKeywords = ["localização", "onde estão", "onde ficam"];
    for (const keyword of locationKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responseModel.location[0]; // Resposta do responseModel para localização
        }
    }
    // Verifica se a mensagem corresponde a uma palavra-chave do arquivo keywordResponses
    for (const keywordResponse of keywordResponses) {
        if (normalizedMessage.includes(keywordResponse.name)) {
            console.log(`Resposta de palavra-chave '${keywordResponse.name}' encontrada.`);
            return keywordResponse.response;
        }
    }
    // Se nenhuma resposta específica for encontrada, retorna uma resposta aleatória de uma categoria aleatória do responseModel
    const randomCategoryKey = Object.keys(responseModel);
    const randomKey = randomCategoryKey[Math.floor(Math.random() * randomCategoryKey.length)];
    const randomResponse = responseModel[randomKey][Math.floor(Math.random() * responseModel[randomKey].length)];
    return randomResponse;
}
export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000', 'http://192.168.43.54:3000'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    io.on('connection', (socket) => {
        console.log(`Novo cliente conectado: ${socket.id}`);
        socket.on('sendMessage', async (message) => {
            console.log('Mensagem recebida:', message.text);
            try {
                const response = await findResponse(message.text);
                socket.emit('receiveMessage', { message: response });
            }
            catch (error) {
                console.error('Erro ao processar a mensagem:', error);
                socket.emit('receiveMessage', { message: 'Desculpe, ocorreu um erro ao processar sua solicitação.' });
            }
        });
        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });
    return io;
};
export default initSocket;
