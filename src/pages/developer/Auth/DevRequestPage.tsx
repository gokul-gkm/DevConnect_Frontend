'use client'

import { useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { DeveloperFormData } from '@/utils/validation/devValidation'
import { developerSchema } from '@/utils/validation/devValidation'
import { Button } from "@/components/ui/shadcn-button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Slider } from "@/components/ui/Slider"
import { Upload, X, Plus, Trash2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import DevAuthApi from '@/service/Api/DevAuthApi'
import { useNavigate } from 'react-router-dom'

const tags = [
  'React', 'Node.js', 'Angular', 'Django', 'PostgreSQL',
  'Python', 'Java', 'TypeScript', 'MongoDB', 'Redis',
  'Docker', 'Kubernetes', 'NextJS', 'AWS'
]

export default function DeveloperRequestPage() {
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [resume, setResume] = useState<File | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
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
  });

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
    const currentExpertise = watch('expertise') || [];
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
    const currentLanguages = watch('languages') || [''];
    setValue('languages', [...currentLanguages, ''], { shouldValidate: true });
  }

  const removeLanguage = (index: number) => {
    const currentLanguages = watch('languages') || [''];
    if (currentLanguages.length > 1) {
      setValue(
        'languages',
        currentLanguages.filter((_, i) => i !== index),
        { shouldValidate: true }
      );
    }
  }

  const onSubmit = async (data: DeveloperFormData) => {
    try {

      const formData = new FormData()
         
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('bio', data.bio);
        formData.append('degree', data.degree);
        formData.append('institution', data.institution);
        formData.append('year', data.year);
        formData.append('jobTitle', data.jobTitle);
        formData.append('company', data.company);
        formData.append('experience', data.experience);
        formData.append('sessionCost', data.sessionCost.toString());

        if (data.expertise && data.expertise.length > 0) {
            data.expertise.forEach((item) => {
                formData.append('expertise[]', item);
            });
        }

        if (data.languages && data.languages.length > 0) {
            data.languages.forEach((item) => {
                if (item) formData.append('languages[]', item);
            });
        }

       
        if (data.github) formData.append('github', data.github);
        if (data.linkedin) formData.append('linkedin', data.linkedin);
        if (data.twitter) formData.append('twitter', data.twitter);
        if (data.portfolio) formData.append('portfolio', data.portfolio);

        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }
        if (resume) {
            formData.append('resume', resume);
        }


        console.log('Form Data Before Submit:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

      const response = await DevAuthApi.devRequest(formData)
      
      if (response.success) {
        toast.success('Profile submitted successfully!')
        reset()
        setProfilePicture(null)
        setResume(null)
        navigate('/developer/auth/login')
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to submit profile')
      }
    }
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
                        e.stopPropagation();
                        setProfilePicture(null);
                        setValue('profilePicture', undefined, { shouldValidate: true });
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
                    <p className="text-base text-gray-400">Drag & Drop</p>
                    <p className="text-sm text-gray-500 mt-2">or click to browse</p>
                  </>
                )}
              </div>
              {errors.profilePicture && (
                <p className="mt-1 text-sm text-red-500">{errors.profilePicture.message}</p>
              )}
            </motion.div>

            <motion.div 
              className="bg-neutral-900 p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-4">Session Cost</h2>
              <div className="space-y-4">
                <Controller
                  name="sessionCost"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) => onChange(newValue)}
                      max={1000}
                      min={100}
                      step={50}
                      className="mt-4"
                    />
                  )}
                />
                <div className="text-center text-2xl font-semibold text-gray-300">
                  ${watch('sessionCost')}
                </div>
                {errors.sessionCost && (
                  <p className="mt-1 text-sm text-red-500">{errors.sessionCost.message}</p>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="bg-neutral-900 p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Languages Known</h2>
              <div className="space-y-4">
              {watch('languages')?.map((_, index) => (
                  <div key={index} className="flex gap-4">
                    <Input
                      {...register(`languages.${index}`)}
                      placeholder="Language"
                      className="bg-neutral-800 border-neutral-700 flex-1 h-10 text-base"
                    />
                    {watch('languages')?.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLanguage(index)}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addLanguage}
                  className="w-full mt-2 h-10 text-base"
                >
                  <Plus className="w-5 h-5 mr-2" /> Add Language
                </Button>
              </div>
              {errors.languages && (
                <p className="mt-1 text-sm text-red-500">{errors.languages.message}</p>
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
                    placeholder="Your Institution" 
                    className="bg-neutral-800 border-neutral-700 mt-2 h-10 text-base"
                  />
                  {errors.institution && (
                    <p className="mt-1 text-sm text-red-500">{errors.institution.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="year" className="text-base">Year</Label>
                  <Input 
                    {...register('year')}
                    placeholder="Year of passing" 
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
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold mb-4">Professional Experience</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="jobTitle" className="text-base">Job title</Label>
                  <Input 
                    {...register('jobTitle')}
                    placeholder="Your Job title" 
                    className="bg-neutral-800 border-neutral-700 mt-2 h-10 text-base"
                  />
                  {errors.jobTitle && (
                    <p className="mt-1 text-sm text-red-500">{errors.jobTitle.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="company" className="text-base">Company name</Label>
                  <Input 
                    {...register('company')}
                    placeholder="Company Name" 
                    className="bg-neutral-800 border-neutral-700 mt-2 h-10 text-base"
                  />
                  {errors.company && (
                    <p className="mt-1 text-sm text-red-500">{errors.company.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="experience" className="text-base">Experience</Label>
                  <Input 
                    {...register('experience')}
                    placeholder="Your experience" 
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
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-4">Social Profile</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="github" className="text-base">GitHub</Label>
                  <Input 
                    {...register('github')}
                    placeholder="https://github.com/username" 
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
                    placeholder="https://linkedin.com/in/username" 
                    className="bg-neutral-800 border-neutral-700 mt-2 h-10 text-base"
                  />
                  {errors.linkedin && (
                    <p className="mt-1 text-sm text-red-500">{errors.linkedin.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="twitter" className="text-base">Twitter X</Label>
                  <Input 
                    {...register('twitter')}
                    placeholder="https://twitter.com/username" 
                    className="bg-neutral-800 border-neutral-700 mt-2 h-10 text-base"
                  />
                  {errors.twitter && (
                    <p className="mt-1 text-sm text-red-500">{errors.twitter.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="portfolio" className="text-base">Portfolio</Label>
                  <Input 
                    {...register('portfolio')}
                    placeholder="https://portfolio.com" 
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
              transition={{ duration: 0.5, delay: 0.6 }}
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
                        e.stopPropagation();
                        setResume(null);
                        setValue('resume', undefined, { shouldValidate: true });
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
                    <p className="text-base text-gray-400">Drag & Drop</p>
                    <p className="text-sm text-gray-500 mt-2">or click to browse</p>
                  </>
                )}
              </div>
              {errors.resume && (
                <p className="mt-1 text-sm text-red-500">{errors.resume.message}</p>
              )}
            </motion.div>
          </div>
        </form>

        <motion.div 
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button 
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-neutral-700 hover:bg-neutral-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Profile'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}