const express = require("express");
const router = express.Router();
const { createFeedback, getAllFeedback } = require("../controllers/feedbackController");
const Feedback = require('../models/feedbackModel');
const jwt = require('jsonwebtoken');

// Middleware de verificação de token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.username = decoded.username;
        req.role = decoded.role;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido', error: error.message });
    }
};

// Middleware de autorização para verificar o papel do usuário
const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.role)) {
            return res.status(403).json({ message: 'Acesso negado' });
        }
        next();
    };
};

// Rota para criar feedback
router.post("/", verifyToken, createFeedback);

// Rota para obter todos os feedbacks
router.get("/", getAllFeedback);

// Rota para obter feedback específico por ID
router.get("/:id", async (req, res) => {
    try {
        const feedbackId = req.params.id;
        const feedback = await Feedback.findById(feedbackId);

        if (!feedback) {
            return res.status(404).json({ message: "Feedback não encontrado." });
        }

        res.status(200).json(feedback);
    } catch (error) {
        console.error('Erro ao buscar feedback:', error);
        res.status(500).json({ message: "Erro ao buscar feedback", error: error.message });
    }
});

// Rota para atualizar um feedback (apenas o próprio usuário ou administrador)
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const feedbackId = req.params.id;
        const feedback = await Feedback.findById(feedbackId);

        if (!feedback) {
            return res.status(404).json({ message: "Feedback não encontrado." });
        }

        // Verifica se o usuário é o dono do feedback ou um administrador
        if (feedback.userId.toString() !== req.userId && req.role !== 'admin') {
            return res.status(403).json({ message: "Acesso negado." });
        }

        const updatedFeedback = await Feedback.findByIdAndUpdate(feedbackId, req.body, { new: true });
        res.status(200).json({ message: "Feedback atualizado com sucesso", feedback: updatedFeedback });
    } catch (error) {
        console.error('Erro ao atualizar feedback:', error);
        res.status(500).json({ message: "Erro ao atualizar feedback", error: error.message });
    }
});

// Rota para deletar um feedback
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const feedbackId = req.params.id;
        const feedback = await Feedback.findById(feedbackId);

        if (!feedback) {
            return res.status(404).json({ message: "Feedback não encontrado." });
        }

        // Permissões de deleção
        if (req.role === 'superadmin') {
            // Superadmin pode deletar qualquer feedback
            await feedback.deleteOne();
        } else if (req.role === 'admin') {
            // Admin pode deletar qualquer feedback de qualquer usuário
            await feedback.deleteOne();
        } else if (feedback.userId.toString() === req.userId) {
            // O próprio usuário pode deletar apenas seu feedback
            await feedback.deleteOne();
        } else {
            return res.status(403).json({ message: "Acesso negado." });
        }

        res.status(200).json({ message: "Feedback deletado com sucesso" });
    } catch (error) {
        console.error('Erro ao deletar feedback:', error);
        res.status(500).json({ message: "Erro ao deletar feedback", error: error.message });
    }
});

module.exports = router;
