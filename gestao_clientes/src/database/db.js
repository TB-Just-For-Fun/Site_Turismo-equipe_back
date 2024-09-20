const mongoose = require('mongoose') //Importa o módulo mongoose, que é uma biblioteca para modelar e gerenciar dados no MongoDB em Node.js.
require('dotenv').config() //Importa e configura a biblioteca dotenv. Esta biblioteca carrega variáveis de ambiente a partir de um arquivo .env para o process.env. 

const connectDatabase = () => {
    console.log('Aguardando conexão com o banco de dados...');
    mongoose.connect(process.env.MONGO_URI)//Usa o método connect() do mongoose para conectar-se ao MongoDB. A string de conexão (process.env.MONGO_URI) é obtida a partir das variáveis de ambiente carregadas pelo dotenv. 

    .then(()=> console.log('Conexão com o banco de dados JUST FOR FUN feita com sucesso!'))
    .catch((error) =>{
        console.error('Falha na conexão com o banco JUST FOR FUN!!', error);
        process.exit(1);
    });
}

module.exports = connectDatabase;
