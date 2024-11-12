// src/utils.ts
import connectDatabase from '../src/database/db'; // Importação padrão
connectDatabase();
export function normalizeString(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function getRandomMessage(responses: any[]): string {
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex].message; // Assumindo que o campo da resposta é `message`
}


// utils.ts

export function randomResponse(responses: string[]): string {
  return responses[0]; // Apenas retorna o primeiro item para teste
}

