import express from 'express';
import { createChat, replyChat, getChat, createTicket, getTicket } from '../controllers/chatController.js';
const router = express.Router();
router.post('/', createChat);
router.post('/:id', replyChat);
router.get('/:id', getChat);
router.post('/tickets', createTicket);
router.get('/tickets/:id', getTicket);
export default router;
