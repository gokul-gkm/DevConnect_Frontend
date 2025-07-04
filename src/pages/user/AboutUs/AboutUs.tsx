import { motion } from "framer-motion";
import { Code2, Users, Lightbulb, Target, Zap, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { HoverButton } from "@/components/ui/HoverButton";
import { HeroSection } from "@/components/user/home/HeroSection";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Role } from "@/types/types";
import DevNavbar from "@/components/layout/DevNavbar";

const AboutUs = () => {
  const {  role } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  const offerings = [
    {
      icon: <Code2 className="w-5 h-5" />,
      title: "Developer Network",
      description: "Connect with skilled developers worldwide, fostering collaboration and knowledge sharing across diverse tech communities."
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Project Collaboration",
      description: "Engage in meaningful projects, pair programming sessions, and code reviews to enhance your development skills."
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Learning Resources",
      description: "Access curated learning materials, tutorials, and documentation to stay updated with the latest technologies."
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Tools & Hackathons",
      description: "Participate in coding challenges, hackathons, and get access to premium development tools and resources."
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {role === Role.DEVELOPER ? <DevNavbar /> : <Navbar />}
    
          <div className="relative min-h-[80vh] flex items-center">
              <div className="container mx-auto px-6 lg:px-8 max-w-6xl  flex flex-col lg:flex-row items-center justify-between gap-12">
                  <HeroSection />
              </div>
          </div>
          
      <section className="bg-black py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="group relative flex flex-col p-10 md:p-12 rounded-2xl 
                        bg-gradient-to-b from-zinc-900/90 to-zinc-900/40
                        border border-zinc-800/50
                        transition-all duration-300 ease-out">
              <div className="relative z-10 max-w-4xl mx-auto">
                
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">
                  Welcome to DevConnect!
                </h2>
                
                <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 text-center">
                  DevConnect is more than just a platform; it's a thriving community for developers of all skill levels. 
                  Whether you're a beginner seeking guidance or a seasoned professional looking to share your expertise, 
                  DevConnect provides the tools and resources you need to grow, collaborate, and succeed in the tech world.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Code2 className="w-5 h-5 text-blue-400" />
                      <h3 className="text-white font-medium">Learn & Grow</h3>
                    </div>
                    <p className="text-sm text-gray-400">Access resources and mentorship to advance your skills</p>
                  </div>
                  <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-purple-400" />
                      <h3 className="text-white font-medium">Connect & Share</h3>
                    </div>
                    <p className="text-sm text-gray-400">Join a community of passionate developers</p>
                  </div>
                  <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-pink-400" />
                      <h3 className="text-white font-medium">Achieve Goals</h3>
                    </div>
                    <p className="text-sm text-gray-400">Reach your development milestones together</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-black py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="group relative flex flex-col p-10 md:p-12 rounded-2xl 
                        bg-gradient-to-b from-zinc-900/90 to-zinc-900/40
                        border border-zinc-800/50
                        transition-all duration-300 ease-out">
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-8">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
                  <h2 className="text-3xl md:text-4xl font-bold text-white whitespace-nowrap">Our Story</h2>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
                </div>

                <div className="space-y-6 mb-8">
                  <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                    DevConnect was born out of a simple idea: to bring developers together in a space 
                    that celebrates collaboration, learning, and innovation. Frustrated by the fragmented 
                    nature of developer communities, we set out to create a platform that bridges the gap 
                    between developers, mentors, companies, and projects.
                  </p>
                  
                  <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                    What started as a small project among passionate developers has now grown into a 
                    comprehensive network, bringing together coding enthusiasts, industry professionals, 
                    and tech companies to share insights, ideas, and opportunities.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-zinc-800/50">
                  <div className="bg-zinc-800/30 rounded-xl p-6 text-center">
                    <span className="text-3xl font-bold text-blue-400 block mb-1">2020</span>
                    <span className="text-sm text-gray-500 block mb-1">Founded</span>
                    <span className="text-sm text-gray-400">Platform Launch</span>
                  </div>

                  <div className="bg-zinc-800/30 rounded-xl p-6 text-center">
                    <span className="text-3xl font-bold text-purple-400 block mb-1">10K+</span>
                    <span className="text-sm text-gray-500 block mb-1">Members</span>
                    <span className="text-sm text-gray-400">Active Developers</span>
                  </div>

                  <div className="bg-zinc-800/30 rounded-xl p-6 text-center">
                    <span className="text-3xl font-bold text-pink-400 block mb-1">500+</span>
                    <span className="text-sm text-gray-500 block mb-1">Success</span>
                    <span className="text-sm text-gray-400">Projects Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-black py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-medium text-white mb-3">
              What We Offer at DevConnect
            </h2>
            <p className="text-gray-500 text-sm md:text-sm">
              Experience increased collaboration, improved learning, and higher productivity. Our tailored solutions 
              are designed to meet your unique development needs, ensuring lasting success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {offerings.map((offering, index) => (
              <div 
                key={index} 
                className="group relative flex flex-col items-center text-center p-6 rounded-xl 
                         bg-gradient-to-b from-zinc-900/90 to-zinc-900/40
                         backdrop-blur-sm border border-zinc-800/50
                         transition-all duration-500 ease-out
                         hover:bg-gradient-to-b hover:from-zinc-800/90 hover:to-zinc-900/60
                         hover:border-zinc-700/50 hover:-translate-y-1"
              >
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-gradient-to-b from-zinc-700/20 to-transparent" />

                <div className="relative z-10 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900
                                flex items-center justify-center
                                ring-1 ring-zinc-700/50 ring-offset-2 ring-offset-zinc-900
                                transform transition-all duration-500 ease-out
                                group-hover:ring-zinc-600/50 group-hover:scale-110
                                group-hover:shadow-[0_0_15px_rgba(39,39,42,0.3)]">
                    <div className="text-gray-400 transition-colors duration-500 group-hover:text-gray-200">
                      {offering.icon}
                    </div>
                  </div>
                </div>

                <h4 className="relative z-10 text-white text-lg font-medium mb-2.5
                             bg-gradient-to-r from-white to-gray-300 bg-clip-text
                             transition-all duration-500 group-hover:text-transparent">
                  {offering.title}
                </h4>
                <p className="relative z-10 text-gray-400 text-sm mb-4 
                             transition-colors duration-500 group-hover:text-gray-300
                             leading-relaxed">
                  {offering.description}
                </p>

                <HoverButton size='sm' onClick={() => navigate('/auth/login')}/>

                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-zinc-700/50 rounded-tl-xl
                             transition-all duration-500 group-hover:border-zinc-600/50" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-zinc-700/50 rounded-br-xl
                             transition-all duration-500 group-hover:border-zinc-600/50" />
              </div>
            ))}
          </div>
        </div>
          </section>
          
      <section className="bg-black py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
            
                      <div className="relative bg-gradient-to-b from-zinc-900/90 to-zinc-900/40 border border-zinc-800/50 rounded-2xl p-8 md:p-12 overflow-hidden group">
                          
              <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-zinc-700/50 rounded-tl-2xl
                           transition-all duration-500 group-hover:border-zinc-600/50" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-zinc-700/50 rounded-br-2xl
                           transition-all duration-500 group-hover:border-zinc-600/50" />
              
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/0 via-zinc-800/0 to-zinc-800/20 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white 
                             bg-clip-text text-transparent">
                  Join Us on Our Journey
                </h2>
                
                <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
                  Be part of our growing community of developers who are shaping the future of technology. 
                  Whether you're here to learn, teach, or collaborate, there's a place for you at DevConnect.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    onClick={() => navigate('/auth/register')}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
                             text-white rounded-full text-sm sm:text-base px-8 py-6 transform hover:scale-105 
                             transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                  >
                    Get Started Today
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/auth/login')}
                    size="lg"
                    variant="outline"
                    className="border-2 border-zinc-700 hover:border-zinc-500 text-white rounded-full 
                             text-sm sm:text-base px-8 py-6 transform hover:scale-105 transition-all duration-300
                             hover:bg-zinc-800/50"
                  >
                    Sign In
                  </Button>
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-800/50">
                  <div className="flex justify-center items-center gap-8 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span>10K+ Developers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-purple-400" />
                      <span>500+ Projects</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-pink-400" />
                      <span>24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;