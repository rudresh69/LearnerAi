export interface ImageResult {
  url: string;
  alt: string;
}

export interface MindMapResponse {
  mermaidCode: string;
  svg?: string;
}

export interface MindMapRequest {
  topic: string;
  type: 'simple' | 'analogy' | 'text';
  text?: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

export type TabType = 'simple' | 'analogy' | 'text';

export interface RelatedImage {
  url: string;
  alt: string;
}