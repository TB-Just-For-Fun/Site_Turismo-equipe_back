"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async () => {
    console.log("Aguardando conexão com o banco de dados...");
    const dbUrl = "mongodb+srv://Aldasmix:Aldasmix@cluster1.vle7k.mongodb.net/justforfun";
    try {
        await mongoose_1.default.connect(dbUrl, {});
        console.log('Conexão com MongoDB Atlas bem-sucedida');
    }
    catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1);
    }
};
exports.default = connectDatabase;
