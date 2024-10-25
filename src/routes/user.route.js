const express = require('express');
const route = express.Router();
const { authMiddleware, verificarAdminSupremoExistente } = require('../middlewares/auth.middleware'); 
const {
    create,
    get,
    getById,
    getByEmail,
    put,
    patch,
    apagar,
    apagarByEmail,
    login,
    createFirstAdmin,
    createAdmin,
    logout,
    patchByEmail, 
    putByEmail 
} = require('../controllers/user.controller'); 

// Rota de login (rota pública)
route.post("/login", login);

// Rotas públicas
route.post("/createUser", create); 

// Rota para criação do primeiro admin (sem necessidade de estar logado)
route.post('/createFirstAdmin', verificarAdminSupremoExistente, createFirstAdmin);

// Rota para criação de admin (somente Administrador Supremo pode criar outros administradores)
route.post('/create-admin', authMiddleware.verifyToken, authMiddleware.verifyAdminSupremo, createAdmin);

// Middleware de verificação de token para rotas protegidas
route.use(authMiddleware.verifyToken);

// Rotas protegidas que precisam de autenticação
route.get("/", get);              
route.get("/:id", getById); 
route.get("/buscar/get", getByEmail);     
route.patch("/:id", patch);       
route.patch("/editar/get", patchByEmail); 
route.put("/:id", put);           
route.put("/editar_todas_infor/get", putByEmail);  
route.delete("/:id", apagar);     
route.delete("/deletar/get", apagarByEmail);

// Rota de logout
route.post('/logout', logout);     

module.exports = route;
