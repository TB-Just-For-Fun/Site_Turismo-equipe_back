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
    randomResponses:string[];
    landscapes: string[];
    cultureAndHistory : string[];
    beaches : string[];
    gastronomy : string[];
    festivalsAndEvents : string[];
    adventureTourism : string[];
    accommodation : string[];
}

const responseModel: ResponsesModel = responses;

interface Message {
    sender: string;
    text: string;
}


const randomResponses = [
    "Desculpe, não entendi muito bem. Pode reformular?",
    "Hmm, isso é meio confuso, mas vou tentar ajudar!",
    "Isso não me parece uma pergunta, mas posso te ajudar com outras informações!",
    "Não tenho certeza do que você quis dizer, mas estou aqui para ajudar!",
    "Ei, isso não soa muito legal. Vamos conversar de forma mais amigável?"
];

async function randomResponse(): Promise<string> {
    // Retorna uma resposta aleatória
    return randomResponses[Math.floor(Math.random() * randomResponses.length)];
}

async function findResponse(userMessage: string): Promise<string> {
    const normalizedMessage = userMessage.toLowerCase();
    console.log('Mensagem do usuário:', normalizedMessage);

    // Verifica se a mensagem corresponde a uma saudação
    const greetings = ["oi", "olá", "ola", "hello", "hi", "Ola", "Olá", "OLA", "OLÁ", "oi!"];
    for (const greeting of greetings) {
        if (normalizedMessage.includes(greeting)) {
            console.log("Resposta de saudação encontrada.");
            return responses.greetings[0]; // Saudação do responses
        }
    }

    // Verifica se a mensagem corresponde a perguntas de FAQ
    for (const faq of faqQuestions) {
        if (normalizedMessage.includes(faq.question.toLowerCase())) {
            console.log(`Resposta para FAQ encontrada na categoria '${faq.category}'.`);
            const categoryResponses = responses[faq.category as keyof ResponsesModel];
            return categoryResponses
                ? categoryResponses[Math.floor(Math.random() * categoryResponses.length)]
                : "Desculpe, não consegui encontrar uma resposta para essa pergunta.";
        }
    }

    // Verifica se a mensagem corresponde à palavra-chave "turismo"
    const tourismKeywords = ["turismo", "pontos turísticos", "lugares para visitar"];
    for (const keyword of tourismKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de turismo encontrada.");
            return responses.tourism[0]; // Resposta do responses para turismo
        }
    }

    // Verifica se a mensagem corresponde à palavra-chave "localização"
    const locationKeywords = ["localização", "onde estão", "onde ficam"];
    for (const keyword of locationKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.location[0]; // Resposta do responses para localização
        }
    }

  // Verifica se a mensagem corresponde à palavra-chave "localização"
  const aboutUsKeywords = ["Just for Fund", "sobre o Just for Fund", "",""];
  for (const keyword of aboutUsKeywords) {
      if (normalizedMessage.includes(keyword)) {
          console.log("Resposta de localização encontrada.");
          return responses.aboutUs[0]; // Resposta do responses para localização
      }
  }

  const servicesKeywords = ["serviços", "sobre vossos serviços", "servicos","services"];
  for (const keyword of servicesKeywords) {
      if (normalizedMessage.includes(keyword)) {
          console.log("Resposta de localização encontrada.");
          return responses.services[0]; // Resposta do responses para localização
      }
  }

    // Verifica se a mensagem contém ofensas
    const offensiveKeywords = ["idiota", "burro", "inútil", "otário"];  // Exemplo de palavras ofensivas
    for (const offensiveWord of offensiveKeywords) {
        if (normalizedMessage.includes(offensiveWord)) {
            console.log("Resposta de ofensa encontrada.");
            return "Ei, vamos manter o respeito por aqui!";
        }
    }


    const reservationsUsKeywords = ["reservas", "sobre as reservas", "tudo sobre reservas","reservations"];
    for (const keyword of reservationsUsKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.reservations[0]; // Resposta do responses para localização
        }
    }

    const contactKeywords = ["contactos", "sobre os contactos", "contact","vossos contactos"];
    for (const keyword of contactKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.contact[0]; // Resposta do responses para localização
        }
    }

    const calendarKeywords = ["calendaio"];
    for (const keyword of calendarKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.calendar[0]; // Resposta do responses para localização
        }
    }


    const additionalInfoKeywords = ["detalhes de serviços", "detalhes de pacotes", "detalhe do serviço","detalhe do pacote"];
    for (const keyword of additionalInfoKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.additionalInfo[0]; // Resposta do responses para localização
        }
    }


    const pricesKeywords = ["precos", "preços", "sobre vossos precos","sobre vossos preços"];
    for (const keyword of locationKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.location[0]; // Resposta do responses para localização
        }
    }

    const packagesKeywords = ["pacotes", "Pacotes", "sobre vossos pacotes","sobre vossos Pacotes"];
    for (const keyword of locationKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.location[0]; // Resposta do responses para localização
        }
    }


    const faqKeywords = ["perguntas", "tranferêcias", "pergunta","transferencia"];
    for (const keyword of faqKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.faq[0]; // Resposta do responses para localização
        }
    }


    const feedbackKeywords = ["feedback"];
    for (const keyword of feedbackKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.feedback[0]; // Resposta do responses para localização
        }
    }


    const hoursKeywords = ["hora"];
    for (const keyword of hoursKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.hours[0]; // Resposta do responses para localização
        }
    }

    const helpKeywords = [""];
    for (const keyword of helpKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.help[0]; // Resposta do responses para localização
        }
    }


    const randomResponsesKeywords = [""];
    for (const keyword of randomResponsesKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.randomResponses[0]; // Resposta do responses para localização
        }
    }


    const landscapesKeywords = ["parque", "parques", "Parque", "Parques",];
    for (const keyword of landscapesKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.landscapes[0]; // Resposta do responses para localização
        }
    }


    const cultureAndHistoryKeywords = ["Luanda", "luanda"];
    for (const keyword of cultureAndHistoryKeywords ) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.cultureAndHistory[0]; // Resposta do responses para localização
        }
    }



    const beachesKeywords = ["praia", "Praias","Praia"];
    for (const keyword of beachesKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.beaches[0]; // Resposta do responses para localização
        }
    }


    const gastronomyKeywords = ["gastronomia"];
    for (const keyword of gastronomyKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.gastronomy[0]; // Resposta do responses para localização
        }
    }

    const festivalsAndEventsKeywords = ["festas", "festa", "eventos","Festa","Festas","Eventos","evento","Evento"];
    for (const keyword of festivalsAndEventsKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.festivalsAndEvents[0]; // Resposta do responses para localização
        }
    }


    const adventureTourismKeywords = ["ourtos servicos"];
    for (const keyword of adventureTourismKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.adventureTourism[0]; // Resposta do responses para localização
        }
    }

    const accommodationKeywords = ["acomodo", "acomodacao", "acomodação","como é a acomodação"];
    for (const keyword of accommodationKeywords) {
        if (normalizedMessage.includes(keyword)) {
            console.log("Resposta de localização encontrada.");
            return responses.accommodation[0]; // Resposta do responses para localização
        }
    }

    // Verifica se a mensagem contém abreviações
    const abbreviationKeywords = ["vlw", "tks", "bjs", "flw", "blz"];  // Exemplo de abreviações
    for (const abbreviation of abbreviationKeywords) {
        if (normalizedMessage.includes(abbreviation)) {
            console.log("Resposta de abreviação encontrada.");
            return "Entendi! Mas, se possível, tente escrever por extenso para me ajudar a entender melhor.";
        }
    }

    // Verifica se a mensagem corresponde a uma palavra-chave do arquivo keywordResponses
    for (const keywordResponse of keywordResponses) {
        if (normalizedMessage.includes(keywordResponse.name)) {
            console.log(`Resposta de palavra-chave '${keywordResponse.name}' encontrada.`);
            return keywordResponse.response;
        }
    }
    return randomResponse()
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