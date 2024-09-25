import express, { Application, Request, Response } from "express";
import http from 'http';
import { Server } from 'socket.io';

class App {
    private app: Application;
    private http: http.Server;
    private io: Server;
    private conversations: { [key: string]: Array<{ sender: string; text: string }> } = {};

    constructor() {
        this.app = express();
        this.http = http.createServer(this.app);
        this.io = new Server(this.http);
        this.listenSocket();
        this.setupRouters();
    }

    listenServer() {
        this.http.listen(8080, (err?: Error) => {
            if (err) {
                console.error('Erro ao iniciar o servidor:', err.message);
            } else {
                console.log('O servidor está rodando na porta 8080');
            }
        });
    }

    listenSocket() {
        this.io.on('connection', (socket) => {
            console.log('user connected =>', socket.id);
            socket.on('message', (msg) => {
                this.io.emit('message', msg);
            });
        });
    }

    setupRouters() {
        this.app.use(express.json());

      
        this.app.post('/chat', (req: Request, res: Response) => {
            const { userMessage } = req.body;
            const conversationId = Object.keys(this.conversations).length + 1;

           
            const welcomeMessage = "Olá! Bem-vindo ao nosso site de turismo. Aqui você pode encontrar informações sobre destinos incríveis e pacotes de viagem.";

           
            this.conversations[conversationId] = [
                { sender: 'User', text: userMessage },
                { sender: 'Bot', text: welcomeMessage }
            ];

            res.status(201).send({ message: welcomeMessage, conversationId });
        });

      
        this.app.post('/chat/:id', (req: Request, res: Response) => {
            const chatId = req.params.id;
            const { userMessage } = req.body;

            if (this.conversations[chatId]) {
                const botResponse = `Você disse: "${userMessage}". Como posso ajudá-lo com mais informações?`;

               
                this.conversations[chatId].push({ sender: 'User', text: userMessage });
                this.conversations[chatId].push({ sender: 'Bot', text: botResponse });

                res.status(200).send({ message: botResponse });
            } else {
                res.status(404).send({ error: "Conversa não encontrada." });
            }
        });

        this.app.get('/chat/:id', (req: Request, res: Response) => {
            const chatId = req.params.id;
            const conversation = this.conversations[chatId];
            if (conversation) {
                res.status(200).send({ id: chatId, messages: conversation });
            } else {
                res.status(404).send({ error: 'Conversa não encontrada.' });
            }
        });

        this.app.post('/tickets', (req: Request, res: Response) => {
            res.status(201).send({ message: "Ticket de suporte criado." });
        });

        this.app.get('/tickets/:id', (req: Request, res: Response) => {
            const ticketId = req.params.id;
            res.status(200).send({ message: `Detalhes do ticket ${ticketId}.` });
        });

        this.app.get('/', (req: Request, res: Response) => {
            res.sendFile(__dirname + './index.html'); 
        });
    }
}

const app = new App();
app.listenServer();
