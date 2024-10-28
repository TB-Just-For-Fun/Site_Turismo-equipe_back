// src/utils/normalizeString.js

export function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
}

  