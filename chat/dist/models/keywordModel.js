import { Schema, model } from 'mongoose';
const keywordSchema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }
});
const KeywordModel = model('Keyword', keywordSchema);
export default KeywordModel;
