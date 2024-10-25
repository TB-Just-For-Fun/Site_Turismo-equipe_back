import Chat from '../models/chatModel';
import Keyword from '../models/keywordModel';
import { normalizeString } from '../utils/normalizeString';
import { getRandomMessage } from '../utils/getRandomMessage';
import ResponseModel from '../models/responseModel'; // Nome alternativo para o modelo Response
// Cria uma nova conversa com a mensagem inicial do bot
export const createChat = async (req, res) => {
    try {
        const { userId, userMessage } = req.body;
        const botResponse = "Bem-vindo ao Just for Fund! Como posso te ajudar?";
        const newChat = new Chat({ userId, userMessage, botResponse });
        await newChat.save();
        res.status(201).send({ message: botResponse, chatId: newChat._id });
    }
    catch (error) {
        res.status(500).send({ error: 'Erro ao criar o chat' });
    }
};
// Responde ao usuário com base na mensagem e nas palavras-chave
export const replyChat = async (userMessage) => {
    try {
        console.log("Processando mensagem do usuário:", userMessage);
        // Normaliza a mensagem
        const normalizedMessage = normalizeString(userMessage);
        // Busca palavras-chave que correspondem à mensagem do usuário
        const keywords = await Keyword.find();
        const foundKeyword = keywords.find(keyword => normalizedMessage.includes(normalizeString(keyword.word)));
        let botResponse;
        if (foundKeyword) {
            // Busca as respostas com base na categoria da palavra-chave
            const responses = await ResponseModel.find({ category: foundKeyword.category });
            if (responses.length > 0) {
                const messages = responses[0].messages; // Pega a primeira resposta ou implemente lógica para múltiplas
                botResponse = getRandomMessage(messages);
            }
            else {
                botResponse = "Desculpe, não consegui encontrar uma resposta apropriada.";
            }
        }
        else {
            botResponse = "Desculpe, não entendi. Pode reformular sua pergunta?";
        }
        // Salva a interação no banco de dados
        const chatEntry = new Chat({ userMessage, botResponse });
        await chatEntry.save();
        console.log("Resposta salva no banco de dados:", botResponse);
        return botResponse;
    }
    catch (error) {
        console.error("Erro ao responder no chat:", error);
        return "Erro ao buscar uma resposta. Tente novamente mais tarde.";
    }
};
// Busca as mensagens de uma conversa
export const getChat = async (req, res) => {
    const chatId = req.params.id;
    try {
        const conversations = await Chat.find({ userId: chatId });
        if (conversations.length > 0) {
            res.status(200).send({ messages: conversations });
        }
        else {
            res.status(404).send({ error: 'Conversa não encontrada.' });
        }
    }
    catch (error) {
        res.status(500).send({ error: 'Erro ao buscar o chat.' });
    }
};
// Exporta a função de resposta como `handleUserMessage`
export const handleUserMessage = replyChat;
