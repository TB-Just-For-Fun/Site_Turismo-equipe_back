const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
require("./src/database/db")

const port = process.env.PORT || 3000;
const pictureRouter = require("./src/routes/picture.route");


app.use(express.json());

//usando o cors
app.use(cors());

//adicionando o header ao servidor
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next()
})

app.get("/", (req, res)=>{res.send("Olá, mundo!")});
app.use("/pictures", pictureRouter);

app.listen(port, () => {
    console.log(`O servidor está rodando na porta ${port}!`)
});
