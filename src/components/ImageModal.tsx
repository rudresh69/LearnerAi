import React, { useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ImageModalProps {
  imageUrl: string;
  alt: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, alt, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h3 className="text-base md:text-lg font-medium text-gray-800 truncate">{alt}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow flex border">
          <button className="p-2 hover:bg-gray-100" title="Zoom In">
            <ZoomIn className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-gray-100" title="Zoom Out">
            <ZoomOut className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-gray-100" title="Rotate">
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        {/* Image Body */}
        <div className="p-4 overflow-auto max-h-[calc(90vh-6rem)]">
          <img
            src={imageUrl}
            alt={alt}
            className="max-w-full max-h-full mx-auto rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
