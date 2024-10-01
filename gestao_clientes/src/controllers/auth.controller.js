const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.models');

const authController = {};

authController.login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).send({ message: "Email e senha são obrigatórios" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).send({ message: "Email ou senha incorretos" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: "Email ou senha incorretos" });
        }

        const token = jwt.sign(
            { role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2d' }
        );

        return res.status(200).send({ message: 'Login bem-sucedido', token });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Erro no login", error });
    }
};

authController.logout = (req, res) => {
    try {
        return res.status(200).send({ message: "Logout realizado com sucesso!" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Erro ao fazer logout", error });
    }
};

module.exports = authController;
