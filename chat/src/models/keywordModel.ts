import { Schema, model, Document } from 'mongoose';

// Interface para o esquema Keyword
export interface IKeyword extends Document {
    word: string;
    category: string;
}

const keywordSchema = new Schema<IKeyword>({
    word: { type: String, required: true },
    category: { type: String, required: true }
});

const Keyword = model<IKeyword>('Keyword', keywordSchema);
export default Keyword;
