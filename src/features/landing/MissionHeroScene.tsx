import React, { Suspense, useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

export const MissionHeroScene: React.FC = () => {
  const splineUrl = 'https://prod.spline.design/zHVDSXFokuOKZOVF/scene.splinecode';
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const stars = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: `${2 + Math.random() * 4}s`,
    delay: `${Math.random() * 5}s`,
    size: `${1 + Math.random() * 2}px`,
  }));

  const FallbackScene = () => (
    <div className="absolute inset-0 bg-surface-0 overflow-hidden z-0">
      {/* Starfield */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full star opacity-20"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            '--d': star.duration,
            '--delay': star.delay,
          } as React.CSSProperties}
        />
      ))}
      
      {/* Rocket SVG Fallback */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-screen pointer-events-none">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          className="w-64 h-64 text-neon-cyan animate-pulse-slow transform -rotate-45 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M13.5 10.5L21 3v7.5l-4.5 4.5h-4.5L10.5 21v-4.5L6 12l4.5-4.5zM3 21l3-3M6 18l1.5-1.5M18 6l-1.5 1.5" />
        </svg>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-transparent to-transparent z-10" />
    </div>
  );

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[1]">
      {hasError ? (
        <FallbackScene />
      ) : (
        <Suspense fallback={<FallbackScene />}>
          <div className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            <Spline 
              scene={splineUrl}
              onLoad={() => setIsLoading(false)}
              onError={() => setHasError(true)}
            />
          </div>
          {isLoading && <FallbackScene />}
        </Suspense>
      )}
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-surface-0/40 z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-surface-0 to-transparent z-10" />
    </div>
  );
};
