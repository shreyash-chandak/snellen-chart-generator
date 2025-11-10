// src/utils/generateLetters.ts
export const generateRandomLetters = (length = 55, seed?: number): string => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  // Deterministic random if seed provided
  let random = Math.random;
  if (seed !== undefined) {
    let s = seed >>> 0;
    random = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 0xffffffff;
    };
  }

  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(Math.floor(random() * alphabet.length));
  }
  return result;
};
