const Feedback = require('../models/feedbackModel'); // Certifique-se de que está apontando para o arquivo certo
const User = require('../models/user.models'); // Certifique-se de apontar para o modelo de usuários

// Função para criar feedback
const createFeedback = async (req, res, next) => {
    try {
        const { user_id, rating, comment } = req.body;

        // Validação dos campos
        if (!user_id || !rating || !comment) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        // Buscando o nome do usuário com base no user_id
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Criação do novo feedback com o nome do usuário
        const newFeedback = new Feedback({ user_id, user_name: user.name, rating, comment });
        await newFeedback.save();

        res.status(201).json({
            message: 'Feedback criado com sucesso!',
            feedback: {
                rating: newFeedback.rating,
                comment: newFeedback.comment,
                user_name: newFeedback.user_name, // Mostra apenas o nome do usuário
            },
        });
    } catch (error) {
        console.error('Erro ao criar feedback:', error);
        res.status(500).json({ message: 'Erro ao criar feedback', error: error.message });
    }
};

// Função para obter todos os feedbacks
const getAllFeedback = async (req, res, next) => {
    try {
        const feedbacks = await Feedback.find(); // Obtendo todos os feedbacks

        res.status(200).json({
            message: 'Feedbacks obtidos com sucesso',
            feedbacks: feedbacks.map(feedback => ({
                rating: feedback.rating,
                comment: feedback.comment,
                user_name: feedback.user_name, // Retorna apenas o nome do usuário
            })),
        });
    } catch (error) {
        console.error('Erro ao obter feedbacks:', error);
        res.status(500).json({ message: 'Erro ao obter feedbacks', error: error.message });
    }
};

// Função para adicionar feedback (usando ID do usuário autenticado)
const addFeedback = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const userId = req.userId; // Assumindo que você pega o ID do usuário a partir do middleware de autenticação

        if (!userId || !rating || !comment) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        const newFeedback = new Feedback({
            user_id: userId,  // Pegando o ID do usuário logado
            rating,
            comment,
        });

        await newFeedback.save();

        return res.status(201).json({ message: 'Feedback adicionado com sucesso!', feedback: newFeedback });
    } catch (error) {
        console.error('Erro ao adicionar feedback:', error);
        return res.status(500).json({ message: 'Erro ao adicionar feedback', error: error.message });
    }
};

// Exporte corretamente todas as funções
module.exports = {
    createFeedback,
    getAllFeedback,
    addFeedback, // Inclua todas as funções que deseja utilizar nas rotas
};

