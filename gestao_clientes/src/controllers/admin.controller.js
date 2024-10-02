const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const userModel = require('../models/user.models');
const emailService = require('../services/emailService');
const SMTP_CONFIG = require("../config/smtp");

const adminController = {};

adminController.createFirstAdmin = async (req, res) => {
    const { username, email, password, dataDeNascimento, numero, role } = req.body;

    try {
        const adminExists = await userModel.findOne({ role: "administrador_supremo" });
        if (adminExists) {
            return res.status(400).json({ message: 'Administrador Supremo já existe.' });
        }

        if (await userModel.findOne({ email }) || await userModel.findOne({ numero })) {
            return res.status(409).json({ message: "Email ou número já existem!" });
        }

        const newAdmin = new userModel({
            username,
            email,
            password: await bcrypt.hash(password, 10),
            dataDeNascimento,
            numero,
            role: "administrador_supremo"
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Administrador Supremo criado com sucesso!', user: newAdmin });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erro ao criar o Administrador Supremo.', error });
    }
};

adminController.createAdmin = async (req, res) => {
    const { username, email, password, dataDeNascimento, numero } = req.body;

    if (req.user.role !== 'administrador_supremo') {
        return res.status(403).send({ message: "Acesso negado." });
    }

    try {
        const existingUser = await userModel.findOne({ $or: [{ email }, { numero }] });
        if (existingUser) {
            return res.status(409).send({ message: "Email ou número já estão em uso!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await userModel.create({
            username,
            email,
            password: hashedPassword,
            dataDeNascimento,
            numero,
            role: 'administrador'
        });

        await emailService.sendAdminWelcomeEmail(email);
        res.status(201).send({ message: "Administrador criado com sucesso", user: newAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erro ao criar administrador", error });
    }
};

module.exports = adminController;
