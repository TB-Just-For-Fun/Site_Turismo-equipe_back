// src/utils.ts
export function normalizeString(input) {
    return input.toLowerCase().replace(/[^a-z0-9]/g, ''); // Remove caracteres especiais e coloca tudo em minúsculas
}
export function getRandomMessage(responses) {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex].message; // Assumindo que o campo da resposta é `message`
}
