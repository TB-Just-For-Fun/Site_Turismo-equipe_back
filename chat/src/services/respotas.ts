import Response from '../models/chatModel';

export const findResponse = async (category: string): Promise<string> => {
    try {
        const response = await Response.findOne({ category });
        
        // Verifica se a resposta foi encontrada
        if (response) {
            return response.userMessage; // Retorna a mensagem do usuário se encontrada
        } else {
            // Retorna uma mensagem padrão se não encontrar a resposta
            return "Desculpe, não consegui encontrar uma resposta apropriada.";
        }
    } catch (error) {
        console.error('Erro ao buscar resposta:', error);
        // Retorna uma mensagem padrão em caso de erro
        return "Desculpe, ocorreu um erro ao tentar encontrar uma resposta.";
    }
};
