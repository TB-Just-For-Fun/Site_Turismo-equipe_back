const mongoose = require('mongoose');
const { Reserva } = require('../models/user'); 
const reservaController = {};


reservaController.getDisponibilidade = async (req, res) => {
  const { id } = req.params; 
  try {
      const reserva = await Reserva.findById(id); 
      if (!reserva) {
          return res.status(404).json({ message: 'A reserva não está disponível no momento. Por favor, volte a pegar seu pacote e tente novamente.' }); 
      }
      const disponibilidade = await disponibilidade.findById(id)
      if (!disponibilidade) {
        return res.status(200).json({ message: 'sua disponibilidade feita com sucesso.' }); 
    }

      res.json({ 
          message: 'A reserva está disponível.',
          disponibilidade: reserva.disponibilidade 
      });
  } catch (error) {
      res.status(200).json({ message: error.message }); 
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
            return res.status(404).send({ message: "Reserva não encontrada" });
        }
        return res.status(200).json(reserva);
    } catch (error) {
        return res.status(500).send({ message: "Erro ao buscar a reserva", error });
    }
};


reservaController.create = async (req, res) => {
    const { IDReserva, dateInicio, dateFim, NumeroAdulto, NumeroCrianca, ValorTotal, StatusReserva } = req.body;

    if (!IDReserva || !dateInicio || !dateFim || !NumeroAdulto || !NumeroCrianca || !ValorTotal || !StatusReserva) {
        return res.status(400).send({ message: "Todos os campos são obrigatórios!" });
    }

    try {
        const reservaInstance = await Reserva.create({
            IDReserva,
            dateInicio: new Date(dateInicio),
            dateFim: new Date(dateFim),
            NumeroAdulto,
            NumeroCrianca,
            ValorTotal,
            StatusReserva,
        });

        return res.status(201).send({
            IDReserva: reservaInstance.IDReserva,
            dateInicio: reservaInstance.dateInicio.toISOString().split('T')[0],
            dateFim: reservaInstance.dateFim.toISOString().split('T')[0],        
            NumeroAdulto: reservaInstance.NumeroAdulto,
            NumeroCrianca: reservaInstance.NumeroCrianca,
            ValorTotal: reservaInstance.ValorTotal,
            StatusReserva: reservaInstance.StatusReserva,
        });
    } catch (error) {
        console.error('Erro ao criar a reserva:', error);
        return res.status(500).send({ message: "Erro ao criar a reserva", error });
    }
};


reservaController.put = async (req, res) => {
    const { id } = req.params;
    const { IDReserva, dateInicio, dateFim, NumeroAdulto, NumeroCrianca, ValorTotal, StatusReserva } = req.body;

    if (!IDReserva || !dateInicio || !dateFim || !NumeroAdulto || !NumeroCrianca || !ValorTotal || !StatusReserva) {
        return res.status(400).send({ message: "Todos os campos são obrigatórios!" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "ID da reserva inválido!" });
    }

    try {
        const reserva = await Reserva.findByIdAndUpdate(id, {
            IDReserva,
            dateInicio: new Date(dateInicio),
            dateFim: new Date(dateFim),
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
        console.error('Erro ao remover a reserva:', error);
        return res.status(500).send({ message: "Erro ao remover a reserva", error });
    }
};

module.exports = reservaController;
