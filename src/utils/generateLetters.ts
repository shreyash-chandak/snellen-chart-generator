// src/utils/generateLetters.ts
export const generateRandomLetters = (length = 36, seed?: number): string => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  // If seed provided, use a simple LCG for deterministic output.
  // Otherwise use Math.random.
  if (typeof seed === 'number') {
    // LCG parameters (32-bit)
    let s = seed >>> 0;
    for (let i = 0; i < length; i++) {
      s = (1664525 * s + 1013904223) >>> 0;
      const idx = s % alphabet.length;
      result += alphabet[idx];
    }
  } else {
    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * alphabet.length);
      result += alphabet[idx];
    }
  }

  return result;
};
