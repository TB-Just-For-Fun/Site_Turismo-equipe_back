const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
require("./src/database/db")

const port = process.env.PORT || 3000;

const pictureRouter = require("./src/routes/picture.route");
const packRoute = require("./src/routes/pack.route");
const notificacoesRoutes = require('./src/routes/notificacoes.route');
const reservaRoute = require('./src/routes/reserva.route');
const userRoute = require('./src/routes/user.route');
const SMTP_CONFIG = require("./src/Config/Smtp")


app.use(express.json());

//usando o cors
app.use(cors());

//adicionando o header ao servidor
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next()
})

//rotas
    //rota principal
app.get("/", (req, res) => { res.send("Just For Fun, all rights reserved.") });
    //rota de imagens
app.use("/pictures", pictureRouter);
    //rota de notificações
app.use('/notificacoes', notificacoesRoutes);
    //rota de reservas
app.use("/api_reservas/calendario", reservaRoute);
app.use("/api_reservas", reservaRoute);
    //rota de pacotes
app.use("/api_pacotes", packRoute);
    //rota de usuarios
app.use("/api_usuarios", userRoute);


app.listen(port, () => {
    console.log(`O servidor está rodando na porta ${port}!`)
});
