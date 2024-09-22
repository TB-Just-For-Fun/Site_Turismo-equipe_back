const mongoose = require('mongoose');


const reservaSchema = new mongoose.Schema({
  IDReserva: {
    type: String,
    required: true,
  },
  dateInicio: {
    type: Date,
    required: true,
  },
  dateFim: {
    type: Date,
    required: true,
  },

disponibilidade:{
type: Boolean,
required:true,
default: true,

  },

  NumeroAdulto: {
    type: Number,
    required: true,
    min: 1,
  },
  NumeroCrianca: {
    type: Number,
    required: true,
    min: 0,
  },
  ValorTotal: {
    type: Number, // Mantém como Number
    required: true,
    min: 0,
  },
  StatusReserva: {
    type: String, // Alterado para String
    required: true,
  }
}, { timestamps: false });
const Reserva = mongoose.model('Reserva', reservaSchema);
module.exports = mongoose.model("User", reservaSchema, 'api_reservas');

