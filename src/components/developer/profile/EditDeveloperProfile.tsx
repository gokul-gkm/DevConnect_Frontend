import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { X, Loader2, User, Mail, Phone, MapPin, Briefcase, Building, Clock, DollarSign, GraduationCap, School, Calendar, Github, Linkedin, Twitter, Globe, Image as ImageIcon, FileText } from 'lucide-react';
import { useForm, Controller, FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useDeveloperProfile } from '@/hooks/profile/useDeveloperProfile';
import CustomSelector from '@/components/shared/CustomSelector';
import { skillOptions, languageOptions } from '@/utils/selectOptions';
import { developerProfileSchema, DeveloperProfileFormData } from '@/utils/validation/devProfileValidation';
import { getFileNameFromUrls } from '@/utils/fileUtils';

interface ErrorMessageProps {
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}

const ErrorMessage = ({ error }: ErrorMessageProps) => {
  if (!error) return null;
  return <p className="mt-1 text-sm text-rose-500">{error.message as React.ReactNode}</p>;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const uploadContainerVariants = {
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const EditDeveloperProfile = () => {
  const { profile, updateProfile, isUpdating } = useDeveloperProfile();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);

  const { register, handleSubmit, control, formState: { errors } } = useForm<DeveloperProfileFormData>({
    resolver: zodResolver(developerProfileSchema),
    defaultValues: {
      username: profile?.username || '',
      email: profile?.email || '',
      bio: profile?.bio || '',
      contact: profile?.contact || '',
      location: profile?.location || '',
      jobTitle: profile?.jobTitle || '',
      companyName: profile?.companyName || '',
      experience: profile?.experience || '',
      hourlyRate: profile?.hourlyRate?.toString() || '',
      degree: profile?.education?.degree || '',
      institution: profile?.education?.institution || '',
      year: profile?.education?.year || '',
      github: profile?.socialLinks?.github || '',
      linkedIn: profile?.socialLinks?.linkedIn || '',
      twitter: profile?.socialLinks?.twitter || '',
      portfolio: profile?.socialLinks?.portfolio || '',
      skills: profile?.skills || [],
      languages: profile?.languages || [],
    }
  });

  const onDropProfileImage = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setProfileImage(acceptedFiles[0]);
    }
  }, []);

  const onDropResume = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setResume(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps: getProfileImageProps, getInputProps: getProfileImageInputProps, isDragActive: isProfileDragActive } = useDropzone({
    onDrop: onDropProfileImage,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const { getRootProps: getResumeProps, getInputProps: getResumeInputProps, isDragActive: isResumeDragActive } = useDropzone({
    onDrop: onDropResume,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const onSubmit = async (data: DeveloperProfileFormData) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== '') {
          formData.append(key, value.toString());
        }
      });

      formData.append('education', JSON.stringify({
        degree: data.degree,
        institution: data.institution,
        year: data.year
      }));

      if (profileImage) {
        formData.append('profilePicture', profileImage);
      }
      if (resume) {
        formData.append('resume', resume);
      }

      await updateProfile(formData);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const inputClassName = "w-full h-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl px-4 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-transparent hover:border-white/20 transition-colors";
  const labelClassName = "flex gap-2 items-center text-sm font-medium text-gray-300 mb-2";
  const sectionClassName = "bg-gradient-to-br from-black to-gray-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-xl hover:border-white/10 transition-all duration-300";

  return (
    <motion.div className="min-h-screen bg-black/80 pt-20 px-4 md:px-8 pb-8" variants={containerVariants} initial="hidden" animate="visible">
      <div className="max-w-5xl mx-auto">
        <motion.h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-8" variants={itemVariants}>
          Edit Profile
        </motion.h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" variants={itemVariants}>
            <div className={sectionClassName}>
              <h2 className="text-xl font-bold text-white mb-6">Profile Picture</h2>
              <motion.div
                variants={uploadContainerVariants}
                whileHover="hover"
                className="relative group"
              >
                <div {...getProfileImageProps()}>
                  <input {...getProfileImageInputProps()} />
                  <motion.div className={`relative overflow-hidden rounded-2xl border-2 ${isProfileDragActive ? 'border-purple-500/50' : 'border-white/10'} transition-colors ${profileImage || profile?.profilePicture ? 'h-48' : 'h-40'} bg-gradient-to-br from-purple-900/20 to-black/20 backdrop-blur-xl`}>
                    {profileImage || profile?.profilePicture ? (
                      <div className="relative h-full">
                        <img 
                          src={profileImage ? URL.createObjectURL(profileImage) : profile?.profilePicture} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                            <ImageIcon className="w-8 h-8 text-white mb-2" />
                            <p className="text-white text-sm">Change Image</p>
                          </motion.div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setProfileImage(null);
                          }}
                          className="absolute top-2 right-2 p-2 bg-rose-500/80 backdrop-blur-xl rounded-full text-white shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                        <motion.div
                          animate={{ y: isProfileDragActive ? -5 : 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <ImageIcon className="w-12 h-12 text-purple-400/80 mb-4" />
                          <p className="text-gray-400 text-sm mb-2">Drag & drop your profile picture</p>
                          <p className="text-purple-400/80 text-xs">or click to browse</p>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <div className={sectionClassName}>
              <h2 className="text-xl font-bold text-white mb-6">Resume</h2>
              <motion.div
                variants={uploadContainerVariants}
                whileHover="hover"
                className="relative group"
              >
                <div {...getResumeProps()}>
                  <input {...getResumeInputProps()} />
                  <motion.div className={`relative overflow-hidden rounded-2xl border-2 ${isResumeDragActive ? 'border-purple-500/50' : 'border-white/10'} transition-colors h-40 bg-gradient-to-br from-purple-900/20 to-black/20 backdrop-blur-xl`}>
                    {resume || profile?.resume ? (
                      <div className="h-full flex items-center justify-center relative">
                        <div className="flex flex-col items-center">
                          <FileText className="w-12 h-12 text-purple-400/80 mb-2" />
                          <p className="text-white text-sm mb-1">
                            {resume ? resume.name : (getFileNameFromUrls(profile?.resume) || 'Current Resume')}
                          </p>
                          <p className="text-gray-400 text-xs">Click to change</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setResume(null);
                          }}
                          className="absolute top-2 right-2 p-2 bg-rose-500/80 backdrop-blur-xl rounded-full text-white shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                        <motion.div
                          animate={{ y: isResumeDragActive ? -5 : 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <FileText className="w-12 h-12 text-purple-400/80 mb-4" />
                          <p className="text-gray-400 text-sm mb-2">Drag & drop your resume (PDF)</p>
                          <p className="text-purple-400/80 text-xs">or click to browse</p>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" variants={itemVariants}>
            <div className={sectionClassName}>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className={labelClassName}>
                    <User className="w-4 h-4" />
                    Username
                  </label>
                  <input {...register('username')} className={inputClassName} />
                  <ErrorMessage error={errors.username} />
                </div>

                <div>
                  <label className={labelClassName}>
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input {...register('email')} type="email" className={inputClassName} readOnly />
                  <ErrorMessage error={errors.email} />
                </div>

                <div>
                  <label className={labelClassName}>
                    <Phone className="w-4 h-4" />
                    Contact
                  </label>
                  <input {...register('contact')} className={inputClassName} />
                  <ErrorMessage error={errors.contact} />
                </div>

                <div>
                  <label className={labelClassName}>
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <input {...register('location')} className={inputClassName} />
                  <ErrorMessage error={errors.location} />
                </div>
              </div>
            </div>

            <div className={sectionClassName}>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Professional Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className={labelClassName}>
                    <Briefcase className="w-4 h-4" />
                    Job Title
                  </label>
                  <input {...register('jobTitle')} className={inputClassName} />
                  <ErrorMessage error={errors.jobTitle} />
                </div>

                <div>
                  <label className={labelClassName}>
                    <Building className="w-4 h-4" />
                    Company
                  </label>
                  <input {...register('companyName')} className={inputClassName} />
                  <ErrorMessage error={errors.companyName} />
                </div>

                <div>
                  <label className={labelClassName}>
                    <Clock className="w-4 h-4" />
                    Experience (years)
                  </label>
                  <input {...register('experience')}className={inputClassName} />
                  <ErrorMessage error={errors.experience} />
                </div>

                <div>
                  <label className={labelClassName}>
                    <DollarSign className="w-4 h-4" />
                    Session Cost ($/hour)
                  </label>
                  <input {...register('hourlyRate')} type="number" className={inputClassName} />
                  <ErrorMessage error={errors.hourlyRate} />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className={sectionClassName} variants={itemVariants}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClassName}>
                  <GraduationCap className="w-4 h-4" />
                  Degree
                </label>
                <input {...register('degree')} className={inputClassName} />
                <ErrorMessage error={errors.degree} />
              </div>

              <div>
                <label className={labelClassName}>
                  <School className="w-4 h-4" />
                  Institution
                </label>
                <input {...register('institution')} className={inputClassName} />
                <ErrorMessage error={errors.institution} />
              </div>

              <div>
                <label className={labelClassName}>
                  <Calendar className="w-4 h-4" />
                  Graduation Year
                </label>
                <input {...register('year')} className={inputClassName} />
                <ErrorMessage error={errors.year} />
              </div>
            </div>
          </motion.div>

          <motion.div className={sectionClassName} variants={itemVariants}>
            <h2 className="text-xl font-bold text-white mb-6">Skills & Languages</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skills</label>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <CustomSelector
                      options={skillOptions}
                      value={field.value.map(skill => ({ value: skill, label: skill }))}
                      onChange={(newValue) => {
                        field.onChange(newValue.map(option => option.value));
                      }}
                      placeholder="Select skills..."
                      error={errors.skills?.message}
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Languages</label>
                <Controller
                  name="languages"
                  control={control}
                  render={({ field }) => (
                    <CustomSelector
                      options={languageOptions}
                      value={field.value.map(language => ({ value: language, label: language }))}
                      onChange={(newValue) => {
                        field.onChange(newValue.map(option => option.value));
                      }}
                      placeholder="Select languages..."
                      error={errors.languages?.message}
                    />
                  )}
                />
              </div>
            </div>
          </motion.div>

          <motion.div className={sectionClassName} variants={itemVariants}>
            <h2 className="text-xl font-bold text-white mb-6">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClassName}>
                  <Github className="w-4 h-4" />
                  GitHub URL
                </label>
                <input {...register('github')} className={inputClassName} placeholder="https://github.com/username" />
                <ErrorMessage error={errors.github} />
              </div>

              <div>
                <label className={labelClassName}>
                  <Linkedin className="w-4 h-4" />
                  LinkedIn URL
                </label>
                <input {...register('linkedIn')} className={inputClassName} placeholder="https://linkedin.com/in/username" />
                <ErrorMessage error={errors.linkedIn} />
              </div>

              <div>
                <label className={labelClassName}>
                  <Twitter className="w-4 h-4" />
                  Twitter URL
                </label>
                <input {...register('twitter')} className={inputClassName} placeholder="https://twitter.com/username" />
                <ErrorMessage error={errors.twitter} />
              </div>

              <div>
                <label className={labelClassName}>
                  <Globe className="w-4 h-4" />
                  Portfolio URL
                </label>
                <input {...register('portfolio')} className={inputClassName} placeholder="https://yourportfolio.com" />
                <ErrorMessage error={errors.portfolio} />
              </div>
            </div>
          </motion.div>

          <motion.div className="flex justify-end" variants={itemVariants}>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20 hover:shadow-xl hover:shadow-purple-900/30"
            >
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Updating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Save Changes</span>
                </div>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditDeveloperProfile;