const express = require("express");
const http = require('http');
const Server = require('socket.io');
const cron = require('node-cron');
const mongoose = require('mongoose');





exports.criarNotificacao = async (req, res) => {
    const { destinatario, assunto, mensagem } = req.body;

    if (!destinatario || !assunto || !mensagem) {
        return res.status(400).json({ error: 'Dados insuficientes para enviar notificação.' });
    }

    try {
        await enviarNotificacao(destinatario, assunto, mensagem);
        return res.status(200).json({ success: 'Notificação enviada com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar notificação:', error);
        return res.status(500).json({ error: 'Erro ao enviar notificação.', details: error.message });
    }
};


const nodemailer = require('nodemailer');
const SMTP_CONFIG = require('../Config/Smtp'); 

async function enviarNotificacao(destinatario, assunto, mensagem) {
    
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

   
    const emailBody = `
    Olá ${destinatario},
    
    ${mensagem} // Inclua a mensagem aqui para que o destinatário saiba do que se trata
    `;

    
    await transporter.sendMail({
        from: `"José Casimiro" <${SMTP_CONFIG.user}>`, 
        to: destinatario, 
        subject: assunto, 
        text: emailBody, 
    });

    console.log(`Notificação enviada para ${destinatario}`); 
}
