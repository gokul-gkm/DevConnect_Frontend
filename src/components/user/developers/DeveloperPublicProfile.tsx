import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Github, Linkedin, Twitter, Globe, MapPin, 
  Calendar, Code, Languages, DollarSign, Clock,
  GraduationCap, Briefcase, Building2, Star,
  User, Zap, CheckCircle,
  MessageSquare
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Spinner } from '@/components/ui/spinner';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useDeveloperPublicProfile } from '@/hooks/profile/useDeveloperPublicProfile';
import { ChatApi } from '@/service/Api/ChatApi';
import toast from 'react-hot-toast';
import ProjectCarousel from './ProjectCarousel';

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

  const handleStartChat = async () => {
    try {
      const response = await ChatApi.createChat(developerId!);
      navigate(`/chats/${response.chat._id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to start chat');
    }
  }

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
        className="bg-black/80 border-b border-white/5 backdrop-blur-xl mt-20"
      >
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={profile?.profilePicture || "/default-avatar.jpg"}
                alt="Profile"
                className="w-32 h-32 rounded-2xl object-cover border-2 border-purple-500/30"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent group-hover:from-purple-500/30 transition-all duration-300" />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300" />
            </motion.div>
            
            <div className="flex-1">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent text-center md:text-left"
              >
                {profile?.username}
              </motion.h1>
              <div className="flex items-center gap-2 text-gray-400 mt-2 justify-center md:justify-start">
                <MapPin className="w-4 h-4" />
                <span>{profile?.location || 'Location not specified'}</span>
              </div>
              
              <div className="flex gap-4 mt-6 justify-center md:justify-start">
                <motion.button
                  onClick={handleStartChat}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl shadow-lg shadow-indigo-950/20 border border-white/10 transition-all duration-300"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium">Chat with Developer</span>
                </motion.button>

                <motion.button
                  onClick={() => navigate(`/sessions/booking/${developerId}`)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl shadow-lg shadow-purple-950/20 border border-white/10 transition-all duration-300"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Book Session</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
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
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <User className="w-4 h-4 text-purple-400" />
            </div>
            <h2 className="text-lg font-bold text-white">About</h2>
          </div>
          <p className="text-gray-400 leading-relaxed">{profile?.bio}</p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-neutral-900 to-black border border-white/5 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <Briefcase className="w-4 h-4 text-purple-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Work Experience</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                  <Building2 className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Company</div>
                  <div className="text-white font-medium mt-1">
                    {profile?.developerProfile?.workingExperience?.companyName || 'Not Specified'}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                  <Code className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Job Title</div>
                  <div className="text-white font-medium mt-1">
                    {profile?.developerProfile?.workingExperience?.jobTitle || 'Not Specified'}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                  <Clock className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Experience</div>
                  <div className="text-white font-medium mt-1">
                    {profile?.developerProfile?.experience || '0'} Years
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-neutral-900 to-black border border-white/5 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <GraduationCap className="w-4 h-4 text-purple-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Education</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Degree</div>
                  <div className="text-white font-medium mt-1">
                    {profile?.developerProfile?.education?.degree || 'Not Specified'}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                  <Building2 className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Institution</div>
                  <div className="text-white font-medium mt-1">
                    {profile?.developerProfile?.education?.institution || 'Not Specified'}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                  <Calendar className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Graduation Year</div>
                  <div className="text-white font-medium mt-1">
                    {profile?.developerProfile?.education?.year || 'Not Specified'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-neutral-900 to-black border border-white/5 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <Code className="w-4 h-4 text-purple-400" />
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
                    className="px-3 py-1.5 rounded-xl bg-purple-950/50 text-purple-400 border-purple-500/20 hover:bg-purple-900/50"
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
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <Languages className="w-4 h-4 text-purple-400" />
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
                    className="px-3 py-1.5 rounded-xl bg-indigo-950/50 text-indigo-400 border-indigo-500/20 hover:bg-indigo-900/50"
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
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <Globe className="w-4 h-4 text-purple-400" />
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
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
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
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <Code className="w-4 h-4 text-purple-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Portfolio Projects</h2>
            </div>
            
            <ProjectCarousel projects={profile.portfolio} />
          </motion.div>
        )}

        <div className="h-16" /> 
      </div>
    </motion.div>
  );
};

export default DeveloperPublicProfile;