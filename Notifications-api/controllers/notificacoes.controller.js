// notificacoes.controller.js
const express = require("express");
const http = require('http');
const { Server } = require('socket.io');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

// Mantenha o resto do seu código

// Adicione a função criarNotificacao
exports.criarNotificacao = async (req, res) => {
    const { destinatario, assunto, mensagem } = req.body;

    if (!destinatario || !assunto || !mensagem) {
        return res.status(400).json({ error: 'Dados insuficientes para enviar notificação.' });
    }

    try {
        await enviarNotificacao(destinatario, assunto, mensagem); // Chame a função que envia a notificação
        return res.status(200).json({ success: 'Notificação enviada com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar notificação:', error);
        return res.status(500).json({ error: 'Erro ao enviar notificação.', details: error.message });
    }
};

// A função enviarNotificacao deve ser acessível aqui
async function enviarNotificacao(destinatario, assunto, mensagem) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: destinatario,
        subject: assunto,
        text: mensagem,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notificação enviada para ${destinatario}`);
}

// Mantenha o resto do seu código
