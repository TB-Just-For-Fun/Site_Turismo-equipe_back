import { Server } from 'socket.io';
import http from 'http';
import { faqQuestions } from './faqQuestions';
import { keywordResponses } from './seed';
import { responses } from './models/responseModel'; // Importando o responseModel
import { intents } from './seed';

// Define a estrutura de `responses` para acessar corretamente as respostas.
interface ResponsesModel {
    greetings: string[];
    aboutUs: string[];
    location: string[];
    services: string[];
    tourism: string[];
    reservations: string[];
    contact: string[];
    calendar: string[];
    additionalInfo: string[];
    prices: string[];
    packages: string[];
    faq: string[];
    feedback: string[];
    hours: string[];
    help: string[];
}

const responseModel: ResponsesModel = responses;

interface Message {
    sender: string;
    text: string;
}

async function findResponse(userMessage: string): Promise<string> {
    const normalizedMessage = userMessage.toLowerCase();
    console.log('Mensagem do usuário:', normalizedMessage);

    // Verifica se a mensagem corresponde a uma saudação
    const greetings = ["oi", "olá", "oi!"];
    for (const greeting of greetings) {
        if (normalizedMessage.includes(greeting)) {
            console.log("Resposta de saudação encontrada.");
            return responseModel.greetings[0];  // Utiliza a saudação do responseModel
        }
    }

    // Verifica se a mensagem corresponde a palavra-chave "turismo"
    const tourismKeywords = ["turismo", "pontos turísticos", "lugares para visitar"];
    for (const keyword of tourismKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de turismo encontrada.");
            return responseModel.tourism[0];  // Resposta do responseModel para turismo
        }
    }

    // Verifica se a mensagem corresponde à palavra-chave "localização"
    const locationKeywords = ["localização", "onde estão", "onde ficam"];
    for (const keyword of locationKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responseModel.location[0];  // Resposta do responseModel para localização
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
    const randomCategoryKey = Object.keys(responseModel) as Array<keyof ResponsesModel>;
    const randomKey = randomCategoryKey[Math.floor(Math.random() * randomCategoryKey.length)];
    const randomResponse = responseModel[randomKey][Math.floor(Math.random() * responseModel[randomKey].length)];
    
    return randomResponse;
}

export const initSocket = (server: http.Server): Server => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log(`Novo cliente conectado: ${socket.id}`);

        socket.on('sendMessage', async (message: Message) => {
            console.log('Mensagem recebida:', message.text);

            try {
                const response = await findResponse(message.text);
                socket.emit('receiveMessage', { message: response });
            } catch (error) {
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