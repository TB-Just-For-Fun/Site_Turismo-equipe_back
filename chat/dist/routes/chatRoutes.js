import express from 'express';
import { createChat, replyChat, getChat } from '../controllers/chatController';
const router = express.Router();
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});
router.get('/', (req, res) => {
    res.send('Bem-vindo à API de chat! Use as rotas /new para criar um chat ou /:id para obter respostas de uma conversa específica.');
});
router.post('/:id', replyChat);
router.post('/new', createChat);
router.get('/:id', getChat);
export default router;
