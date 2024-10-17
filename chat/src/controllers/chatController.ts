import { Request, Response } from 'express';

const conversations: { [key: string]: Array<{ sender: string; text: string }> } = {};

// Função para criar uma nova conversa e responder automaticamente
export const createChat = (req: Request, res: Response) => {
    const { userMessage } = req.body;
    const conversationId = Object.keys(conversations).length + 1;
    const botMessage = "Bem-vindo ao Just for Fund! Como posso te ajudar?";

    conversations[conversationId] = [
        { sender: 'User', text: userMessage },
        { sender: 'Bot', text: botMessage }
    ];

    res.status(201).send({ message: botMessage, conversationId });
};

// Função para responder uma conversa existente
export const replyChat = (req: Request, res: Response) => {
    const chatId = req.params.id;
    const { userMessage } = req.body;

    if (conversations[chatId]) {
        const botResponse = "Estou aqui para ajudar com mais informações sobre o Just for Fund.";

        conversations[chatId].push({ sender: 'User', text: userMessage });
        conversations[chatId].push({ sender: 'Bot', text: botResponse });

        res.status(200).send({ message: botResponse });
    } else {
        res.status(404).send({ error: "Conversa não encontrada." });
    }
};

// Função para obter o histórico de uma conversa
export const getChat = (req: Request, res: Response) => {
    const chatId = req.params.id;
    const conversation = conversations[chatId];

    if (conversation) {
        res.status(200).send({ messages: conversation });
    } else {
        res.status(404).send({ error: 'Conversa não encontrada.' });
    }
};
