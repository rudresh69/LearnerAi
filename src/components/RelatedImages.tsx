import React, { useState } from 'react';
import { ImageResult } from '../types';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface RelatedImagesProps {
  images: ImageResult[];
  isLoading: boolean;
}

const RelatedImages: React.FC<RelatedImagesProps> = ({ images, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  if (isLoading) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Related Images</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-40 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Related Images</h3>
        <p className="text-gray-500">No related images found.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Related Images</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div 
            key={index}
            className="cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-40 object-cover"
            />
          </div>
        ))}
      </div>

      {/* Modal with Zoom Controls */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-base font-medium text-gray-700 truncate max-w-[80%]">{selectedImage.alt}</h3>
              <button onClick={() => setSelectedImage(null)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Zoom Buttons */}
            <div className="absolute top-16 right-4 bg-white rounded-md shadow-md flex flex-col sm:flex-row z-10">
              <button onClick={handleZoomIn} className="p-2 hover:bg-gray-100" title="Zoom In">
                <ZoomIn className="h-5 w-5" />
              </button>
              <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100" title="Zoom Out">
                <ZoomOut className="h-5 w-5" />
              </button>
              <button onClick={handleResetZoom} className="p-2 hover:bg-gray-100" title="Reset Zoom">
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>

            {/* Image */}
            <div className="p-4 overflow-auto max-h-[calc(90vh-8rem)]">
              <div className="flex items-center justify-center min-h-[300px]">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt}
                  className="max-w-full h-auto mx-auto transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel})` }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t text-sm text-gray-500">
              Zoom: {Math.round(zoomLevel * 100)}% &nbsp;|&nbsp; Use the buttons to zoom or reset
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedImages;
