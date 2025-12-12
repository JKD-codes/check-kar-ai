import React, { useState } from 'react';
import { AnalysisResult, AnalysisState, UploadedImage, HistoryItem } from './types';
import { analyzeImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import AnalysisResultView from './components/AnalysisResultView';
import HistoryView from './components/HistoryView';
import { 
  ScanEye, AlertOctagon, RefreshCw, Github, Aperture, Activity, Search,
  Info, BookOpen, Layers, Cpu, Eye, Fingerprint, BrainCircuit, Clock
} from 'lucide-react';

type View = 'home' | 'how-it-works' | 'about' | 'history';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [analysisState, setAnalysisState] = useState<AnalysisState>(AnalysisState.IDLE);
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addToHistory = (img: UploadedImage, res: AnalysisResult) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      image: img,
      result: res
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const handleImageSelected = async (file: File, base64: string, preview: string) => {
    const newImage = { file, base64, previewUrl: preview, mimeType: file.type };
    setCurrentImage(newImage);
    setAnalysisState(AnalysisState.ANALYZING);
    setError(null);
    setResult(null);
    
    // Switch to analyzer view if not already there
    if (currentView !== 'home') setCurrentView('home');

    try {
      const data = await analyzeImage(base64, file.type);
      setResult(data);
      setAnalysisState(AnalysisState.COMPLETE);
      addToHistory(newImage, data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the image. Please ensure the API key is valid or try a different image.");
      setAnalysisState(AnalysisState.ERROR);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setCurrentImage(item.image);
    setResult(item.result);
    setAnalysisState(AnalysisState.COMPLETE);
    setCurrentView('home');
  };

  const handleReset = () => {
    setAnalysisState(AnalysisState.IDLE);
    setCurrentImage(null);
    setResult(null);
    setError(null);
  };

  const NavLink = ({ view, label, icon: Icon }: { view: View; label: string; icon?: React.ElementType }) => (
    <button 
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
        currentView === view ? 'text-blue-400' : 'text-slate-300 hover:text-white'
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => setCurrentView('home')} 
            className="flex items-center gap-2 text-blue-500 hover:opacity-80 transition-opacity"
          >
            <ScanEye className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight text-white">Check-Kar <span className="text-blue-500">AI</span></span>
          </button>
          
          <nav className="hidden md:flex items-center gap-8">
            <NavLink view="home" label="Analyzer" />
            <NavLink view="history" label="History" />
            <NavLink view="how-it-works" label="How it works" />
            <NavLink view="about" label="About" />
            <div className="h-4 w-px bg-slate-700"></div>
            <a 
              href="https://github.com/JKD-codes/ai-detector" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center">
        
        {/* --- VIEW: HOME (ANALYZER) --- */}
        {currentView === 'home' && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            {/* Hero Section (only visible when idle) */}
            {analysisState === AnalysisState.IDLE && (
              <div className="text-center mb-12 max-w-3xl animate-fade-in-up">
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold tracking-wide uppercase">
                  Powered by Gemini 2.5
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200 tracking-tight">
                  Is it Real or AI?
                </h1>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                  Detect deepfakes and AI-generated imagery instantly with professional-grade forensics analysis. 
                  Our advanced model scans for diffusion artifacts, lighting inconsistencies, and anatomical errors.
                </p>
              </div>
            )}

            {/* Sophisticated Scanning Animation */}
            {analysisState === AnalysisState.ANALYZING && currentImage && (
              <div className="mb-8 relative w-full max-w-2xl rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl mx-auto bg-slate-900 group">
                {/* Source Image - Darkened */}
                <div className="relative aspect-video w-full overflow-hidden">
                    <img 
                      src={currentImage.previewUrl} 
                      className="w-full h-full object-cover opacity-30 filter grayscale contrast-125" 
                      alt="Scanning" 
                    />
                    
                    {/* Grid Overlay */}
                    <div className="absolute inset-0 scanner-grid opacity-50 z-10"></div>
                    
                    {/* Moving Scanner Bar */}
                    <div className="scanner-bar"></div>

                    {/* HUD Elements */}
                    <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
                      {/* Top HUD */}
                      <div className="flex justify-between items-start">
                          <div className="bg-slate-900/80 backdrop-blur border border-blue-500/30 p-2 rounded text-xs font-mono text-blue-400 flex items-center gap-2">
                            <Activity className="w-4 h-4 animate-pulse" />
                            SCANNING_SECTORS...
                          </div>
                          <div className="text-xs font-mono text-slate-500">
                            {new Date().toISOString().split('T')[0]} <span className="text-blue-500">REL_01</span>
                          </div>
                      </div>

                      {/* Center Reticle */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-blue-500/20 rounded-full flex items-center justify-center">
                          <div className="w-28 h-28 border border-blue-500/40 rounded-full border-dashed animate-spin-slow"></div>
                          <div className="absolute w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                      </div>

                      {/* Bottom HUD */}
                      <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                                <Aperture className="w-3 h-3" />
                                <span>NOISE_PATTERN_ANALYSIS</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                                <Search className="w-3 h-3" />
                                <span>DIFFUSION_ARTIFACTS</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-blue-500 crt-flicker">PROCESSING</div>
                            <div className="text-xs font-mono text-blue-300">NEURAL_ENGINE_ACTIVE</div>
                          </div>
                      </div>
                    </div>
                    
                    {/* Corner Brackets */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-blue-500 z-20"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-blue-500 z-20"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-blue-500 z-20"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-500 z-20"></div>
                </div>
              </div>
            )}

            {/* Upload Section - Hidden when analyzing or complete */}
            {analysisState !== AnalysisState.COMPLETE && analysisState !== AnalysisState.ANALYZING && (
              <div className="w-full">
                  <ImageUploader 
                    onImageSelected={handleImageSelected} 
                    analysisState={analysisState} 
                  />
              </div>
            )}

            {/* Results Section */}
            {analysisState === AnalysisState.COMPLETE && result && currentImage && (
              <div className="w-full space-y-8 animate-fade-in-up">
                <div className="flex justify-between items-center max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-white">Analysis Report</h2>
                    <button 
                      onClick={handleReset}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-all border border-slate-700"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Analyze New Image
                    </button>
                </div>
                <AnalysisResultView result={result} imagePreview={currentImage.previewUrl} />
              </div>
            )}

            {/* Error State */}
            {analysisState === AnalysisState.ERROR && (
              <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-xl max-w-md text-center">
                <AlertOctagon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-400 mb-2">Analysis Failed</h3>
                <p className="text-red-200/80 mb-6">{error}</p>
                <button 
                    onClick={handleReset}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- VIEW: HISTORY --- */}
        {currentView === 'history' && (
          <HistoryView 
            history={history} 
            onSelect={handleHistorySelect} 
            onClear={() => setHistory([])} 
          />
        )}

        {/* --- VIEW: HOW IT WORKS --- */}
        {currentView === 'how-it-works' && (
          <div className="max-w-5xl w-full animate-fade-in space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">
                Behind the Detection
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Check-Kar AI combines advanced computer vision with the semantic understanding of Gemini 2.5 to analyze images at a pixel and conceptual level.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                  <Layers className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">1. Multi-Layer Scanning</h3>
                <p className="text-slate-400 leading-relaxed">
                  The image is decomposed into texture, lighting, and noise layers. We analyze local pixel relationships to find statistical irregularities common in diffusion models.
                </p>
              </div>

              <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                  <Eye className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">2. Semantic Inconsistency</h3>
                <p className="text-slate-400 leading-relaxed">
                  Unlike traditional pixel-scanners, our model understands context. It looks for "logic errors" like inconsistent shadows, impossible anatomy, or nonsensical background text.
                </p>
              </div>

              <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 mb-6">
                  <Cpu className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">3. Probabilistic Verdict</h3>
                <p className="text-slate-400 leading-relaxed">
                  We generate a detailed confidence score based on the weighted sum of all detected artifacts, giving you a transparent reason why an image is flagged as AI or Human.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
               <div className="flex-1 space-y-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Fingerprint className="w-6 h-6 text-blue-400" />
                    Why it matters
                  </h3>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    As generative AI becomes indistinguishable from reality, the line between truth and fabrication blurs. Check-Kar aims to provide a reliable "second opinion" for journalists, researchers, and everyday users to verify the authenticity of visual media.
                  </p>
                  <button 
                    onClick={() => setCurrentView('home')}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
                  >
                    Start Detecting
                  </button>
               </div>
               <div className="flex-1 w-full max-w-sm">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8 relative overflow-hidden">
                     <div className="absolute inset-0 bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
                     <BrainCircuit className="w-full h-full text-blue-500/20" />
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* --- VIEW: ABOUT --- */}
        {currentView === 'about' && (
          <div className="max-w-2xl w-full mx-auto animate-fade-in pt-8">
            <div className="group bg-slate-800 rounded-3xl p-1 border border-slate-700 shadow-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:border-blue-500/50">
               <div className="bg-slate-900/50 p-8 md:p-12 text-center rounded-[22px] transition-colors duration-500 group-hover:bg-slate-900/80">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-1 mb-8 shadow-xl shadow-blue-500/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-blue-500/40">
                     <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center overflow-hidden">
                        <ScanEye className="w-16 h-16 text-blue-400 transition-colors duration-500 group-hover:text-white" />
                     </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-3 transition-all duration-300 group-hover:text-blue-400 group-hover:tracking-wide">Jagrat Mogaveera</h2>
                  
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                     <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 group-hover:bg-blue-500/20 group-hover:border-blue-500/40">
                       Creator
                     </span>
                     <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 group-hover:bg-purple-500/20 group-hover:border-purple-500/40">
                       Developer
                     </span>
                  </div>
                  
                  <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                     <p>
                       Check-Kar AI was conceptualized and built by <strong className="text-white group-hover:text-blue-300 transition-colors">Jagrat Mogaveera</strong>, an Information Tech student currently studying at <strong className="text-white group-hover:text-blue-300 transition-colors">TCSC</strong> (Thakur College of Science and Commerce).
                     </p>
                     <p className="text-slate-400 text-base">
                       This project represents the intersection of modern web development and state-of-the-art artificial intelligence. It serves as a practical application of forensic image analysis to solve real-world challenges in digital media authentication.
                     </p>
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-800 flex justify-center gap-6">
                     <a href="https://github.com/JKD-codes" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 hover:bg-blue-600">
                        <Github className="w-6 h-6" />
                     </a>
                     <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 hover:bg-purple-600">
                        <BookOpen className="w-6 h-6" />
                     </a>
                     <a href="mailto:jagratjkd@gmail.com" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 hover:bg-pink-600">
                        <Info className="w-6 h-6" />
                     </a>
                  </div>
               </div>
            </div>
            
            <div className="mt-12 text-center">
               <p className="text-slate-500 text-sm">
                  Built with React, TypeScript, Tailwind CSS, and Google Gemini API.
               </p>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-12 bg-[#0f172a]">
         <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Check-Kar AI Detector. All rights reserved.</p>
            <p className="mt-2">
              Disclaimer: AI detection is probabilistic. Results should be used as indicators, not definitive proof.
            </p>
         </div>
      </footer>
    </div>
  );
};

export default App;
