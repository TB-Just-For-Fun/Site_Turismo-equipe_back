import { Server } from 'socket.io';
import http from 'http';

// Definir as respostas automáticas
const responses = {
    greetings: [
        "Oi! Tudo bem com você? O que gostaria de saber?",
        "Olá! Como posso ajudar hoje?",
        "Bem-vindo ao Just for Fund! Estou aqui para te ajudar  com os nossos serviços."
    ],
    aboutUs: [
        "O Just for Fund é uma plataforma de turismo em Angola, especializada em oferecer experiências únicas de viagem. Estamos aqui para ajudar você a explorar o melhor que Angola tem a oferecer!"
    ],
    tourismInfo: [
        "Angola é um país rico em biodiversidade e cultura, com belas paisagens, parques nacionais, e uma costa deslumbrante. Temos diversas opções de pacotes turísticos que incluem desde safáris até passeios culturais."
    ],
    wonders: [
        "As maravilhas de Angola incluem parques como o Parque Nacional da Quiçama, famoso pela sua fauna selvagem, e o Parque Nacional de Iona, conhecido por suas impressionantes formações rochosas e biodiversidade. Além disso, a costa de Namibe é perfeita para quem ama praias e paisagens marítimas."
    ],
    location: [
        "Estamos localizados em Lubango, uma cidade linda na província da Huíla, conhecida por suas montanhas e clima agradável. É um ótimo ponto de partida para explorar a região!"
    ],
    humpata: [
        "A Humpata é uma região montanhosa famosa por suas vistas panorâmicas e clima ameno. É um destino ideal para caminhadas e desfrutar da natureza, além de ser próxima a Lubango."
    ],
    general: [
        "Para informações detalhadas sobre nossos pacotes, serviços, e mais sobre turismo em Angola, recomendo visitar nosso site. Se precisar de algo específico, estou aqui para ajudar!"
    ],
    invalid: [
        "Parece que não estou familiarizado com isso. Que tal perguntar sobre turismo em Angola ou nossas ofertas?"
    ]
};

// Função auxiliar para obter uma mensagem aleatória
const getRandomMessage = (category: keyof typeof responses): string => {
    const messages = responses[category];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
};

// Função para gerar a resposta do bot
const getBotResponse = (message: string): string => {
    let botResponse = '';

    // Verificar se a mensagem é uma saudação
    if (message.match(/(oi|olá|boa tarde|bom dia|boa noite)/i)) {
        botResponse = getRandomMessage('greetings');
    } else if (message.match(/(descrição|sobre vocês)/i)) {
        botResponse = getRandomMessage('aboutUs');
    } else if (message.match(/(turismo em angola|sobre turismo|o que ver|maravilhas)/i)) {
        botResponse = getRandomMessage('tourismInfo');
    } else if (message.match(/(maravilhas de angola|o que ver|parques|pontos turísticos)/i)) {
        botResponse = getRandomMessage('wonders');
    } else if (message.match(/(localização|onde vocês estão)/i)) {
        botResponse = getRandomMessage('location');
    } else if (message.match(/(humpata|sobre a humpata)/i)) {
        botResponse = getRandomMessage('humpata');
    } else if (message.match(/(serviços|o que vocês oferecem|quais são os serviços)/i)) {
        botResponse = getRandomMessage('general'); // Resposta específica sobre serviços
    } else {
        botResponse = getRandomMessage('invalid'); // Resposta para perguntas irrelevantes
    }

    return botResponse;
};

export const initSocket = (server: http.Server): Server => {
    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000', 'http://192.168.1.103:3000'],  // Adicione a origem correta
            methods: ['GET', 'POST'],
            credentials: true 
        }
    });

    // Definir as conversas aqui no initSocket.ts
    const conversations: { [key: string]: Array<{ sender: string; text: string }> } = {};

    io.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);

        // Evento de envio de mensagem
        socket.on('sendMessage', (message) => {
            if (!message || !message.text) {
                console.log('Mensagem inválida recebida do cliente.');
                return;
            }

            console.log('Mensagem recebida do cliente:', message.text);

            // Gerar um ID de conversa
            const conversationId = Object.keys(conversations).length + 1;

            // Processar a mensagem recebida e gerar uma resposta
            const botResponse = getBotResponse(message.text);

            // Salvar a mensagem no histórico de conversas
            conversations[conversationId] = [
                { sender: 'User', text: message.text }
            ];

            // Simular um atraso de 5 segundos para responder
            setTimeout(() => {
                // Atualizar a conversa com a resposta final
                conversations[conversationId].push({ sender: 'Bot', text: botResponse });

                // Emitir a resposta de volta para o cliente
                socket.emit('receiveMessage', { text: botResponse, conversationId });
            }, 1000); // Atraso de 5 segundos
        });

        // Evento de desconexão
        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });

    return io;
};
