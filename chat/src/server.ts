import express, { Application } from "express";
import http from 'http';
import cors from 'cors';
import { initSocket } from './initSocket.js';
import connectDatabase from './database/db.js';
import chatRoutes from './routes/chatRoutes.js';

// Configuração do Express
const appExpress = express();
appExpress.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['content-type'],
    credentials: true
}));

// Classe App que controla o servidor
class App {
    private app: Application;
    private http: http.Server;

    constructor() {
        this.app = express();
        this.http = http.createServer(this.app);
        this.middlewares();
        this.setupRouters();
        this.listenServer();
    }

    private middlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
    }

    listenServer() {
        // Iniciando o servidor HTTP
        this.http.listen(8080, () => {
            console.log('O servidor está rodando na porta 8080');
        });

        // Tratamento de erros do servidor
        this.http.on('error', (error: any) => {
            console.error('Erro ao iniciar o servidor:', error.message);
        });

        // Iniciando o WebSocket
        initSocket(this.http); // Passando o servidor HTTP para o WebSocket
    }

    setupRouters() {
        this.app.use('/api/chat', chatRoutes);
        this.app.use('/api/tickets', chatRoutes);
    }
}

// Conectando ao banco de dados e iniciando a aplicação
connectDatabase();
const serverApp = new App();
