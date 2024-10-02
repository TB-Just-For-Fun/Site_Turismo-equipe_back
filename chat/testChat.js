"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function startChat() {
    try {
        const response = await axios_1.default.post('http://localhost:8080/chat', {
            userMessage: 'Olá, quais serviços vocês oferecem?'
        });
        console.log('Bot resposta inicial:', response.data.message);
        return response.data.conversationId;
    }
    catch (error) {
        console.error('Erro ao iniciar o chat:', error.message);
    }
}
async function continueChat(conversationId) {
    try {
        const response = await axios_1.default.post(`http://localhost:8080/chat/${conversationId}`, {
            userMessage: 'Me fale mais sobre os pacotes turísticos.'
        });
        console.log('Bot resposta continuada:', response.data.message);
    }
    catch (error) {
        console.error('Erro ao continuar o chat:', error.message);
    }
}
(async () => {
    const conversationId = await startChat();
    if (conversationId) {
        await continueChat(conversationId);
    }
})();
