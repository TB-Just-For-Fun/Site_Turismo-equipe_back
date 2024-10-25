const Feedback = require('../models/feedbackModel');
const userModel = require('../models/user.models');
const jwt = require('jsonwebtoken'); // Se você estiver usando JWT para autenticação


const createFeedback = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Obtém o token do cabeçalho

        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        // Decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Certifique-se de usar a chave secreta correta
        const userId = decoded.id;
        const username = decoded.username; // O nome do usuário obtido do token
        const role = decoded.role; // Obtém o papel do usuário a partir do token

        // Lógica para criar feedback
        const feedbackData = {
            rating: req.body.rating,
            comment: req.body.comment,
            name: username, // Preenche automaticamente o nome do usuário
            user: userId,
            tipo: role // Armazena o papel do usuário
        };

        const feedback = new Feedback(feedbackData);
        await feedback.save();
        res.status(201).json({ message: 'Feedback criado com sucesso', feedback });
    } catch (error) {
        console.error('Erro ao criar feedback:', error.message); // Mensagem de erro mais clara
        res.status(400).json({ message: 'Erro ao criar feedback', error: error.message });
    }
};

module.exports = {
    createFeedback,
    // Outras exportações, se necessário
};



const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find(); // Busca todos os feedbacks
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Erro ao buscar feedbacks:', error);
        res.status(500).json({ message: 'Erro ao buscar feedbacks', error: error.message });
    }
};

module.exports = {
    createFeedback,
    getAllFeedback // Adicione esta linha se a função estiver definida
};