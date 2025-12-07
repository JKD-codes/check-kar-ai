export interface AnalysisResult {
  aiLikelihood: number;
  humanLikelihood: number;
  verdict: 'LIKELY_AI' | 'LIKELY_HUMAN' | 'UNCERTAIN';
  confidenceScore: number;
  indicators: string[];
  analysis: string;
  potentialPrompt: string;
  sourceGenerator?: string;
  modelSpecificArtifacts?: string;
  technicalDetails: {
    lighting: string;
    texture: string;
    composition: string;
    artifacts: string;
    modelSignature: string;
  };
}

export enum AnalysisState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface UploadedImage {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  image: UploadedImage;
  result: AnalysisResult;
}