'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/shadcn-button"
import { Sidebar } from '@/components/layout/ProfileSidebar'
import Navbar from '@/components/layout/Navbar'
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ChangePasswordPage() {
  const [activeItem, setActiveItem] = useState('Password & Security');
  const [isSaving, setIsSaving] = useState(false);


  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [validations, setValidations] = useState({
    hasLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecial: false,
    passwordsMatch: false
  })

  

  useEffect(() => {
    const { newPassword, confirmPassword } = formData
    setValidations({
      hasLength: newPassword.length >= 8,
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      passwordsMatch: newPassword === confirmPassword && newPassword !== ''
    })
  }, [formData.newPassword, formData.confirmPassword])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('All fields are required')
      return
    }

    if (!Object.values(validations).every(Boolean)) {
      toast.error('Please meet all password requirements')
      return
    }

    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Password updated successfully')
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      toast.error('Failed to update password')
    } finally {
      setIsSaving(false)
    }
  }


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0A0A0A] text-white flex mt-16">
        <Sidebar 
          activeItem={activeItem} 
          setActiveItem={setActiveItem}
        />
        
        <main className="flex-1 lg:ml-72">
          <div className="min-h-screen p-4 lg:p-8 pt-32 lg:pt-8">
            <div className="max-w-4xl mx-auto space-y-12">
              <form onSubmit={handleSubmit}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-2xl p-8 backdrop-blur-sm border border-white/5"
                >
                  <h2 className="text-xl font-semibold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
                  </h2>
                  
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 flex items-center gap-2">
                        Current Password
                      </label>
                      <div className="relative group">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="bg-zinc-800/50 border-white/5 focus:border-purple-500/50 h-12 px-4 pr-12
                            rounded-xl transition-all duration-200
                            focus:ring-2 focus:ring-purple-500/20
                            group-hover:border-purple-500/30 group-hover:bg-zinc-800/70"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                            hover:text-white transition-colors p-1.5 rounded-lg
                            hover:bg-white/10"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 flex items-center gap-2">
                        New Password
                      </label>
                      <div className="relative group">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="bg-zinc-800/50 border-white/5 focus:border-purple-500/50 h-12 px-4 pr-12
                            rounded-xl transition-all duration-200
                            focus:ring-2 focus:ring-purple-500/20 
                            group-hover:border-purple-500/30 group-hover:bg-zinc-800/70"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                            hover:text-white transition-colors p-1.5 rounded-lg
                            hover:bg-white/10"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 flex items-center gap-2">
                        Confirm New Password
                      </label>
                      <div className="relative group">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="bg-zinc-800/50 border-white/5 focus:border-purple-500/50 h-12 px-4 pr-12
                            rounded-xl transition-all duration-200
                            focus:ring-2 focus:ring-purple-500/20
                            group-hover:border-purple-500/30 group-hover:bg-zinc-800/70"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                            hover:text-white transition-colors p-1.5 rounded-lg
                            hover:bg-white/10"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 p-4 bg-purple-500/5 rounded-xl border border-purple-500/10">
                    <h3 className="text-sm font-medium text-purple-200 mb-3">Password Requirements</h3>
                    <ul className="space-y-2">
                      <li className="text-xs flex items-center gap-2">
                        {validations.hasLength ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-gray-500" />
                        )}
                        <span className={validations.hasLength ? "text-green-400" : "text-gray-400"}>
                          At least 8 characters long
                        </span>
                      </li>
                      <li className="text-xs flex items-center gap-2">
                        {validations.hasUpperCase ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-gray-500" />
                        )}
                        <span className={validations.hasUpperCase ? "text-green-400" : "text-gray-400"}>
                          Contains at least one uppercase letter
                        </span>
                      </li>
                      <li className="text-xs flex items-center gap-2">
                        {validations.hasNumber ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-gray-500" />
                        )}
                        <span className={validations.hasNumber ? "text-green-400" : "text-gray-400"}>
                          Contains at least one number
                        </span>
                      </li>
                      <li className="text-xs flex items-center gap-2">
                        {validations.hasSpecial ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-gray-500" />
                        )}
                        <span className={validations.hasSpecial ? "text-green-400" : "text-gray-400"}>
                          Contains at least one special character
                        </span>
                      </li>
                      <li className="text-xs flex items-center gap-2">
                        {validations.passwordsMatch ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-gray-500" />
                        )}
                        <span className={validations.passwordsMatch ? "text-green-400" : "text-gray-400"}>
                          Passwords match
                        </span>
                      </li>
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="sticky bottom-0 bg-black/90 backdrop-blur-xl border-t border-white/5 mt-12 -mx-8 px-8 py-4 flex items-center justify-end gap-4"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-colors px-6"
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving || !Object.values(validations).every(Boolean)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                      text-white px-6 shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Updating...
                      </div>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}