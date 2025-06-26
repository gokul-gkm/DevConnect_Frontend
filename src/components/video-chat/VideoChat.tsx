import { motion } from 'framer-motion'

import { Button } from '../ui/shadcn-button'
import { X } from 'lucide-react'
import { MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoChatProps {
  onClose: () => void;
}

const VideoChat = ({ onClose }: VideoChatProps) => {
  return (
    <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className={cn(
                "fixed inset-y-0 right-0 z-40",
                "w-full sm:w-80 md:w-96",
                "bg-black/90 backdrop-blur-xl",
                "border-l border-zinc-800/80",
                "flex flex-col"
              )}
            >
              <div className="flex justify-between items-center p-4 border-b border-zinc-800/80">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  Chat
                </h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-zinc-400 hover:text-white rounded-full h-8 w-8 bg-zinc-900/80 border border-zinc-800/60"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-grow p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                <div className="text-center text-zinc-500 py-10 flex flex-col items-center">
                  <MessageSquare className="h-8 w-8 text-zinc-700 mb-2" />
                  No messages yet
                </div>
              </div>
              
              <div className="p-4 border-t border-zinc-800/80">
                <textarea 
                  className="w-full bg-zinc-900/80 border border-zinc-800/60 rounded-xl p-3 text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 shadow-inner"
                  placeholder="Type a message..."
                  rows={2}
                />
                <div className="flex justify-end mt-2">
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-900/20 border border-indigo-500/30"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </motion.div>
  )
}

export default VideoChat
