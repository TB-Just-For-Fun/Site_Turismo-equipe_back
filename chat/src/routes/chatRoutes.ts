import express from 'express';
import { createChat, replyChat, getChat } from '../controllers/chatController';

const router = express.Router();

router.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

router.get('/', (req: express.Request, res: express.Response) => {
    res.send('Bem-vindo à API de chat! Use as rotas /new para criar um chat ou /:id para obter respostas de uma conversa específica.');
});


router.post('/:id', replyChat);
router.post('/new', createChat as any);
router.get('/:id', getChat as any);


export default router;
