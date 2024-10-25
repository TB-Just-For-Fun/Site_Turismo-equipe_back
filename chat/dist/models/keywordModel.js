import { Schema, model } from 'mongoose';
const keywordSchema = new Schema({
    word: { type: String, required: true },
    category: { type: String, required: true }
});
const Keyword = model('Keyword', keywordSchema);
export default Keyword;
