import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/shadcn-button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/Label';
import { ArrowLeft, Upload, Link as LinkIcon, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProjectFormValues, projectSchema } from '@/utils/validation/projectValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddProject } from '@/hooks/projects/useAddProject';

const AddProject = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      projectLink: "",
    }
  });

  const [previewImage, setPreviewImage] = useState<string>('');
  const navigate = useNavigate();
  const { addProject, isSubmitting } = useAddProject();
  
  const watchCoverImage = watch("coverImage");
  
  useEffect(() => {
    if (watchCoverImage instanceof FileList && watchCoverImage[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(watchCoverImage[0]);
    }
  }, [watchCoverImage]);
  
  const onSubmit = async(data: ProjectFormValues) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('description', data.description);
    if (data.projectLink) {
      formData.append('projectLink', data.projectLink);
    }
    if (data.coverImage instanceof FileList && data.coverImage.length > 0) {
      formData.append('coverImage', (data.coverImage as FileList)[0]);
    }
    
    addProject(formData);
    reset();
    setPreviewImage('');
  };
  
  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewImage('');
    reset({ coverImage: undefined });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-6 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-black" />
     
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />

      <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-start mb-8 px-4"
        >
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white group flex items-center gap-2 
                     hover:bg-white/5 transition-all duration-300"
            onClick={()=> navigate('/developer/portfolio')}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Projects</span>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white/5 rounded-2xl 
                   border border-white/10
                   backdrop-blur-xl overflow-hidden
                   shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        >
          <div className="relative px-8 pt-8 pb-6 text-center bg-gradient-to-b from-white/[0.08] to-transparent">
            <h1 className="text-4xl font-bold text-white mb-3">
              Create New Project
            </h1>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label className="text-white/90 font-medium ml-1">Project Title</Label>
                  <div className="relative group">
                    <Input
                      {...register("title")}
                      className="bg-black/40 border-white/10 text-white/90 h-12
                               focus:border-white/20 focus:ring-2 focus:ring-white/10 
                               hover:border-white/20 transition-colors duration-300
                               placeholder:text-white/30"
                      placeholder="Enter project title"
                    />
                  </div>
                  {errors.title && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-400 text-sm ml-1"
                    >
                      {errors.title.message}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white/90 font-medium ml-1">Category</Label>
                  <div className="relative group">
                    <Input
                      {...register("category")}
                      className="bg-black/40 border-white/10 text-white/90 h-12
                               focus:border-white/20 focus:ring-2 focus:ring-white/10 
                               hover:border-white/20 transition-colors duration-300
                               placeholder:text-white/30"
                      placeholder="E.g., E-commerce, Portfolio"
                    />
                  </div>
                  {errors.category && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-400 text-sm ml-1"
                    >
                      {errors.category.message}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/90 font-medium ml-1">Description</Label>
                <div className="relative group">
                  <Textarea
                    {...register("description")}
                    className="bg-black/40 border-white/10 text-white/90 min-h-[120px] 
                             focus:border-white/20 focus:ring-2 focus:ring-white/10 
                             hover:border-white/20 transition-colors duration-300
                             placeholder:text-white/30 rounded-xl"
                    placeholder="Describe your project..."
                  />
                </div>
                {errors.description && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-400 text-sm ml-1"
                  >
                    {errors.description.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-white/90 font-medium ml-1">Project Link</Label>
                <div className="relative group">
                  <Input
                    {...register("projectLink")}
                    className="bg-black/40 border-white/10 text-white/90 pl-10 h-12
                             focus:border-white/20 focus:ring-2 focus:ring-white/10 
                             hover:border-white/20 transition-colors duration-300
                             placeholder:text-white/30"
                    placeholder="https://your-project.com"
                  />
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                </div>
                {errors.projectLink && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-400 text-sm ml-1"
                  >
                    {errors.projectLink.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-white/90 font-medium ml-1">Cover Image</Label>
                <div className="relative">
                  <input
                    type="file"
                    id="coverImage"
                    accept="image/*"
                    {...register("coverImage")}
                    className="hidden"
                  />
                  <div
                    onClick={() => document.getElementById('coverImage')?.click()}
                    className="relative cursor-pointer group"
                  >
                    {previewImage ? (
                      <div className="relative rounded-xl overflow-hidden">
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="w-full aspect-video object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                                    transition-all duration-300 flex items-center justify-center">
                          <div className="flex flex-col items-center transform translate-y-4 
                                      group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-white font-medium mb-3">Change Image</p>
                            <Button
                              type="button"
                              onClick={clearImage}
                              variant="outline"
                              size="sm"
                              className="bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-500 rounded-xl"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-xl border-2 border-dashed border-white/20 aspect-video
                                  hover:border-white/40 transition-all duration-300 
                                  group-hover:bg-white/[0.02]">
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Upload className="w-8 h-8 text-white/40 mb-2 
                                        group-hover:text-white/60 transition-colors duration-300" />
                          <p className="text-white/60 font-medium group-hover:text-white/80 transition-colors duration-300">
                            Click to upload project cover image
                          </p>
                          <p className="text-white/40 text-sm mt-1">Recommended: 1920x1080px</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.coverImage && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-400 text-sm ml-1 mt-2"
                    >
                      {errors.coverImage.message}
                    </motion.p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative overflow-hidden rounded-xl h-14
                         bg-gradient-to-r from-white/10 to-white/5
                         hover:from-white/20 hover:to-white/10
                         text-white font-medium text-lg
                         transition-all duration-300
                         border border-white/10 hover:border-white/20"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 
                              group-hover:-translate-y-1 transition-transform duration-300">
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white/90 
                                rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Create Project
                    </>
                  )}
                </span>
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProject;