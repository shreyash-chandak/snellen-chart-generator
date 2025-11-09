const COMMON_LETTERS = 'CDEFLOPTZ';
const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generateRandomLetters = (): string => {
  const length = Math.floor(Math.random() * 4) + 5;
  let result = '';

  for (let i = 0; i < length; i++) {
    const useCommon = Math.random() > 0.3;
    const sourceLetters = useCommon ? COMMON_LETTERS : ALL_LETTERS;
    const randomIndex = Math.floor(Math.random() * sourceLetters.length);
    result += sourceLetters[randomIndex];
  }

  return result;
};
