import { Request, Response } from 'express';
import { responses, keywordResponses} from '../seed';



const conversations: { [key: string]: Array<{ sender: string; text: string }> } = {};

export const createChat = (req: Request, res: Response) => {
    const { userMessage } = req.body;
    const conversationId = Object.keys(conversations).length + 1;
    let botMessage = responses.greetings[0];  // Alterado para let

    conversations[conversationId] = [
        { sender: 'User', text: userMessage },
        { sender: 'Bot', text: botMessage }
    ];

    res.status(201).send({ message: botMessage, conversationId });
};

export const replyChat = (req: Request, res: Response) => {
    const chatId = req.params.id;
    const { userMessage } = req.body;

    if (conversations[chatId]) {
        let botResponse = responses.help ? responses.help[0] : "Desculpe, não entendi a sua pergunta.";  // Verificado null

        conversations[chatId].push({ sender: 'User', text: userMessage });
        if (botResponse) {
            conversations[chatId].push({ sender: 'Bot', text: botResponse });
        } else {
            conversations[chatId].push({ sender: 'Bot', text: "Desculpe, não entendi a sua pergunta." });
        }

        res.status(200).send({ message: botResponse });
    } else {
        res.status(404).send({ error: "Conversa não encontrada." });
    }
};

export const getChat = (req: Request, res: Response) => {
    const chatId = req.params.id;
    const conversation = conversations[chatId];

    if (conversation) {
        res.status(200).send({ messages: conversation });
    } else {
        res.status(404).send({ error: 'Conversa não encontrada.' });
    }
};




