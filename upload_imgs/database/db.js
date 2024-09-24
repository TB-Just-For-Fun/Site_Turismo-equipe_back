const mongoose = require("mongoose");

require("dotenv").config();

mongoose.set("strictQuery", true);

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conexão ao banco de dados Atlas efectuada com sucesso!");
}

main().catch((err) => console.log("Erro ao conectar ao banco de dados: ",err))

module.exports = main;