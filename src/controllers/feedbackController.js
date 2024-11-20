const Feedback = require('../models/feedbackModel');
const User = require('../models/user.models'); 
const jwt = require('jsonwebtoken');

// Função para apagar feedbacks
const apagarFeedback = async (req, res) => {
    const { id } = req.params; // ID do feedback
    const { role, _id: userId } = req.user; // Papel e ID do usuário autenticado

    // Verifica se o ID do feedback é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        // Procura o feedback no banco de dados
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ message: "Feedback não encontrado" });
        }

        // Verifica permissões de exclusão
        // Administrador supremo pode deletar qualquer feedback
        if (role === 'administrador_supremo') {
            await Feedback.findByIdAndDelete(id);
            return res.status(200).json({ message: "Feedback deletado com sucesso" });
        }

        // Administrador pode deletar feedback de qualquer usuário
        if (role === 'administrador') {
            await Feedback.findByIdAndDelete(id);
            return res.status(200).json({ message: "Feedback deletado com sucesso" });
        }

        // Usuário comum pode deletar apenas seu próprio feedback
        if (role === 'cliente') {
            if (feedback.user.toString() === userId.toString()) {
                await Feedback.findByIdAndDelete(id);
                return res.status(200).json({ message: "Seu feedback foi deletado com sucesso" });
            }
            return res.status(403).json({ message: "Acesso negado. Você só pode deletar seu próprio feedback." });
        }

        return res.status(403).json({ message: "Acesso negado." });
    } catch (error) {
        console.error('Erro ao deletar feedback:', error);
        res.status(500).json({ message: "Erro ao deletar feedback", error: error.message });
    }
};

// Funções de criação e busca de feedbacks
const createFeedback = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Você precisa estar logado para deixar um feedback.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const feedbackData = {
            rating: req.body.rating,
            comment: req.body.comment,
            name: user.username,
            user: userId,
            tipo: decoded.role
        };

        const feedback = new Feedback(feedbackData);
        await feedback.save();
        res.status(201).json({ message: 'Feedback criado com sucesso', feedback });
    } catch (error) {
        console.error('Erro ao criar feedback:', error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
        }
        res.status(500).json({ message: 'Erro ao criar feedback', error: error.message });
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
    getAllFeedback,
    apagarFeedback
};
