const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ocorreu um erro interno' });
};

app.use(errorHandler);

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para aumentar o timeout
app.use((req, res, next) => {
    res.setTimeout(5000, () => {
        console.log('Request has timed out.');
        res.status(408).send('Request timed out');
    });
    next();
});

// Definir uma rota exemplo
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
