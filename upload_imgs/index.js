const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
require("./src/database/db")

const port = process.env.PORT || 3000;
const pictureRouter = require("./src/routes/picture.route");


app.use(express.json());
app.use("/pictures", pictureRouter);

//adicionando o header ao servidor
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
})

//habilitando o cors para todas as origens
app.use(cors());

//habilitando o cors para o localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));


app.listen(port, () => {
    console.log(`O servidor está rodando na porta ${port}!`)
});
