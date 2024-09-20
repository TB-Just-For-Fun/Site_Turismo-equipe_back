const express = require('express');
const app = express();
const connectDatabase = require('./src/database/db');
const userRoute = require('./src/routes/user.route');


 const PORT = 3000; //Define a constante porta, que contém o número da porta onde o servidor Express irá rodar

//conecção com o banco de dados
connectDatabase() //Chama a função connectDatabase(), que estabelece a conexão com o banco de dados configurado no projeto.

app.use(express.json()); // Configura o middleware express.json(), que permite à aplicação lidar com requisições que tenham um corpo no formato JSON.

app.use("/api_usuarios", userRoute); //Cria um middleware para rotas que começam com /user para redirecionar requisições para userRoute.

app.listen(PORT, () => console.log(`A rodar o servidor na porta ${PORT}`));
