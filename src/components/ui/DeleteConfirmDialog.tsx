import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    isDeleting: boolean;
    projectTitle: string;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmDialog = ({ 
    isOpen, 
    isDeleting, 
    projectTitle, 
    onClose, 
    onConfirm 
}: DeleteConfirmDialogProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
                        onClick={onClose}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="w-[90%] max-w-[400px] p-8 rounded-2xl
                                     bg-gradient-to-br from-white/[0.08] to-white/[0.02]
                                     border border-white/[0.1] backdrop-blur-2xl
                                     shadow-[0_0_60px_rgba(0,0,0,0.5)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative flex justify-center mb-6">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ 
                                            duration: 2, 
                                            repeat: Infinity,
                                            repeatType: "reverse" 
                                        }}
                                        className="w-14 h-14 rounded-full bg-red-500/20"
                                    />
                                </div>
                                <div className="relative">
                                    <AlertTriangle className="w-10 h-10 text-red-500" />
                                </div>
                            </div>

                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    Delete Project?
                                </h3>
                                <p className="text-sm text-white/70">
                                    Are you sure you want to delete <span className="text-white font-medium">"{projectTitle}"</span>? This action cannot be undone.
                                </p>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onClose}
                                    className="px-5 py-2.5 text-sm rounded-xl
                                             text-white/80 hover:text-white
                                             bg-white/5 hover:bg-white/10
                                             border border-white/10
                                             transition-all duration-300
                                             hover:scale-105 active:scale-95"
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={onConfirm}
                                    disabled={isDeleting}
                                    className="px-5 py-2.5 text-sm rounded-xl
                                             bg-gradient-to-r from-red-500 to-red-600
                                             hover:from-red-600 hover:to-red-700
                                             text-white font-semibold
                                             shadow-[0_0_25px_rgba(239,68,68,0.4)]
                                             hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]
                                             transition-all duration-300
                                             flex items-center gap-2
                                             hover:scale-105 active:scale-95"
                                >
                                    {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Delete Project
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DeleteConfirmDialog;