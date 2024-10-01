const express = require("express");
const http = require('http');
const Server = require('socket.io');
const cron = require('node-cron');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const SMTP_CONFIG = require('../Config/Smtp'); 


exports.notificarNovaDisponibilidade = async (destinatarios, disponibilidade) => {
    const assunto = "Nova Disponibilidade Disponível!";
    const mensagem = `Temos uma nova disponibilidade: ${disponibilidade}. Confira no nosso site!`;
    
    for (let destinatario of destinatarios) {
        await enviarNotificacao(destinatario, assunto, mensagem);
    }
};


exports.notificarNovaReserva = async (destinatario, reserva) => {
    const assunto = "Nova Reserva Realizada!";
    const mensagem = `Sua reserva foi confirmada! Detalhes: ${JSON.stringify(reserva)}.`;
    
    await enviarNotificacao(destinatario, assunto, mensagem);
};


exports.notificarNovoPacote = async (destinatarios, pacote) => {
    const assunto = "Novo Pacote Disponível!";
    const mensagem = `Confira nosso novo pacote: ${pacote.nome}. Aproveite esta oportunidade!`;

    for (let destinatario of destinatarios) {
        await enviarNotificacao(destinatario, assunto, mensagem);
    }
};


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
    
    ${mensagem} 
    `;

    await transporter.sendMail({
        from: `"Just For Fun" <${SMTP_CONFIG.user}>`, 
        to: destinatario, 
        subject: assunto, 
        text: emailBody, 
    });

    console.log(`Notificação enviada para ${destinatario}`); 
}
