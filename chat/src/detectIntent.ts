// detectIntent.ts
import { intents } from './seed';

export async function detectIntent(userMessage: string): Promise<string> {
    const normalizedMessage = userMessage.toLowerCase();

    for (const intent of intents) {
        for (const example of intent.examples) {
            if (normalizedMessage.includes(example.toLowerCase())) {
                console.log(`Intenção detectada: ${intent.intent}`);
                return intent.response;
            }
        }
    }

    console.log("Nenhuma intenção encontrada");
    return "Desculpe, não entendi a sua pergunta. Pode reformular?";
}
