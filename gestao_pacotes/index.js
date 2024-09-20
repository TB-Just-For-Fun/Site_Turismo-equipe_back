const express = require("express");
const app = express();
const packRoute = require("./src/routes/pack.route");
const connectDatabase = require("./src/database/db");

const port = 3000;

//conectar ao banco de dados
connectDatabase();

//configurar o middleware
app.use(express.json());
app.use("/api_pacotes", packRoute);

//iniciar o servidor
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));