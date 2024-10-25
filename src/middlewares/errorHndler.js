const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ocorreu um erro interno' });
};

app.use(errorHandler);

const express = require('express');
const app = express();
const PORT = 8080;


app.use((req, res, next) => {
    res.setTimeout(5000, () => {
        console.log('Request has timed out.');
        res.status(408).send('Request timed out');
    });
    next();
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
