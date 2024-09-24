const express = require('express');
const app = express();
const connectDatabase = require("./src/database/db");
const reservaRoute = require('./src/routes/user.route');

const PORT = 3000; 

connectDatabase();

app.use(express.json());

app.use("/api_reservas/calendario", reservaRoute);
app.use("/api_reservas", reservaRoute); // Adicionando rotas de reservas

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
