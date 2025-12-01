import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useChatPage } from "@/hooks/chat/useChatPage";
import Navbar from "@/components/layout/Navbar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ChatPage = () => {
  const { loading } = useChatPage();

  if (loading) {
    return (
      <LoadingSpinner
        size="lg"
        text="Loading chat..."
        color="white"
        bgColor="dark"
        fullScreen={true}
      />
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
