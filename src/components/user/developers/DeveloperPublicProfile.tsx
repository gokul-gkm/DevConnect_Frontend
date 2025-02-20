import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, Linkedin, Twitter, Globe, MapPin, 
  Calendar, Code, Languages, DollarSign, Clock,
  GraduationCap, Briefcase, Building2, Star,
  User, Zap, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import { Badge } from "@/components/ui/badge";
import { Spinner } from '@/components/ui/spinner';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ProjectCard from './ProjectCard';
import { useDeveloperPublicProfile } from '@/hooks/profile/useDeveloperPublicProfile';

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

const DeveloperPublicProfile = () => {
  const { developerId } = useParams();
  const navigate = useNavigate();


  const { profile, isLoading, error } = useDeveloperPublicProfile(developerId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative">
          <div className="absolute inset-0 bg-white/5 blur-xl rounded-full" />
          <Spinner className="w-12 h-12 text-white" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black/95 pt-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-950/50 border border-rose-500/20 mb-4">
            <Zap className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="text-xl font-semibold text-rose-400">Error loading profile</h3>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Rating',
      value: profile?.developerProfile?.rating || 0,
      icon: Star,
      gradient: 'from-amber-950 to-black',
      suffix: '/5'
    },
    {
      label: 'Sessions',
      value: profile?.developerProfile?.totalSessions || 0,
      icon: CheckCircle,
      gradient: 'from-emerald-950 to-black',
      suffix: ' Total'
    },
    {
      label: 'Rate',
      value: profile?.developerProfile?.hourlyRate || 0,
      icon: DollarSign,
      gradient: 'from-blue-950 to-black',
      prefix: '$',
      suffix: '/hr'
    },
    {
      label: 'Experience',
      value: profile?.developerProfile?.experience || 0,
      icon: Clock,
      gradient: 'from-purple-950 to-black',
      suffix: ' Years'
    }
  ];

  return (
    <motion.div
      className="min-h-screen bg-black/95"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-20 z-50 backdrop-blur-xl bg-black/80 border-b border-white/5 px-4 py-4"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={profile?.profilePicture || "/default-avatar.jpg"}
                alt="Profile"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/50"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent" />
            </motion.div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
              >
                {profile?.username}
              </motion.h1>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{profile?.location || 'Location not specified'}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate(`/sessions/booking/${developerId}`)}
            className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-800 text-white font-medium px-6 py-4 h-11 rounded-2xl flex items-center gap-2 shadow-lg shadow-purple-950/50 border border-white/10"
          >
            <Calendar className="w-4 h-4" />
            Book a Session
          </Button>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative overflow-hidden rounded-2xl p-4",
                "bg-gradient-to-br",
                stat.gradient,
                "border border-white/5 hover:border-white/10 transition-all duration-300",
                "shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-white/5 border border-white/10">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                  <div className="text-xl font-bold text-white">
                    {stat.prefix}{stat.value}{stat.suffix}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-neutral-900 to-black border border-white/5 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-purple-500/10 rounded-2xl">
              <User className="w-4 h-4 text-purple-500" />
            </div>
            <h2 className="text-lg font-bold text-white">About</h2>
          </div>
          <p className="text-gray-400">{profile?.bio}</p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-neutral-900 to-black border border-white/5 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-2xl">
              <Briefcase className="w-4 h-4 text-purple-500" />
            </div>
            <h2 className="text-lg font-bold text-white">Professional Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Building2,
                label: 'Company',
                value: profile?.developerProfile?.workingExperience?.companyName
              },
              {
                icon: Code,
                label: 'Job Title',
                value: profile?.developerProfile?.workingExperience?.jobTitle
              },
              {
                icon: GraduationCap,
                label: 'Education',
                value: profile?.developerProfile?.education?.degree,
                subValue: profile?.developerProfile?.education?.institution
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition-colors">
                    <item.icon className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{item.label}</h3>
                    <p className="text-gray-400">{item.value}</p>
                    {item.subValue && (
                      <p className="text-gray-500 text-sm mt-1">{item.subValue}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-neutral-900 to-black border border-white/5 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-2xl">
                <Code className="w-4 h-4 text-purple-500" />
              </div>
              <h2 className="text-lg font-bold text-white">Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile?.developerProfile?.expertise?.map((skill: string, index: number) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge
                    className="px-3 py-1.5 rounded-2xl bg-purple-950/50 text-purple-400 border-purple-500/20 hover:bg-purple-900/50"
                  >
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-neutral-900 to-black border border-white/5 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-2xl">
                <Languages className="w-4 h-4 text-purple-500" />
              </div>
              <h2 className="text-lg font-bold text-white">Languages</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile?.developerProfile?.languages?.map((language: string, index: number) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge
                    className="px-3 py-1.5 rounded-2xl bg-blue-950/50 text-blue-400 border-blue-500/20 hover:bg-blue-900/50"
                  >
                    {language}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-neutral-900 to-black border border-white/5 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-2xl">
              <Globe className="w-4 h-4 text-purple-500" />
            </div>
            <h2 className="text-lg font-bold text-white">Connect</h2>
          </div>
          <div className="flex gap-3">
            {[
              { icon: Github, link: profile?.socialLinks?.github },
              { icon: Linkedin, link: profile?.socialLinks?.linkedIn },
              { icon: Twitter, link: profile?.socialLinks?.twitter },
              { icon: Globe, link: profile?.socialLinks?.portfolio }
            ].map((social, index) => (
              social.link && (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <social.icon className="w-4 h-4 text-purple-400" />
                </motion.a>
              )
            ))}
          </div>
        </motion.div>

        {profile?.portfolio && profile.portfolio.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-neutral-900 to-black border border-white/5 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-2xl">
              <Code className="w-4 h-4 text-purple-500" />
              </div>
              <h2 className="text-lg font-bold text-white">Portfolio Projects</h2>
            </div>
            
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.portfolio.map((project: any) => (
                  <motion.div
                    key={project._id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="group relative overflow-hidden"
                  >
                    <ProjectCard project={project} />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </motion.div>
        )}

        <div className="h-16" /> 
      </div>
    </motion.div>
  );
};

export default DeveloperPublicProfile;