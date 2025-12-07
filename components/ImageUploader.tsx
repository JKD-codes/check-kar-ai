import React, { useCallback, useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { AnalysisState } from '../types';

interface ImageUploaderProps {
  onImageSelected: (file: File, base64: string, preview: string) => void;
  analysisState: AnalysisState;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, analysisState }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract base64 part
      const base64 = result.split(',')[1];
      onImageSelected(file, base64, result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const handleBoxClick = () => {
    if (analysisState !== AnalysisState.ANALYZING && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={`relative group w-full max-w-2xl mx-auto rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer
        ${isDragOver 
          ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
          : 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
        }
        ${analysisState === AnalysisState.ANALYZING ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleBoxClick}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileInput}
      />
      
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-300
          ${isDragOver ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-200'}
        `}>
          <UploadCloud className="w-10 h-10" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2">
          Upload Image to Detect
        </h3>
        <p className="text-slate-400 mb-8 max-w-sm">
          Click anywhere or drag and drop your image here. We support JPG, PNG, and WEBP.
        </p>

        <div className="relative inline-flex group/btn">
          <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover/btn:opacity-100 group-hover/btn:-inset-1 group-hover/btn:duration-200 animate-tilt"></div>
          <span className="relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-slate-900 font-pj rounded-xl cursor-pointer">
            <ImageIcon className="w-5 h-5 mr-2" />
            Select File
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;