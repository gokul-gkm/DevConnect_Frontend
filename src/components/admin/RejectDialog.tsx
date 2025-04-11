import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/shadcn-button';
import { XCircle, MessageCircleWarning, ShieldAlert, CheckCircle } from 'lucide-react';

interface RejectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reason: string;
  onReasonChange: (value: string) => void;
  onReject: () => void;
  title?: string;
  entityName?: string;
}

const RejectDialog: React.FC<RejectDialogProps> = ({
  isOpen,
  onClose,
  reason,
  onReasonChange,
  onReject,
  title = "Reject Application",
  entityName = "Developer"
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="p-0 border-0 shadow-none bg-transparent max-w-lg overflow-visible">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative"
            >
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-500/20 p-5 rounded-full border-4 border-slate-900 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <MessageCircleWarning className="w-8 h-8 text-red-400" />
              </div>

              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-[0_10px_50px_-12px_rgba(0,0,0,0.5)]">

                <div className="bg-slate-800/50 pt-12 px-6 pb-6 border-b border-slate-800/50">
                  <h2 className="text-center text-xl font-bold text-slate-100">{title}</h2>
                  <p className="text-center text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                    Please provide feedback explaining why this application is being rejected
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="relative">
                    <div className="absolute -left-3 top-0 bg-red-500/10 p-1.5 rounded-full shadow-md">
                      <ShieldAlert className="w-5 h-5 text-red-400" />
                    </div>
                    
                    <div className="pl-7">
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Rejection Feedback
                      </label>
                      <Textarea
                        placeholder={`Please explain why this ${entityName.toLowerCase()} application is being rejected...`}
                        value={reason}
                        onChange={(e) => onReasonChange(e.target.value)}
                        className="min-h-[120px] dark:bg-slate-800/70 dark:border-slate-700/80 rounded-xl dark:text-slate-300 
                        focus:border-red-500/30 focus:ring-red-500/10 placeholder-slate-500/70 resize-none shadow-inner"
                      />
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-slate-500">
                          {reason.trim().length < 10 
                            ? `At least ${10 - reason.trim().length} more characters needed` 
                            : 'Feedback is sufficient'}
                        </p>
                        <div className={`text-xs ${reason.trim().length < 10 ? 'text-red-400' : 'text-green-400'} flex items-center gap-1`}>
                          {reason.trim().length < 10 
                            ? <ShieldAlert className="w-3 h-3" />
                            : <CheckCircle className="w-3 h-3" />}
                          {reason.trim().length < 10 ? 'Too short' : 'Ready to submit'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 px-6 py-4 border-t border-slate-800/50 flex items-center justify-between">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="border-slate-700 text-slate-300 hover:bg-slate-800 rounded-full px-5"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={reason.trim().length < 10 ? 'opacity-50' : 'opacity-100'}
                  >
                    <Button
                      variant="destructive"
                      onClick={onReject}
                      disabled={reason.trim().length < 10}
                      className="bg-red-500/10 hover:bg-red-500/20 
                      text-red-400 border border-red-500/30 rounded-full px-5 shadow-md"
                    >
                      <XCircle className="w-4 h-4 mr-2" /> 
                      Reject Application
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default RejectDialog;
