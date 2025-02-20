'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/shadcn-button"
import { Lock, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ChangePasswordProps {
  onSave: (passwords: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
}

export function ChangePassword({ onSave }: ChangePasswordProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

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

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (formData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long')
      return
    }

    setIsLoading(true)
    try {
      await onSave(formData)
      toast.success('Password updated successfully')
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      toast.error('Failed to update password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex-1 lg:ml-72">
      <div className="min-h-screen p-4 lg:p-8 pt-32 lg:pt-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-2xl p-6 backdrop-blur-sm border border-white/5"
            >
              <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Current Password</label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="bg-zinc-900/50 border-white/5 focus:border-purple-500/50 pr-10"
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
                  <label className="text-sm text-gray-400">New Password</label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="bg-zinc-900/50 border-white/5 focus:border-purple-500/50 pr-10"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
                  <label className="text-sm text-gray-400">Confirm New Password</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="bg-zinc-900/50 border-white/5 focus:border-purple-500/50 pr-10"
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40"
              >
                {isLoading ? (
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
  )
}