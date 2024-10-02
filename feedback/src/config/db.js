const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

const feedbackSchema = new mongoose.Schema({
    user_id: Number,
    rating: Number,
    comment: String
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = { mongoose, Feedback };
