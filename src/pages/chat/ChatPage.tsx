import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useChatPage } from "@/hooks/chat/useChatPage";
import { Spinner } from "@/components/ui/spinner";
import Navbar from "@/components/layout/Navbar";

const ChatPage = () => {
  const { loading } = useChatPage();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black/95">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black/95">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-[72px] md:pt-20">
        <ChatSidebar />
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatPage;
