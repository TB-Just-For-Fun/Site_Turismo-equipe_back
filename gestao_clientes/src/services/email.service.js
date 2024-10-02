const nodemailer = require('nodemailer');
const SMTP_CONFIG = require('../config/smtp');

const emailService = {};

emailService.sendConfirmationEmail = async (email, username) => {
    const transporter = nodemailer.createTransport({
        host: SMTP_CONFIG.host,
        port: SMTP_CONFIG.port,
        secure: false,
        auth: {
            user: SMTP_CONFIG.user,
            pass: SMTP_CONFIG.pass,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const message = `
        Olá ${username},
        Seu cadastro foi realizado com sucesso!
    `;

    try {
        await transporter.sendMail({
            from: `"Just For Fun" <${SMTP_CONFIG.user}>`,
            to: email,
            subject: 'Cadastro realizado com sucesso!',
            text: message,
        });
    } catch (error) {
        console.error("Erro ao enviar email de confirmação", error);
    }
};

emailService.sendAdminWelcomeEmail = async (email) => {
    // Lógica para envio de email de boas-vindas ao admin
};

module.exports = emailService;
