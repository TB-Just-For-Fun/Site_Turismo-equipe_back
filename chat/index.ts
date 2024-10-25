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

fetch('/api/chat', { method: 'POST' });  


app.post('/api/chat', (req, res) => {
  const message = req.body.message;
  res.status(200).json({reponse:`msg recebida: ${message}`});
});


app.get('/api/chat', (req, res) => {
  const message = req.body.message;
  res.status(200).json({reponse:`msg recebida: ${message}`});
});

const port =3001;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
