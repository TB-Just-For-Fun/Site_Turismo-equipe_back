
const express = require('express');
const router = express.Router();

const { criarNotificacao } = require('../controllers/notificacoes.controller'); 
router.post('/notificacao', criarNotificacao); 

module.exports = router;
