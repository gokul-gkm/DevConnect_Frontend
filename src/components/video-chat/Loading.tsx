import { Sparkles } from "lucide-react"

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex flex-col items-center justify-center z-50">
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-2xl"></div>
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 rounded-full border-[3px] border-zinc-800/80 shadow-[0_0_25px_rgba(0,0,0,0.3)]"></div>
        <div className="w-24 h-24 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin absolute"></div>
        <div className="w-24 h-24 rounded-full border-2 border-transparent border-b-purple-500/70 animate-spin absolute" style={{ animationDuration: '1.5s' }}></div>
        <div className="absolute flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-indigo-400/90" />
        </div>
      </div>
    </div>
    <h2 className="text-xl font-medium text-white mb-2">Connecting to Session</h2>
    <p className="text-zinc-400 text-sm flex items-center gap-2">
      <span className="inline-block h-1.5 w-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
      Setting up secure connection...
    </p>
  </div>
  )
}

export default Loading
