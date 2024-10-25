import express from 'express';
import http from 'http';
import cors from 'cors';
import initSocket from './initSocket';
import mongoose from 'mongoose';
const mongoURI = 'mongodb+srv://Aldasmix:Aldasmix@cluster1.vle7k.mongodb.net/justforfun';
const app = express();
const server = http.createServer(app);
const corsOptions = {
    origin: ['http://localhost:3001', 'http://192.168.102.251:3001', 'http://192.168.102.211:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));
// Inicializando o Socket.IO
initSocket(server);
// Conexão ao MongoDB
mongoose.connect(mongoURI)
    .then(() => {
    console.log('Conexão com MongoDB Atlas bem-sucedida');
    server.listen(3001, () => {
        console.log('Servidor rodando na porta 3001');
    });
})
    .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
});
