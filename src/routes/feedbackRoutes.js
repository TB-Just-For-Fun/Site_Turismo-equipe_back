const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.models');
const Feedback = require('../models/feedbackModel'); // Certifique-se de que esse modelo exista
const InvalidToken = require('../models/invalidToken.model');

const router = express.Router();

// Middleware de autenticação
const authMiddleware = {
    verifyToken: async (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send({ message: "Cabeçalho de autorização ou token ausente" });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const usuario = await UserModel.findById(decoded.id);
            if (!usuario) {
                return res.status(401).send({ message: "Usuário não encontrado ou token inválido" });
            }
            req.user = usuario;
            next();
        } catch (error) {
            console.error('Erro ao verificar token:', error.message);
            return res.status(401).send({ message: "Token inválido", error: error.message });
        }
    },
};

// Rota para criar feedback
router.post('/', authMiddleware.verifyToken, async (req, res) => {
    const { rating, comment } = req.body;

    // Validação de dados
    if (rating < 1 || rating > 5) {
        return res.status(400).send({ message: "A classificação deve estar entre 1 e 5." });
    }
    if (!comment || comment.trim() === "") {
        return res.status(400).send({ message: "O comentário não pode estar vazio." });
    }

    const feedbackData = {
        rating,
        comment,
        name: req.user.username, // Usa o nome do usuário autenticado
        user: req.user.id,
    };
    try {
        const feedback = new Feedback(feedbackData);
        await feedback.save();
        res.status(201).json({ message: 'Feedback criado com sucesso', feedback });
    } catch (error) {
        console.error('Erro ao criar feedback:', error.message);
        res.status(400).json({ message: 'Erro ao criar feedback', error: error.message });
    }
});

// Rota para listar todos os feedbacks
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Erro ao listar feedbacks:', error.message);
        res.status(500).json({ message: 'Erro ao listar feedbacks', error: error.message });
    }
});

// Rota para atualizar feedback
router.put('/:id', authMiddleware.verifyToken, async (req, res) => {
    const { rating, comment } = req.body;

    // Validação de dados
    if (rating < 1 || rating > 5) {
        return res.status(400).send({ message: "A classificação deve estar entre 1 e 5." });
    }
    if (!comment || comment.trim() === "") {
        return res.status(400).send({ message: "O comentário não pode estar vazio." });
    }

    try {
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, { rating, comment }, { new: true });
        if (!feedback) {
            return res.status(404).send({ message: "Feedback não encontrado." });
        }
        res.status(200).json({ message: 'Feedback atualizado com sucesso', feedback });
    } catch (error) {
        console.error('Erro ao atualizar feedback:', error.message);
        res.status(500).json({ message: 'Erro ao atualizar feedback', error: error.message });
    }
});

// Rota para excluir feedback
router.delete('/:id', authMiddleware.verifyToken, async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) {
            return res.status(404).send({ message: "Feedback não encontrado." });
        }
        res.status(200).json({ message: 'Feedback excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir feedback:', error.message);
        res.status(500).json({ message: 'Erro ao excluir feedback', error: error.message });
    }
});

module.exports = router;
