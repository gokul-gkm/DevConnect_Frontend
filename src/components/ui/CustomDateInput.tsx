import { Calendar } from "lucide-react";

export const CustomDateInput = ({ value, onClick }: any) => (
    <button
      onClick={onClick}
      className="w-full p-4 text-left rounded-xl bg-black/40 border border-zinc-800 hover:border-indigo-500/50 transition-all text-zinc-300 text-sm relative group"
    >
      {value || 'Select session date'}
      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 opacity-70 group-hover:opacity-100 transition-opacity" />
    </button>
  );