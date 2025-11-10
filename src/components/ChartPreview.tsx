// src/components/ChartPreview.tsx
import { forwardRef, useMemo } from 'react';
import { generateRandomLetters } from '../utils/generateLetters';

interface ChartPreviewProps {
  letters: string; // user-typed letters (A-Z only expected)
}

function hashStringToSeed(s: string): number {
  // simple hash -> 32-bit int
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

const ChartPreview = forwardRef<HTMLDivElement, ChartPreviewProps>(({ letters }, ref) => {
  const validInput = (letters || '').replace(/[^A-Z]/g, '');

  // total letters required for 8 rows: 1+2+...+8 = 36
  const TOTAL_LETTERS = 36;
  const TOTAL_ROWS = 8;

  // compute the filled 36-letter string deterministically based on validInput
  const filled36 = useMemo(() => {
    if (!validInput) return ''; // empty preview if no input

    const needed = Math.max(0, TOTAL_LETTERS - validInput.length);

    if (needed === 0) {
      return validInput.slice(0, TOTAL_LETTERS);
    }

    // deterministic seed from input so preview doesn't flicker randomly while typing
    const seed = hashStringToSeed(validInput);
    const suffix = generateRandomLetters(needed, seed);
    return (validInput + suffix).slice(0, TOTAL_LETTERS);
  }, [validInput]);

  const rows = useMemo(() => {
    if (!filled36) return [];

    const arr: { fontSize: number; letters: string }[] = [];
    let idx = 0;

    // Exponential interpolation from maxSize -> minSize
    const maxSize = 100 * 0.95; // px (scaled overall)
    const minSize = 18 * 0.95;

    for (let row = 0; row < TOTAL_ROWS; row++) {
      const t = row / (TOTAL_ROWS - 1); // 0..1
      // exponential interpolation: size = max * (min/max)^(t)
      const ratio = minSize / maxSize;
      const fontSize = Math.max(10, Math.round(maxSize * Math.pow(ratio, t)));

      const count = row + 1;
      const lettersForRow = filled36.slice(idx, idx + count).split('').join(' ');
      idx += count;

      arr.push({ fontSize, letters: lettersForRow });
    }

    return arr;
  }, [filled36]);

  return (
    <div
      ref={ref}
      id="chart-preview"
      className="flex items-center justify-center p-6"
      style={{ background: 'transparent' }}
    >
      {validInput.length === 0 ? (
        <div
          className="bg-white rounded-lg shadow-sm flex items-center justify-center"
          style={{
            width: 'min(420px, 44vw)',
            height: 'min(560px, 66vh)',
            transform: 'scale(0.95)',
          }}
        >
          <p className="text-slate-400">Enter letters to generate your chart</p>
        </div>
      ) : (
        <div
          className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center overflow-hidden"
          style={{
            width: 'min(420px, 44vw)',
            padding: '18px',
            transform: 'scale(0.95)',
            boxSizing: 'border-box',
            // keep chart area white for printing
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {rows.map((r, i) => (
              <div
                key={i}
                style={{
                  fontFamily: '"DejaVu Sans", Arial, sans-serif',
                  fontSize: `${r.fontSize}px`,
                  lineHeight: 1,
                  color: '#111',
                  letterSpacing: `${Math.max(2, r.fontSize / 18)}px`,
                  fontWeight: 400,
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
                aria-hidden
              >
                {r.letters}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

ChartPreview.displayName = 'ChartPreview';
export default ChartPreview;
