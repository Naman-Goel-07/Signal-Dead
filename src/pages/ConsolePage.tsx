import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocationStore } from '@/store/locationStore';

interface NavCardProps {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  delay: number;
}

const NavCard: React.FC<NavCardProps> = ({ title, description, path, icon, delay }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(path)}
      className="group relative w-full text-left console-panel p-6 rounded-xl overflow-hidden hover:border-neon-cyan/50 transition-colors duration-300"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-3xl group-hover:bg-neon-cyan/10 transition-colors duration-500" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="text-neon-cyan/70 group-hover:text-neon-cyan transition-colors duration-300 mb-4">
          {icon}
        </div>
        <h3 className="font-heading text-2xl font-bold tracking-wider text-white mb-2 uppercase">
          {title}
        </h3>
        <p className="font-body text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors duration-300">
          {description}
        </p>
        
        <div className="mt-6 flex items-center text-neon-cyan text-sm font-heading tracking-widest font-bold opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
          ENTER MODULE <span className="ml-2">→</span>
        </div>
      </div>
    </motion.button>
  );
};

export const ConsolePage: React.FC = () => {
  const { location } = useLocationStore();

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto w-full flex flex-col">
      {/* Location Strip */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between border-b border-border-dim pb-4 mb-8"
      >
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          <h2 className="font-heading text-sm md:text-base font-bold tracking-widest text-white/80 uppercase">
            MISSION CONSOLE
          </h2>
        </div>
        <div className="text-right">
          <p className="font-heading text-xs tracking-widest text-neon-cyan uppercase">Active Target</p>
          <p className="text-sm font-mono text-white/60 truncate max-w-[200px] md:max-w-xs">
            {location?.locationName || 'UNKNOWN'}
          </p>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NavCard
            title="Mission Status"
            description="Comprehensive overview of current mission readiness, reliability levels, and estimated positioning accuracy."
            path="/console/status"
            delay={0.1}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <NavCard
            title="Telemetry"
            description="Raw real-time GNSS monitoring data including geomagnetic KP index, satellite availability, and dilution of precision."
            path="/console/telemetry"
            delay={0.2}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          <NavCard
            title="Advisory"
            description="Plain-English operational guidance generated from complex space weather and ionospheric risk factors."
            path="/console/advisory"
            delay={0.3}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <NavCard
            title="24h Forecast"
            description="Predictive timeline of expected GNSS degradation over the next 24 hours to aid mission scheduling."
            path="/console/forecast"
            delay={0.4}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};
