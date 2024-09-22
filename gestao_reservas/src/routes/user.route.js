const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/usuarios', userController.create); // Rota para criar um usuário
router.get('/reservas/disponibilidade/:id', userController.getDisponibilidade); // Verificar disponibilidade de reservas
router.get('/reservas', userController.getReservas); // Listar todas as reservas disponíveis
router.get('/usuarios/:id', userController.getById); // Buscar usuário por ID
router.put('/usuarios/:id', userController.put); // Atualizar usuário por ID
router.delete('/usuarios/:id', userController.apagar); // Apagar usuário por ID

module.exports = router;
