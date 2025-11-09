import { useState, useRef } from 'react';
import { Eye, Shuffle, Download } from 'lucide-react';
import ChartPreview from './components/ChartPreview';
import { downloadChart } from './utils/downloadChart';
import { generateRandomLetters } from './utils/generateLetters';

function App() {
  const [letters, setLetters] = useState('EFPTOZ');
  const [fileType, setFileType] = useState<'png' | 'pdf' | 'svg'>('png');
  const previewRef = useRef<HTMLDivElement>(null);

  const handleRandomize = () => {
    const randomLetters = generateRandomLetters();
    setLetters(randomLetters);
  };

  const handleDownload = async () => {
    if (previewRef.current) {
      await downloadChart(previewRef.current, fileType);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Eye className="w-10 h-10 text-slate-700" />
            <h1 className="text-4xl font-light text-slate-800 tracking-tight">Snellen Chart Generator</h1>
          </div>
          <p className="text-slate-600 font-light">Create custom eye test charts instantly</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Chart Letters
              </label>
              <textarea
                value={letters}
                onChange={(e) => setLetters(e.target.value.toUpperCase())}
                className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all resize-none font-mono text-lg"
                placeholder="Enter letters for your chart (e.g., EFPTOZ)"
              />
              <p className="mt-2 text-xs text-slate-500">
                Enter letters A-Z. Each character will be sized progressively smaller.
              </p>
            </div>

            <button
              onClick={handleRandomize}
              className="w-full bg-slate-700 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Shuffle className="w-5 h-5" />
              Randomize Letters
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Download Format
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as 'png' | 'pdf' | 'svg')}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="png">PNG Image</option>
                <option value="pdf">PDF Document</option>
                <option value="svg">SVG Vector</option>
              </select>
            </div>

            <button
              onClick={handleDownload}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-5 h-5" />
              Download Chart
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-sm font-medium text-slate-700 mb-4">Live Preview</h2>
            <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
              <ChartPreview letters={letters} ref={previewRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
