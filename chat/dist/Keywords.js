// keywords.ts
export const keywords = {
    greetings: ["oi", "olá", "bom dia", "boa tarde", "boa noite", "alô", "saudações"],
    help: ["ajuda", "ajudar", "informações", "dúvidas", "preciso de ajuda", "assistência"],
    reservations: ["reserva", "reservar", "reservas", "fazer uma reserva", "pacotes"],
    hotels: ["hotel", "hospedagem", "hospedar", "hotéis", "estadia", "acomodação"],
    login: ["login", "logar", "entrar", "acesso", "conta"],
    unknown: [] // para capturar outras mensagens
};
// models/keywordModel.js
import mongoose from 'mongoose';
const keywordSchema = new mongoose.Schema({
    keyword: { type: String, required: true, unique: true },
    category: { type: String, required: true }
});
const Keyword = mongoose.model('Keyword', keywordSchema);
export default Keyword;
