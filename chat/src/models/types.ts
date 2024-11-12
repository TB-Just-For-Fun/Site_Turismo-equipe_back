// src/models/types.ts (ou models.ts, dependendo da estrutura)

export interface IntentModel {
    intents: string[];
    examples: string[];
    response: string;
    // Outras propriedades de IntentModel aqui
}

export interface ResponsesModel extends IntentModel {
    // Outras propriedades de ResponsesModel aqui
}

