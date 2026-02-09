import { motion } from 'framer-motion';

interface ReviewSkeletonProps {
  count?: number;
}

export const ReviewSkeleton = ({ count = 3 }: ReviewSkeletonProps) => {
  return (
    <div className="space-y-6 mb-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="bg-gradient-to-br from-zinc-900/70 to-black/60 rounded-2xl backdrop-blur-md border border-zinc-800/50 p-6 shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <motion.div
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 rounded-xl bg-zinc-800/50 border border-zinc-700/50"
                />
                <motion.div
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="absolute -bottom-3 -right-3 bg-zinc-800 rounded-xl p-1.5 border border-zinc-700/50 w-16 h-7"
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                <div className="space-y-2">
                  <motion.div
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="h-5 w-32 bg-zinc-800/50 rounded-lg"
                  />
                  <motion.div
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                    className="h-4 w-24 bg-zinc-800/50 rounded-lg"
                  />
                </div>
                <motion.div
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="h-8 w-32 bg-zinc-800/50 rounded-xl border border-zinc-700/50"
                />
              </div>

              <motion.div
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="mb-3 p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/30 space-y-2"
              >
                <div className="h-4 w-3/4 bg-zinc-800/50 rounded-lg" />
                <div className="h-4 w-1/2 bg-zinc-800/50 rounded-lg" />
              </motion.div>

              <motion.div
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-700/20 space-y-2"
              >
                <div className="h-4 w-20 bg-zinc-800/50 rounded-lg mb-3" />
                <div className="h-4 w-full bg-zinc-800/50 rounded-lg" />
                <div className="h-4 w-5/6 bg-zinc-800/50 rounded-lg" />
                <div className="h-4 w-4/6 bg-zinc-800/50 rounded-lg" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};