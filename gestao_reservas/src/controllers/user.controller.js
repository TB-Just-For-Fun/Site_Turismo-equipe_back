const mongoose = require('mongoose');
const userModel = require('../models/user');

const userController = {};

// Função para buscar todos os usuários
userController.get = async (req, res) => {
  try {
    const usuarios = await userModel.find();
    console.log('Usuários encontrados:', usuarios);
    return res.status(200).send(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).send({ message: "Ocorreu um erro ao buscar os usuários", error });
  }
};

// Função para buscar usuário por ID
userController.getById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "ID inválido" });
  }

  try {
    const usuario = await userModel.findById(id);
    if (!usuario) {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }
    console.log('Usuário encontrado:', usuario);
    return res.status(200).send(usuario);
  } catch (error) {
    console.error('Erro ao buscar o usuário:', error);
    return res.status(500).send({ message: "Erro ao buscar o usuário", error });
  }
};

// Função para criar um novo usuário
userController.create = async (req, res) => {
  const { IDReserva, dateInicio, dateFim, NumeroAdulto, NumeroCrianca, ValorTotal, StatusReserva } = req.body;

  if (!IDReserva || !dateInicio || !dateFim || !NumeroAdulto || !NumeroCrianca || !ValorTotal || !StatusReserva) {
    return res.status(400).send({ message: "Todos os campos são obrigatórios!" });
  }

  try {
    const userInstance = await userModel.create({
      IDReserva,
      dateInicio: new Date(dateInicio),
      dateFim: new Date(dateFim),
      NumeroAdulto,
      NumeroCrianca,
      ValorTotal,
      StatusReserva,
    });
   

    return res.status(201).send({
      IDReserva: userInstance.IDReserva,
      dateInicio: userInstance.dateInicio.toISOString().split('T')[0],  // Apenas a data
      dateFim: userInstance.dateFim.toISOString().split('T')[0],        // Apenas a data
      NumeroAdulto: userInstance.NumeroAdulto,
      NumeroCrianca: userInstance.NumeroCrianca,
      ValorTotal: userInstance.ValorTotal,
      StatusReserva: userInstance.StatusReserva,
    });
  } catch (error) {
    console.error('Erro ao criar a reserva:', error);
    return res.status(500).send({ message: "Erro ao criar a reserva", error });
  }
};

// Função para atualizar um usuário
userController.put = async (req, res) => {
  const { id } = req.params;
  const { IDReserva, dateInicio, dateFim, NumeroAdulto, NumeroCrianca, ValorTotal, StatusReserva } = req.body;

  if (!IDReserva || !dateInicio || !dateFim || !NumeroAdulto || !NumeroCrianca || !ValorTotal || !StatusReserva) {
    return res.status(400).send({ message: "Todos os campos são obrigatórios!" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "ID do usuário inválido!" });
  }

  try {
    console.log('Dados recebidos para atualização:', req.body);
    const usuario = await userModel.findByIdAndUpdate(id, {
      IDReserva,
      dateInicio: new Date(dateInicio),
      dateFim: new Date(dateFim),
      NumeroAdulto,
      NumeroCrianca,
      ValorTotal,
      StatusReserva,
    }, { new: true });

    if (!usuario) {
      return res.status(404).send({ message: "Usuário não encontrado!" });
    }

    console.log('Usuário atualizado:', usuario);
    return res.status(200).send({
      message: "Usuário atualizado com sucesso",
      usuario,
    });
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error);
    return res.status(500).send({ message: "Erro ao atualizar o usuário", error });
  }
};

// Função para apagar um usuário
userController.apagar = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "ID inválido" });
  }

  try {
    const usuario = await userModel.findByIdAndDelete(id);

    if (!usuario) {
      return res.status(404).send({ message: "Usuário não encontrado!" });
    }

    console.log('Usuário removido:', usuario);
    return res.status(200).send({ message: "Usuário removido com sucesso!", usuario });
  } catch (error) {
    console.error('Erro ao remover o usuário:', error);
    return res.status(500).send({ message: "Erro ao remover o usuário", error });
  }
};


module.exports = userController;
