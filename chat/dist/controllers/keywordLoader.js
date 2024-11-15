import Keyword from '../models/keywordModel';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = path.join(__dirname, '../data/keywords.json'); // Defina filePath aqui
export async function loadKeywords() {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const keywordsFromFile = JSON.parse(data);
        for (const keyword of keywordsFromFile) {
            try {
                if (!keyword.category) {
                    console.error(`A palavra-chave '${keyword.name}' não possui categoria definida.`);
                    continue;
                }
                // Garantir que 'synonyms' seja um array, se não, definir como array vazio
                if (!Array.isArray(keyword.synonyms)) {
                    keyword.synonyms = [];
                }
                // Insere a palavra-chave no banco de dados
                await Keyword.create(keyword);
                console.log(`Palavra-chave '${keyword.name}' inserida com sucesso`);
            }
            catch (insertError) {
                if (insertError instanceof Error) {
                    console.error(`Erro ao inserir a palavra-chave '${keyword.name}':`, insertError.message);
                }
                else {
                    console.error(`Erro desconhecido ao inserir a palavra-chave '${keyword.name}':`, insertError);
                }
            }
        }
        console.log('Palavras-chave carregadas com sucesso');
    }
    catch (error) {
        console.error('Erro ao carregar palavras-chave:', error);
    }
}
