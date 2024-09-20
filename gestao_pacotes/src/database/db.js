const mongoose = require('mongoose')
require('dotenv').config()

const connectDatabase = () => {
    console.log("Aguardando conexão com o banco de dados...");

    //string de conexão sem as opções depracetadas
    mongoose.connect(process.env.MONGO_URI)
    .then( () => console.log("MongoDB Atlas Conectado com sucesso!"))
    .catch((error) => {
        console.log("Erro ao conectar ao MongoDB Atlas: ",error);
        process.exit(1);
    })
}

module.exports = connectDatabase;