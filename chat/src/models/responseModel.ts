import { Schema, model, Document } from 'mongoose';

// Defina a interface do documento
interface IMessageResponse extends Document {
    messages: string[]; // Array de mensagens
    category: string; // Categoria da resposta
}

// Defina o esquema
const responseSchema = new Schema<IMessageResponse>({
    messages: { type: [String], required: true },
    category: { type: String, required: true } // Certifique-se de que essa propriedade existe
});

// Crie e exporte o modelo
const ResponseModel = model<IMessageResponse>('Response', responseSchema);
export default ResponseModel; // Certifique-se de que está exportando corretamente
