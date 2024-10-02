const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.models');

const authMiddleware = {};

// Middleware para verificar o token JWT
authMiddleware.verifyToken = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    // Verifica se o cabeçalho Authorization está presente
    if (!authHeader) {
        return res.status(401).send({ message: "Cabeçalho de autorização não fornecido" });
    }

    // Extrai o token removendo o prefixo "Bearer "
    const token = authHeader.replace("Bearer ", "");

    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Verifica se o ID está presente no payload do token
        if (!decoded.id) {
            return res.status(401).send({ message: "Token inválido: ID do usuário não encontrado." });
        }

        // Busca o usuário no banco de dados
        const usuario = await UserModel.findById(decoded.id);
        
        // Verifica se o usuário existe e está ativo
        if (!usuario) {
            return res.status(401).send({ message: "Usuário não encontrado ou token inválido" });
        }

        // Armazena o usuário autenticado na requisição
        req.user = usuario;
        next();
    } catch (error) {
        return res.status(401).send({ message: "Token inválido", error: error.message });
    }
};

// Middleware para verificar se o usuário é administrador supremo 
authMiddleware.verifyAdminSupremo = (req, res, next) => {
    // Verifica se o usuário foi atribuído corretamente pelo middleware anterior
    if (!req.user) {
        return res.status(401).send({ message: "Usuário não autenticado" });
    }

    // Verifica o papel do usuário
    if (req.user.role !== 'administrador_supremo') {
        return res.status(403).send({ message: "Acesso negado. Apenas o Administrador Supremo tem permissão para essa ação." });
    }

    next();
};

// Middleware para verificar se o Administrador Supremo já existe
const verificarAdminSupremoExistente = async (req, res, next) => {
    try {
        const adminSupremo = await UserModel.findOne({ role: 'administrador_supremo' });
        
        // Se já existir um Administrador Supremo, retorna erro
        if (adminSupremo) {
            return res.status(400).send({ message: 'Administrador Supremo já existe.' });
        }

        next();
    } catch (error) {
        return res.status(500).send({ message: "Erro ao verificar Administrador Supremo", error: error.message });
    }
};

module.exports = {
    authMiddleware,
    verificarAdminSupremoExistente
};
