import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Point = {
  x: number;
  y: number;
  timestamp: number;
  id: string;
};

type BackgroundProps = {
  children?: React.ReactNode;
};

const Background = ({ children }: BackgroundProps) => {
  const [mousePoints, setMousePoints] = useState<Point[]>([]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPoint = {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
        id: Math.random().toString(36).substring(2) + Date.now().toString(36)
      };
      
      setMousePoints(prevPoints => {
        const recentPoints = [...prevPoints, newPoint].filter(
          point => Date.now() - point.timestamp < 1000
        );
        return recentPoints;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-[#00264d]">
      {/* Wave container */}
      <div className="relative w-full h-full">
        {/* Waves */}
        {[...Array(1)].map((_, index) => (
          <motion.div
            key={`wave-${index}`}
            className="absolute h-full"
            style={{
              width: '170vh',
              right: `-170vh`,
              background: `linear-gradient(90deg, 
                transparent,
                rgba(100, 200, 255, 0.2) 20%,
                rgba(100, 200, 255, 0.2) 80%,
                transparent
              )`,
              // maskImage: `url("data:image/svg+xml,%3Csvg width='100' height='800' viewBox='0 0 100 800' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0C30 0 70 100 100 150C130 200 70 300 100 350C130 400 70 500 100 550C130 600 70 700 100 750C130 800 100 800 100 800H0V0Z' fill='black'/%3E%3C/svg%3E")`,
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              // WebkitMaskImage: `url("data:image/svg+xml,%3Csvg width='100' height='800' viewBox='0 0 100 800' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0C30 0 70 100 100 150C130 200 70 300 100 350C130 400 70 500 100 550C130 600 70 700 100 750C130 800 100 800 100 800H0V0Z' fill='black'/%3E%3C/svg%3E")`,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
            }}
            animate={{
              x: ['-440vh', '0%']
            }}
            transition={{
              duration: 30,
              delay: index * 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {/* Cursor trail effect */}
        {mousePoints.map((point) => (
          <motion.div
            key={point.id}
            className="absolute w-4 h-4 rounded-full pointer-events-none"
            style={{
              left: point.x,
              top: point.y,
              background: 'radial-gradient(circle, rgba(100, 200, 255, 0.3) 0%, transparent 70%)',
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            onAnimationComplete={() => {
              setMousePoints(prev => prev.filter(p => p.id !== point.id));
            }}
          />
        ))}
      </div>

      {children}
    </div>
  );
};

export default Background;
