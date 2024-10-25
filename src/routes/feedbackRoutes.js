const express = require("express");
const router = express.Router();
const { createFeedback, getAllFeedback, addFeedback } = require("../controllers/feedbackController");
const authMiddleware = require("../middlewares/auth.middleware");

// Use a função importada para a rota POST de criação de feedback
router.post('/api/feedback', authMiddleware.verifyToken, addFeedback);

// Rota para obter todos os feedbacks
router.get("/", getAllFeedback);

module.exports = router;
