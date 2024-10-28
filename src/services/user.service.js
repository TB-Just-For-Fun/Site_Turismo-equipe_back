const userModel = require('../models/user.models');

// Serviço para obter todos os usuários
const getAllUsers = async () => {
    return await userModel.find();
};

// Serviço para obter um usuário por ID
const getUserById = async (id) => {
    return await userModel.findOne({ _id: id });
};

// Serviço para obter um usuário por Email
const getUserByEmail = async (email) => {
    return await userModel.findOne({ email: email });
};

// Serviço para criar um novo usuário
const createUser = async (userData) => {
    return await userModel.create(userData);
};

// Serviço para atualizar um usuário por ID
const updateUser = async (id, updateData) => {
    return await userModel.findByIdAndUpdate(id, updateData, { new: true });
};

// Serviço para atualizar um usuário por Email
const updateUserByEmail = async (email, updateData) => {
    return await userModel.findByEmailAndUpdate(email, updateData, { new: true });
};

// Serviço para atualizar parcialmente um usuário por ID
const updatePartialUserById = async (id, updateData) => {
    return await userModel.findByIdAndUpdate(
        id, 
        { $set: updateData },  //  $set para garantir que apenas os campos fornecidos sejam atualizados
        { new: true, omitUndefined: true }  // omitUndefined impede que campos não definidos sobrescrevam dados
    );
};

// Serviço para atualizar parcialmente um usuário por Email
const updatePartialUserByEmail = async (email, updateData) => {
    return await userModel.findOneAndUpdate(
        { email: email }, 
        { $set: updateData },  // $set para atualizar apenas os campos fornecidos
        { new: true, omitUndefined: true }  // omitUndefined garante que campos não definidos não sejam alterados
    );
};

// Serviço para deletar um usuário por ID
const deleteUser = async (id) => {
    return await userModel.deleteOne({ _id: id });
};

// Serviço para deletar um usuário por Email
const deleteUserByEmail = async (email) => {
    return await userModel.deleteOne({ email: email });
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    updateUserByEmail,
    updatePartialUserById,
    updatePartialUserByEmail,
    deleteUser,
    deleteUserByEmail,
};
