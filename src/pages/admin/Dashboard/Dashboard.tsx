import {motion } from 'framer-motion'



const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto space-y-8"
            >
        <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-sm shadow-xl"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Manage and monitor DevConnect
                        </p>
                    </div>

                    
        </motion.div>
        </motion.div>
    </div>
  )
}

export default Dashboard
