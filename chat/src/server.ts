import express, { Application, Request, Response } from "express";
import http from 'http';
import { Server } from 'socket.io';
import connectDatabase from './database/db'; 

connectDatabase();

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
        this.http.listen(8080, (error) => {
            if (error) {
                console.error('Erro ao iniciar o servidor:', error.message);
            } else {
                console.log('O servidor está rodando na porta 8080');
            }
        });
    }

    listenSocket() {
        this.io.on('connection', (socket) => {
            console.log('User connected =>', socket.id);
            socket.on('message', (msg) => {
                this.io.emit('message', msg);
            });
        });
    }

    setupRouters() {
        this.app.use(express.json());

     
        this.app.post('/chat', (req, res) => {
            const { userMessage } = req.body;
            const conversationId = Object.keys(this.conversations).length + 1;

            const botMessage = this.getRandomMessage("greetings");

            this.conversations[conversationId] = [
                { sender: 'User', text: userMessage },
                { sender: 'Bot', text: botMessage }
            ];

            res.status(201).send({ message: botMessage, conversationId });
        });

      
        this.app.post('/chat/:id', (req: Request, res: Response) => {
            const chatId = req.params.id;
            const { userMessage } = req.body;

            if (this.conversations[chatId]) {
                const botResponse = this.getRandomMessage("services");

                this.conversations[chatId].push({ sender: 'User', text: userMessage });
                this.conversations[chatId].push({ sender: 'Bot', text: botResponse });

                res.status(200).send({ message: botResponse });
            } else {
                res.status(404).send({ error: "Conversa não encontrada." });
            }
        });

      
        this.app.get('/chat/:id', (req, res) => {
            const chatId = req.params.id;
            const conversation = this.conversations[chatId];
            if (conversation) {
                res.status(200).send({ id: chatId, messages: conversation });
            } else {
                res.status(404).send({ error: 'Conversa não encontrada.' });
            }
        });

     
        this.app.post('/tickets', (req, res) => {
            res.status(201).send({ message: "Ticket de suporte criado." });
        });

        this.app.get('/tickets/:id', (req, res) => {
            const ticketId = req.params.id;
            res.status(200).send({ message: `Detalhes do ticket ${ticketId}.` });
        });

       
        this.app.get('/', (req, res) => {
            res.sendFile(__dirname + '/');
        });
    }

   
    getRandomMessage(category: keyof typeof responses): string {
        const messages = responses[category];
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }
}


const responses = {
    greetings: [
        "Olá! Como posso ajudar hoje?",
        "Oi! Tudo bem com você? O que gostaria de saber?",
        "Bem-vindo! Estou aqui para te ajudar com nossos serviços."
    ],
    services: [
        "Nós oferecemos pacotes de turismo personalizados para várias regiões.",
        "Nossos serviços incluem reservas de hotéis, pacotes turísticos e guias locais.",
        "Quer saber mais sobre nossos pacotes? Temos ofertas exclusivas!"
    ],
    general: [
        "Posso te ajudar com mais alguma coisa?",
        "Fique à vontade para perguntar o que precisar!",
        "Se precisar de mais informações, estou aqui para ajudar."
    ]
};

const app = new App();
app.listenServer();
