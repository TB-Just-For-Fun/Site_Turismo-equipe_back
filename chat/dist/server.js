import express from 'express';
import http from 'http';
import cors from 'cors';
import { initSocket } from './initSocket';
import chatRoutes from './routes/chatRoutes';
class App {
    app;
    server;
    io;
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = initSocket(this.server);
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use(cors({
            origin: ['http://localhost:3000', 'http://192.168.43.54:8080', 'http://192.168.43.40:3000'],
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }));
        this.app.use(express.json());
    }
    routes() {
        this.app.use('/api/chat', chatRoutes);
    }
    listen(port) {
        this.server.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    }
}
const app = new App();
app.listen(8080);
