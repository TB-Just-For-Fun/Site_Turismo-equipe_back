const express = require("express");
const app = express()

require("dotenv").config();
require("./src/database/db")

const port = process.env.PORT || 3000;
const pictureRouter = require("./src/routes/picture.route");

app.use("/picture", pictureRouter);
app.use(express.json());


app.listen(port, () => {
    console.log(`O servidor está rodando na porta ${port}!`)
});
