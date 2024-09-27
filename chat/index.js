"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./database/db"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, db_1.default)();
fetch('/chat', { method: 'POST' });
app.use('/chat', (req, res) => {
    res.send("Bem-vindo ao chat!");
});
const port = 8080;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
