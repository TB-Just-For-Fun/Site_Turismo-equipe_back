function handleGreetings() {
    return randomResponse(responses.greetings);
}
const testResponses = ['Hello', 'Hi', 'Greetings'];
console.log(randomResponse(testResponses));
export const responses = {
    greetings: [ /* mensagens de saudação */],
    help: [ /* mensagens de ajuda */],
    reservations: [ /* mensagens de reservas */],
    hotels: [ /* mensagens de hotéis */],
    login: [ /* mensagens de login */],
    unknown: [ /* mensagens desconhecidas */]
};
// Função para selecionar respostas com base nas palavras-chave detectadas
export function getResponse(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("olá") || lowerMessage.includes("oi")) {
        return randomResponse(responses.greetings);
    }
    else if (lowerMessage.includes("ajuda") || lowerMessage.includes("ajudar")) {
        return randomResponse(responses.help);
    }
    else if (lowerMessage.includes("reserva") || lowerMessage.includes("reservar")) {
        return randomResponse(responses.reservations);
    }
    else if (lowerMessage.includes("hotel") || lowerMessage.includes("hospedagem")) {
        return randomResponse(responses.hotels);
    }
    else if (lowerMessage.includes("login") || lowerMessage.includes("entrar")) {
        return randomResponse(responses.login);
    }
    else {
        return randomResponse(responses.unknown);
    }
}
// Função auxiliar para retornar uma resposta aleatória de uma lista
function randomResponse(responseArray) {
    const randomIndex = Math.floor(Math.random() * responseArray.length);
    return responseArray[randomIndex];
}
