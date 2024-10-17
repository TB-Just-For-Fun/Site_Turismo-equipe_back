import express, { Application } from 'express';
import http from 'http';
import cors from 'cors';
import database from './database/db';
import { Server } from 'socket.io';
import { initSocket } from './initSocket';
import chatRoutes from './routes/chatRoutes'; 
import connectDatabase from './database/db.js';

class App {
    public app: Application;
    public server: http.Server;
    public io: Server;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = initSocket(this.server); 

        this.middlewares();
        this.routes();
    }

    
    private middlewares(): void {
        this.app.use(cors({
            origin: ['http://localhost:3001', 'http://192.168.193.251:3001', 'http://192.168.100.26:3000'],
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }));
// Garante que o CORS esteja corretamente configurado
        this.app.options('*', cors()); // Lida com requisições preflight
        this.app.use(express.json());

        
    }

   
    private routes(): void {
        this.app.use('/api/chat', chatRoutes); 
    }

  
    public listen(port: number): void {
        this.server.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    }
}
connectDatabase();
const app = new App();
app.listen(3001);


