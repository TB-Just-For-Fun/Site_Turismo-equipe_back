const express = require('express');
const app = express();
const connectDatabase = require("./src/database/db");
const userRoute = require('./src/routes/user.route'); 

const PORT = 3000; 


connectDatabase();


app.use(express.json());


app.use("/api_reservas", userRoute); 


app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
