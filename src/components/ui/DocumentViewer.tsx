import { FileText, Download, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DocumentViewerProps {
  src: string;
  filename?: string;
  fileType: 'pdf' | 'document';
  className?: string;
}

export const DocumentViewer = ({ src, filename = '', fileType, className }: DocumentViewerProps) => {
  const displayName = filename || (fileType === 'pdf' ? 'PDF File' : 'Document');
  
  const typeLabel = fileType === 'pdf' ? 'PDF' : 'Document';
  
  return (
    <div className={cn(
      "bg-gradient-to-r from-black/30 to-gray-800/10 p-3 rounded-xl flex items-center space-x-3 shadow-lg", 
      className
    )}>
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md",
        fileType === 'pdf' ? "bg-red-500/30" : "bg-blue-500/30"
      )}>
        <FileText className={cn(
          "w-5 h-5",
          fileType === 'pdf' ? "text-red-300" : "text-blue-300"
        )} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white/90 truncate">{displayName}</div>
        <div className="text-xs text-white/60">
          {typeLabel} • Click to view
        </div>
      </div>
      
      <div className="flex-shrink-0 flex space-x-2">
        <motion.a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition backdrop-blur-sm"
        >
          <ExternalLink className="w-4 h-4 text-white" />
        </motion.a>
        <motion.a
          href={src}
          download
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition backdrop-blur-sm"
        >
          <Download className="w-4 h-4 text-white" />
        </motion.a>
      </div>
    </div>
  );
}; 