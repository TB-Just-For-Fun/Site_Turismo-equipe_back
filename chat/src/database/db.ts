import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        
        // Verifica se a URL de conexão está disponível
        if (!mongoURI) {
            throw new Error('A URL de conexão do MongoDB não foi encontrada no arquivo .env');
        }

        // Conecta ao MongoDB com opções para maior estabilidade
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 30000, // Tempo limite para selecionar servidor (30 segundos)
            socketTimeoutMS: 45000,        // Tempo limite do socket (45 segundos)
        });

        console.log('Conexão com MongoDB bem-sucedida!');
    } catch (error) {
        console.error('Erro ao conectar com MongoDB:', error);
        // Encerra o processo em caso de erro de conexão
        process.exit(1);
    }
};

// Inicia a conexão
connectDB();

export default connectDB;
