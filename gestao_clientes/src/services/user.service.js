const userModel = require('../models/user.models');

// Serviço para obter todos os usuários
const getAllUsers = async () => {
    return await userModel.find();
};

// Serviço para obter um usuário por ID
const getUserById = async (id) => {
    return await userModel.findOne({ _id: id });
};

// Serviço para criar um novo usuário
const createUser = async (userData) => {
    return await userModel.create(userData);
};

// Serviço para atualizar um usuário
const updateUser = async (id, updateData) => {
    return await userModel.findByIdAndUpdate(id, updateData, { new: true });
};

// Serviço para deletar um usuário
const deleteUser = async (id) => {
    return await userModel.deleteOne({ _id: id });
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
