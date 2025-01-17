import { useEffect, useState } from 'react';
import Navbar from '../layout/Navbar';

const NotFound = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 30;
      const y = (clientY / window.innerHeight - 0.5) * 30;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
    <Navbar />
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">

      <div className="absolute inset-0" style={{ perspective: '1000px' }}>
        <div
          className="absolute inset-0 grid grid-cols-8 gap-4 p-8 transform-gpu transition-transform duration-700"
          style={{
            transform: `rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {[...Array(64)].map((_, i) => (
            <div
              key={i}
              className="aspect-square border border-white/5 rounded-lg transform transition-all duration-700"
              style={{
                transform: `translateZ(${Math.sin(i * 0.5) * 20}px)`,
                opacity: 0.1 + (Math.sin(i * 0.5) + 1) * 0.1
              }}
            />
          ))}
        </div>
      </div>


      <div
        className="relative z-10 text-center"
        style={{
          transform: `perspective(1000px) rotateX(${mousePosition.y * 0.05}deg) rotateY(${mousePosition.x * 0.05}deg)`,
          transition: 'transform 0.6s cubic-bezier(0.17, 0.67, 0.83, 0.67)'
        }}
      >

        <div 
          className="relative group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <h1 className="text-[200px] font-bold leading-none tracking-tighter">
            <span className="relative inline-block transition-transform duration-700 transform-gpu hover:scale-110"
                  style={{ 
                    textShadow: '0 0 20px rgba(255,255,255,0.2)',
                    transform: isHovered ? 'translateZ(100px)' : 'translateZ(0)'
                  }}>
              4
            </span>
            <span className="relative inline-block transition-transform duration-700 transform-gpu hover:scale-110 mx-4"
                  style={{ 
                    textShadow: '0 0 20px rgba(255,255,255,0.2)',
                    transform: isHovered ? 'translateZ(150px)' : 'translateZ(0)'
                  }}>
              0
            </span>
            <span className="relative inline-block transition-transform duration-700 transform-gpu hover:scale-110"
                  style={{ 
                    textShadow: '0 0 20px rgba(255,255,255,0.2)',
                    transform: isHovered ? 'translateZ(100px)' : 'translateZ(0)'
                  }}>
              4
            </span>
          </h1>


          <div 
            className="absolute -bottom-4 left-0 w-full h-1 bg-white/20 blur-sm transform-gpu transition-all duration-700"
            style={{
              transform: isHovered ? 'scaleX(1.2) translateZ(50px)' : 'scaleX(0.8) translateZ(0)'
            }}
          />
        </div>


        <p className="text-3xl font-light mt-12 mb-16 tracking-widest transform transition-transform duration-700"
           style={{
             transform: isHovered ? 'translateZ(50px)' : 'translateZ(0)',
             opacity: 0.7
           }}>
          PAGE NOT FOUND
        </p>


        <div className="flex justify-center items-center gap-8">
          <a
            href="/"
            className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-lg transition-all duration-500"
            style={{
              transform: isHovered ? 'translateZ(50px)' : 'translateZ(0)'
            }}
          >
            <div className="absolute inset-0 bg-white/10 transform-gpu transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-white/20 to-transparent transform-gpu transition-all duration-500" />
            <span className="relative z-10 text-lg font-medium">Home</span>
          </a>

          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.history.back(); }}
            className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-lg transition-all duration-500"
            style={{
              transform: isHovered ? 'translateZ(50px)' : 'translateZ(0)'
            }}
          >
            <div className="absolute inset-0 bg-white/5 transform-gpu transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-white/10 to-transparent transform-gpu transition-all duration-500" />
            <span className="relative z-10 text-lg font-medium">Go Back</span>
          </a>
        </div>
      </div>
      </div>
      </>
  );
};

export default NotFound;


const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0) translateZ(0); }
    50% { transform: translateY(-20px) translateZ(50px); }
  }

  .perspective-1000 {
    perspective: 1000px;
  }

  .preserve-3d {
    transform-style: preserve-3d;
  }
`;
document.head.appendChild(style);