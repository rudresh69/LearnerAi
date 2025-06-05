import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface MindMapDisplayProps {
  mermaidCode: string;
  isLoading: boolean;
}

const MindMapDisplay: React.FC<MindMapDisplayProps> = ({ mermaidCode, isLoading }) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mermaidCode || isLoading) return;

    const renderMermaid = async () => {
      try {
        setSvgContent('');
        mermaid.initialize({
          startOnLoad: true,
          theme: 'default',
          securityLevel: 'loose',
          mindmap: {
            padding: 50,
            useMaxWidth: false,
          },
        });

        const { svg } = await mermaid.render(`mind-map-svg-${Date.now()}`, mermaidCode);
        setSvgContent(svg);
        setError(null);
      } catch (err) {
        console.error('Error rendering mermaid diagram:', err);
        setError('Failed to render mind map. Please check your input and try again.');
      }
    };

    renderMermaid();
  }, [mermaidCode, isLoading]);

  const downloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsPdf = async () => {
    if (!containerRef.current) return;
    try {
      const canvas = await html2canvas(containerRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('mindmap.pdf');
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-md">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-md">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!svgContent) {
    return (
      <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-md">
        <div className="text-center text-gray-500">
          <p className="text-xl font-semibold mb-2">No Mind Map Generated Yet</p>
          <p>Enter a topic and click "Generate" to create your mind map.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h3 className="text-lg font-semibold text-gray-700">Generated Mind Map</h3>
        <div className="flex space-x-2">
          <button
            onClick={downloadSvg}
            className="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            title="Download SVG"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={exportAsPdf}
            className="p-2 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition"
            title="Export as PDF"
          >
            📄
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden" ref={containerRef}>
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={3}
          centerOnInit
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: true }}
          pinch={{ step: 0.1 }}
          panning={{ velocityDisabled: true }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="bg-gray-100 p-2 flex justify-end space-x-2 overflow-x-auto">
                <button
                  onClick={() => zoomIn()}
                  className="p-1 rounded-md bg-white text-gray-700 hover:bg-gray-200 transition"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => zoomOut()}
                  className="p-1 rounded-md bg-white text-gray-700 hover:bg-gray-200 transition"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={() => resetTransform()}
                  className="p-1 rounded-md bg-white text-gray-700 hover:bg-gray-200 transition"
                  title="Reset Zoom"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
              <TransformComponent wrapperClass="min-h-[400px] sm:min-h-[500px] bg-white">
                <div
                  className="mermaid p-4 flex justify-center"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center sm:text-left">
        <p>Tip: Use pinch or scroll to zoom, drag to pan. Reset view using the ⟳ button.</p>
      </div>
    </div>
  );
};

export default MindMapDisplay;
