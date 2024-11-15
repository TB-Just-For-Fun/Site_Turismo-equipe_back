const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Importa o cookie-parser
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
// bodyparser
app.use(bodyParser.json());

// Configuração do CORS para aceitar qualquer origem dinamicamente
app.use(cors({
    origin: (origin, callback) => {
        // Permite qualquer origem
        callback(null, origin || '*');
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));

// Adiciona o cookie-parser para habilitar a leitura dos cookies
app.use(cookieParser()); // Aqui está o cookie-parser

// Middleware para adicionar os headers necessários ao CORS
app.use((req, res, next) => {
    const origin = req.headers.origin;
    res.header('Access-Control-Allow-Origin', origin || '*'); // Define a origem da requisição
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Rotas
// Rota principal
app.get("/", (req, res) => { res.json("Just For Fun, all rights reserved."); });
// Rota de imagens
app.use("/pictures", pictureRouter);
// Rota de notificações
app.use('/notificacoes', notificacoesRoutes);
// Rota de reservas
app.use("/api_reservas/calendario", reservaRoute);
app.use("/api_reservas", reservaRoute);
// Rota de pacotes
app.use("/api_pacotes", packRoute);
// Rota de usuários
app.use("/api_usuarios", userRoute);
// Rota de feedback
app.use('/api/feedback', feedbackRoutes);

app.listen(port, () => {
    console.log(`O servidor está rodando na porta ${port}!`);
});
