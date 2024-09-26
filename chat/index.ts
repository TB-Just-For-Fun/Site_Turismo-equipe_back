import express from 'express';
import connectDatabase from './database/db';

const app = express();
app.use(express.json());


connectDatabase();

fetch('/chat', { method: 'POST'});  


app.use('/chat', (req, res) => {
  res.send("Bem-vindo ao chat!");
});

const port = 8080;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
