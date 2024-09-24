const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/user.controller');

router.get('/calendario', reservaController.obterCalendario);
router.post('/reservas', reservaController.create);
router.get('/reservas/disponibilidade/:id', reservaController.getDisponibilidade); 
router.get('/reservas/:id', reservaController.getReservaById); 
router.put('/reservas/:id', reservaController.put);
router.delete('/reservas/:id', reservaController.apagar);

module.exports = router;
