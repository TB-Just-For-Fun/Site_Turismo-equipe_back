import { Server } from "socket.io";
import mongoose from 'mongoose';
import Response from './models/responseModel';
import connectDatabase from '../src/database/db';

// Respostas automáticas e variações
export const responses: { [key: string]: string[] } = {
    greetings: [
        "👋 Oi! Como posso te ajudar hoje?",
        "🌟 Olá! Bem-vindo ao Just for Fund, o que posso fazer por você?",
        "😊 Saudações! O que você gostaria de saber sobre turismo em Angola?",
        "🙌 Oi, viajante! Estou aqui para ajudar com qualquer dúvida.",
        "👋 Olá! Pronto para explorar as maravilhas de Angola?"
    ],
    aboutUs: [
        "🌍 O Just for Fund é uma plataforma dedicada ao turismo em Angola, trazendo as melhores experiências.",
        "💼 Somos especialistas em turismo em Angola, focados em criar experiências inesquecíveis.",
        "🌟 Nossa missão é garantir que você tenha as melhores memórias de viagem por Angola.",
        "🚀 Explore o melhor de Angola com o Just for Fund – seu guia de aventuras.",
        "🌄 Quer descobrir o que Angola tem de melhor? Estamos aqui para te ajudar!"
    ],
    location: [
        "📍 Estamos localizados em Lubango, na província da Huíla, cercados pelas paisagens incríveis da Serra da Chela.",
        "🌄 Nossa base é em Lubango, no coração da Huíla, próximo a maravilhas como a Fenda da Tundavala e o Cristo Rei.",
        "🏞️ Se você estiver por Lubango, visite nossa sede e explore os pontos turísticos nas proximidades, como a Humpata e o Namibe.",
        "📍 Estamos localizados no Lubango, pronto para te guiar pelas maravilhas do sul de Angola.",
        "🚗 A nossa localização é estratégica para visitar os parques nacionais e praias do Namibe."
    ],
    services: [
        "🛏️ Oferecemos pacotes turísticos, reservas de hotéis e passeios guiados em várias regiões de Angola.",
        "🚗 Nossos serviços incluem passeios guiados, reservas de hospedagem e aventuras personalizadas.",
        "📦 Você pode contar conosco para hospedagem, passeios e pacotes personalizados para a sua viagem.",
        "🌄 Planeje sua próxima aventura em Angola conosco! Reservas de hotéis, pacotes turísticos e muito mais.",
        "📅 Faça já sua reserva com a gente e explore o melhor de Angola!"
    ],
    tourism: [
        "🌍 Angola oferece destinos incríveis como a Fenda da Tundavala, o Deserto do Namibe e as Quedas de Kalandula.",
        "🏞️ Que tal conhecer o Parque Nacional da Quiçama ou as praias do Namibe? Posso te ajudar a planejar.",
        "🌊 Se você adora o mar, temos pacotes que exploram as praias intocadas de Moçâmedes e Baía dos Tigres.",
        "🌄 As maravilhas naturais de Angola, como o Monte Moco e o Planalto da Huíla, são destinos imperdíveis.",
        "🚶‍♂️ Vamos explorar o turismo em Angola? Oferecemos tours guiados para os melhores destinos."
    ],
    reservations: [
        `📝 Faça suas reservas diretamente no nosso site. Acesse nossa página de 
        <a href='https://justforfund.com/reservas' 
           style="display: inline-block; color: #ffffff; background-color: #0066cc; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;"
           target="_blank">Reservas</a>.`,
        "🛎️ Pronto para fazer uma reserva? É só acessar nosso site e garantir sua vaga nas melhores aventuras.",
        "📅 Precisa reservar um hotel ou um pacote turístico? Acesse nossa plataforma de reservas e escolha seu destino.",
        "📝 Quer garantir sua viagem? Nosso sistema de reservas online facilita o planejamento da sua viagem.",
        "📅 Agende sua próxima aventura com a gente. Acesse nossa página de reservas e escolha o melhor pacote."
    ],
    contact: [
        `📞 Precisa de mais informações? Visite nossa página de 
        <a href='https://justforfund.com/contato'
           style="display: inline-block; color: #ffffff; background-color: #00cc66; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;"
           target="_blank">Contato</a>.`,
        "📞 Se precisar de mais assistência, nossa página de contato está disponível para ajudar.",
        "📧 Quer falar diretamente com nossa equipe? Visite a página de contato e mande sua mensagem.",
        "☎️ Para suporte adicional, entre em contato conosco por meio do formulário disponível no site.",
        "📲 Pode nos chamar no chat ou visitar a nossa página de contato para assistência personalizada."
    ]
};


export const keywordResponses = [
    {
        name: "oi",
        category: "greetings",
        response: "Olá! Como posso ajudá-lo hoje?"
    },
    {
        name: "olá",
        category: "greetings",
        response: "Oi! Em que posso te ajudar?"
    },
    {
        name: "reserva",
        category: "reservations",
        response: "Você gostaria de fazer uma reserva? Podemos te ajudar com isso!"
    },
    {
        name: "hotel",
        category: "services",
        response: "Temos ótimos hotéis disponíveis. Gostaria de saber mais sobre eles?"
    },
    {
        name: "pacote",
        category: "services",
        response: "Temos pacotes especiais para você! Quer ver as opções?"
    },
    {
        name: "sítios turísticos",
        category: "tourism",
        response: "Angola tem maravilhas incríveis. Você gostaria de saber mais sobre os sítios turísticos?"
    },
    {
        name: "ajuda",
        category: "help",
        response: "Claro! Como posso te ajudar?"
    }
];


async function getResponse(userInput: string): Promise<string> {
    const normalizedInput = userInput.trim().toLowerCase();

    // Verifique se a entrada corresponde a uma saudação, como "oi" ou "olá"
    if (normalizedInput.includes("oi") || normalizedInput.includes("olá")) {
        return "Olá! Como posso ajudá-lo hoje?";
    }

    // Se a saudação não for encontrada, procure outras respostas
    const randomCategoryKey = Object.keys(responses)[Math.floor(Math.random() * Object.keys(responses).length)];
    const randomResponse = responses[randomCategoryKey][Math.floor(Math.random() * responses[randomCategoryKey].length)];

    return randomResponse;
}

// Simulando uma chamada com input
async function respondToUser(userInput: string) {
    const response = await getResponse(userInput);
    console.log(response);
}

// seed.ts - Modelo de treinamento com intenções e sinônimos
export const intents = [
    {
      intent: "greeting",
      examples: [
        "oi", "olá", "oi, tudo bem?", "olá, como vai?", "bom dia", "boa tarde", "boa noite"
      ],
      response: "Olá! Como posso ajudá-lo hoje?"
    },
    {
      intent: "location",
      examples: [
        "onde estão?", "onde vocês ficam?", "qual a localização?", "onde fica a sede?"
      ],
      response: "Estamos localizados no Lubango, província da Huíla, Angola. Como posso te ajudar mais?"
    },
    {
      intent: "tourism",
      examples: [
        "turismo", "pacotes turísticos", "pontos turísticos", "onde visitar", "lugares interessantes"
      ],
      response: "Temos pacotes turísticos incríveis! Visite o Namibe, a Humpata, e o Lubango. Quer mais detalhes?"
    },
    {
      intent: "reservation",
      examples: [
        "reservas", "como posso reservar?", "fazer uma reserva", "quero reservar", "como faço minha reserva?"
      ],
      response: "Você pode fazer sua reserva diretamente pelo nosso site ou clicando [aqui]. Como posso te ajudar com sua reserva?"
    },
    {
      intent: "help",
      examples: [
        "ajuda", "informações", "preciso de ajuda", "me ajude", "o que vocês fazem?"
      ],
      response: "Eu posso te ajudar a encontrar pacotes turísticos, fazer reservas e responder dúvidas sobre nossa localização."
    },
    {
      intent: "goodbye",
      examples: [
        "tchau", "adeus", "até logo", "nos vemos", "obrigado", "valeu"
      ],
      response: "Até mais! Espero ter ajudado. Volte sempre!"
    },
  ];
  
// Exemplo de chamada
respondToUser("oi").then(console.log); // Isso deve retornar uma resposta para "oi"
