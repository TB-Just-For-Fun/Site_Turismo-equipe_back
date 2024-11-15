
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true, // Certifique-se de que esse campo é obrigatório
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referência ao modelo de usuário
        required: true,
    },
    tipo: {
        type: String,
        required: true,
    },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
