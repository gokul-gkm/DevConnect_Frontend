import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/shadcn-button";
import AdminApi from "@/service/Api/AdminApi";
import { useQuery } from "@tanstack/react-query";

import {motion} from 'framer-motion'
import { useParams } from "react-router-dom";
export default function UserDetails() {
    const { userId } = useParams()
    
    const { data: userData, isLoading, error } = useQuery({
        queryKey: ['userDetails', userId],
        queryFn: () => userId ? AdminApi.getUserDetails(userId) : Promise.reject('No user ID provided'),
        enabled: !!userId, 
    });
    
    console.log(userData)

    




  const user = {
    name: "Mark Johnson",
    id: "ID#1234567890",
    avatar: "https://i.imghippo.com/files/GFY5894omo.jpg",
    reviewCount: 0,
    hourlyRate: 3500,
    totalEarnings: 20000,
    bio: "Hi, I'm Mark Johnson, Developer. If you can't handle, the answer is no. If two equally difficult paths exist, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).",
    contactInfo: {
      phone: "+91 123 456 123",
      email: "mark@example.com",
      location: "United States"
    },
    professional: {
      title: "Senior Mern Stack Developer",
      company: "growth+",
      experience: "2 years"
    },
    expertise: ["Node.js", "React.js", "MongoDB", "Next.js", "TypeScript"],
    availableTimes: ["10 AM", "11 AM", "2 PM", "4 PM", "5 PM"],
    languages: ["English", "Hindi", "Malayalam"],
    socialLinks: {
      github: "http://github.com",
      linkedin: "http://github.com",
      email: "mark@example.com",
      twitter: "http://twitter.com",
      portfolio: "http://example.com"
    },
    portfolio: [
      {
        id: 1,
        title: "E-Commerce Revolution",
        description: "A dynamic e-commerce platform that revolutionized online shopping for fashion enthusiasts...",
        image: "https://i.imghippo.com/files/GFY5894omo.jpg"
      },
      {
        id: 2,
        title: "E-Commerce Revolution",
        description: "A dynamic e-commerce platform that revolutionized online shopping for fashion enthusiasts...",
        image: "https://i.imghippo.com/files/GFY5894omo.jpg"
      },
      {
        id: 3,
        title: "E-Commerce Revolution",
        description: "A dynamic e-commerce platform that revolutionized online shopping for fashion enthusiasts...",
        image: "https://i.imghippo.com/files/GFY5894omo.jpg"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">

      <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto space-y-8"
            >
          
          <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-sm shadow-xl"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                            User Details
                        </h1>

                    </div>

                    
              </motion.div>
              
              </motion.div>

      <div className="max-w-6xl mx-auto p-6">
      
        <div className="rounded-lg border border-blue-500/20 bg-slate-900/50 p-6">
          <div className="flex justify-between items-start mb-8">
            <div className="flex gap-4">
              <img
                src={userData?.user?.profilePicture}
                alt={userData?.user.username}
                className="w-12 h-12 rounded-lg"
              />
              <div>
                <h2 className="text-lg font-medium text-slate-100">{userData?.user.username}</h2>
                <p className="text-sm text-slate-500">Last seen moments ago</p>
              </div>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              className="bg-transparent border border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-full px-6"
            >
              Block
            </Button>
          </div>

         
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900/50 p-4 rounded">
              <p className="text-sm text-slate-400">No of Sessions Booked</p>
              <p className="text-xl font-semibold text-slate-100 mt-1">{user.reviewCount}</p>
            </div>
        
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
         
              <div>
                <h3 className="text-lg font-medium text-slate-100 mb-4">Profile Informations</h3>
                <p className="text-slate-400 text-sm mb-4">{userData?.user?.bio}</p>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-400">Full Name:</p>
                    <p className="text-sm text-slate-300">{userData?.user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Mobile:</p>
                    <p className="text-sm text-slate-300">{userData?.user.contact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email:</p>
                    <p className="text-sm text-slate-300">{userData?.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Location:</p>
                    <p className="text-sm text-slate-300">{user.contactInfo.location}</p>
                  </div>
                </div>
              </div>


             
            </div>

            <div className="space-y-6">
                
            <div>
                <h3 className="text-lg font-medium text-slate-100 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.expertise.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-slate-800/50 text-slate-300 border-none text-xs px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-slate-100 mb-4">Social Media</h3>
                <div className="space-y-2">
                  {Object.entries(user.socialLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300"
                    >
                      <span className="text-slate-500">•</span>
                      {url}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
}