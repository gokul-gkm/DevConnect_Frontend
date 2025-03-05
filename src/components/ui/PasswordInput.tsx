import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { UseFormRegisterReturn } from 'react-hook-form'

interface PasswordInputProps {
  label: string
  registration: UseFormRegisterReturn
  error?: string
}

export function PasswordInput({ label, registration, error }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>
      <div className="relative group">
        <Input
          type={showPassword ? "text" : "password"}
          {...registration}
          className="bg-zinc-800/50 border-white/5 focus:border-purple-500/50 h-12 px-4 pr-12
            rounded-xl transition-all duration-200
            focus:ring-2 focus:ring-purple-500/20
            group-hover:border-purple-500/30 group-hover:bg-zinc-800/70"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
            hover:text-white transition-colors p-1.5 rounded-lg
            hover:bg-white/10"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}