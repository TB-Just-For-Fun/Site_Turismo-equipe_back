const Feedback = require('../models/feedbackModel'); // Certifique-se de que está apontando para o arquivo certo
const User = require('../models/user.models'); // Modelo de usuário para buscar o nome

const createFeedback = async (req, res, next) => {
    try {
        // Pegue o user_id do cliente logado (normalmente disponível após autenticação)
        const userId = req.user.id;  // Verifique se você tem `req.user` configurado corretamente no middleware de autenticação

        const { rating, comment } = req.body;

        // Validação dos campos
        if (!userId || !rating || !comment) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        // Busque o nome do usuário logado no banco de dados
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Criação do novo feedback com o nome do usuário
        const newFeedback = new Feedback({
            user_id: userId,
            name: user.name,  // Inclua o nome do usuário
            rating,
            comment
        });

        await newFeedback.save();

        res.status(201).json({
            message: 'Feedback criado com sucesso!',
            feedback: newFeedback,
        });
    } catch (error) {
        console.error('Erro ao criar feedback:', error);
        res.status(500).json({ message: 'Erro ao criar feedback', error: error.message });
    }
};

const getAllFeedback = async (req, res, next) => {
    try {
        const feedbacks = await Feedback.find(); // Obtendo todos os feedbacks

        res.status(200).json({
            message: 'Feedbacks obtidos com sucesso',
            feedbacks: feedbacks,
        });
    } catch (error) {
        console.error('Erro ao obter feedbacks:', error);
        res.status(500).json({ message: 'Erro ao obter feedbacks', error: error.message });
    }
};

module.exports = {
    createFeedback,
    getAllFeedback,
};
