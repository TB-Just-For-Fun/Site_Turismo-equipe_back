// src/routes/feedbackRoutes.js

const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedbackModel'); // Importa o modelo de Feedback

// Rota para obter todos os feedbacks
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find(); // Obtém todos os feedbacks do banco de dados
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter feedbacks' });
    }
});

// Rota para enviar um novo feedback
router.post('/', async (req, res) => {
    const { user_id, rating, comment } = req.body;

    // Valida os campos
    if (!user_id || !rating || !comment) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Cria uma nova instância do modelo
        const newFeedback = new Feedback({ user_id, rating, comment });
        await newFeedback.save(); // Salva o feedback no banco de dados
        res.status(201).json(newFeedback); // Retorna o feedback criado
    } catch (error) {
        console.error('Erro ao enviar feedback:', error);
        res.status(500).json({ error: 'Erro ao enviar feedback' });
    }
});

module.exports = router;
