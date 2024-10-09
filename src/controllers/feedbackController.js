const { Feedback } = require('../../feedback/src/config/db'); // Importar o modelo de feedback

const createFeedback = async (req, res, next) => {
    try {
        const { user_id, rating, comment } = req.body;
        const newFeedback = new Feedback({ user_id, rating, comment });
        await newFeedback.save();
        res.status(201).json(newFeedback);
    } catch (error) {
        console.error('Erro ao criar feedback:', error);
        res.status(500).send('Erro ao criar feedback');
    }
};

const getAllFeedback = async (req, res, next) => {
    try {
        const feedbacks = await Feedback.find(); // Alterado para usar Mongoose
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Erro ao obter feedback:', error);
        res.status(500).send('Erro ao obter feedback');
    }
};

module.exports = {
    createFeedback,
    getAllFeedback,
};
