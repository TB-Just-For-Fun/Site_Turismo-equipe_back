const Feedback = require('../models/feedbackModel');
const jwt = require('jsonwebtoken');

const createFeedback = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const username = decoded.username; // O nome do usuário obtido do token
        const role = decoded.role; // Obtém o papel do usuário a partir do token

        const feedbackData = {
            rating: req.body.rating,
            comment: req.body.comment,
            name: username, // Preenche automaticamente o nome do usuário
            user: userId,   // Usa o ID do usuário decodificado
            tipo: role      // Armazena o papel do usuário
        };

        const feedback = new Feedback(feedbackData);
        await feedback.save();
        res.status(201).json({ message: 'Feedback criado com sucesso', feedback });
    } catch (error) {
        console.error('Erro ao criar feedback:', error.message);
        res.status(400).json({ message: 'Erro ao criar feedback', error: error.message });
    }
};

const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Erro ao buscar feedbacks:', error);
        res.status(500).json({ message: 'Erro ao buscar feedbacks', error: error.message });
    }
};

module.exports = {
    createFeedback,
    getAllFeedback
};
