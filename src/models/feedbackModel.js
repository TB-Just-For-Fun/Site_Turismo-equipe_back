const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // Usar ObjectId para relacionar com o usuário
        ref: 'User', // Ref para o modelo de Usuário
        required: true,
    },
    name: {
        type: String,
        required: true, // Vamos adicionar o nome do usuário logado
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    }
}, {
    timestamps: true // Isso vai adicionar 'createdAt' e 'updatedAt' automaticamente
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
