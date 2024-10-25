createFeedback: async (req, res, next) => {
    const { user_id, rating, comment } = req.body;
    console.log('Recebendo feedback:', req.body);
    try {
        const feedback = await Feedback.create({ user_id, rating, comment });
        res.status(201).json(feedback);
    } catch (error) {
        console.error('Erro ao criar feedback:', error);
        next(error);
    }
}
