// api.ts
import axios from 'axios';
import { MindMapRequest, MindMapResponse, ImageResult } from '../types';
axios.defaults.withCredentials = true;
// ✅ Base URL of Flask backend
export const API_BASE = import.meta.env.VITE_BACKEND_URL;

// ✅ Axios instance with credentials for cookies/session support
const apiClient = axios.create({
  baseURL: API_BASE ,
  withCredentials: true, // 🔐 Ensures cookies (like session) are sent
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Global error interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('❌ Unauthorized - please log in.');
    } else {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);

// ✅ Generate Mind Map
export const generateMindMap = async (request: MindMapRequest): Promise<MindMapResponse> => {
  try {
    const response = await apiClient.post<MindMapResponse>('/generate-mindmap', request);
    return response.data;
  } catch (error) {
    console.error('❌ Error generating mind map:', error);
    throw new Error('Failed to generate mind map. Please try again.');
  }
};

// ✅ Get related images
export const getRelatedImages = async (topic: string): Promise<ImageResult[]> => {
  try {
    const response = await apiClient.get<ImageResult[]>(`/related-images?topic=${encodeURIComponent(topic)}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching related images:', error);
    return [];
  }
};

// 🧪 Mock generate mind map (for offline/testing)
export const mockGenerateMindMap = async (request: MindMapRequest): Promise<MindMapResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  let mermaidCode = '';

  if (request.type === 'simple') {
    mermaidCode = `mindmap
  root((${request.topic}))
    Key Concept 1
      Sub-concept 1.1
      Sub-concept 1.2
    Key Concept 2
      Sub-concept 2.1
      Sub-concept 2.2
    Key Concept 3
      Sub-concept 3.1
        Detail 3.1.1
        Detail 3.1.2
      Sub-concept 3.2`;
  } else if (request.type === 'analogy') {
    mermaidCode = `mindmap
  root((${request.topic}))
    Analogy["${request.topic} is like a Tree"]
      Roots["Foundation/Origins"]
        Basic principles
        Historical context
      Trunk["Core Concepts"]
        Main theories
        Central ideas
      Branches["Applications"]
        Field 1
        Field 2
        Field 3
      Leaves["Details/Examples"]
        Example 1
        Example 2`;
  } else if (request.type === 'text') {
    mermaidCode = `mindmap
  root((${request.topic}))
    Main Point 1
      Supporting detail 1.1
      Supporting detail 1.2
    Main Point 2
      Supporting detail 2.1
        Evidence 2.1.1
        Evidence 2.1.2
      Supporting detail 2.2
    Main Point 3
      Supporting detail 3.1
      Supporting detail 3.2`;
  }

  return { mermaidCode };
};

// 🧪 Mock related images (for offline/testing)
export const mockGetRelatedImages = async (topic: string): Promise<ImageResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643', alt: `${topic} concept 1` },
    { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475', alt: `${topic} concept 2` },
    { url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', alt: `${topic} concept 3` },
    { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3', alt: `${topic} concept 4` },
  ];
};
