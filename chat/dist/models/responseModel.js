import { Schema, model } from 'mongoose';
// Defina o esquema
const responseSchema = new Schema({
    messages: { type: [String], required: true },
    category: { type: String, required: true } // Certifique-se de que essa propriedade existe
});
// Crie e exporte o modelo
const ResponseModel = model('Response', responseSchema);
export default ResponseModel; // Certifique-se de que está exportando corretamente
