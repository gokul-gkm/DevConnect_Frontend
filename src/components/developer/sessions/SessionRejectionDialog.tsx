
import React from 'react';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/shadcn-button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from '@/components/ui/spinner';

interface SessionRejectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: () => void;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  isLoading: boolean;
}

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

export const SessionRejectionDialog: React.FC<SessionRejectionDialogProps> = ({
  isOpen,
  onClose,
  onReject,
  rejectionReason,
  setRejectionReason,
  isLoading
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0 border-0 shadow-2xl overflow-hidden max-w-lg">
        <motion.div
          variants={dialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl overflow-hidden"
        >

          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent opacity-20" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />

          <div className="relative p-6 space-y-6">
            <DialogHeader className="space-y-4 pb-4 border-b border-white/5">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Decline Session Request
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-base">
                Please provide a detailed reason for declining this session request. 
                This feedback will be shared with the requester.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Rejection Reason
              </label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent rounded-xl blur-xl" />
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter your reason for declining..."
                  className="min-h-[160px] resize-none dark:bg-black/40 backdrop-blur-xl border-white/10 focus:border-white/20 text-white placeholder:text-gray-500 rounded-xl"
                />
              </div>
              <p className="text-xs text-gray-500">
                Be specific and constructive in your feedback
              </p>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
              <Button 
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto h-12 rounded-xl bg-transparent border-white/10 hover:bg-white/5 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={onReject}
                disabled={isLoading}
                className="w-full sm:w-auto h-12 rounded-xl bg-gradient-to-r from-rose-500/20 to-rose-600/20 hover:from-rose-500/30 hover:to-rose-600/30 text-rose-300 border border-rose-300/20 backdrop-blur-xl"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="w-4 h-4" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    <span>Confirm Rejection</span>
                  </div>
                )}
              </Button>
            </DialogFooter>
          </div>

          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/10 blur-3xl rounded-full" />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};