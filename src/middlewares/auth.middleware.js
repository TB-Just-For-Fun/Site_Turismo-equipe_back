const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.models');
const InvalidToken = require('../models/invalidToken.model'); // Importa o modelo de tokens inválidos

const authMiddleware = {};

// Middleware para verificar o token JWT
authMiddleware.verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    console.log("Token recebido:", token); // Verifique o valor do token

    if (!token) {
        return res.status(401).json({ message: "Cabeçalho de autorização ou token ausente" });
    }

    try {
        const isInvalid = await InvalidToken.findOne({ token });
        if (isInvalid) {
            return res.status(401).json({ message: "Sessão expirada. Token inválido." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.id) {
            return res.status(401).json({ message: "Token inválido: ID do usuário não encontrado." });
        }

        const usuario = await UserModel.findById(decoded.id);
        if (!usuario) {
            return res.status(401).json({ message: "Usuário não encontrado ou token inválido" });
        }

        req.user = usuario;
        next();
    } catch (error) {
        console.error("Erro ao verificar o token:", error.message); // Mostra o erro de verificação
        return res.status(401).json({ message: "Token inválido", error: error.message });
    }
};

// Middleware para verificar se o usuário é administrador supremo 
authMiddleware.verifyAdminSupremo = (req, res, next) => {
    // Verifica se o usuário foi atribuído corretamente pelo middleware anterior
    if (!req.user) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Verifica o papel do usuário
    if (req.user.role !== 'administrador_supremo') {
        return res.status(403).json({ message: "Acesso negado. Apenas o Administrador Supremo tem permissão para essa ação." });
    }

    next();
};

// Middleware para verificar se o Administrador Supremo já existe
const verificarAdminSupremoExistente = async (req, res, next) => {
    try {
        const adminSupremo = await UserModel.findOne({ role: 'administrador_supremo' });
        
        // Se já existir um Administrador Supremo, retorna erro
        if (adminSupremo) {
            return res.status(400).json({ message: 'Administrador Supremo já existe.' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Erro ao verificar Administrador Supremo", error: error.message });
    }
};

module.exports = {
    authMiddleware,
    verificarAdminSupremoExistente
};
