// index.js
const express = require('express');
const notificacoesRoutes = require('./routes/notificacoes.route');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use('/notificacoes', notificacoesRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
