import express, { Application } from "express";
import http from 'http';
import { Server } from 'socket.io';
class App {

    private app: Application;
    private http: http.Server;
    private io: Server;

    constructor() {
        this.app = express();
        this.http = http.createServer(this.app);
        this.io = new Server(this.http);
        this.listenSocket();
        this.setupRouters();
    }

    listenServer() {
        this.http.listen(3000, (err?: Error) => {
            if (err) {
                console.error('Erro ao iniciar o servidor:', err.message);
            } else {
                console.log('O servidor está rodando na porta 3000');
            }
        });
    }
    listenSocket() {
        this.io.on('connection', (socket)=>{
            console.log('user connected =>', socket.id);

            socket.on('message', (msg) => {
this.io.emit('message', msg)
            });
        });
    }
    setupRouters() {
        this.app.on('/', (req, res) => {
            res.sendFile(__dirname + './');
        });
    }
}
const app = new App();

app.listenServer();