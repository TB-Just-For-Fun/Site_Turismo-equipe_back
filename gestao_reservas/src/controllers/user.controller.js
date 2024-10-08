const mongoose = require('mongoose');
const Reserva = require('../models/user'); 
const reservaController = {};


const moment = require('moment-timezone');
const timezone = moment.tz.guess();
console.log(`Fuso horário detectado: ${timezone}`);
const dateInicio = moment.tz('2024-10-01 13:30', 'Africa/Luanda').format();
const dateFim = moment.tz('2024-10-05 09:00', 'Africa/Luanda').format();

console.log(`Início: ${dateInicio}, Fim: ${dateFim}`);



const userController = {};

reservaController.getDisponibilidade = async (req, res) => {
    const { id } = req.params; 
    try {
        const reserva = await Reserva.findById(id); 
        if (!reserva) {
            return res.status(404).json({ message: 'A reserva não foi encontrada. Por favor, verifique o ID e tente novamente.' });
        }
        if (reserva.disponibilidade) {
            return res.status(200).json({
                message: 'A reserva está disponível.',
                disponibilidade: reserva.disponibilidade
            });
        } else {
            return res.status(404).json({ message: 'A reserva foi encontrada, mas não há disponibilidade no momento.' });
        }
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar a reserva ou a disponibilidade", error: error.message });
    }
};
reservaController.obterCalendario = async (req, res) => {
  try {
      const reservas = await Reserva.find();
      const eventos = reservas.map(reserva => ({
          title: `Reserva ${reserva.IDReserva}`,
          start: reserva.dateInicio,
          end: reserva.dateFim,
      })); 
      if (eventos.length > 0) {
          res.json({ 
              message: 'Calendário de reservas obtido com sucesso.',
              eventos 
          });
      } else {
          res.json({ 
              message: 'Não há reservas no calendário.' 
          });
      }
  } catch (error) {
      res.status(500).json({ message: "Erro ao obter o calendário", error: error.message });
  }
};
reservaController.getReservaById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "ID inválido" });
    }

    try {
        const reserva = await Reserva.findById(id);
        if (!reserva) {
            return res.status(404).send({ message: "Reserva não encontrada!" });
        }
        return res.status(200).json(reserva);
    } catch (error) {
        return res.status(500).send({ message: "Erro ao buscar a reserva", error });
    }
};
const  IDReserva = 'R' + Math.random().toString(36).substring(2, 8).toUpperCase();
reservaController.create = async (req, res) => {
    const { dateInicio, dateFim, NumeroAdulto, NumeroCrianca, ValorTotal, StatusReserva, disponibilidade } = req.body;
    if (  !dateInicio || !dateFim || NumeroAdulto === undefined || NumeroCrianca === undefined || !ValorTotal || !StatusReserva || disponibilidade === undefined) {
        return res.status(400).send({ message: "Todos os campos são obrigatórios!" });
    }
    try {
        const reservaInstance = await Reserva.create({
            dateInicio: moment. tz (dateInicio, 'Angola/Huíla_lubango') . toDate (),
            dateFim: moment. tz (dateFim, 'Angola/Huíla_lubango') . toDate (),
            NumeroAdulto,
            NumeroCrianca,
            ValorTotal,
            StatusReserva,
            disponibilidade,
        });
        const eventoCalendario = {
            title: `Reserva ${reservaInstance.IDReserva}`,
            start: reservaInstance.dateInicio.toISOString().split('T')[0],
            end: reservaInstance.dateFim.toISOString().split('T')[0],
        };
        return res.status(201).send({
            message: "Reserva criada com sucesso",
            reserva: {
                dateInicio: reservaInstance.dateInicio.toISOString().split('T')[0],
                dateFim: reservaInstance.dateFim.toISOString().split('T')[0],
                NumeroAdulto: reservaInstance.NumeroAdulto,
                NumeroCrianca: reservaInstance.NumeroCrianca,
                ValorTotal: reservaInstance.ValorTotal,
                StatusReserva: reservaInstance.StatusReserva,
                disponibilidade: reservaInstance.disponibilidade 
            },
            calendario: eventoCalendario
        });
    } catch (error) {
        console.error('Erro ao criar a reserva:', error);
        return res.status(500).send({ message: "Erro ao criar a reserva", error });
    }
};
reservaController.put = async (req, res) => {
    const { id } = req.params;
    const {dateInicio, dateFim, NumeroAdulto, NumeroCrianca, ValorTotal, StatusReserva } = req.body;
    if (!dateInicio || !dateFim || !NumeroAdulto || !NumeroCrianca || !ValorTotal || !StatusReserva) {
        return res.status(400).send({ message: "Todos os campos são obrigatórios!" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "ID da reserva inválido!" });
    }

    try {
        const reserva = await Reserva.findByIdAndUpdate(id, {
            dateInicio: moment.tz(dateInicio, 'Angola/Huíla_lubango').toDate(),
            dateFim: moment.tz(dateFim, 'Angola/Huíla_lubango').toDate(),
            NumeroAdulto,
            NumeroCrianca,
            ValorTotal,
            StatusReserva,
        }, { new: true });

        if (!reserva) {
            return res.status(404).send({ message: "Reserva não encontrada!" });
        }

        return res.status(200).send({
            message: "Reserva atualizada com sucesso",
            reserva,
        });
    } catch (error) {
        console.error('Erro ao atualizar a reserva:', error);
        return res.status(500).send({ message: "Erro ao atualizar a reserva", error });
    }
};
reservaController.apagar = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "ID inválido" });
    }

    try {
        const reserva = await Reserva.findByIdAndDelete(id);

        if (!reserva) {
            return res.status(404).send({ message: "Reserva não encontrada!" });
        }

        return res.status(200).send({ message: "Reserva removida com sucesso!", reserva });
    } catch (error) {
        return res.status(500).send({ message: "Erro ao remover a reserva", error });
    }
};
module.exports = reservaController;
