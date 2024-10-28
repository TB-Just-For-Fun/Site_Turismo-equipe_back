// src/models/chatModel.ts
import mongoose, { Schema } from 'mongoose';
const ChatSchema = new Schema({
    userMessage: { type: String, required: true },
    botResponse: { type: String, required: true },
    text: { type: String }, // Opcional
    category: { type: String } // Opcional
});
const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;
