import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const CherryBlossomLayer: React.FC = () => {
  // Generate a fixed number of petals to keep performance high
  const petals = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      xStart: Math.random() * 100, // percentage
      yStart: -10 - Math.random() * 20, // percentage above screen
      duration: 15 + Math.random() * 15, // seconds
      delay: Math.random() * -20, // random start offset
      scale: 0.3 + Math.random() * 0.4,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          initial={{
            x: `${petal.xStart}vw`,
            y: `${petal.yStart}vh`,
            rotate: petal.rotation,
            opacity: 0,
            scale: petal.scale,
          }}
          animate={{
            x: [`${petal.xStart}vw`, `${petal.xStart + (Math.random() * 20 - 10)}vw`],
            y: '110vh',
            rotate: petal.rotation + 360,
            opacity: [0, 0.4, 0.4, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Simple SVG petal shape */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-cherry drop-shadow-[0_0_8px_rgba(255,107,157,0.3)]"
          >
            <path
              d="M12 2C8 2 5 6 5 10C5 14 12 22 12 22C12 22 19 14 19 10C19 6 16 2 12 2Z"
              fill="currentColor"
              opacity="0.6"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default CherryBlossomLayer;
