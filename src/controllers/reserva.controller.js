const mongoose = require('mongoose');
const Reserva = require('../models/reserva'); 
const moment = require('moment-timezone');

const reservaController = {};


reservaController.create = async (req, res) => {
    const { nome, email, dataInicio, dataFim, numAdultos, numCriancas } = req.body;

    // Verificar se todos os campos estão preenchidos
    if (!nome || !email || !dataInicio || !dataFim || numAdultos === undefined || numCriancas === undefined) {
        return res.status(400).send({ message: "Todos os campos são obrigatórios!" });
    }

    const IDReserva = 'R' + Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
        const reservaInstance = await Reserva.create({
            IDReserva,
            nome,
            email,
            dataInicio: moment.tz(dataInicio, 'Africa/Luanda').toDate(),
            dataFim: moment.tz(dataFim, 'Africa/Luanda').toDate(),
            numAdultos,
            numCriancas,
        });
        return res.status(201).send({ message: "Reserva criada com sucesso", reserva: reservaInstance });
    } catch (error) {
        console.error('Erro ao criar a reserva:', error);  // Log detalhado do erro
        return res.status(500).send({ message: "Erro ao criar a reserva", error: error.message });
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


reservaController.obterCalendario = async (req, res) => {
    try {
        const reservas = await Reserva.find();
        const eventos = reservas.map(reserva => ({
            title: `Reserva ${reserva.IDReserva}`,
            start: reserva.dataInicio,
            end: reserva.dataFim,
        }));
        return res.json({ message: 'Calendário de reservas obtido com sucesso.', eventos });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao obter o calendário", error: error.message });
    }
};


reservaController.put = async (req, res) => {
    const { id } = req.params;
    const { dataInicio, dataFim, numAdultos, numCriancas } = req.body;

    if (!dataInicio || !dataFim || !numAdultos || !numCriancas) {
        return res.status(400).send({ message: "Todos os campos são obrigatórios!" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "ID da reserva inválido!" });
    }

    try {
        const reserva = await Reserva.findByIdAndUpdate(id, {
            dataInicio: moment.tz(dataInicio, 'Africa/Luanda').toDate(),
            dataFim: moment.tz(dataFim, 'Africa/Luanda').toDate(),
            numAdultos,
            numCriancas,
        }, { new: true });

        if (!reserva) {
            return res.status(404).send({ message: "Reserva não encontrada!" });
        }

        return res.status(200).send({ message: "Reserva atualizada com sucesso", reserva });
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
