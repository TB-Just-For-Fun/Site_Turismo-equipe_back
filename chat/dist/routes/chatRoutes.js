import express from 'express';
import { createChat, replyChat, getChat, createTicket, getTicket } from '../controllers/chatController'; // Controladores do chat
const router = express.Router();
router.post('/', createChat); // Criar nova conversa
router.post('/:id', replyChat); // Responder a uma conversa
router.get('/:id', getChat); // Obter uma conversa por ID
router.post('/tickets', createTicket); // Criar ticket de suporte
router.get('/tickets/:id', getTicket); // Obter detalhes de um ticket


if (message) {
    console.log('Mensagem recebida no servidor:', message);
    
    // Envia uma resposta JSON com o status 200
    res.status(200).json({ reply: `Resposta do servidor: ${message}` });
} else {
    // Retorna um erro caso a mensagem esteja faltando
    res.status(400).json({ error: 'Nenhuma mensagem enviada.' });
}


export default router;
