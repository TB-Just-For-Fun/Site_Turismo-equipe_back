const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('./src/config/db'); // Conexão com o banco de dados
const feedbackRoutes = require('./src/routes/feedbackRoutes'); // Não precisa passar o pool aqui
const app = express();

// Middleware para aumentar o timeout
app.use((req, res, next) => {
    res.setTimeout(115000, () => {
        console.log('Request has timed out.');
        res.status(408).send('Request timed out');
    });
    next();
});

// Middleware para analisar JSON
app.use(bodyParser.json());

// Usar rotas
app.use('/api/feedback', feedbackRoutes());

// Middleware de erro
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ocorreu um erro interno' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
