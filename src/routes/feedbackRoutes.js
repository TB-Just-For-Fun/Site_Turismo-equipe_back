const express = require("express");
const router = express.Router();
const { createFeedback, getAllFeedback } = require("../controllers/feedbackController");
const Feedback = require('../models/feedbackModel'); // Importa o modelo aqui
const jwt = require('jsonwebtoken'); // Importa o jwt para verificar o token

// Middleware de verificação de token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Obtém o token do cabeçalho

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        // Decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Certifique-se de usar a chave secreta correta
        req.userId = decoded.id; // Armazena o ID do usuário na requisição
        req.username = decoded.username; // Armazena o nome do usuário na requisição
        req.role = decoded.role; // Armazena o papel do usuário na requisição
        next(); // Chama o próximo middleware ou rota
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido', error: error.message });
    }
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

// Rota para atualizar um feedback
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const feedbackId = req.params.id;
        const updatedFeedback = await Feedback.findByIdAndUpdate(feedbackId, req.body, { new: true });

        if (!updatedFeedback) {
            return res.status(404).json({ message: "Feedback não encontrado." });
        }

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
        const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);

        if (!deletedFeedback) {
            return res.status(404).json({ message: "Feedback não encontrado." });
        }

        res.status(200).json({ message: "Feedback deletado com sucesso" });
    } catch (error) {
        console.error('Erro ao deletar feedback:', error);
        res.status(500).json({ message: "Erro ao deletar feedback", error: error.message });
    }
});

module.exports = router;
