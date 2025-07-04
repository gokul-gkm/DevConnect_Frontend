import { Check, X } from 'lucide-react'

interface PasswordRequirementsProps {
  password: string
  confirmPassword: string
}

export function PasswordRequirements({ password, confirmPassword }: PasswordRequirementsProps) {
  const requirements = [
    {
      text: "At least 8 characters long",
      isMet: password.length >= 8
    },
    {
      text: "Contains at least one uppercase letter",
      isMet: /[A-Z]/.test(password)
    },
    {
      text: "Contains at least one number",
      isMet: /[0-9]/.test(password)
    },
    {
      text: "Contains at least one special character",
      isMet: /[@$!%*?&#^]/.test(password)
    },
    {
      text: "Passwords match",
      isMet: password === confirmPassword && password !== ""
    }
  ]

  return (
    <div className="mt-8 p-4 bg-purple-500/5 rounded-xl border border-purple-500/10">
      <h3 className="text-sm font-medium text-purple-200 mb-3">Password Requirements</h3>
      <ul className="space-y-2">
        {requirements.map(({ text, isMet }, index) => (
          <li key={index} className="text-xs flex items-center gap-2">
            {isMet ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <X className="w-4 h-4 text-gray-500" />
            )}
            <span className={isMet ? "text-green-400" : "text-gray-400"}>
              {text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}