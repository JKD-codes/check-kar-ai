import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Calendar, ArrowRight, Trash2, ShieldAlert, ShieldCheck, AlertTriangle, Siren } from 'lucide-react';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect, onClear }) => {
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'LIKELY_AI': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'LIKELY_HUMAN': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'LIKELY_AI': return <ShieldAlert className="w-4 h-4" />;
      case 'LIKELY_HUMAN': return <ShieldCheck className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (history.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-24 animate-fade-in">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-slate-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No History Yet</h2>
        <p className="text-slate-400 text-center max-w-md">
          Images you analyze during this session will appear here. Start by uploading an image in the Analyzer tab.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-500" />
            Analysis History
          </h2>
          <p className="text-slate-400 mt-1">
            Recent scans from this session ({history.length} items)
          </p>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className="group bg-slate-800 rounded-xl border border-slate-700 overflow-hidden cursor-pointer hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 hover:-translate-y-1"
          >
            {/* Image Preview */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <img 
                src={item.image.previewUrl} 
                alt="History item" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              
              {/* Overlay Date */}
              <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur rounded text-xs text-slate-300 flex items-center gap-1.5 border border-white/10">
                <Calendar className="w-3 h-3" />
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 border ${getVerdictColor(item.result.verdict)}`}>
                  {getVerdictIcon(item.result.verdict)}
                  {item.result.verdict.replace('_', ' ')}
                </div>
              </div>

              {/* Source (if AI) */}
              {item.result.verdict === 'LIKELY_AI' && item.result.sourceGenerator && item.result.sourceGenerator !== 'N/A' && (
                <div className="mb-4 flex items-center gap-2 text-red-300 text-sm font-medium">
                  <Siren className="w-4 h-4" />
                  {item.result.sourceGenerator}
                </div>
              )}

              <div className="flex items-center justify-between text-slate-400 text-sm mt-4 pt-4 border-t border-slate-700">
                <span className="font-mono">
                  Score: {item.result.aiLikelihood}% AI
                </span>
                <div className="flex items-center gap-1 text-blue-400 group-hover:translate-x-1 transition-transform">
                  View Report <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;