import express from 'express';
import { createChat, replyChat, getChat } from '../controllers/chatController';

const router = express.Router();

router.post('/', createChat);         // Criar nova conversa
router.post('/:id', replyChat);       // Responder a uma conversa
router.get('/:id', getChat);          // Obter uma conversa por ID

export default router;
