import { DeveloperChatSidebar } from '@/components/chat/DeveloperChatSidebar';
import { DeveloperChatWindow } from '@/components/chat/DeveloperChatWindow';
import DevNavbar from '@/components/layout/DevNavbar';

const DeveloperChatPage = () => {

    return (
        <>
            <DevNavbar/>
            <div className="flex h-screen bg-black/95 mt-20">
                <DeveloperChatSidebar />
                <DeveloperChatWindow />
            </div>
        </>
    );
};

export default DeveloperChatPage;