import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/shadcn-button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import { useProject } from '@/hooks/projects/useProject';
import { useUpdateProject } from '@/hooks/projects/useUpdateProject';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ImageIcon, ArrowLeft } from 'lucide-react';


import { ProjectFormValues, projectSchema } from '@/utils/validation/projectValidation';
import { toast } from 'react-hot-toast';

const EditProject = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState<string>('');
    const { data: project, isLoading: isProjectLoading } = useProject(projectId!);
    const { mutate: updateProject, isPending } = useUpdateProject();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        mode: 'onSubmit'
    });

    useEffect(() => {
        if (project) {
            reset({
                title: project.title,
                category: project.category,
                description: project.description,
                projectLink: project.projectLink || '',
            });
            setPreviewImage(project.coverImage);
        }
    }, [project, reset]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('coverImage', file as any);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: ProjectFormValues) => {
        try {
            if (!projectId) {
                toast.error('Project ID is missing');
                return;
            }
            const formData = new FormData();

            formData.append('projectId', projectId!);
            formData.append('title', data.title);
            formData.append('category', data.category);
            formData.append('description', data.description);
            if (data.projectLink) {
                formData.append('projectLink', data.projectLink);
            }
            if (data.coverImage && data.coverImage instanceof File) {
                formData.append('coverImage', data.coverImage);
            }

            if (!projectId) {
                toast.error('Project ID is missing');
                return;
            }            
            await updateProject(formData, {
                onSuccess: () => {
                    navigate('/developer/portfolio');
                },
                onError: (error: any) => {
                    console.error('Submit Error:', error);
                    toast.error(error.message || 'Failed to update project');
                },
            });
        } catch (error: any) {
            console.error('Submit Error:', error);
            toast.error(error.message || 'Failed to update project');
        }
       
    };

    const onSubmitWrapper = handleSubmit((data) => {
        return onSubmit(data);
    }, (errors) => {
        console.log('Form validation errors:', errors);
    });

    if (isProjectLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black p-4 sm:p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.7),rgba(0,0,0,0.4))]" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5" />
            
            <div className="container mx-auto max-w-4xl relative">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    onClick={() => navigate('/developer/portfolio')}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Portfolio</span>
                </motion.button>

                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70 text-center">
                        Edit Project
                    </h1>
                   
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10"
                >
                    <form onSubmit={
                        onSubmitWrapper}
                        onError={(errors) => {
                console.log('Form Validation Errors:', errors);
            }} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Project Title
                                </label>
                                <Input
                                    {...register('title')}
                                    className="bg-white/5 border-white/10 text-white"
                                    placeholder="Enter project title"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Category
                                </label>
                                <Input
                                    {...register('category')}
                                    className="bg-white/5 border-white/10 text-white"
                                    placeholder="Enter project category"
                                />
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Description
                            </label>
                            <Textarea
                                {...register('description')}
                                className="dark:bg-white/5 border-white/10 text-white min-h-[120px] rounded-xl"
                                placeholder="Enter project description"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Project Link (Optional)
                            </label>
                            <Input
                                {...register('projectLink')}
                                className="bg-white/5 border-white/10 text-white"
                                placeholder="https://your-project.com"
                            />
                            {errors.projectLink && (
                                <p className="mt-1 text-sm text-red-500">{errors.projectLink.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Cover Image
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/[0.07] transition-colors relative overflow-hidden group">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                                            {previewImage ? (
                                                <div className="relative w-full h-full">
                                                    <img
                                                        src={previewImage}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <p className="text-white text-sm">Click to change image</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <ImageIcon className="w-12 h-12 text-white/40 mb-4" />
                                                    <p className="text-sm text-white/60">
                                                        Click to upload project image
                                                    </p>
                                                    <p className="text-xs text-white/40 mt-1">
                                                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={isPending}
                                onClick={() => console.log('Submit button clicked')}
                                className="relative overflow-hidden px-6 py-2.5 rounded-xl
                                         bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                                         hover:from-indigo-600 hover:to-purple-600
                                         transition-all duration-300 disabled:opacity-50
                                         shadow-[0_0_20px_rgba(99,102,241,0.3)]
                                         hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                            >
                                {isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                Update Project
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/developer/portfolio')}
                                className="px-6 py-2.5 rounded-xl
                                         border border-white/10 text-white/80
                                         hover:bg-white/5 hover:text-white
                                         transition-all duration-300"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default EditProject;