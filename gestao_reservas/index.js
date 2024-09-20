const express = require('express');
const app = express();
const connectDatabase = require("./src/database/db");
const userRoute = require('./src/routes/user.route');

const PORT = 3000; 

// Conectar ao banco de dados
connectDatabase();

// Configurar middleware
app.use(express.json());
app.use("/api_reservas", userRoute);

// Iniciar o servidor
app.listen(PORT, () => console.log(`A rodar o servidor na porta ${PORT}`));
