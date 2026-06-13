import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import CherryBlossomLayer from '@/components/ui/CherryBlossomLayer';
import { GlobalHeader } from '@/components/layout/GlobalHeader';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isConsole = location.pathname.startsWith('/console');

  return (
    <div className="min-h-screen bg-surface-0 text-white overflow-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 hud-grid pointer-events-none opacity-40 z-0" />
      
      {/* Cherry Blossom Ambient Layer */}
      <CherryBlossomLayer />

      {/* Scan Line Effect */}
      <div className="scan-line" />

      {/* Global Header for Console Routes */}
      {isConsole && <GlobalHeader />}

      {/* Page Content with Transitions */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`relative w-full h-full min-h-screen flex flex-col ${isConsole ? 'pt-20' : ''}`}
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
};
