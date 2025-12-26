
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { GridConfig } from './types';
import PaperPreview from './components/PaperPreview';
import { generateA4GridPDF } from './services/pdfService';
import { 
  FileDown, 
  Settings, 
  Info, 
  MessageSquare, 
  RefreshCw, 
  Files, 
  Maximize2, 
  Minimize2, 
  Type,
  Layout,
  Palette
} from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<GridConfig>({
    spacing: 3,
    lineColor: '#cbd5e1', // 默认浅蓝色
    lineWidth: 0.2, // 默认宽度 mm
    showCenterLine: true,
    margin: 10,
    pageCount: 1,
    orientation: 'landscape'
  });

  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const presets = [
    '#cbd5e1', // Slate 300 (Default)
    '#94a3b8', // Slate 400
    '#334155', // Slate 700
    '#3b82f6', // Blue 500
    '#ef4444', // Red 500
    '#10b981', // Emerald 500
  ];

  const handleDownload = () => {
    generateA4GridPDF(config);
  };

  const askGemini = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I am generating a ${config.pageCount}-page A4 ${config.orientation} paper. 
        Settings: ${config.spacing}mm spacing, color: ${config.lineColor}, line width: ${config.lineWidth}mm. 
        Briefly suggest creative uses for this specific combination.`
      });
      setAiResponse(response.text);
    } catch (error) {
      console.error("Gemini Error:", error);
      setAiResponse("设置已生效。当前配色和布局非常适合书法练习或结构化笔记！");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Sidebar Controls */}
      <aside className="w-full lg:w-96 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 no-print shrink-0 overflow-y-auto max-h-screen">
        <header className="pb-4 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            专业纸张生成
          </h1>
          <p className="text-sm text-slate-500 mt-1">定制您的专属书写辅助纸</p>
        </header>

        <div className="space-y-5">
          {/* Orientation Toggle */}
          <section>
            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Layout className="w-4 h-4" /> 纸张方向
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-lg">
              <button
                onClick={() => setConfig({ ...config, orientation: 'portrait' })}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  config.orientation === 'portrait' 
                  ? 'bg-white shadow-sm text-blue-600 border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Minimize2 className="w-4 h-4 rotate-90" /> 纵向 (P)
              </button>
              <button
                onClick={() => setConfig({ ...config, orientation: 'landscape' })}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  config.orientation === 'landscape' 
                  ? 'bg-white shadow-sm text-blue-600 border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Maximize2 className="w-4 h-4" /> 横向 (L)
              </button>
            </div>
          </section>

          {/* Line Color */}
          <section>
            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" /> 线条颜色
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {presets.map(color => (
                <button
                  key={color}
                  onClick={() => setConfig({ ...config, lineColor: color })}
                  className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
                    config.lineColor.toLowerCase() === color.toLowerCase() ? 'border-blue-600 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              <div className="relative w-7 h-7 rounded-full border border-slate-200 overflow-hidden bg-white hover:scale-110 transition-all">
                <input 
                  type="color" 
                  value={config.lineColor}
                  onChange={(e) => setConfig({ ...config, lineColor: e.target.value })}
                  className="absolute inset-0 w-full h-full cursor-pointer scale-150"
                  title="自定义颜色"
                />
              </div>
              <span className="ml-1 text-[10px] font-mono text-slate-400 uppercase">{config.lineColor}</span>
            </div>
          </section>

          {/* Page Count */}
          <section>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Files className="w-4 h-4" /> 打印页数
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="range" min="1" max="100" step="1"
                value={config.pageCount}
                onChange={(e) => setConfig({ ...config, pageCount: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="w-12 text-center text-sm font-bold text-blue-600 bg-blue-50 py-1 rounded">{config.pageCount}</span>
            </div>
          </section>

          {/* Line Spacing */}
          <section>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Type className="w-4 h-4" /> 行间距 (mm)
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="range" min="2" max="20" step="0.5"
                value={config.spacing}
                onChange={(e) => setConfig({ ...config, spacing: parseFloat(e.target.value) })}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="w-12 text-center text-sm font-bold text-blue-600 bg-blue-50 py-1 rounded">{config.spacing}</span>
            </div>
          </section>

          {/* Line Width */}
          <section>
            <label className="block text-sm font-semibold text-slate-700 mb-2">线条粗细 (mm)</label>
            <div className="flex gap-3 items-center">
              <input
                type="range" min="0.05" max="2.0" step="0.05"
                value={config.lineWidth}
                onChange={(e) => setConfig({ ...config, lineWidth: parseFloat(e.target.value) })}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="w-12 text-center text-sm font-bold text-blue-600 bg-blue-50 py-1 rounded">{config.lineWidth}</span>
            </div>
          </section>

          {/* Margins */}
          <section>
            <label className="block text-sm font-semibold text-slate-700 mb-2">页边距 (mm)</label>
            <input
              type="range" min="0" max="40" step="1"
              value={config.margin}
              onChange={(e) => setConfig({ ...config, margin: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </section>

          {/* Divider Switch */}
          <section className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-sm font-semibold text-slate-700">显示纵向中轴线</span>
            <button
              onClick={() => setConfig({ ...config, showCenterLine: !config.showCenterLine })}
              className={`w-11 h-6 rounded-full transition-colors relative ${config.showCenterLine ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${config.showCenterLine ? 'left-6' : 'left-1'}`} />
            </button>
          </section>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            <FileDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
            下载 PDF ({config.pageCount} 页)
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <button 
            onClick={askGemini}
            disabled={isAiLoading}
            className="w-full flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors py-2"
          >
            {isAiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
            咨询 AI 使用建议
          </button>
          {aiResponse && (
            <div className="mt-3 p-4 bg-blue-50 rounded-xl text-xs text-blue-800 leading-relaxed border border-blue-100">
              {aiResponse}
            </div>
          )}
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 overflow-y-auto flex flex-col p-4 lg:p-12 items-center justify-start bg-slate-50">
        <div className="w-full max-w-5xl flex flex-col items-center">
          <header className="mb-8 text-center no-print">
            <h2 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Live Preview</h2>
            <div className="flex flex-wrap justify-center items-center gap-4 text-slate-500 text-xs font-medium">
              <span className="bg-white px-3 py-1 rounded-full border border-slate-200">
                {config.orientation === 'landscape' ? '横向 (297x210mm)' : '纵向 (210x297mm)'}
              </span>
              <span className="bg-white px-3 py-1 rounded-full border border-slate-200" style={{ color: config.lineColor }}>
                ● 线条颜色
              </span>
              <span className="bg-white px-3 py-1 rounded-full border border-slate-200">
                间距: {config.spacing}mm
              </span>
              <span className="bg-white px-3 py-1 rounded-full border border-slate-200">
                粗细: {config.lineWidth}mm
              </span>
            </div>
          </header>

          <PaperPreview config={config} />

          <footer className="mt-12 text-slate-400 text-xs no-print text-center max-w-md">
            <div className="flex justify-center gap-4 mb-4">
              <div className="flex items-center gap-1"><Info className="w-3 h-3" /> 高精度生成</div>
              <div className="flex items-center gap-1"><Info className="w-3 h-3" /> 标准 A4 比例</div>
            </div>
            <p className="leading-relaxed">
              生成的 PDF 针对 100% 比例打印进行了优化。如果打印结果不准，请确保打印设置中的“页面缩放”选择为“无”或“实际大小”。
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
