import { forwardRef } from 'react';

interface ChartPreviewProps {
  letters: string;
}

const ChartPreview = forwardRef<HTMLDivElement, ChartPreviewProps>(
  ({ letters }, ref) => {
    const validLetters = letters.replace(/[^A-Z]/g, '');

    const generateRows = () => {
      if (validLetters.length === 0) return [];

      const rows = [];
      let charIndex = 0;

      for (let row = 0; row < 11; row++) {
        const maxSize = 120;
        const minSize = 8;
        const fontSize = maxSize - (row / 10) * (maxSize - minSize);

        const letterCount = Math.max(1, Math.ceil((row + 1) / 2));
        const rowLetters = [];

        for (let i = 0; i < letterCount; i++) {
          if (charIndex >= validLetters.length) {
            charIndex = 0;
          }
          rowLetters.push(validLetters[charIndex]);
          charIndex++;
        }

        rows.push({ fontSize, letters: rowLetters.join('') });
      }

      return rows;
    };

    const rows = generateRows();

    return (
      <div
        ref={ref}
        className="bg-white p-12 min-h-[600px] flex flex-col items-center justify-center"
        id="chart-preview"
      >
        {validLetters.length === 0 ? (
          <p className="text-slate-400 text-lg">Enter letters to generate your chart</p>
        ) : (
          <div className="space-y-3 text-center w-full">
            {rows.map((row, index) => (
              <div
                key={index}
                className="font-bold tracking-widest transition-all duration-300"
                style={{
                  fontSize: `${row.fontSize}px`,
                  lineHeight: '1.1',
                  fontFamily: 'serif',
                  color: '#1e293b',
                  letterSpacing: `${Math.max(2, row.fontSize / 20)}px`,
                }}
              >
                {row.letters}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ChartPreview.displayName = 'ChartPreview';

export default ChartPreview;
