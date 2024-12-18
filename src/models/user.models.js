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
        enum: ['cliente', 'administrador', 'administrador_supremo'], // Enum para definir os tipos de usuário
        default: 'cliente',  
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
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

