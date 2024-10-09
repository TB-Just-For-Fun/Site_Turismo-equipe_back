const { Feedback } = require('../Config/db'); // Importar o modelo de feedback

// Criação de um novo feedback
const createFeedback = async (req, res, next) => {
    try {
        const { user_id, rating, comment } = req.body;

        
        if (!user_id || !rating || !comment) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        // Criando o novo feedback
        const newFeedback = new Feedback({ user_id, rating, comment });
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

// Obter todos os feedbacks
const getAllFeedback = async (req, res, next) => {
    try {
        const feedbacks = await Feedback.find(); // Busca todos os feedbacks

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
