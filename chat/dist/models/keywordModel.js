import mongoose, { Schema } from 'mongoose';
const keywordSchema = new Schema({
    keyword: { type: String, required: true, unique: true },
    response: { type: String, required: true },
    synonyms: { type: [String], default: [] }, // Definindo 'synonyms' como um array de strings, com valor padrão de array vazio
});
// Criação do modelo Keyword com verificação para evitar redefinir se o modelo já existe
const Keyword = mongoose.models.Keyword || mongoose.model('Keyword', keywordSchema);
export default Keyword;
