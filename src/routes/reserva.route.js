const express = require('express');
const reservaController = require('../controllers/reserva.controller'); 
const router = express.Router();


router.post('/reservas', reservaController.create);
router.get('/reservas/:id', reservaController.getReservaById);
router.get('/calendario', reservaController.obterCalendario);
router.put('/reservas/:id', reservaController.put);
router.delete('/reservas/:id', reservaController.apagar);

module.exports = router;
