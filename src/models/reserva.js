const mongoose = require('mongoose');

const ReservaSchema = new mongoose.Schema({
    IDReserva: {
        type: String,
        required: true,
        unique: true,
    },
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    dataInicio: {
        type: Date,
        required: true,
    },
    dataFim: {
        type: Date,
        required: true,
    },
    numAdultos: {
        type: Number,
        required: true,
    },
    numCriancas: {
        type: Number,
        required: true,
    }
});

const Reserva = mongoose.model('Reserva', ReservaSchema);
module.exports = Reserva;
