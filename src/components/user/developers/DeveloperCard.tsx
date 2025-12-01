import { useState, useEffect } from "react";
import {
  Github,
  Linkedin,
  Twitter,
  DollarSign,
  User,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface DeveloperCardProps {
  developer: {
    _id: string;
    username: string;
    email: string;
    title?: string;
    profilePicture?: string;
    socialLinks?: {
      github?: string;
      linkedin?: string;
      twitter?: string;
    };
    developerProfile?: {
      bio?: string;
      hourlyRate?: number;
      languages?: string[];
      skills?: string[];
      title?: string;
    };
  };
  index: number;
}

const DeveloperCard = ({ developer, index }: DeveloperCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isActive3D, setIsActive3D] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const skills = developer.developerProfile?.skills || [];
  const languages = developer.developerProfile?.languages || [];
  const title =
    developer.title ||
    developer.developerProfile?.title ||
    "Software Developer";
  const hourlyRate = developer.developerProfile?.hourlyRate;

  useEffect(() => {
    if (isFlipped && !isActive3D) {
      const timer = setTimeout(() => setIsFlipped(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isFlipped, isActive3D]);

  const handleViewProfile = () => {
    navigate(`/dev-profile/${developer._id}`);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive3D) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = -((y - centerY) / centerY) * 5;

    setMousePosition({ x: rotateY, y: rotateX });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="w-full max-w-full sm:max-w-[220px] md:max-w-[240px] lg:max-w-[260px] xl:max-w-[280px]"
      style={{ perspective: "1500px", height: "320px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="w-full h-full"
        animate={{
          rotateY: isFlipped ? 180 : mousePosition.x,
          rotateX: isFlipped ? 0 : mousePosition.y,
          z: isActive3D ? 15 : 0,
          scale: isActive3D ? 1.02 : 1,
        }}
        transition={{
          duration: isFlipped ? 0.8 : 0.3,
          type: isFlipped ? "spring" : "tween",
          stiffness: 70,
          damping: 15,
        }}
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          boxShadow: isActive3D
            ? "0 15px 35px rgba(0,0,0,0.25), 0 0 20px rgba(79, 70, 229, 0.1)"
            : "0 10px 25px rgba(0,0,0,0.2)",
        }}
      >
        <motion.div
          className="absolute w-full h-full rounded-xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden" as const,
            background:
              "linear-gradient(135deg, rgba(15,15,20,0.95) 0%, rgba(10,10,15,0.98) 100%)",
            boxShadow: "0 15px 35px -12px rgba(0,0,0,0.5)",
            border: "1px solid rgba(30,30,40,0.4)",
            transform: `translateZ(${isActive3D ? "10px" : "0px"})`,
          }}
        >
          <div
            className="absolute inset-0 rounded-xl border-2 border-indigo-500/5"
            style={{ transform: "translateZ(1px)" }}
          />
          <div
            className="absolute inset-0 rounded-xl border border-indigo-500/10"
            style={{ transform: "translateZ(2px)" }}
          />

          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-transparent to-purple-600/5 opacity-50" />

          <div
            className="relative h-full flex flex-col p-4"
            style={{ transform: "translateZ(5px)" }}
          >
            <div className="flex flex-col items-center mb-2">
              <motion.div
                className="relative w-40 h-40 rounded-full overflow-hidden mb-3
                         border-2 border-indigo-500/20"
                whileHover={{
                  scale: 1.03,
                  borderColor: "rgba(99, 102, 241, 0.3)",
                  z: 10,
                }}
                onHoverStart={() => setIsActive3D(true)}
                style={{
                  boxShadow: "0 0 15px rgba(79, 70, 229, 0.15)",
                  background:
                    "linear-gradient(45deg, rgba(49, 46, 129, 0.2), rgba(79, 70, 229, 0.1))",
                  transform: "translateZ(8px)",
                }}
              >
                <img
                  src={developer.profilePicture || "/default-avatar.png"}
                  alt={developer.username}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <h3
                className="text-base font-medium text-gray-100 text-center mb-0.5 line-clamp-1"
                style={{ transform: "translateZ(12px)" }}
              >
                {developer.username}
              </h3>
              <p
                className="text-xs text-indigo-200/60 text-center mb-1 line-clamp-1"
                style={{ transform: "translateZ(10px)" }}
              >
                {title}
              </p>

              {hourlyRate && (
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-xl
                           bg-indigo-950/40 text-indigo-100 text-xs backdrop-blur-sm
                           border border-indigo-500/10 mb-2"
                  style={{ transform: "translateZ(15px)" }}
                >
                  <DollarSign className="w-3 h-3 text-indigo-300" />
                  <span>{hourlyRate}/hr</span>
                </div>
              )}
            </div>

            <div className="mt-auto" style={{ transform: "translateZ(12px)" }}>
              <motion.button
                onHoverStart={() => setIsActive3D(true)}
                onHoverEnd={() => setTimeout(() => setIsActive3D(false), 1000)}
                whileHover={{ scale: 1.01, z: 20 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleViewProfile}
                className="w-[calc(100%-3rem)] mx-auto py-1.5 rounded-xl
                         bg-gradient-to-r from-indigo-800 to-purple-800
                         text-white text-xs font-medium
                         border border-indigo-700/30
                         flex items-center justify-center gap-1.5"
              >
                <span>View Profile</span>
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
                >
                  <ExternalLink className="w-3 h-3" />
                </motion.div>
              </motion.button>
            </div>

            <motion.button
              className="absolute bottom-2 right-2 p-1.5 rounded-full bg-indigo-950/40 text-indigo-300/70 border border-indigo-500/10"
              onClick={() => {
                setIsActive3D(!isActive3D);
                !isFlipped && setIsFlipped(true);
              }}
              whileHover={{
                scale: 1.08,
                backgroundColor: "rgba(67, 56, 202, 0.3)",
              }}
              animate={{ rotate: isActive3D ? 180 : 0 }}
              style={{ transform: "translateZ(12px)" }}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          <div
            className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"
            style={{ transform: "translateZ(3px)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-purple-600/5 blur-xl pointer-events-none"
            style={{ transform: "translateZ(1px)" }}
          />
          <div
            className="absolute top-8 left-8 w-12 h-12 rounded-full bg-indigo-600/5 blur-xl pointer-events-none"
            style={{ transform: "translateZ(2px)" }}
          />
        </motion.div>

        <motion.div
          className="absolute w-full h-full rounded-xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden" as const,
            background:
              "linear-gradient(135deg, rgba(15,15,20,0.9) 0%, rgba(10,10,15,0.95) 100%)",
            boxShadow: "0 15px 35px -12px rgba(0,0,0,0.5)",
            border: "1px solid rgba(30,30,40,0.4)",
            transform: "rotateY(180deg) translateZ(10px)",
          }}
        >
          <div
            className="absolute inset-0 rounded-xl border-2 border-indigo-500/5"
            style={{ transform: "translateZ(1px)" }}
          />
          <div
            className="absolute inset-0 rounded-xl border border-indigo-500/10"
            style={{ transform: "translateZ(2px)" }}
          />

          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/5 via-transparent to-indigo-600/5 opacity-60" />

          <div
            className="relative h-full flex flex-col p-4 mt-2"
            style={{ transform: "translateZ(5px)" }}
          >
            <h3
              className="text-sm font-medium text-gray-200 mb-3 flex items-center"
              style={{ transform: "translateZ(8px)" }}
            >
              <User className="w-3.5 h-3.5 text-indigo-400/70 mr-1.5" />
              About {developer.username}
            </h3>

            <div
              className="mb-3 overflow-y-auto max-h-20"
              style={{ transform: "translateZ(8px)" }}
            >
              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-4">
                {developer.developerProfile?.bio || "No bio available"}
              </p>
            </div>

            <div className="mb-3" style={{ transform: "translateZ(10px)" }}>
              <h4 className="text-xs font-medium text-indigo-300/70 mb-2">
                Skills
              </h4>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <motion.span
                      key={skill}
                      className="px-1.5 py-0.5 rounded-xl text-[10px]
                             bg-indigo-950/40 text-indigo-200
                             border border-indigo-600/10"
                      onHoverStart={() => setIsActive3D(true)}
                      onHoverEnd={() =>
                        setTimeout(() => setIsActive3D(false), 1000)
                      }
                      whileHover={{
                        backgroundColor: "rgba(67, 56, 202, 0.25)",
                        borderColor: "rgba(99, 102, 241, 0.2)",
                        scale: 1.03,
                        z: 15,
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))
                ) : (
                  <span className="text-[10px] text-zinc-500">
                    No skills listed
                  </span>
                )}
              </div>
            </div>

            {languages.length > 0 && (
              <div className="mb-3" style={{ transform: "translateZ(10px)" }}>
                <h4 className="text-xs font-medium text-indigo-300/70 mb-2">
                  Languages
                </h4>
                <div className="flex flex-wrap gap-1">
                  {languages.map((lang) => (
                    <motion.span
                      key={lang}
                      className="px-1.5 py-0.5 rounded-xl text-[10px]
                               bg-indigo-950/40 text-indigo-200
                               border border-indigo-600/10"
                      onHoverStart={() => setIsActive3D(true)}
                      onHoverEnd={() =>
                        setTimeout(() => setIsActive3D(false), 1000)
                      }
                      whileHover={{
                        backgroundColor: "rgba(67, 56, 202, 0.25)",
                        borderColor: "rgba(99, 102, 241, 0.2)",
                        scale: 1.03,
                        z: 15,
                      }}
                    >
                      {lang}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
            <div
              className="mt-auto mb-2 flex items-center justify-center space-x-3"
              style={{ transform: "translateZ(10px)" }}
            >
              {developer.socialLinks?.github && (
                <motion.a
                  href={developer.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 p-1.5 rounded-full bg-zinc-900/70"
                  onHoverStart={() => setIsActive3D(true)}
                  onHoverEnd={() =>
                    setTimeout(() => setIsActive3D(false), 1000)
                  }
                  whileHover={{
                    scale: 1.08,
                    backgroundColor: "rgba(67, 56, 202, 0.3)",
                    color: "#ffffff",
                    z: 18,
                  }}
                >
                  <Github className="w-3.5 h-3.5" />
                </motion.a>
              )}
              {developer.socialLinks?.linkedin && (
                <motion.a
                  href={developer.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 p-1.5 rounded-full bg-zinc-900/70"
                  onHoverStart={() => setIsActive3D(true)}
                  onHoverEnd={() =>
                    setTimeout(() => setIsActive3D(false), 1000)
                  }
                  whileHover={{
                    scale: 1.08,
                    backgroundColor: "rgba(67, 56, 202, 0.3)",
                    color: "#ffffff",
                    z: 18,
                  }}
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </motion.a>
              )}
              {developer.socialLinks?.twitter && (
                <motion.a
                  href={developer.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 p-1.5 rounded-full bg-zinc-900/70"
                  onHoverStart={() => setIsActive3D(true)}
                  onHoverEnd={() =>
                    setTimeout(() => setIsActive3D(false), 1000)
                  }
                  whileHover={{
                    scale: 1.08,
                    backgroundColor: "rgba(67, 56, 202, 0.3)",
                    color: "#ffffff",
                    z: 18,
                  }}
                >
                  <Twitter className="w-3.5 h-3.5" />
                </motion.a>
              )}
            </div>
            <motion.button
              className="absolute bottom-4 right-2 p-1.5 rounded-full bg-indigo-950/40 text-indigo-300/70 border border-indigo-500/10"
              onClick={() => {
                setIsActive3D(!isActive3D);
                isFlipped && setIsFlipped(false);
              }}
              whileHover={{
                scale: 1.08,
                backgroundColor: "rgba(67, 56, 202, 0.3)",
              }}
              animate={{ rotate: isActive3D ? 180 : 0 }}
              style={{ transform: "translateZ(12px)" }}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          <div
            className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"
            style={{ transform: "translateZ(3px)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-purple-600/5 blur-xl pointer-events-none"
            style={{ transform: "translateZ(1px)" }}
          />
          <div
            className="absolute top-8 left-8 w-12 h-12 rounded-full bg-indigo-600/5 blur-xl pointer-events-none"
            style={{ transform: "translateZ(2px)" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DeveloperCard;
