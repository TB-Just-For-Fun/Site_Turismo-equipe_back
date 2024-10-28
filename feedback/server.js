const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./src/config/db'); 
const feedbackRoutes = require('./src/routes/feedbackRoutes'); 

const app = express();

connectDB(); 

app.use((req, res, next) => {
    res.setTimeout(115000, () => {
        console.log('Request has timed out.');
        res.status(408).send('Request timed out');
    });
    next();
});

app.use(bodyParser.json());


app.use('/api/feedback', feedbackRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ocorreu um erro interno' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
