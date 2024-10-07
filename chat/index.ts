import express from 'express';
import connectDatabase from './src/database/db';
import cors from 'cors';



const app = express();
app.use(express.json());

app.use(cors());
app.use(express.json());

interface Message {
  message: string;
}




connectDatabase();

fetch('/chat', { method: 'POST'});  


app.use('/chat', (req, res) => {
  res.send("Bem-vindo ao chat!");
});

const port = 8080;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
