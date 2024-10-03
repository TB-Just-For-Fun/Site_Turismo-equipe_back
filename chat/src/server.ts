import express, { Application } from "express";
import http from 'http';
import { Server } from 'socket.io';
import connectDatabase from './database/db.js';
import chatRoutes from './routes/chatRoutes.js';
import initSocket from './initSocket.js';
import cors from 'cors';

class App {
    private app: Application;
    private http: http.Server;
    private io: Server;

    constructor() {
        this.app = express();
        this.http = http.createServer(this.app);
        this.io = new Server(this.http);
        this.middlewares(); 
        this.setupRouters();
        this.listenSocket();
    }

    private middlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
    }

    listenServer() {
        this.http.listen(8080, () => {
            console.log('O servidor está rodando na porta 8080');
        });

        // Separando o tratamento de erro
        this.http.on('error', (error: any) => {
            console.error('Erro ao iniciar o servidor:', error.message);
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
        this.app.use('/api/chat', chatRoutes);
        this.app.use('/api/tickets', chatRoutes); // Substitua se necessário
    }
}

connectDatabase();

const app = new App();
app.listenServer();
