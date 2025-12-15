'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/shadcn-button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CustomSelect } from '@/components/ui/CutsomSelect'
import {
  Github, Linkedin, Twitter, Globe, X, Plus, UploadCloud
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { ProfileFormData, profileSchema } from '@/utils/validation/userValidation'

const AVAILABLE_SKILLS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C++", 
  "AWS", "Docker", "Kubernetes", "MongoDB", "PostgreSQL", "GraphQL", "REST API",
  "HTML", "CSS", "Next.js", "Vue.js", "Angular", "Express.js"
];

interface EditProfileProps {
    userData: ProfileFormData;
  onSave: (formData: FormData) => void;
  isUpdating: boolean;
}

export function EditProfile({ userData, onSave }: EditProfileProps) {
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>(userData.profilePicture || '')
    const [newSkill, setNewSkill] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)
  
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      setValue,
      watch
    } = useForm<ProfileFormData>({
      resolver: zodResolver(profileSchema),
      defaultValues: {
        username: userData.username,
        email: userData.email,
        contact:userData.contact,
        location: userData.location,
        bio: userData.bio,
        profilePicture: userData.profilePicture,
        skills: userData.skills || [],
        socialLinks: {
          github: userData.socialLinks?.github || '',
          linkedIn: userData.socialLinks?.linkedIn || '',
          twitter: userData.socialLinks?.twitter || '',
          portfolio: userData.socialLinks?.portfolio || ''
        }
      }
    })
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
  
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
  
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
    
    const onSubmit = async (data: ProfileFormData) => {
        try {
          const formData = new FormData()
          formData.append('username', data.username)
          if (data.contact) formData.append('contact', data.contact.toString())
          if (data.bio) formData.append('bio', data.bio)
          if (data.location) formData.append('location', data.location)

          formData.append('skills', JSON.stringify(data.skills))
          formData.append('socialLinks', JSON.stringify(data.socialLinks))

          if (selectedImage) {
            formData.append('profilePicture', selectedImage)
          }
      
          await onSave(formData)
        } catch (error: any) {
          console.error('Update error:', error)
          toast.error(error.message || 'Failed to update profile')
        }
      }
  
    return (
      <main className="flex-1 lg:ml-72">
        <div className="min-h-screen p-4 lg:p-8 pt-32 lg:pt-8">
          <div className="max-w-4xl mx-auto space-y-12">
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                    <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 p-8 mb-8"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <Avatar className="w-32 h-32 ring-4 ring-purple-500/30 rounded-2xl">
                    <AvatarImage src={previewUrl} className="object-cover" />
                    <AvatarFallback>{watch('username')?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
                  >
                    <UploadCloud className="w-6 h-6 text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-400">Click to upload profile photo</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-2xl p-6 backdrop-blur-sm border border-white/5"
            >
              <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Username</label>
                  <Input
                    {...register('username')}
                    className="bg-zinc-900/50 border-white/5 focus:border-purple-500/50"
                    placeholder="Enter your username"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Email</label>
                  <Input
                    {...register('email')}
                    type="email"
                    readOnly
                    className="bg-zinc-900/50 border-white/5 cursor-not-allowed opacity-70"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Phone</label>
                  <Input
                    {...register('contact')}
                    className="bg-zinc-900/50 border-white/5 focus:border-purple-500/50"
                    placeholder="Enter your phone number"
                  />
                  {errors.contact && (
                    <p className="mt-1 text-sm text-red-500">{errors.contact.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Location</label>
                  <Input
                    {...register('location')}
                    className="bg-zinc-900/50 border-white/5 focus:border-purple-500/50"
                    placeholder="Enter your location"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-2xl p-6 backdrop-blur-sm border border-white/5"
            >
              <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Bio
              </h2>
              <Textarea
                {...register('bio')}
                className="bg-zinc-900/50 dark:bg-zinc-900/50 border-white/5 focus:border-purple-500/50 min-h-[120px] rounded-xl"
                placeholder="Tell us about yourself..."
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
              )}
                        </motion.div>
               
                    <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-2xl p-6 backdrop-blur-sm border border-white/5"
            >
              <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {watch('skills')?.map((skill) => (
                  <Badge 
                    key={skill}
                    className="bg-purple-500/10 text-purple-300 border-purple-500/20 pl-3 pr-2 py-1.5"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => {
                        const currentSkills = watch('skills')
                        setValue('skills', currentSkills.filter(s => s !== skill))
                      }}
                      className="ml-2 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <CustomSelect
                  value={newSkill}
                  onChange={setNewSkill}
                  options={AVAILABLE_SKILLS.filter(skill => !watch('skills').includes(skill))}
                  placeholder="Select a skill..."
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (newSkill && !watch('skills').includes(newSkill)) {
                      const currentSkills = watch('skills')
                      setValue('skills', [...currentSkills, newSkill])
                      setNewSkill('')
                    }
                  }}
                  variant="outline"
                  className="border-white/5 hover:bg-white/5"
                  disabled={!newSkill}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {errors.skills && (
                <p className="mt-2 text-sm text-red-500">{errors.skills.message}</p>
              )}
            </motion.div>

           
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-2xl p-6 backdrop-blur-sm border border-white/5"
            >
              <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Social Links
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    <Github className="w-4 h-4" /> GitHub
                  </label>
                  <Input
                    {...register('socialLinks.github')}
                    className="bg-zinc-900/50 border-white/5 focus:border-purple-500/50"
                    placeholder="https://github.com/username"
                  />
                  {errors.socialLinks?.github && (
                    <p className="mt-1 text-sm text-red-500">{errors.socialLinks.github.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </label>
                  <Input
                    {...register('socialLinks.linkedIn')}
                    className="bg-zinc-900/50 border-white/5 focus:border-purple-500/50"
                    placeholder="https://linkedin.com/in/username"
                  />
                  {errors.socialLinks?.linkedIn && (
                    <p className="mt-1 text-sm text-red-500">{errors.socialLinks.linkedIn.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    <Twitter className="w-4 h-4" /> Twitter
                  </label>
                  <Input
                    {...register('socialLinks.twitter')}
                    className="bg-zinc-900/50 border-white/5 focus:border-purple-500/50"
                    placeholder="https://twitter.com/username"
                  />
                  {errors.socialLinks?.twitter && (
                    <p className="mt-1 text-sm text-red-500">{errors.socialLinks.twitter.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Portfolio
                  </label>
                  <Input
                    {...register('socialLinks.portfolio')}
                    className="bg-zinc-900/50 border-white/5 focus:border-purple-500/50"
                    placeholder="https://your-portfolio.com"
                  />
                  {errors.socialLinks?.portfolio && (
                    <p className="mt-1 text-sm text-red-500">{errors.socialLinks.portfolio.message}</p>
                  )}
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
                className="border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-colors px-6 rounded-xl"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40 rounded-xl"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default EditProfile