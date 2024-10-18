const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
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
