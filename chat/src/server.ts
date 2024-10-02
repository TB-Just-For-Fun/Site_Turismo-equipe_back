import express, { Application } from "express";
import http from 'http';
import { Server } from 'socket.io';
import connectDatabase from './database/db'; 
import cors from 'cors';
import chatRoutes from './routes/chatRoutes'; 
import initSocket from './initSocket';



class App {
    private app: Application;
    private http: http.Server;
    private io: Server;

    constructor() {
        this.app = express();
        this.http = http.createServer(this.app);
        this.io = new Server(this.http);
        this.middlewares(); 
        this.listenSocket();
        this.setupRouters();
    }

    private middlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
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

        this.app.use('/api/chat', chatRoutes);
        this.app.use('/api/tickets', chatRoutes);
    }
}

connectDatabase();

const app = new App();
app.listenServer();
