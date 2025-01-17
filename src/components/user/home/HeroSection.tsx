import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
import { useAppSelector } from "@/hooks/useAppSelector";

export function HeroSection() {
  const navigate = useNavigate();
   const { isAuthenticated } = useAppSelector((state) => state.user);


  const textAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 } 
    }
  };

 
  const words = ["Connect,", "Collaborate,", "and", "Code"];
  
  return (
    <div className="relative min-h-[80vh] flex items-center mt-6 md:mt-20">
      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 max-w-2xl ps-3">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 flex flex-wrap gap-x-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            {words.map((word, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut"
                    }
                  }
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p 
            className="text-gray-400 text-sm mb-8 max-w-xl"
            variants={textAnimation}
            initial="hidden"
            animate="visible"
          >
            At DevConnect, we empower developers to build, learn, and thrive together. 
            Our platform is designed to connect passionate developers, share knowledge, 
            and foster collaboration. Whether you're looking to join expert-led sessions, 
            explore valuable resources, or engage in community discussions, DevConnect is 
            your space to grow in the ever-evolving world of technology.
          </motion.p>
          {!isAuthenticated &&
            <motion.div
              className="flex gap-4"
              variants={textAnimation}
              initial="hidden"
              animate="visible"
            >
              <Button
                onClick={() => navigate('/auth/register')}
                size="lg"
                className="bg-white text-black dark:hover:bg-black hover:text-white hover:border hover:border-white rounded-full text-sm sm:text-base"
              >
                Get Started
              </Button>
              <Button
                onClick={() => navigate('/auth/login')}
                size="lg"
                variant="outline"
                className="rounded-full dark:hover:bg-white dark:hover:text-black hover:border hover:border-black text-sm sm:text-base"
              >
                SignIn
              </Button>
            </motion.div>
          }
        </div>

        <motion.div 
          className="flex-1 flex justify-center lg:justify-center md:justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-48 h-48 md:w-64 md:h-64">
            <img
              src="https://i.imghippo.com/files/NPo1259thc.png"
              alt="DC Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}