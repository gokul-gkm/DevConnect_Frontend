import { Volume2, Play, FileText } from 'lucide-react';

interface FilePreviewProps {
  fileType: string | null;
  filePreview: string | null;
  fileName: string;
  isDeveloperChat?: boolean;
}

export const FilePreview = ({ fileType, filePreview, fileName, isDeveloperChat = false }: FilePreviewProps) => {
    
  const maxWidth = isDeveloperChat ? 'max-w-[320px]' : 'max-w-[280px]';
  
  switch (fileType) {
    case 'image':
      return (
        <div className={`relative rounded-xl overflow-hidden h-[${isDeveloperChat ? '100' : '80'}px] w-[${isDeveloperChat ? '200' : '160'}px] border border-zinc-700/50 shadow-md inline-block`}>
          <img 
            src={filePreview!} 
            alt="Preview" 
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-xs text-zinc-300 truncate backdrop-blur-sm">
            {fileName.length > (isDeveloperChat ? 18 : 15) 
              ? fileName.substring(0, isDeveloperChat ? 15 : 13) + '...' 
              : fileName}
          </div>
        </div>
      );
    case 'video':
      return (
        <div className={`relative rounded-xl overflow-hidden h-[${isDeveloperChat ? '100' : '80'}px] w-[${isDeveloperChat ? '200' : '160'}px] border border-zinc-700/50 shadow-md inline-block`}>
          <video 
            src={filePreview!} 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="bg-blue-600/80 p-1.5 rounded-full shadow-lg">
              <Play className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-xs text-zinc-300 truncate backdrop-blur-sm">
            {fileName.length > (isDeveloperChat ? 18 : 15) 
              ? fileName.substring(0, isDeveloperChat ? 15 : 13) + '...' 
              : fileName}
          </div>
        </div>
      );
    case 'audio':
      return (
        <div className={`flex items-center space-x-3 bg-gradient-to-r from-zinc-800/70 to-zinc-900/70 p-2 rounded-xl border border-zinc-700/50 shadow-md ${maxWidth}`}>
          <div className="bg-blue-600/50 p-1.5 rounded-full shadow-inner flex-shrink-0">
            <Volume2 className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-zinc-200 truncate">{fileName}</div>
            <div className="text-xs text-zinc-400 text-opacity-70">Audio file</div>
          </div>
        </div>
      );
    case 'pdf':
      return (
        <div className={`flex items-center space-x-3 bg-gradient-to-r from-zinc-800/70 to-zinc-900/70 p-2 rounded-xl border border-zinc-700/50 shadow-md ${maxWidth}`}>
          <div className="bg-red-600/50 p-1.5 rounded-full shadow-inner flex-shrink-0">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-zinc-200 truncate">{fileName}</div>
            <div className="text-xs text-zinc-400 text-opacity-70">PDF document</div>
          </div>
        </div>
      );
    case 'document':
      return (
        <div className={`flex items-center space-x-3 bg-gradient-to-r from-zinc-800/70 to-zinc-900/70 p-2 rounded-xl border border-zinc-700/50 shadow-md ${maxWidth}`}>
          <div className="bg-blue-600/50 p-1.5 rounded-full shadow-inner flex-shrink-0">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-zinc-200 truncate">{fileName}</div>
            <div className="text-xs text-zinc-400 text-opacity-70">Document</div>
          </div>
        </div>
      );
    default:
      return (
        <div className={`bg-gradient-to-r from-zinc-800/70 to-zinc-900/70 p-2 rounded-xl border border-zinc-700/50 shadow-md ${maxWidth}`}>
          <div className="text-xs text-zinc-200 truncate">{fileName}</div>
        </div>
      );
  }
}; 