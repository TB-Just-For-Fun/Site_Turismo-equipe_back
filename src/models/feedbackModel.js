const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    user_name: {
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
