import { DeveloperChatSidebar } from '@/components/chat/DeveloperChatSidebar';
import { DeveloperChatWindow } from '@/components/chat/DeveloperChatWindow';
import DevNavbar from '@/components/layout/DevNavbar';

const DeveloperChatPage = () => {
    return (
        <div className="flex flex-col h-screen bg-black/95">
            <DevNavbar />
            <div className="flex flex-1 overflow-hidden pt-[72px] md:pt-20">
                <DeveloperChatSidebar />
                <DeveloperChatWindow />
            </div>
        </div>
    );
};

export default DeveloperChatPage;