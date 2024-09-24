const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  IDReserva: {
    type: String,
    required: true,
    unique: true,
  },
  dateInicio: {
    type: Date,
    required: true,
  },
  dateFim: {
    type: Date,
    required: true,
  },
  disponibilidade: {
    type: Boolean,
    required: true,
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
    type: Number,
    required: true,
    min: 0,
  },
  StatusReserva: {
    type: String,
    required: true,
  }
}, { timestamps: false });


const Reserva = mongoose.model('Reserva', reservaSchema);
module.exports =  Reserva ;
module.exports = mongoose.model("user", reservaSchema,'api_reservas' )