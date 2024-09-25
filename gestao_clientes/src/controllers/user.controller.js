const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.models');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const userController = {}; // Objeto para armazenar funções do controlador de usuários

// Função de Login
userController.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "Email e senha são obrigatórios" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).send({ message: "Credenciais inválidas" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: "Credenciais inválidas" });
        }

        const generateToken = (user) => {
            return jwt.sign(
                { id: user._id, role: user.role },  // Inclui o ID e o role do usuário
                process.env.JWT_SECRET,
                { expiresIn: '2d' }  // Define a expiração do token
            );
        };

        // Gera o token chamando a função 'generateToken'
        const token = generateToken(user);

        // Retorna o token na resposta
        return res.status(200).send({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Erro no login", error });
    }
};


// Função de logout
userController.logout = async (req, res) => {
    try {
        return res.status(200).send({ message: "Logout realizado com sucesso!" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Erro ao fazer logout", error });
    }
};

// Criar Administrador Supremo
userController.createFirstAdmin = async (req, res) => {
    try {
        const { username, email, password, dataDeNascimento, numero, role } = req.body;
        console.log(role);
        const adminSupremoExistente = await userModel.findOne({ role: role });
        console.log(adminSupremoExistente)
        if (adminSupremoExistente && adminSupremoExistente.role === "administrador_supremo") {
            return res.status(400).json({ message: 'Administrador Supremo já existe.' });
        }
        if (await userModel.findOne({ email: email })) {
            return res.status(409).json({ message: "Este email já existe!" })
        }
        if (await userModel.findOne({ numero: numero })) {
            return res.status(409).json({ message: "Este numero já existe!" })
        }

        const novoAdminSupremo = new userModel({
            username,
            email,
            password: await bcrypt.hash(password, 10), // Criptografa a senha diretamente na criação
            dataDeNascimento,
            numero,
            role: role
        });

        await novoAdminSupremo.save();
        res.status(201).json({ message: 'Administrador Supremo criado com sucesso!', user: novoAdminSupremo });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Erro ao criar o Administrador Supremo.', error });
    }
};

// Função para criar um administrador
userController.createAdmin = async (req, res) => {
    const { username, email, password, dataDeNascimento, numero } = req.body;

    // Verifica se o usuário logado é um administrador supremo
    if (req.user.role !== 'administrador_supremo') {
        return res.status(403).send({ message: "Acesso negado. Apenas o Administrador Supremo pode criar outros administradores." });
    }

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!username || !email || !password || !dataDeNascimento || !numero) {
        return res.status(400).send({ message: "Todos os campos são obrigatórios" });
    }

    try {
        // Verifica se o email ou número já estão em uso
        const existingUser = await userModel.findOne({ $or: [{ email }, { numero }] });
        if (existingUser) {
            return res.status(409).send({ message: "Email ou número já estão em uso!" });
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria uma nova instância do usuário com a role de administrador
        const userInstance = await userModel.create({
            username,
            email,
            password: hashedPassword,
            dataDeNascimento,
            numero,
            role: 'administrador' // Define que o novo usuário será um administrador
        });

        // Configuração do transportador de email
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Envio de email de boas-vindas
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Bem-vindo ao sistema!',
            text: 'Seu cadastro como administrador foi realizado com sucesso!'
        });

        return res.status(201).send({
            message: "Administrador criado com sucesso",
            user: userInstance
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Erro ao criar administrador", error });
    }
};


// Método GET (acesso apenas por administradores)
userController.get = async (req, res) => {
    try {
        if (req.user.role !== 'administrador') {
            return res.status(403).send({ message: "Acesso negado. Apenas administradores." });
        }

        const usuarios = await userModel.find();
        return res.status(200).send(usuarios);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Ocorreu um erro", error });
    }
}

// Método getById
userController.getById = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await userModel.findById(id);
        if (!usuario) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }
        return res.status(200).send(usuario);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Ocorreu um erro", error });
    }
}

// Método CREATE (disponível para criação de clientes)
userController.create = async (req, res) => {
    try {
        const { username, email, password, dataDeNascimento, numero } = req.body;

        // Validação dos campos obrigatórios
        if (!username || !email || !password || !dataDeNascimento || !numero) {
            return res.status(400).send({ message: "Todos os campos são obrigatórios" });
        }

        // Verifica se o email ou número já existem
        const existingUser = await userModel.findOne({ $or: [{ email }, { numero }] });
        if (existingUser) {
            return res.status(409).send({ message: "Este email ou número já existe!" });
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria uma nova instância do usuário
        const userInstance = await userModel.create({
            username,
            email,
            password: hashedPassword,
            dataDeNascimento,
            numero,
            role: 'cliente' // Definindo o role diretamente
        });

        // Remove a senha antes de retornar o usuário
        const { password: _, ...userResponse } = userInstance.toObject();

        // Retorna a resposta de sucesso
        return res.status(201).send({
            message: "Usuário criado com sucesso",
            user: userResponse
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: "Erro ao criar usuário"
        });
    }
};


// Método PUT para atualizar um usuário
userController.put = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await userModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!usuario) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }

        return res.status(200).send({
            message: "Usuário atualizado com sucesso",
            usuario
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Erro ao atualizar o usuário", error });
    }
}

// Método PATCH para atualizar parcialmente um usuário
userController.patch = async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    try {
        const usuarioAtualizado = await userModel.findByIdAndUpdate(id, updateFields, { new: true });

        if (!usuarioAtualizado) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }

        return res.status(200).send({
            message: "Usuário atualizado com sucesso",
            usuario: usuarioAtualizado
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Erro ao atualizar o usuário", error });
    }
};

// Método DELETE para deletar um usuário
userController.apagar = async (req, res) => {
    const { id } = req.params;
    const { role, _id: userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "ID inválido" });
    }

    try {
        const usuarioDeletado = await userModel.findById(id);
        if (!usuarioDeletado) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }

        if (role === 'administrador_supremo') {
            await userModel.findByIdAndDelete(id);
            return res.status(200).send({ message: "Usuário deletado com sucesso" });
        }

        if (role === 'administrador') {
            if (usuarioDeletado.role === 'administrador' && usuarioDeletado._id.toString() !== userId.toString()) {
                return res.status(403).send({ message: "Acesso negado. Apenas o administrador supremo pode deletar contas de outros administradores." });
            }

            // Administrador pode deletar sua própria conta ou a conta de clientes
            if (usuarioDeletado.role === 'cliente' || usuarioDeletado._id.toString() === userId.toString()) {
                await userModel.findByIdAndDelete(id);
                return res.status(200).send({ message: "Usuário deletado com sucesso" });
            }

            return res.status(403).send({ message: "Acesso negado. Você não pode deletar esse usuário." });
        }

        return res.status(403).send({ message: "Acesso negado." });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Erro ao deletar usuário", error });
    }
};

module.exports = userController;
