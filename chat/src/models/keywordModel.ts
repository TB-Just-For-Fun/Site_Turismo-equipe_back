import mongoose, { Schema, Document } from 'mongoose';

export interface IKeyword extends Document {
  keyword: string;     // A palavra-chave
  response: string;    // A resposta associada à palavra-chave
  synonyms?: string[]; // Sinônimos da palavra-chave, agora opcional
}

const keywordSchema = new Schema<IKeyword>({
  keyword: { type: String, required: true, unique: true },
  response: { type: String, required: true },
  synonyms: { type: [String], default: [] }, // Definindo 'synonyms' como um array de strings, com valor padrão de array vazio
});

// Criação do modelo Keyword com verificação para evitar redefinir se o modelo já existe
const Keyword = mongoose.models.Keyword || mongoose.model<IKeyword>('Keyword', keywordSchema);

export default Keyword;
