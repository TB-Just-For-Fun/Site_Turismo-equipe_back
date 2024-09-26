const express = require("express");
const http = require('http');
const  Server  = require('socket.io');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const mongoose = require('mongoose');
require('dotenv').config();


exports.criarNotificacao = async (req, res) => {
    const { destinatario, assunto, mensagem } = req.body;

    if (!destinatario || !assunto || !mensagem) {
        return res.status(400).json({ error: 'Dados insuficientes para enviar notificação.' });
    }

    try {
        await enviarNotificacao(destinatario, assunto, mensagem);
        return res.status(200).json({ success: 'Notificação de teste enviada com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar notificação:', error);
        return res.status(500).json({ error: 'Erro ao enviar notificação.', details: error.message });
    }
};

async function enviarNotificacao(destinatario, assunto, mensagem) {
  
    const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io', 
        port: 2525, 
        auth: {
             user: "ab67097bb8c4ad",
             pass: "********12a7"
        },
    });

    const mailOptions = {
        from: {
            address: "hello@example.com", 
            name: "Mailtrap Test", 
        },
        to: destinatario, 
        subject: assunto, 
        text: mensagem, 
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notificação de teste enviada para ${destinatario}`);
}


