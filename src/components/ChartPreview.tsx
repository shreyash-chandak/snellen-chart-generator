// src/components/ChartPreview.tsx
import { forwardRef, useMemo, useEffect, useState } from 'react';
import { generateRandomLetters } from '../utils/generateLetters';

interface ChartPreviewProps {
  letters: string;
}

function hashStringToSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

const FONT_SIZES = [152, 130, 108, 87, 65, 43, 33, 21, 15, 9];
const TOTAL_ROWS = FONT_SIZES.length;
const TOTAL_LETTERS = (TOTAL_ROWS * (TOTAL_ROWS + 1)) / 2; // 55

const ChartPreview = forwardRef<HTMLDivElement, ChartPreviewProps>(({ letters }, ref) => {
  const validInput = (letters || '').replace(/[^A-Z]/g, '');

  // Generate deterministic preview letters
  const filled = useMemo(() => {
    if (!validInput) return '';
    const needed = Math.max(0, TOTAL_LETTERS - validInput.length);
    const seed = hashStringToSeed(validInput);
    const suffix = generateRandomLetters(needed, seed);
    return (validInput + suffix).slice(0, TOTAL_LETTERS);
  }, [validInput]);

  // Construct rows
  const rows = useMemo(() => {
    if (!filled) return [];
    const arr: { fontSize: number; letters: string }[] = [];
    let idx = 0;
    for (let row = 0; row < TOTAL_ROWS; row++) {
      const count = row + 1;
      const fontSize = FONT_SIZES[row];
      const lettersForRow = filled.slice(idx, idx + count).split('').join(' ');
      idx += count;
      arr.push({ fontSize, letters: lettersForRow });
    }
    return arr;
  }, [filled]);

  // Handle scaling for preview
  const [scale, setScale] = useState(0.5); // default zoom-out factor

  useEffect(() => {
    const updateScale = () => {
      const container = document.getElementById('preview-container');
      if (container) {
        const availableHeight = container.clientHeight;
        // Adjust scale based on available height
        setScale(Math.min(availableHeight / 1100, 0.7)); // max zoom 0.6, fits even small screens
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // --- CSS for print layout ---
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        @page {
          size: A4 portrait;
          margin: 0;
        }
        body {
          background: white !important;
        }
        #chart-print-container {
          width: 210mm;
          height: 297mm;
          display: flex;
          justify-content: center;
          align-items: center;
          background: white;
        }
        #chart-content {
          transform: scale(0.95);
          transform-origin: center center;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      id="preview-container"
      ref={ref}
      className="flex items-center justify-center bg-slate-100"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      }}
    >
      {validInput.length === 0 ? (
        <div
          className="bg-white flex items-center justify-center"
          style={{
            width: 'min(420px, 44vw)',
            height: 'min(560px, 66vh)',
            borderRadius: '8px',
          }}
        >
          <p className="text-slate-400">Enter letters to generate your chart</p>
        </div>
      ) : (
        <div
          id="chart-print-container"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease',
          }}
        >
          <div
            id="chart-content"
            className="bg-white flex flex-col items-center justify-center"
            style={{
              width: '210mm',
              height: '297mm',
              padding: '2rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            {rows.map((r, i) => (
              <div
                key={i}
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontWeight: 'bold',
                  fontSize: `${r.fontSize}px`,
                  lineHeight: 1,
                  color: '#000',
                  letterSpacing: `${Math.max(4, r.fontSize / 8)}px`,
                  whiteSpace: 'nowrap',
                  display: 'block',
                  textAlign: 'center',
                }}
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
