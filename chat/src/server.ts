import express, { Application } from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import chatRoutes from './routes/chatRoutes';
import initSocket from './initSocket';

class App {
    public app: Application;
    public server: http.Server;
    public io: Server;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        
        // Initialize Socket.IO with the server instance
        this.io = initSocket(this.server); // Initialize Socket.IO here

        this.middlewares();
        this.routes();
    }

    private middlewares(): void {
        this.app.use(cors({
            origin: ['http://localhost:3000', 'http://192.168.43.54:3000'],
            methods: ['GET', 'POST'],
            credentials: true,
        }));
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

// Função principal para conectar ao banco de dados e inicializar o servidor
const main = async () => {
    try {

        const application = new App(); // Criar instância da classe App
        application.listen(3001); // Iniciar servidor na porta 3001
    } catch (error) {
        console.error('Erro na execução do main:', error);
    }
};

main();
