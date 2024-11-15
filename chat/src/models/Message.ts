import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['sent', 'received'], required: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;
