const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.models');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const SMTP_CONFIG = require("../config/smtp");

const userController = {}; // Objeto para armazenar funções do controlador de usuários

userController.login = async (req, res) => {
    // Verifica se o corpo da requisição está sendo recebido corretamente

    const { email, password } = req.body;

    // Verifica se email e senha foram fornecidos
    if (!email || !password) {
        return res.status(400).send({ message: "Email e senha são obrigatórios" });
    }

    try {
        const user = await userModel.findOne({ email });

        // Verifica se o usuário existe
        if (!user) {
            return res.status(401).send({ message: "Email ou Senha incorretos" });
        }

        // Compara a senha fornecida com a senha armazenada no banco de dados
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: "Email ou Senha incorretos" });
        }

        // Gera o token JWT
        const generateToken = (user) => {
            return jwt.sign(
                { 
                    id: user._id,  
                    role: user.role  
                },  
                process.env.JWT_SECRET,  // Chave secreta para assinar o token
                { expiresIn: '2d' }  // Define a expiração do token para 2 dias
            );
        };
        
        // Gerar o token
        const token = generateToken(user);

        // Retorna o token na resposta
        return res.status(200).send({ message: 'Login bem-sucedido', token });
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

        // Configuração do transportador de email usando SMTP_CONFIG
        const transporter = nodemailer.createTransport({
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            secure: false, // Use `true` se estiver utilizando a porta 465
            auth: {
                user: SMTP_CONFIG.user,
                pass: SMTP_CONFIG.pass,
            },
            tls: {
                rejectUnauthorized: process.env.NODE_ENV !== 'production' ? false : true,
            },
        });

        // Envio de email de boas-vindas
        await transporter.sendMail({
            from: `"Supreme Admin" <${SMTP_CONFIG.user}>`,
            to: email,
            subject: 'Bem-vindo ao sistema!',
            text: 'Seu cadastro como administrador foi realizado com sucesso!',
        });

        return res.status(201).send({
            message: "Administrador criado com sucesso",
            user: userInstance
        });
    } catch (error) {
        console.error(error);

        // Verifique o tipo de erro para fornecer respostas mais detalhadas
        if (error.message.includes("SMTP")) {
            return res.status(500).send({ message: "Erro ao enviar o e-mail", error });
        }

        return res.status(500).send({ message: "Erro ao criar administrador", error });
    }
};


// Método GET (acesso apenas por administradores)
userController.get = async (req, res) => {
    try {
        if (req.user.role !== 'administrador' && req.user.role !== 'administrador_supremo') {
            return res.status(403).send({ message: "Acesso negado. Apenas administradores." });
        }

        const usuarios = await userModel.find();
        return res.status(200).send(usuarios);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Ocorreu um erro", error });
    }
};

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
};

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

        // Envia um e-mail de confirmação para o usuário
        await enviarEmailConfirmacao(userResponse.email, userResponse.username);

        // Retorna a resposta de sucesso
        return res.status(201).send({
            message: "Usuário criado com sucesso. Verifique seu e-mail para mais detalhes.",
            user: userResponse
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: "Erro ao criar usuário",
            error
        });
    }
};

// Função auxiliar para enviar o email de confirmação
async function enviarEmailConfirmacao(email, username) {
    try {
        const transporter = nodemailer.createTransport({
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            secure: false, // Use true se estiver usando a porta 465
            auth: {
                user: SMTP_CONFIG.user,
                pass: SMTP_CONFIG.pass,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // Corpo do email
        const emailBody = `
            Olá ${username},

            Seu cadastro foi realizado com sucesso!
            
            Volte agora à nossa página e faça login com as suas credenciais.

            Atenciosamente,
            Just For Fun
        `;

        await transporter.sendMail({
            from: `"Just For Fun" <${SMTP_CONFIG.user}>`,
            to: email,
            subject: 'Cadastro realizado com sucesso!',
            text: emailBody,
        });

        console.log(`Email de confirmação enviado para ${email}`);
    } catch (error) {
        console.error("Erro ao enviar o email de confirmação:", error);
    }
};


// Método PUT para atualizar um usuário
userController.put = async (req, res) => {
    const { id } = req.params;

    try {
        // Criptografa a senha, se fornecida
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        // Busca o usuário atual antes da atualização
        const usuarioAtual = await userModel.findById(id);
        if (!usuarioAtual) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }

        // Atualiza o usuário
        const usuarioAtualizado = await userModel.findByIdAndUpdate(id, req.body, { new: true });

        // Verifica se o role foi alterado para 'administrador' e envia um email de promoção
        if (usuarioAtualizado.role === 'administrador' && usuarioAtual.role !== 'administrador') {
            await enviarEmailPromocao(usuarioAtualizado.email);
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

// Método PATCH para atualizar parcialmente um usuário
userController.patch = async (req, res) => {
    const { id } = req.params;  // ID do usuário a ser atualizado (se disponível)
    const { email } = req.query;  // Email do usuário a ser atualizado (se disponível)
    const updateFields = req.body;  // Campos a serem atualizados
    const { user } = req;  // Usuário logado (informações do token)

    try {
        let usuarioAtual;

        // Busca o usuário atual antes da atualização, por id ou email
        if (id) {
            usuarioAtual = await userModel.findById(id);
        } else if (email) {
            usuarioAtual = await userModel.findOne({ email });
        } else {
            return res.status(400).send({ message: "Por favor, forneça um id ou email para atualização" });
        }

        if (!usuarioAtual) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }

        // Verifica se o usuário tem permissão para atualizar
        if (user.role === 'cliente') {
            // Clientes só podem atualizar seus próprios dados
            if (user._id.toString() !== usuarioAtual._id.toString()) {
                return res.status(403).send({ message: "Acesso negado. Você só pode atualizar seus próprios dados." });
            }
        } else if (user.role === 'administrador') {
            // Administradores não podem atualizar outros administradores ou o administrador supremo
            if (usuarioAtual.role === 'administrador' || usuarioAtual.role === 'administrador_supremo') {
                return res.status(403).send({ message: "Acesso negado. Você não pode atualizar outros administradores." });
            }
        }

        // Restringir campos que podem ser atualizados
        const camposPermitidos = {
            cliente: ['username', 'password', 'numero'],
            administrador: ['username', 'password', 'numero'],
            administrador_supremo: ['username', 'password', 'numero', 'email', 'role'],
        };

        // Verifica os campos que estão sendo atualizados
        for (const campo in updateFields) {
            // Se o campo não for permitido para o papel do usuário, retornar erro
            if (!camposPermitidos[user.role].includes(campo)) {
                return res.status(403).send({ message: `Acesso negado. Você não pode atualizar o campo "${campo}".` });
            }
        }

        // Criptografa a senha, se fornecida
        if (updateFields.password) {
            updateFields.password = await bcrypt.hash(updateFields.password, 10);
        }

        // Atualiza o usuário
        const usuarioAtualizado = await userModel.findByIdAndUpdate(usuarioAtual._id, updateFields, { new: true });

        // Verifica se o role foi alterado para 'administrador' e envia um email de promoção
        if (usuarioAtualizado.role === 'administrador' && usuarioAtual.role !== 'administrador') {
            await enviarEmailPromocao(usuarioAtualizado.email);
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




// Função auxiliar para enviar o email de promoção
async function enviarEmailPromocao(email) {
    try {
        const transporter = nodemailer.createTransport({
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            secure: false, // Use true se estiver usando a porta 465
            auth: {
                user: SMTP_CONFIG.user,
                pass: SMTP_CONFIG.pass,
            },
            tls: {
                rejectUnauthorized: process.env.NODE_ENV !== 'production' ? false : true,
            },
        });

        await transporter.sendMail({
            from: `"Just For Fun" <${SMTP_CONFIG.user}>`,
            to: email,
            subject: 'Parabéns! Você foi promovido a administrador',
            text: 'Seu papel no sistema foi atualizado para administrador. Parabéns pela promoção!',
        });

        console.log(`Email de promoção enviado para ${email}`);
    } catch (error) {
        console.error("Erro ao enviar o email de promoção:", error);
    }
}



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

        // Admin Supremo pode deletar qualquer conta, incluindo a própria
        if (role === 'administrador_supremo') {
            await userModel.findByIdAndDelete(id);
            return res.status(200).send({ message: "Usuário deletado com sucesso" });
        }

        // Administrador (que não é supremo)
        if (role === 'administrador') {
            // Verifica se o admin está tentando deletar outra conta de admin
            if (usuarioDeletado.role === 'administrador' && usuarioDeletado._id.toString() !== userId.toString()) {
                return res.status(403).send({ message: "Acesso negado. Apenas o administrador supremo pode deletar contas de outros administradores." });
            }

            // Admin pode deletar a própria conta ou a conta de clientes
            if (usuarioDeletado._id.toString() === userId.toString() || usuarioDeletado.role === 'cliente') {
                await userModel.findByIdAndDelete(id);
                return res.status(200).send({ message: "Usuário deletado com sucesso" });
            }

            return res.status(403).send({ message: "Acesso negado. Você não pode deletar esse usuário." });
        }

        // Cliente pode deletar apenas a própria conta
        if (role === 'cliente') {
            if (usuarioDeletado._id.toString() === userId.toString()) {
                await userModel.findByIdAndDelete(id);
                return res.status(200).send({ message: "Conta deletada com sucesso" });
            }

            return res.status(403).send({ message: "Acesso negado. Você só pode deletar a sua própria conta." });
        }

        return res.status(403).send({ message: "Acesso negado." });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Erro ao deletar usuário", error });
    }
};


module.exports = userController;
