'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/shadcn-button"
import { Sidebar } from '@/components/layout/ProfileSidebar'
import Navbar from '@/components/layout/Navbar'
import { Lock } from 'lucide-react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { changePasswordSchema, type ChangePasswordFormData } from "@/utils/validation/userValidation"
import { useChangePassword } from '@/hooks/profile/useChangePassword'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { PasswordRequirements } from '@/components/ui/PasswordRequirements'

export default function ChangePasswordPage() {
  const [activeItem, setActiveItem] = useState('Password & Security')
  const { mutate: changePassword, isPending } = useChangePassword()

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword(data, {
      onSuccess: () => form.reset()
    })
  }

  const newPassword = form.watch("newPassword") || ""
  const confirmPassword = form.watch("confirmPassword") || ""

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0A0A0A] text-white flex mt-16">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <main className="flex-1 lg:ml-72">
          <div className="min-h-screen p-4 lg:p-8 pt-32 lg:pt-8">
            <div className="max-w-4xl mx-auto space-y-12">
              <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    <PasswordInput
                      label="Current Password"
                      registration={form.register("currentPassword")}
                      error={form.formState.errors.currentPassword?.message}
                    />
                    <PasswordInput
                      label="New Password"
                      registration={form.register("newPassword")}
                      error={form.formState.errors.newPassword?.message}
                    />
                    <PasswordInput
                      label="Confirm New Password"
                      registration={form.register("confirmPassword")}
                      error={form.formState.errors.confirmPassword?.message}
                    />
                  </div>

                  <PasswordRequirements
                    password={newPassword}
                    confirmPassword={confirmPassword}
                  />
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
                    disabled={isPending || !form.formState.isValid}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                      text-white px-6 shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
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