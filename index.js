const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();

require("dotenv").config();
require("./src/database/db");

const port = process.env.PORT;

const pictureRouter = require("./src/routes/picture.route");
const packRoute = require("./src/routes/pack.route");
const notificacoesRoutes = require('./src/routes/notificacoes.route');
const reservaRoute = require('./src/routes/reserva.route');
const userRoute = require('./src/routes/user.route');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const SMTP_CONFIG = require("./src/Config/Smtp");

// Middleware para aumentar o timeout
app.use((req, res, next) => {
    res.setTimeout(115000, () => {
        console.log('Request has timed out.');
        res.status(408).send('Request timed out');
    });
    next();
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser()); // Para ler cookies

// Configuração do CORS para aceitar credenciais e o domínio do frontend
app.use(cors({
    origin: '*', 
    credentials: true, // Permite o envio de cookies
}));

// Adiciona headers necessários ao servidor
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // substitua com a URL do front-end
    res.header('Access-Control-Allow-Credentials', 'true'); // Necessário para cookies
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Rotas
app.get("/", (req, res) => { res.send("Just For Fun, all rights reserved.") });
app.use("/pictures", pictureRouter);
app.use('/notificacoes', notificacoesRoutes);
app.use("/api_reservas/calendario", reservaRoute);
app.use("/api_reservas", reservaRoute);
app.use("/api_pacotes", packRoute);
app.use("/api_usuarios", userRoute);
app.use('/api/feedback', feedbackRoutes);

app.listen(port, () => {
    console.log(`O servidor está rodando na porta ${port}!`);
});
