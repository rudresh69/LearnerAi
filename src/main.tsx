import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import mermaid from 'mermaid';
import { BrowserRouter } from 'react-router-dom'; // ✅ import this

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ wrap App */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
