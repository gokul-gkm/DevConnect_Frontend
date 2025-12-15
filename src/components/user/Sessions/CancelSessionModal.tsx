import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/shadcn-button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CancelSessionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  loading: boolean;
}

export function CancelSessionModal({ open, onClose, onSubmit, loading }: CancelSessionModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Please provide a reason for cancellation.");
      return;
    }
    setError("");
    await onSubmit(reason);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <AnimatePresence>
        {open && (
          <DialogContent className="bg-gradient-to-br from-zinc-900/90 to-black/70 backdrop-blur-md border border-zinc-800/50 shadow-xl max-w-2xl !rounded-2xl p-4 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3 
              }}
            >
              <DialogHeader className="p-4 border-b border-zinc-800/50">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <DialogTitle className="text-white flex items-center gap-2">
                    <motion.div
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <AlertCircle className="w-5 h-5 text-rose-400" />
                    </motion.div>
                    Cancel Session
                  </DialogTitle>
                </motion.div>
              </DialogHeader>
              
              <div className="p-5 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-800/50"
                >
                  <h4 className="text-zinc-300 text-sm flex items-center gap-1.5 mb-3">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    Cancellation Reason
                  </h4>
                  <Textarea
                    placeholder="Please provide a detailed reason for cancelling this session..."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    disabled={loading}
                    rows={3}
                    className="bg-zinc-800/50 border border-zinc-700/30 text-white placeholder:text-zinc-400 focus:border-rose-500/50 focus:ring-rose-500/20 rounded-xl"
                  />
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-rose-400 text-sm mt-2 flex items-center gap-1 overflow-hidden"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-800/50"
                >
                  <h4 className="text-zinc-300 text-sm flex items-center gap-1.5 mb-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    Important Note
                  </h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Cancelling a session will refund the full amount to your wallet. This action cannot be undone.
                  </p>
                </motion.div>
              </div>

              <DialogFooter className="p-4 border-t border-zinc-800/50 flex gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="flex-1"
                >
                  <Button 
                    variant="outline" 
                    onClick={onClose} 
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 border-zinc-600/50 shadow-lg hover:shadow-zinc-900/10 transition-all duration-300"
                  >
                    Keep Session
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="flex-1"
                >
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="w-full h-12 gap-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/50 text-rose-400 border border-rose-500/30 shadow-lg shadow-rose-900/5 hover:shadow-rose-900/10 transition-all duration-300"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Spinner className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    Cancel Session
                  </Button>
                </motion.div>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
