const express = require('express');
const route = express.Router(); // Inicializa o router do Express
const { authMiddleware, verificarAdminSupremoExistente } = require('../middlewares/auth.middleware'); // Importa os middlewares
const {
    create,
    get,
    getById,
    put,
    apagar,
    login,
    createFirstAdmin,
    createAdmin,
    logout
} = require('../controllers/user.controller'); // Desestrutura os métodos do controller 

// Rota de login (rota pública)
route.post("/login", login);

// Rotas públicas
route.post("/", create); // Rota para criar um novo usuário (pode ser um registro público)

// Rota para criação do primeiro admin (sem necessidade de estar logado)
route.post('/createFirstAdmin', verificarAdminSupremoExistente, createFirstAdmin);

// Rota para criação de admin (somente Administrador Supremo pode criar outros administradores)
route.post('/create-admin', authMiddleware.verifyToken, authMiddleware.verifyAdminSupremo, createAdmin);

// Middleware de verificação de token para rotas protegidas
route.use(authMiddleware.verifyToken);

// Rotas protegidas que precisam de autenticação
route.get("/", get);              
route.get("/:id", getById);        
route.put("/:id", put);            
route.delete("/:id", apagar);      

// Rota de logout
route.post('/logout', logout);     

module.exports = route;
