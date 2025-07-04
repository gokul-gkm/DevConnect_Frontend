import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { DocumentViewer } from '@/components/ui/DocumentViewer';
import { ImageViewer } from '@/components/ui/ImageViewer';

interface MessageMediaContentProps {
  mediaType?: string;
  mediaUrl?: string;
}

export const MessageMediaContent = ({ mediaType, mediaUrl }: MessageMediaContentProps) => {
  if (!mediaUrl) return null;
  
  switch (mediaType) {
    case 'image':
      return (
        <div className="mb-1 max-w-[220px] w-full">
          <ImageViewer 
            src={mediaUrl} 
            className="w-full" 
          />
        </div>
      );
    case 'video':
      return <VideoPlayer src={mediaUrl} className="mb-1 max-w-[220px] w-full" />;
    case 'audio':
      return <AudioPlayer src={mediaUrl} className="mb-1 w-full max-w-[260px]" />;
    case 'pdf':
      return <DocumentViewer src={mediaUrl} fileType="pdf" className="mb-1 max-w-[260px]" />;
    case 'document':
      return <DocumentViewer src={mediaUrl} fileType="document" className="mb-1 max-w-[260px]" />;
    default:
      return null;
  }
}; 