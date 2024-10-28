// src/models/chatModel.ts
import mongoose, { Schema, Document } from 'mongoose';

interface ChatResponse extends Document {
    userMessage: string;
    botResponse: string;
    text?: string;
    category?: string;
}

const ChatSchema = new Schema({
    userMessage: { type: String, required: true },
    botResponse: { type: String, required: true },
    text: { type: String }, // Opcional
    category: { type: String } // Opcional
});

const Chat = mongoose.model<ChatResponse>('Chat', ChatSchema);
export default Chat;
