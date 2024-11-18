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

        // Inicialize o Socket.IO com a instância do servidor
        this.io = initSocket(this.server); // Chame o Socket.IO

        this.middlewares();
        this.routes();
    }

    private middlewares(): void {
        // Configure o CORS para permitir acesso de IPs específicos e dispositivos móveis
        this.app.use(cors({
            origin: ['*'],  
            methods: ['GET', 'POST'],
            credentials: true,
        }));
        this.app.use(express.json());
    }

    private routes(): void {
        this.app.use('/api/chat', chatRoutes); // Configure as rotas do chat
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
        const application = new App(); // Cria a instância da classe App
        application.listen(3001); // Inicia o servidor na porta 3001
    } catch (error) {
        console.error('Erro na execução do main:', error);
    }
};

main();
