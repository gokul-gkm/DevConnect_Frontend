import { HoverButton } from '@/components/ui/HoverButton';
import {  Code2, LightbulbIcon, Sparkles, Smartphone, Zap, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FeaturesSection() {
    const navigate = useNavigate();
  const features = [
    {
      icon: <Code2 className="w-5 h-5" />,
      title: "Connect with Top Developers",
      description:
        "Join a network of skilled developers from around the globe, sharing knowledge and opportunities for growth",
    },
    {
      icon: <LightbulbIcon className="w-5 h-5" />,
      title: "One-to-One Mentorship",
      description:
        "Get personalized guidance and mentorship from industry experts to accelerate your learning",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Collaborative Projects",
      description:
        "Engage in real-world projects with other developers to build your portfolio and skills",
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: "Live Coding Sessions",
      description:
        "Participate in interactive coding sessions to solve challenges and learn best practices in real-time",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Comprehensive Learning Resources",
      description:
        "Access a library of curated resources, tutorials, and articles to deepen your technical knowledge",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Community-Driven Discussions",
      description:
        "Join lively discussions on the latest trends in development, frameworks, and tools with a vibrant community",
    },
  ];

  return (
    <section className="bg-black py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-medium text-white mb-3">
            Reasons to Choose DevConnect for
          </h2>
          <h3 className="text-xl md:text-3xl text-neutral-400 mb-6 font-bold">
            Your Developer Journey
          </h3>
          <p className="text-gray-500 text-sm md:text-sm max-w-3xl mx-auto">
            Partnering with DevConnect offers a multitude of advantages. Experience increased brand visibility, improved customer engagement, and higher ROI. Our tailored solutions are designed to meet your unique business needs, ensuring lasting success.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
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
                    {feature.icon}
                  </div>
                </div>
              </div>

              <h4 className="relative z-10 text-white text-lg font-medium mb-2.5
                           bg-gradient-to-r from-white to-gray-300 bg-clip-text
                           transition-all duration-500 group-hover:text-transparent">
                {feature.title}
              </h4>
              <p className="relative z-10 text-gray-400 text-sm mb-4 
                           transition-colors duration-500 group-hover:text-gray-300
                           leading-relaxed">
                {feature.description}
              </p>

             
                <HoverButton size='sm' onClick={()=> navigate('/about')}/>


              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-zinc-700/50 rounded-tl-xl
                           transition-all duration-500 group-hover:border-zinc-600/50" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-zinc-700/50 rounded-br-xl
                           transition-all duration-500 group-hover:border-zinc-600/50" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}