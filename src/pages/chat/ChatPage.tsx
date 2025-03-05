import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useChatPage } from "@/hooks/chat/useChatPage";
import { Spinner } from "@/components/ui/spinner";
import Navbar from "@/components/layout/Navbar";

const ChatPage = () => {
  const { loading } = useChatPage();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex h-screen  mt-20">
        <ChatSidebar />
        <ChatWindow />
      </div>
    </>
  );
};

export default ChatPage;
