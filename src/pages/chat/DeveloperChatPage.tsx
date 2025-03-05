import { DeveloperChatSidebar } from '@/components/chat/DeveloperChatSidebar';
import { DeveloperChatWindow } from '@/components/chat/DeveloperChatWindow';
import { useDeveloperChat } from '@/hooks/chat/useDeveloperChat';
import { Spinner } from '@/components/ui/spinner';
import Navbar from '@/components/layout/Navbar';

const DeveloperChatPage = () => {
  const { loading } = useDeveloperChat();
    
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black/95">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Navbar/>
      <div className="flex h-screen bg-black/95 mt-24">
        <DeveloperChatSidebar />
        <DeveloperChatWindow />
      </div>
    </>
  );
};

export default DeveloperChatPage;