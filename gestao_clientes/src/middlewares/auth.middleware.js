const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.models');

const authMiddleware = {};

// Middleware para verificar o token JWT
authMiddleware.verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");  // Extrai o token do cabeçalho
    if (!token) {
        return res.status(401).send({ message: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Decodifica o token
        req.user = decoded;  // Armazena o ID e o role do usuário na requisição
        next();  
    } catch (error) {
        return res.status(401).send({ message: "Token inválido" });
    }
};

// Middleware para verificar se o usuário é administrador
authMiddleware.verifyAdminSupremo = (req, res, next) => {
    if (req.user.role !== 'administrador_supremo') {
        return res.status(403).send({ message: "Acesso negado. Apenas o Administrador Supremo tem permissão para essa ação." });
    }
    next();
};
// Middleware para verificar se o Administrador Supremo já existe
const verificarAdminSupremoExistente = async (req, res, next) => {
    const adminSupremo = await UserModel.findOne({ role: 'administrador_supremo' });
    if (adminSupremo) {
        return res.status(400).send({ message: 'Administrador Supremo já existe.' });
    }
    next();
};

module.exports = {
    authMiddleware,
    verificarAdminSupremoExistente
};
