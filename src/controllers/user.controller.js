const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.models');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const SMTP_CONFIG = require("../Config/user.smtp");
const validator = require('validator');
const InvalidToken = require('../models/invalidToken.model');
const { validationResult } = require('express-validator');




const userController = {};

userController.login = async (req, res) => {
    console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "Email e senha são obrigatórios" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).send({ message: "Email ou senha incorretos" });
        }

        // Gera o token JWT
        const generateToken = (user) => {
            return jwt.sign(
                { 
                    id: user.id,  
                    role: user.role
                     
                },  
                process.env.JWT_SECRET,
                { expiresIn: '2d' }
            );
        };

        const token = generateToken(user);

        // Define o cookie com o token
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            maxAge: 2 * 24 * 60 * 60 * 1000
        });

        // Exibe o valor do cookie no console
        console.log('Token gerado e armazenado no cookie:', token);
        console.log('---------------------------------------------')
        console.log('Token role:', user.role, ' - Logado com sucesso'); 

        return res.status(200).send({ message: 'Login bem-sucedido', token});
            
    } catch (error) {
        console.error('Erro no login:', error); // Log detalhado
        return res.status(500).send({ message: "Erro no login", error });
    }
};


// Função de logout
userController.logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(400).send({ message: "Nenhum token encontrado para logout" });
        }

        // Invalida o token
        await InvalidToken.create({ token });

        // Limpa o cookie do token
        res.clearCookie('token');

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
        // Adicionando um log para verificar a role do token
        console.log('Token role:', req.user.role);

        // Verificação de role (se o usuário é administrador ou administrador supremo)
        if (req.user.role !== 'administrador' && req.user.role !== 'administrador_supremo') {
            return res.status(403).send({ message: "Acesso negado. Apenas administradores." });
        }

        const usuarios = await userModel.find();
        return res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Ocorreu um erro", error });
    }
};


// Método getById
userController.getById = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await userModel.findById(id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        return res.status(200).json(usuario);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Ocorreu um erro", error });
    }
};

// Método getByEmail
userController.getByEmail = async (req, res) => {
    try {
        const usuario = await userModel.findOne(req.query); 
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        return res.status(200).json(usuario);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Ocorreu um erro", error });
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
            Estamos muito felizes em tê-lo conosco! Aqui, sua aventura começa. Explore destinos incríveis, descubra experiências inesquecíveis e faça memórias que durarão para sempre.\n\n
            Seja você um viajante experiente ou alguém em busca de novas aventuras, temos algo especial para todos. Navegue pelo nosso portfólio de serviços, agende passeios emocionantes e entre em contato com nossa equipe para qualquer dúvida.\n\n
            Prepare-se para explorar o mundo de forma divertida e única!\n\n
            Boa viagem! 🧳✈️\n\n
            Faça login agora, com suas credenciais:\n
            <a href="https://192.168.100.24/login" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #007bff; color: white; text-align: center; text-decoration: none; border-radius: 5px;">Login</a>
        `;

        await transporter.sendMail({
            from: `"Just For Fun" <${SMTP_CONFIG.user}>`,
            to: email,
            subject: 'Cadastro realizado com sucesso!',
            text: emailBody, // Usar apenas texto simples
            html: emailBody.replace(/\n/g, '<br/>'), // Adicionando suporte para HTML
        });

        console.log(`Email de confirmação enviado para ${email}`);
    } catch (error) {
        console.error("Erro ao enviar o email de confirmação:", error);
    }
}


// Método PUT para atualização completa pelo ID
userController.put = async (req, res) => {
    const { id } = req.params;  // ID do usuário
    const updateFields = req.body;
    const { user } = req;  // Usuário logado (informações do token)

    try {
        const usuarioAtual = await userModel.findById(id);
        if (!usuarioAtual) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        // Verifica os campos permitidos com base no papel do usuário logado
        if (!temPermissaoParaAtualizar(user, updateFields, usuarioAtual)) {
            return res.status(403).json({ message: "Acesso negado. Você não pode atualizar este usuário." });
        }

        // Criptografa a senha, se fornecida
        if (updateFields.password) {
            updateFields.password = await bcrypt.hash(updateFields.password, 10);
        }

        // Atualiza o usuário
        const usuarioAtualizado = await userModel.findByIdAndUpdate(usuarioAtual._id, updateFields, { new: true });
        
        // Envia email de promoção, se aplicável
        await verificarEEnviarEmailPromocao(usuarioAtualizado, usuarioAtual);

        return res.status(200).json({
            message: "Usuário atualizado com sucesso",
            usuario: usuarioAtualizado
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar o usuário", error });
    }
};

// Método PUT para atualização completa pelo Email
userController.putByEmail = async (req, res) => {
    try {
        const { email } = req.query;  // Email do usuário a ser atualizado

        // Verifica se o email é válido
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Email inválido" });
        }

        const usuarioAtual = await userModel.findOne({ email });  // Encontra o usuário pelo email
        const updateFields = req.body;  // Campos a serem atualizados
        const { user } = req;  // Usuário logado (informações do token)

        if (!usuarioAtual) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        // Verifica se o usuário logado está tentando atualizar seu próprio perfil
        const isUpdatingSelf = user.email === usuarioAtual.email;

        if (!temPermissaoParaAtualizar(user, updateFields, usuarioAtual, isUpdatingSelf)) {
            return res.status(403).json({ message: "Acesso negado. Você não pode atualizar este usuário." });
        }

        if (updateFields.password) {
            updateFields.password = await bcrypt.hash(updateFields.password, 10);
        }

        const usuarioAtualizado = await userModel.findOneAndUpdate(
            { email: usuarioAtual.email },
            updateFields,
            { new: true }
        );

        // Envia email de promoção, se aplicável
        await verificarEEnviarEmailPromocao(usuarioAtualizado, usuarioAtual);

        return res.status(200).json({
            message: "Usuário atualizado com sucesso",
            usuario: usuarioAtualizado
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar o usuário", error });
    }
};

// Função para enviar email de promoção
async function verificarEEnviarEmailPromocao(usuarioAtualizado, usuarioAtual) {
    // Exemplo de lógica para enviar o email
    // Se o usuário foi promovido para 'premium' ou fez alguma mudança relevante
    if (usuarioAtualizado.role !== usuarioAtual.role && usuarioAtualizado.role === 'premium') {
        console.log(`Enviando email de promoção para ${usuarioAtualizado.email}`);
        
        // Enviar o email de promoção, utilizando a função que você já criou
        await enviarEmailPromocao(usuarioAtualizado.email);
    }
}

// Função auxiliar para verificar permissões de atualização
function temPermissaoParaAtualizar(user, updateFields, usuarioAtual, isUpdatingSelf) {
    // Se o usuário estiver atualizando a si mesmo, permitir atualização de todos os campos, exceto o email
    if (isUpdatingSelf) {
        if (updateFields.email) {
            return false; // Não permite alteração de email
        }
        return true; // Permite atualização de outros campos
    }

    // Lógica adicional para outras permissões (por exemplo, admin)
    if (user.role === 'admin') {
        return true; // Admin pode atualizar qualquer usuário
    }

    return false; // Acesso negado para outros casos
}



// Método PATCH para atualização parcial de um usuário
userController.patch = async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;
    const { user } = req;

    try {
        const usuarioAtual = await userModel.findById(id);
        if (!usuarioAtual) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        // Verifica se o usuário tem permissão para atualizar
        if (!temPermissaoParaAtualizar(user, updateFields, usuarioAtual)) {
            return res.status(403).json({ message: "Acesso negado. Você não pode atualizar este usuário." });
        }

        // Criptografa a senha, se fornecida
        if (updateFields.password) {
            updateFields.password = await bcrypt.hash(updateFields.password, 10);
        }

        // Atualiza o usuário
        const usuarioAtualizado = await userModel.findByIdAndUpdate(usuarioAtual._id, updateFields, { new: true });

        return res.status(200).json({
            message: "Usuário atualizado com sucesso",
            usuario: usuarioAtualizado
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar o usuário", error });
    }
}; 

// Função auxiliar para verificar permissões de atualização
function temPermissaoParaAtualizar(user, updateFields, usuarioAtual) {
    const camposPermitidos = {
        cliente: ['username', 'password', 'numero'],
        administrador: ['username', 'password', 'numero', 'email'],
        administrador_supremo: ['username', 'password', 'numero', 'email', 'role'],
    };

    // Verifica os campos que estão sendo atualizados
    for (const campo in updateFields) {
        if (!camposPermitidos[user.role].includes(campo) && user.role !== 'administrador_supremo') {
            return false;
        }
    }

    // Impede alterações de papel (role) por usuários não autorizados
    if (updateFields.role && user.role !== 'administrador_supremo') {
        return false;
    }

    // Administradores não podem alterar o email de outros administradores
    if (updateFields.email && user.role === 'administrador' && usuarioAtual.role === 'administrador') {
        return false;
    }

    return true;
} 

// Método PATCH para atualizar parcialmente um usuário pelo email
userController.patchByEmail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email } = req.query;  // Email do usuário a ser atualizado
        
        // Verifica se o email é válido
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Email inválido" });
        }

        const updateFields = req.body;
        const { user } = req;
        const usuarioAtual = await userModel.findOne({ email });

        if (!usuarioAtual) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        if (user.role === 'cliente' && user.email !== usuarioAtual.email) {
            return res.status(403).json({ message: "Acesso negado. Você só pode atualizar seus próprios dados." });
        }

        if (user.role === 'administrador' && usuarioAtual.role === 'administrador_supremo') {
            return res.status(403).json({ message: "Acesso negado. Você não pode atualizar o administrador supremo." });
        }

        const camposPermitidos = {
            cliente: ['username', 'password', 'numero'],
            administrador: ['username', 'password', 'numero', 'email'],
            administrador_supremo: ['username', 'password', 'numero', 'email', 'role'],
        };

        for (const campo in updateFields) {
            if (!camposPermitidos[user.role].includes(campo)) {
                return res.status(403).json({ message: `Acesso negado. Você não pode atualizar o campo "${campo}".` });
            }

            if (campo === 'email' && user.role === 'administrador' && usuarioAtual.role === 'administrador') {
                return res.status(403).json({ message: "Acesso negado. Administradores não podem alterar o email de outros administradores." });
            }
        }

        let senhaAlterada = false; // Para rastrear se a senha foi alterada

        if (updateFields.password) {
            try {
                updateFields.password = await bcrypt.hash(updateFields.password, 10);
                senhaAlterada = true; // Marcar que a senha foi alterada
            } catch (err) {
                console.error('Erro ao criptografar a senha:', err);
                return res.status(500).send({ message: 'Erro ao atualizar o usuário' });
            }
        }

        const usuarioAtualizado = await userModel.findOneAndUpdate(
            { email },
            updateFields,
            { new: true }
        );

        const usuarioSemSenha = usuarioAtualizado.toObject();
        delete usuarioSemSenha.password;

        // Verifica se houve promoção para administrador
        if (usuarioAtualizado.role === 'administrador' && usuarioAtual.role !== 'administrador') {
            await enviarEmailPromocao(usuarioAtualizado.email);
        }

        // Envia email de confirmação se a senha foi alterada
        if (senhaAlterada) {
            await enviarEmailAlteracaoSenha(usuarioAtualizado.email); // Corrigido para enviar o email ao novo email
        }

        return res.status(200).json({
            message: "Usuário atualizado com sucesso",
            usuario: usuarioSemSenha
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar o usuário", error });
    }
};

// Função auxiliar para enviar o email de promoção
async function enviarEmailPromocao(email) {
    try {
        const transporter = nodemailer.createTransport({
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            secure: false,
            auth: {
                user: SMTP_CONFIG.user,
                pass: SMTP_CONFIG.pass,
            },
            tls: {
                rejectUnauthorized: process.env.NODE_ENV !== 'production' ? false : true,
            },
        });

        // Corpo do email
        const emailBody = `
            Estamos muito felizes em anunciar que você foi promovido a Administrador no Just For Fun! Sua dedicação e paixão pelo que fazemos não passaram despercebidas, e acreditamos que você tem o que é necessário para desempenhar este novo papel com excelência.\n\n
            Como Administrador, você terá novas responsabilidades e a oportunidade de impactar ainda mais nossa comunidade de viajantes. A sua experiência será fundamental para aprimorar nossos serviços e garantir que nossos clientes tenham experiências memoráveis.\n\n
            Sinta-se à vontade para compartilhar suas ideias e sugestões para o nosso crescimento. Estamos aqui para apoiá-lo nesta nova jornada!\n\n
            Vamos juntos fazer do Just For Fun um lugar ainda mais incrível!\n\n
            👏 Parabéns novamente! 👏\n\n
            Faça login agora, com suas credenciais:\n
            <a href="https://192.168.100.24/login" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #007bff; color: white; text-align: center; text-decoration: none; border-radius: 5px;">Login</a>
        `;

        await transporter.sendMail({
            from: `"Just For Fun" <${SMTP_CONFIG.user}>`,
            to: email,
            subject: 'Parabéns! Você foi promovido a administrador',
            text: emailBody, // Usar apenas texto simples
            html: emailBody.replace(/\n/g, '<br/>'), // Adicionando suporte para HTML
        });

        console.log(`Email de promoção enviado para ${email}`);
    } catch (error) {
        console.error("Erro ao enviar o email de promoção:", error);
    }
}

// Função auxiliar para enviar o email de alteração de senha
async function enviarEmailAlteracaoSenha(email) {
    try {
        const transporter = nodemailer.createTransport({
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            secure: false,
            auth: {
                user: SMTP_CONFIG.user,
                pass: SMTP_CONFIG.pass,
            },
            tls: {
                rejectUnauthorized: process.env.NODE_ENV !== 'production' ? false : true,
            },
        });

        // Corpo do email
        const emailBody = `
            A sua senha foi alterada com sucesso. Faça login agora com as suas novas credenciais:\n
            <a href="https://192.168.100.24/login" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #007bff; color: white; text-align: center; text-decoration: none; border-radius: 5px;">Login</a>
        `;

        await transporter.sendMail({
            from: `"Just For Fun" <${SMTP_CONFIG.user}>`,
            to: email,
            subject: 'A sua senha foi alterada',
            text: emailBody, // Usar apenas texto simples
            html: emailBody.replace(/\n/g, '<br/>'), // Adicionando suporte para HTML
        });

        console.log(`Email de alteração de senha enviado para ${email}`);
    } catch (error) {
        console.error("Erro ao enviar o email de alteração de senha:", error);
    }
}


 // Método DELETE para deletar um usuário
userController.apagar = async (req, res) => {
    const { id } = req.params;
    const { role, _id: userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const usuarioDeletado = await userModel.findById(id);
        if (!usuarioDeletado) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        // Admin Supremo pode deletar qualquer conta, incluindo a própria
        if (role === 'administrador_supremo') {
            await userModel.findByIdAndDelete(id);
            return res.status(200).json({ message: "Usuário deletado com sucesso" });
        }

        // Administrador (que não é supremo)
        if (role === 'administrador') {
            // Verifica se o admin está tentando deletar outra conta de admin
            if (usuarioDeletado.role === 'administrador' && usuarioDeletado._id.toString() !== userId.toString()) {
                return res.status(403).json({ message: "Acesso negado. Apenas o administrador supremo pode deletar contas de outros administradores." });
            }

            // Admin pode deletar a própria conta ou a conta de clientes
            if (usuarioDeletado._id.toString() === userId.toString() || usuarioDeletado.role === 'cliente') {
                await userModel.findByIdAndDelete(id);
                return res.status(200).json({ message: "Usuário deletado com sucesso" });
            }

            return res.status(403).json({ message: "Acesso negado. Você não pode deletar esse usuário." });
        }

        // Cliente pode deletar apenas a própria conta
        if (role === 'cliente') {
            if (usuarioDeletado._id.toString() === userId.toString()) {
                await userModel.findByIdAndDelete(id);
                return res.status(200).json({ message: "Conta deletada com sucesso" });
            }

            return res.status(403).json({ message: "Acesso negado. Você só pode deletar a sua própria conta." });
        }

        return res.status(403).json({ message: "Acesso negado." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao deletar usuário", error });
    }
};

// Método DELETE para deletar um usuário por email
userController.apagarByEmail = async (req, res) => {
    try {
        const { email } = req.query; 

        // Verificação de email válido
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Email inválido" });
        }

        const { role, email: userEmail } = req.user;  // Pega o papel e o email do usuário logado
        // Busca o usuário pelo email
        const usuarioDeletado = await userModel.findOne({ email });
        
        if (!usuarioDeletado) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        // Admin Supremo pode deletar qualquer conta
        if (role === 'administrador_supremo') {
            await userModel.findOneAndDelete({ email });
            return res.status(200).json({ message: "Usuário deletado com sucesso" });
        }

        // Administrador (não supremo) só pode deletar sua própria conta ou contas de clientes
        if (role === 'administrador') {
            if (usuarioDeletado.role === 'administrador' && usuarioDeletado.email !== userEmail) {
                return res.status(403).json({ message: "Acesso negado. Apenas o administrador supremo pode deletar outros administradores." });
            }

            if (usuarioDeletado.email === userEmail || usuarioDeletado.role === 'cliente') {
                await userModel.findOneAndDelete({ email });
                return res.status(200).json({ message: "Usuário deletado com sucesso" });
            }

            return res.status(403).json({ message: "Acesso negado. Você não pode deletar este usuário." });
        }

        // Cliente pode deletar apenas a própria conta
        if (role === 'cliente' && usuarioDeletado.email === userEmail) {
            await userModel.findOneAndDelete({ email });
            return res.status(200).json({ message: "Conta deletada com sucesso" });
        }

        // Caso não seja permitido
        return res.status(403).json({ message: "Acesso negado. Você não tem permissão para realizar esta operação" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao deletar usuário", error });
    }
};



module.exports = userController;