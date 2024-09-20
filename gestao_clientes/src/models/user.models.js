const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true, // Converte o email para minúsculas
    },
    numero: {
        type: String,
        unique: true,
        required: true,
    },
    password: { 
        type: String,
        required: true
    },
    dataDeNascimento: {
        type: Date,
        required: true
    },
    role: {
        type: String,
        enum: ['cliente', 'administrador'],
        default: 'cliente' // Corrigido para uma string simples
    },
    date: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password; // Remove a senha antes de retornar o usuário
    return user;
};

module.exports = mongoose.model("user", userSchema, "api_usuarios");
