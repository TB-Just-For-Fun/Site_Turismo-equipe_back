const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.models');
const nodemailer = require('nodemailer');


const userController = {};

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

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).send({ token });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Erro no login", error });
    }
};

// Criação de usuário administrador
userController.createAdmin = async (req, res) => {
    const { username, email, password, dataDeNascimento, numero } = req.body;

    if (!username || !email || !password || !dataDeNascimento || !numero) {
        return res.status(400).send({ message: "Todos os campos são obrigatórios" });
    }

    try {
        const existingUser = await userModel.findOne({ $or: [{ email }, { numero }] });
        if (existingUser) {
            return res.status(400).send({ message: "Email ou número já estão em uso!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userInstance = await userModel.create({
            username,
            email,
            password: hashedPassword,
            dataDeNascimento,
            numero,
            role: 'administrador'
        });

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

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
        console.log(error);
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
        return res.status(201).send(usuarios);
    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: "Ocorreu um erro", error: error });
    }
}

// Método getById
userController.getById = async (req, res) =>{ //Define um método assíncrono chamado getById dentro do userController para lidar com requisições GET que solicitam um usuário específico pelo ID.
    
    const{id}= req.params; //Extrai o id dos parâmetros da URL da requisição (req.params). Isso é feito para identificar qual usuário recuperar.
    
    const usuarios = await userModel.findOne({_id:id}); // Usa o método findOne() do userModel para buscar um usuário específico com base no ID fornecido. A consulta {_id: id} é usada para encontrar o documento correto no banco de dados.

    return res.status(201).send(usuarios);
}

// Método CREATE (disponível para criação de qualquer tipo de usuário)
userController.create = async (req, res) => {
    try {
        const { username, email, password, dataDeNascimento, numero } = req.body;
        const role = 'cliente';

        if (!username || !email || !password || !dataDeNascimento || !numero) {
            return res.status(400).send({ message: "Todos os campos são obrigatórios" });
        }

        // Verifica se o email já existe
        const emailExite = await userModel.findOne({ email });
        if (emailExite) {
            return res.status(401).send({ message: "Este email já existe!" });
        }

        // Verifica se o número já existe
        const numeroExite = await userModel.findOne({ numero });
        if (numeroExite) {
            return res.status(401).send({ message: "Este número já existe!" });
        }

        // Gera o hash da senha usando bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Cria o usuário com a senha encriptada
        const userInstance = await userModel.create({
            username,
            email,
            password: hashedPassword, // Armazena a senha encriptada
            dataDeNascimento,
            numero,
            role
        });

        return res.status(200).send({
            message: "Usuário criado com sucesso",
            user: userInstance
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Erro ao criar usuário"
        });
    }
};


// Método PUT

userController.put = async (req, res) => {
    const{id} = req.params;
    const {username, passward, email} = req.body; //Extrai o id dos parâmetros da URL e os dados do corpo da requisição (req.body). O id é usado para identificar qual usuário atualizar, e os dados são usados para atualizar o usuário.

    const usuario = await userModel.findByIdAndUpdate(id, {...req.body}, {new:true}); //Usa o método findByIdAndUpdate() do userModel para encontrar e atualizar um usuário com o ID fornecido. O parâmetro {new: true} faz com que a função retorne o documento atualizado em vez do original.

    res.status(200).send({
        message: "usuario atualizado com sucesso",
        usuario
    }); 

}



// Método PATCH
userController.patch = async (req, res) => {
    const { id } = req.params; // Extrai o id dos parâmetros da URL
    const updateFields = req.body; // Extrai os campos que precisam ser atualizados do corpo da requisição

    try {
        // Usa o método findByIdAndUpdate() para atualizar os campos específicos do usuário
        const usuarioAtualizado = await userModel.findByIdAndUpdate(id, updateFields, { new: true });

        if (!usuarioAtualizado) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }

        return res.status(200).send({
            message: "Usuário atualizado com sucesso",
            usuario: usuarioAtualizado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: "Erro ao atualizar o usuário", error: error });
    }
};


// Método DELETE para deletar um usuário (clientes podem deletar suas próprias contas, administradores podem deletar qualquer conta)
userController.apagar = async (req, res) => {
    const { id } = req.params;
    const { role, _id: userId } = req.user;

    // Se o usuário for um cliente, ele só pode deletar sua própria conta
    if (role !== 'administrador' && id !== userId.toString()) {
        return res.status(403).send({ message: "Acesso negado. Você só pode deletar sua própria conta." });
    }

    try {
        const usuarioDeletado = await userModel.findByIdAndDelete(id);
        if (!usuarioDeletado) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }
        return res.status(200).send({ message: "Usuário deletado com sucesso" });
    } catch (error) {
        return res.status(400).send({ message: "Erro ao deletar usuário", error });
    }
};


module.exports = userController;

