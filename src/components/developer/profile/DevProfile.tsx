import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Edit, Github, Linkedin, Twitter, Globe, MapPin, Mail, Phone, Download, Briefcase, Building2, GraduationCap, Code, Languages, DollarSign, School, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { useDeveloperProfile } from '@/hooks/profile/useDeveloperProfile';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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

const DeveloperProfile = () => {

  const { profile, isLoading, error } = useDeveloperProfile();

  if (isLoading) {
    return <LoadingSpinner text='Loading developer profile...' bgColor='dark' />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black/80 px-4 py-24">
        <div className="max-w-5xl mx-auto text-center text-rose-400">
          Error loading profile
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-6 lg:py-0 px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-20 backdrop-blur-xl bg-black/80 border-b border-white/5 -mx-4 px-4 py-6 sm:px-6"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
          >
            Developer Profile
          </motion.h1>
          <Link to="/developer/edit-profile">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white/5 backdrop-blur-sm text-white rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </div>
            </motion.button>
          </Link>
        </div>
      </motion.div>

      <div className="space-y-6 py-8">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            "group relative overflow-hidden rounded-2xl border",
            "bg-gradient-to-br from-black to-gray-900/50",
            "border-white/5 hover:border-white/10 transition-all duration-300",
            "shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50"
          )}
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-6">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <img
                    src={profile?.profilePicture || "/default-avatar.jpg"}
                    alt="Profile"
                    className="w-24 h-24 rounded-2xl object-cover border border-white/10"
                  />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{profile?.username}</h1>
                  <p className="text-gray-400">{profile?.jobTitle}</p>
                  <div className="flex items-center gap-2 text-gray-400 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile?.location || 'Location not specified'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-white">{profile?.email}</span>
              </div>
              {profile?.contact && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-white">{profile?.contact}</span>
                </div>
              )}
              <div className="flex items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-white">{profile?.hourlyRate}/hour</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={cn(
            "group relative overflow-hidden rounded-2xl border",
            "bg-gradient-to-br from-black to-gray-900/50",
            "border-white/5 hover:border-white/10 transition-all duration-300",
            "shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50"
          )}
        >
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4">About</h2>
            <p className="text-gray-400">{profile?.bio}</p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={cn(
            "group relative overflow-hidden rounded-2xl border",
            "bg-gradient-to-br from-black to-gray-900/50",
            "border-white/5 hover:border-white/10 transition-all duration-300",
            "shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50"
          )}
        >
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-6">Professional Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="text-white font-semibold">Experience</h3>
                  <p className="text-gray-400">{profile?.experience}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="text-white font-semibold">Company</h3>
                  <p className="text-gray-400">{profile?.companyName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <Code className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="text-white font-semibold">Job Title</h3>
                  <p className="text-gray-400">{profile?.jobTitle}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {profile?.education && (
          <motion.div
            variants={itemVariants}
            className={cn(
              "group relative overflow-hidden rounded-2xl border",
              "bg-gradient-to-br from-black to-gray-900/50",
              "border-white/5 hover:border-white/10 transition-all duration-300",
              "shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50"
            )}
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-bold text-white">Education</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <div>
                    <h3 className="text-white font-semibold">Degree</h3>
                    <p className="text-gray-400">{profile?.education?.degree}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <School className="w-5 h-5 text-gray-400" />
                  <div>
                    <h3 className="text-white font-semibold">Institution</h3>
                    <p className="text-gray-400">{profile?.education?.institution}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <h3 className="text-white font-semibold">Graduation Year</h3>
                    <p className="text-gray-400">{profile?.education?.year}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            variants={itemVariants}
            className={cn(
              "group relative overflow-hidden rounded-2xl border",
              "bg-gradient-to-br from-black to-gray-900/50",
              "border-white/5 hover:border-white/10 transition-all duration-300",
              "shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50"
            )}
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-bold text-white">Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile?.skills?.map((skill: string, index: any) => (
                  <Badge
                    key={index}
                    className="px-4 py-2 rounded-xl bg-white/5 text-white border-white/10 hover:bg-white/10"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={cn(
              "group relative overflow-hidden rounded-2xl border",
              "bg-gradient-to-br from-black to-gray-900/50",
              "border-white/5 hover:border-white/10 transition-all duration-300",
              "shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50"
            )}
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Languages className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-bold text-white">Languages</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile?.languages?.map((language: string, index: any) => (
                  <Badge
                    key={index}
                    className="px-4 py-2 rounded-xl bg-white/5 text-white border-white/10 hover:bg-white/10"
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className={cn(
            "group relative overflow-hidden rounded-2xl border",
            "bg-gradient-to-br from-black to-gray-900/50",
            "border-white/5 hover:border-white/10 transition-all duration-300",
            "shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50"
          )}
        >
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-6">Links & Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Social Links</h3>
                <div className="flex gap-4">
                  {profile?.socialLinks?.github && (
                    <motion.a 
                      href={profile.socialLinks?.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2 }}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </motion.a>
                  )}
                  {profile?.socialLinks?.linkedIn && (
                    <motion.a 
                      href={profile.socialLinks?.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2 }}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </motion.a>
                  )}
                  {profile?.socialLinks?.twitter && (
                    <motion.a 
                      href={profile.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2 }}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </motion.a>
                  )}
                  {profile?.socialLinks?.portfolio && (
                    <motion.a 
                      href={profile.socialLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2 }}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                    </motion.a>
                  )}
                </div>
              </div>

              {profile?.resume && (
                <div>
                  <h3 className="text-white font-semibold mb-4">Resume</h3>
                  <motion.a
                    href={profile.resume}
                    download
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm text-white rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Resume</span>
                  </motion.a>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeveloperProfile;