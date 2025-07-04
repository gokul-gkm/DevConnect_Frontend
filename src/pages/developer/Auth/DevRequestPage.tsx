'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { DeveloperFormData } from '@/utils/validation/devValidation'
import { developerSchema } from '@/utils/validation/devValidation'
import { Button } from "@/components/ui/shadcn-button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Slider } from "@/components/ui/Slider"
import { Upload, X, Plus, Trash2, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { useDevRequest } from '@/hooks/devAuth/useDevRequest'

const tags = [
  'React', 'Node.js', 'Angular', 'Django', 'PostgreSQL',
  'Python', 'Java', 'TypeScript', 'MongoDB', 'Redis',
  'Docker', 'Kubernetes', 'NextJS', 'AWS'
]

export default function DeveloperRequestPage() {
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [resume, setResume] = useState<File | null>(null)
  const { submitRequest, isSubmitting } = useDevRequest()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DeveloperFormData>({
    resolver: zodResolver(developerSchema),
    defaultValues: {
      username: '',
      email: '',
      bio: '',
      sessionCost: 500,
      expertise: [],
      languages: [''],
      degree: '',
      institution: '',
      year: '',
      jobTitle: '',
      company: '',
      experience: '',
      github: '',
      linkedin: '',
      twitter: '',
      portfolio: '',
    }
  })

  const onProfileDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setProfilePicture(file)
      setValue('profilePicture', file, { shouldValidate: true })
    }
  }, [setValue])

  const onResumeDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setResume(file)
      setValue('resume', file, { shouldValidate: true })
    }
  }, [setValue])

  const { getRootProps: getProfileRootProps, getInputProps: getProfileInputProps } = useDropzone({
    onDrop: onProfileDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 5000000 
  })

  const { getRootProps: getResumeRootProps, getInputProps: getResumeInputProps } = useDropzone({
    onDrop: onResumeDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 5000000
  })

  const handleTagClick = (tag: string) => {
    const currentExpertise = watch('expertise') || []
    if (currentExpertise.includes(tag)) {
      setValue(
        'expertise',
        currentExpertise.filter((t) => t !== tag),
        { shouldValidate: true }
      )
    } else if (currentExpertise.length < 5) {
      setValue(
        'expertise',
        [...currentExpertise, tag],
        { shouldValidate: true }
      )
    }
  }

  const addLanguage = () => {
    const currentLanguages = watch('languages') || ['']
    setValue('languages', [...currentLanguages, ''], { shouldValidate: true })
  }

  const removeLanguage = (index: number) => {
    const currentLanguages = watch('languages') || ['']
    if (currentLanguages.length > 1) {
      setValue(
        'languages',
        currentLanguages.filter((_, i) => i !== index),
        { shouldValidate: true }
      )
    }
  }

  const onSubmit = async (data: DeveloperFormData) => {
    const formData = new FormData()
    
    formData.append('username', data.username)
    formData.append('email', data.email)
    formData.append('bio', data.bio)
    formData.append('degree', data.degree)
    formData.append('institution', data.institution)
    formData.append('year', data.year)
    formData.append('jobTitle', data.jobTitle)
    formData.append('company', data.company)
    formData.append('experience', data.experience)
    formData.append('sessionCost', data.sessionCost.toString())

    if (data.expertise && data.expertise.length > 0) {
      data.expertise.forEach((item) => {
        formData.append('expertise[]', item)
      })
    }

    if (data.languages && data.languages.length > 0) {
      data.languages.forEach((item) => {
        if (item) formData.append('languages[]', item)
      })
    }

    if (data.github) formData.append('github', data.github)
    if (data.linkedin) formData.append('linkedin', data.linkedin)
    if (data.twitter) formData.append('twitter', data.twitter)
    if (data.portfolio) formData.append('portfolio', data.portfolio)

    if (profilePicture) {
      formData.append('profilePicture', profilePicture)
    }
    if (resume) {
      formData.append('resume', resume)
    }

    submitRequest(formData)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-3xl font-bold mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Upload your developer profile
        </motion.h1>
        <motion.p 
          className="text-gray-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Please fill in your details to get verified.
        </motion.p>

        <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <motion.div 
              className="bg-neutral-900 p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="username" className="text-base">Full name</Label>
                  <Input 
                    {...register('username')}
                    placeholder="Your name" 
                    className="bg-neutral-800 border-neutral-700 mt-2 h-10 text-base"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="text-base">Email</Label>
                  <Input 
                    {...register('email')}
                    type="email" 
                    placeholder="Your email address" 
                    className="bg-neutral-800 border-neutral-700 mt-2 h-10 text-base"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="bio" className="text-base">Bio</Label>
                  <textarea 
                    {...register('bio')}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-neutral-800 border-neutral-700 rounded-md p-3 mt-2 resize-none text-base"
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-neutral-900 p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Label className="text-xl font-semibold mb-4">Expertise</Label>
              <div className="flex flex-wrap gap-3 mt-4">
                {tags.map((tag) => (
                  <motion.button
                    type="button"
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      watch('expertise')?.includes(tag)
                        ? 'bg-neutral-600 text-white'
                        : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <span>{watch('expertise')?.length || 0} Selected</span>
                <button 
                  type="button"
                  onClick={() => setValue('expertise', [], { shouldValidate: true })}
                  className="ml-2 text-neutral-400 hover:text-neutral-300"
                >
                  Clear all
                </button>
              </div>
              {errors.expertise && (
                <p className="mt-1 text-sm text-red-500">{errors.expertise.message}</p>
              )}
            </motion.div>

            <motion.div 
              className="bg-neutral-900 p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Label className="text-xl font-semibold mb-4">Profile Picture</Label>
              <div 
                {...getProfileRootProps()} 
                className="mt-4 border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors"
              >
                <input {...getProfileInputProps()} />
                {profilePicture ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-base text-gray-300">{profilePicture.name}</span>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setProfilePicture(null)
                        setValue('profilePicture', undefined, { shouldValidate: true })
                      }} 
                      className="text-gray-500 hover:text-gray-400"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto w-12 h-12 rounded-full bg-neutral-600/20 flex items-center justify-center mb-4">
                      <Upload className="w-6 h-6 text-neutral-300" />
                    </div>
                    <p className="text-sm text-gray-400">
                      Drop your profile picture here, or{" "}
                      <span className="text-neutral-300">browse</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG or WEBP (max. 5MB)
                    </p>
                  </>
                )}
              </div>
              {errors.profilePicture && (
                <p className="mt-1 text-sm text-red-500">{errors.profilePicture.message}</p>
              )}
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div 
              className="bg-neutral-900 p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4">Education</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="degree" className="text-base">Degree</Label>
                  <Input 
                    {...register('degree')}
                    placeholder="Your degree" 
                    className="bg-neutral-800 border-neutral-700 mt-2 h-10 text-base"
                  />
                  {errors.degree && (
                    <p className="mt-1 text-sm text-red-500">{errors.degree.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="institution" className="text-base">Institution</Label>
                  <Input 
                    {...register('institution')}
                    placeholder="Your institution" 
                    className="bg-neutral-800 border-neutral-700 mt-2 h-10 text-base"
                  />
                  {errors.institution && (
                    <p className="mt-1 text-sm text-red-500">{errors.institution.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="year" className="text-base">Year of Completion</Label>
                  <Input 
                    {...register('year')}
                    placeholder="YYYY" 
                    className="bg-neutral-800 border-neutral-700 mt-2 h-10 text-base"
                  />
                  {errors.year && (
                    <p className="mt-1 text-sm text-red-500">{errors.year.message}</p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-neutral-900 p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Professional Experience</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="jobTitle" className="text-base">Current Job Title</Label>
                  <Input 
                    {...register('jobTitle')}
                    placeholder="Your job title" 
                    className="bg-neutral-800 border-neutral-700 mt-2 h-10 text-base"
                  />
                  {errors.jobTitle && (
                    <p className="mt-1 text-sm text-red-500">{errors.jobTitle.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="company" className="text-base">Company</Label>
                  <Input 
                    {...register('company')}
                    placeholder="Your company" 
                    className="bg-neutral-800 border-neutral-700 mt-2 h-10 text-base"
                  />
                  {errors.company && (
                    <p className="mt-1 text-sm text-red-500">{errors.company.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="experience" className="text-base">Years of Experience</Label>
                  <Input 
                    {...register('experience')}
                    placeholder="Years of experience" 
                    className="bg-neutral-800 border-neutral-700 mt-2 h-10 text-base"
                  />
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-500">{errors.experience.message}</p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-neutral-900 p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold mb-4">Languages</h2>
              <div className="space-y-4">
                {watch('languages')?.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      {...register(`languages.${index}`)}
                      placeholder="Programming language"
                      className="bg-neutral-800 border-neutral-700 h-10 text-base"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeLanguage(index)}
                        className="p-2 text-gray-400 hover:text-gray-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLanguage}
                  className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-300"
                >
                  <Plus className="w-4 h-4" />
                  Add Language
                </button>
              </div>
              {errors.languages && (
                <p className="mt-1 text-sm text-red-500">{errors.languages.message}</p>
              )}
            </motion.div>

            <motion.div 
              className="bg-neutral-900 p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-4">Session Cost</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Cost per hour</span>
                  <span className="text-sm font-medium">${watch('sessionCost')}</span>
                </div>
                <Slider
                  {...register('sessionCost')}
                  defaultValue={[500]}
                  max={2000}
                  min={100}
                  step={50}
                  onValueChange={(value) => setValue('sessionCost', value[0])}
                />
              </div>
            </motion.div>

            <motion.div 
              className="bg-neutral-900 p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-xl font-semibold mb-4">Social Links</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="github" className="text-base">GitHub</Label>
                  <Input 
                    {...register('github')}
                    placeholder="Your GitHub profile" 
                    className="bg-neutral-800 border-neutral-700 mt-2 h-10 text-base"
                  />
                  {errors.github && (
                    <p className="mt-1 text-sm text-red-500">{errors.github.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="linkedin" className="text-base">LinkedIn</Label>
                  <Input 
                    {...register('linkedin')}
                    placeholder="Your LinkedIn profile" 
                    className="bg-neutral-800 border-neutral-700 mt-2 h-10 text-base"
                  />
                  {errors.linkedin && (
                    <p className="mt-1 text-sm text-red-500">{errors.linkedin.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="twitter" className="text-base">Twitter</Label>
                  <Input 
                    {...register('twitter')}
                    placeholder="Your Twitter profile" 
                    className="bg-neutral-800 border-neutral-700 mt-2 h-10 text-base"
                  />
                  {errors.twitter && (
                    <p className="mt-1 text-sm text-red-500">{errors.twitter.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="portfolio" className="text-base">Portfolio Website</Label>
                  <Input 
                    {...register('portfolio')}
                    placeholder="Your portfolio website" 
                    className="bg-neutral-800 border-neutral-700 mt-2 h-10 text-base"
                  />
                  {errors.portfolio && (
                    <p className="mt-1 text-sm text-red-500">{errors.portfolio.message}</p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-neutral-900 p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Label className="text-xl font-semibold mb-4">Resume</Label>
              <div 
                {...getResumeRootProps()} 
                className="mt-4 border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors"
              >
                <input {...getResumeInputProps()} />
                {resume ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-base text-gray-300">{resume.name}</span>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setResume(null)
                        setValue('resume', undefined, { shouldValidate: true })
                      }} 
                      className="text-gray-500 hover:text-gray-400"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto w-12 h-12 rounded-full bg-neutral-600/20 flex items-center justify-center mb-4">
                      <Upload className="w-6 h-6 text-neutral-300" />
                    </div>
                    <p className="text-sm text-gray-400">
                      Drop your resume here, or{" "}
                      <span className="text-neutral-300">browse</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      PDF, DOC or DOCX (max. 5MB)
                    </p>
                  </>
                )}
              </div>
              {errors.resume && (
                <p className="mt-1 text-sm text-red-500">{errors.resume.message}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Button
                type="submit"
                className="w-full h-12 text-base border px-2 py-3 flex justify-center items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
    <>
      <Loader2 className="w-4 h-4 animate-spin mr-2" />
      Submitting...
    </>
  ) : (
    "Submit Profile"
  )}
                
              </Button>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  )
}