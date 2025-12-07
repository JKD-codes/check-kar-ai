import React from 'react';
import { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Search, Sparkles, Download, Link as LinkIcon, FileText, Siren } from 'lucide-react';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  imagePreview: string;
}

const COLORS = ['#ef4444', '#3b82f6']; // Red for AI, Blue for Human

const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ result, imagePreview }) => {
  const chartData = [
    { name: 'AI Probability', value: result.aiLikelihood },
    { name: 'Human Probability', value: result.humanLikelihood },
  ];

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'LIKELY_AI': return 'text-red-500';
      case 'LIKELY_HUMAN': return 'text-blue-500';
      default: return 'text-yellow-500';
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'LIKELY_AI': return <ShieldAlert className="w-12 h-12 text-red-500" />;
      case 'LIKELY_HUMAN': return <ShieldCheck className="w-12 h-12 text-blue-500" />;
      default: return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
    }
  };

  const handleDownloadReport = async () => {
    try {
      // Dynamically import jsPDF to prevent app crash on load if module resolution fails
      const module = await import('jspdf');
      const jsPDF = module.jsPDF || (module as any).default;
      
      if (!jsPDF) {
        throw new Error("PDF Library failed to load");
      }

      const doc = new jsPDF();
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(59, 130, 246); // Blue
      doc.text("Check-Kar AI", 20, 20);
      
      doc.setFontSize(14);
      doc.setTextColor(100);
      doc.text("Detection Report", 20, 28);
      
      doc.setLineWidth(0.5);
      doc.line(20, 32, 190, 32);

      // Verdict
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text("Verdict:", 20, 45);
      doc.setFont("helvetica", "normal");
      doc.text(result.verdict.replace('_', ' '), 50, 45);

      doc.setFont("helvetica", "bold");
      doc.text("Confidence:", 20, 52);
      doc.setFont("helvetica", "normal");
      doc.text(`${result.aiLikelihood}% AI / ${result.humanLikelihood}% Human`, 50, 52);

      // Model Source (if detected)
      if (result.verdict === 'LIKELY_AI' && result.sourceGenerator && result.sourceGenerator !== 'N/A') {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(220, 38, 38); // Red
        doc.text("Suspected Model Source:", 20, 59);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0);
        doc.text(result.sourceGenerator, 75, 59);

        if (result.modelSpecificArtifacts) {
           doc.setFont("helvetica", "italic");
           doc.setFontSize(10);
           const splitArtifacts = doc.splitTextToSize(result.modelSpecificArtifacts, 160);
           doc.text(splitArtifacts, 20, 65);
           // Adjust Y position based on length of artifact text
           // This is a rough estimation, normally we'd track Y pos
        }
      }

      // Indicators
      // Start lower to account for potentially long artifact text
      let yPos = 85; 
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Key Indicators:", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 7;
      result.indicators.forEach((ind) => {
        doc.text(`• ${ind}`, 25, yPos);
        yPos += 7;
      });

      // Analysis
      yPos += 5;
      doc.setFont("helvetica", "bold");
      doc.text("Detailed Analysis:", 20, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const splitAnalysis = doc.splitTextToSize(result.analysis, 170);
      doc.text(splitAnalysis, 20, yPos);
      
      // Technical Details
      yPos += (splitAnalysis.length * 4) + 12;
      
      // Check for page overflow before technical details
      if (yPos > 250) {
          doc.addPage();
          yPos = 20;
      }
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Technical Breakdown:", 20, yPos);
      yPos += 7;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      doc.text(`Lighting: ${result.technicalDetails.lighting}`, 20, yPos);
      yPos += 6;
      doc.text(`Texture: ${result.technicalDetails.texture}`, 20, yPos);
      yPos += 6;
      doc.text(`Composition: ${result.technicalDetails.composition}`, 20, yPos);
      yPos += 6;
      doc.text(`Artifacts: ${result.technicalDetails.artifacts}`, 20, yPos);

      // Potential Prompt - Only if LIKELY_AI
      if (result.verdict === 'LIKELY_AI' && result.potentialPrompt) {
          yPos += 12;
          if (yPos > 260) {
            doc.addPage();
            yPos = 20;
          }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text("Reverse-Engineered Prompt:", 20, yPos);
          yPos += 7;
          doc.setFontSize(10);
          doc.setFont("helvetica", "italic");
          const splitPrompt = doc.splitTextToSize(result.potentialPrompt, 170);
          doc.text(splitPrompt, 20, yPos);
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Generated by Check-Kar AI Detector on ${new Date().toLocaleDateString()}`, 20, 280);
      }

      doc.save("Check-Kar-Report.pdf");
    } catch (error) {
      console.error("PDF Generation Error", error);
      alert("Failed to generate PDF. Please try again or check your internet connection.");
    }
  };

  const handleCopyLink = () => {
    // Since we don't have a backend to store the result permanently, we copy the summary text.
    let summary = `
🔍 Check-Kar AI Analysis Result

Verdict: ${result.verdict}
AI Probability: ${result.aiLikelihood}%
Human Probability: ${result.humanLikelihood}%
`;

    if (result.verdict === 'LIKELY_AI' && result.sourceGenerator && result.sourceGenerator !== 'N/A') {
      summary += `Suspected Source: ${result.sourceGenerator}\n`;
      if (result.modelSpecificArtifacts) {
        summary += `Signature: ${result.modelSpecificArtifacts}\n`;
      }
    }

    summary += `
Key Indicators:
${result.indicators.map(i => `• ${i}`).join('\n')}

Analysis:
${result.analysis}

Check-Kar AI Detector
    `.trim();

    navigator.clipboard.writeText(summary).then(() => {
      alert("Analysis summary copied to clipboard! (Note: Persistent link sharing requires a backend account)");
    }).catch(err => {
      console.error("Failed to copy", err);
      alert("Failed to copy to clipboard.");
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      {/* Left Column: Image, Confidence, Export, & Prompt */}
      <div className="space-y-6">
        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800">
           <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white border border-white/10">
              Source Image
           </div>
           <img 
             src={imagePreview} 
             alt="Analyzed content" 
             className="w-full h-auto object-cover max-h-[500px]"
           />
           {/* Overlay showing verdict badge */}
           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-6 pt-20">
              <div className="flex items-center gap-4">
                {getVerdictIcon(result.verdict)}
                <div>
                  <p className="text-slate-300 text-sm font-medium uppercase tracking-widest">Detection Result</p>
                  <h2 className={`text-3xl font-bold ${getVerdictColor(result.verdict)}`}>
                    {result.verdict.replace('_', ' ')}
                  </h2>
                </div>
              </div>
           </div>
        </div>

        {/* Confidence Card */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
           <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
             <Search className="w-5 h-5 text-blue-400" />
             Confidence Analysis
           </h3>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={chartData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   fill="#8884d8"
                   paddingAngle={5}
                   dataKey="value"
                   stroke="none"
                 >
                   {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                 />
                 <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-2xl font-bold">
                    {result.aiLikelihood}%
                 </text>
                 <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-400 text-xs font-medium uppercase tracking-wider">
                    AI Score
                 </text>
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="flex justify-center gap-8 mt-2">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <span className="text-sm text-slate-300">AI Generated</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-blue-500"></div>
               <span className="text-sm text-slate-300">Human Made</span>
             </div>
           </div>
        </div>

        {/* Data Export Card */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Data Export
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDownloadReport}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900/50 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-200 transition-all font-medium group active:scale-95"
            >
              <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Download PDF Report</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900/50 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-200 transition-all font-medium group active:scale-95"
            >
              <LinkIcon className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <span>Copy Shareable Link</span>
            </button>
          </div>
        </div>

        {/* Suspected Model Source - Conditional Card */}
        {result.verdict === 'LIKELY_AI' && result.sourceGenerator && result.sourceGenerator !== 'N/A' && (
          <div className="bg-slate-800 rounded-xl p-6 border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse-slow">
             <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
               <Siren className="w-5 h-5" />
               Suspected Model Source
             </h3>
             <div className="flex flex-col gap-2">
                <div>
                   <div className="text-2xl font-mono text-white font-bold tracking-wider">
                     {result.sourceGenerator}
                   </div>
                </div>
                {result.modelSpecificArtifacts && (
                  <div className="mt-2 pt-2 border-t border-red-500/30">
                     <p className="text-slate-300 text-sm italic">
                       "{result.modelSpecificArtifacts}"
                     </p>
                  </div>
                )}
             </div>
          </div>
        )}

        {/* Potential Generation Prompt Card - Only show if AI */}
        {result.verdict === 'LIKELY_AI' && result.potentialPrompt && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Potential Generation Prompt
            </h3>
            <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-700/50 relative">
              <p className="text-slate-300 font-mono text-sm leading-relaxed italic border-l-2 border-purple-500 pl-4">
                "{result.potentialPrompt}"
              </p>
              <div className="mt-3 flex justify-end">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  Reverse Engineered by Gemini
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Detailed Analysis */}
      <div className="space-y-6">
        {/* Analysis Text */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Detailed Analysis</h3>
          <p className="text-slate-300 leading-relaxed">
            {result.analysis}
          </p>
        </div>

        {/* Key Indicators */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Key Visual Indicators</h3>
          <div className="space-y-3">
            {result.indicators.map((indicator, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                {result.verdict === 'LIKELY_AI' ? (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                ) : (
                   <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                )}
                <span className="text-slate-300 text-sm">{indicator}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Breakdown */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Technical Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
               <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Lighting</span>
               <p className="text-sm text-slate-200">{result.technicalDetails.lighting}</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
               <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Texture</span>
               <p className="text-sm text-slate-200">{result.technicalDetails.texture}</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
               <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Composition</span>
               <p className="text-sm text-slate-200">{result.technicalDetails.composition}</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
               <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Artifacts</span>
               <p className="text-sm text-slate-200">{result.technicalDetails.artifacts}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultView;