const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Campo para o nome do usuário
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referência ao modelo de usuário (opcional)
    rating:{ type: Number, require:true}
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
