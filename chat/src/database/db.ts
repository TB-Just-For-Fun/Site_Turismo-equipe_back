import mongoose from 'mongoose';

const connectDatabase = async () => {
  console.log("Aguardando conexão com o banco de dados...");

  const dbUrl = "mongodb+srv://Aldasmix:Aldasmix@cluster1.vle7k.mongodb.net/justforfun";

  try {
    await mongoose.connect(dbUrl, {
    });
    console.log('Conexão com MongoDB Atlas bem-sucedida');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1); 
  }
};

export default connectDatabase;
