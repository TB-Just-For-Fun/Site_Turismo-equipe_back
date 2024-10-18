import express from 'express';
import { createChat, replyChat, getChat } from '../controllers/chatController';

const router = express.Router();

router.post('/', createChat);         
router.post('/:id', replyChat);       
router.get('/:id', getChat);          

export default router;
