// src/routes/feedbackRoutes.js

const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedbackModel'); // Importa o modelo de Feedback
const { authMiddleware } = require('../middlewares/auth.middleware'); // Importa o middleware de verificação de token

// Rota para obter todos os feedbacks
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find(); // Obtém todos os feedbacks do banco de dados
        res.json(feedbacks);
    } catch (error) {
        console.error('Erro ao obter feedbacks:', error);
        res.status(500).json({ message: 'Erro ao obter feedbacks', error: error.message });
    }
});

// Rota para enviar um novo feedback
router.post('/', authMiddleware.verifyToken, async (req, res) => {
    const { rating, comment } = req.body; // Pega os campos do corpo da requisição

    // Valida os campos
    if (!rating || !comment) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Cria uma nova instância do modelo
        const newFeedback = new Feedback({ user_id: req.user.id, rating, comment }); // Usa o ID do usuário extraído do token
        await newFeedback.save(); // Salva o feedback no banco de dados
        res.status(201).json(newFeedback); // Retorna o feedback criado
    } catch (error) {
        console.error('Erro ao enviar feedback:', error);
        res.status(500).json({ message: 'Erro ao enviar feedback', error: error.message });
    }
});

module.exports = router;
