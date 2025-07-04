import { useState, useEffect } from 'react';
import { ZoomIn, X, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

interface ImageViewerProps {
  src: string;
  alt?: string;
  className?: string;
}

export const ImageViewer = ({ src, alt = 'Image', className }: ImageViewerProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const openFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPreviewOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsPreviewOpen(false);
    document.body.style.overflow = '';
  };

  const renderFullscreenModal = () => {
    if (!mounted) return null;
    
    return createPortal(
      <div 
        className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
        onClick={closeFullscreen}
      >
        <div 
          className="relative max-w-[90vw] max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          <img 
            src={src} 
            alt={alt} 
            className="max-w-full max-h-[80vh] object-contain rounded-md"
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const link = document.createElement('a');
                link.href = src;
                link.download = '';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-white/20 p-2 rounded-full backdrop-blur-sm hover:bg-white/30"
            >
              <Download className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={closeFullscreen}
              className="bg-white/20 p-2 rounded-full backdrop-blur-sm hover:bg-white/30"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div 
        className={cn(
          "rounded-xl overflow-hidden shadow-lg relative group cursor-pointer",
          className
        )}
      >
        <img 
          src={src}
          alt={alt}
          className="w-full h-full object-contain rounded-xl"
          onClick={openFullscreen}
        />
        <div 
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl"
          onClick={openFullscreen}
        >
          <div 
            className="bg-white/20 p-2 rounded-full backdrop-blur-sm"
          >
            <ZoomIn className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      
      {isPreviewOpen && renderFullscreenModal()}
    </>
  );
}; 