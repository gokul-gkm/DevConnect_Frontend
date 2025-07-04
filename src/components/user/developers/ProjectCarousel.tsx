import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Globe, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

const scrollbarHideStyles = {
  '::-webkit-scrollbar': {
    display: 'none'
  },
  scrollbarWidth: 'none',
  '-ms-overflow-style': 'none'
} as const;

interface ProjectCarouselProps {
  projects: Array<{
    _id: string;
    title: string;
    category: string;
    description: string;
    coverImage: string;
    projectLink?: string;
  }>;
}

const ProjectCarousel = ({ projects }: ProjectCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: true,
    dragFree: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full py-6">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 pl-4 pr-8">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_48%]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setIsHovered(project._id)}
              onHoverEnd={() => setIsHovered(null)}
            >
              <motion.div 
                className="relative h-[400px] rounded-2xl overflow-hidden bg-white/5"
                animate={{
                  scale: isHovered === project._id ? 1.02 : 1,
                  y: isHovered === project._id ? -4 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >

                <motion.div className="absolute inset-0">
                  <motion.img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    animate={{
                      scale: isHovered === project._id ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </motion.div>

                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: isHovered === project._id ? 0.8 : 0.3,
                  }}
                  transition={{ duration: 0.3 }}
                />

                <motion.div 
                  className="absolute inset-x-0 bottom-0 p-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    animate={{
                      y: isHovered === project._id ? 0 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white backdrop-blur-sm mb-3">
                        {project.category}
                      </span>
                    </motion.div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-white tracking-tight">{project.title}</h3>
                      <motion.div 
                        className="relative"
                        animate={{
                          height: isHovered === project._id ? '60px' : '42px',
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div 
                          className="absolute inset-0 overflow-y-auto"
                          style={scrollbarHideStyles}
                        >
                          <p className="text-gray-100 leading-relaxed text-sm">{project.description}</p>
                        </div>
                      </motion.div>
                    </div>

                    {project.projectLink && (
                      <motion.a
                        href={project.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-full bg-white/90 text-black text-sm font-medium hover:bg-white transition-all duration-300"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Globe className="w-4 h-4" />
                        <span>View Project</span>
                        <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </motion.a>
                    )}
                  </motion.div>
                </motion.div>

                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
        <motion.button
          className="pointer-events-auto p-3 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </motion.button>
        <motion.button
          className="pointer-events-auto p-3 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {scrollSnaps.map((_, index) => (
          <motion.button
            key={index}
            className={`relative h-1.5 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? 'bg-white w-6'
                : 'bg-white/20 w-1.5 hover:bg-white/40'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {index === selectedIndex && (
              <motion.div
                className="absolute inset-0 rounded-full bg-white/50 blur-[1px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ProjectCarousel; 