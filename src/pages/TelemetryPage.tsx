import React from 'react';
import { motion } from 'framer-motion';
import { BackButton } from '@/components/layout/BackButton';
import { useTelemetry } from '@/hooks/useTelemetry';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';

export const TelemetryPage: React.FC = () => {
  const { data, loading, error } = useTelemetry();

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto w-full">
      <BackButton />
      
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-border-dim pb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-wider text-white uppercase flex items-center">
            <span className="w-3 h-3 bg-neon-cyan mr-4 hidden md:block"></span>
            Raw Telemetry
          </h1>
          <p className="font-body text-white/50 mt-2">Real-time GNSS signal monitoring parameters</p>
        </div>
        <div className="mt-4 md:mt-0 font-mono text-xs text-white/40 text-right">
          UPDATE RATE: <span className="text-neon-cyan">LIVE</span><br/>
          DATA SOURCE: <span className="text-white/60">AWAITING CONNECTION</span>
        </div>
      </header>

      {error ? (
        <div className="p-4 border border-crimson/30 bg-crimson/10 rounded text-crimson text-sm">
          {error}
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="console-panel p-6 rounded-none aero-border relative overflow-hidden">
            <div className="text-xs font-heading tracking-widest text-white/40 mb-6">GEOMAGNETIC KP INDEX</div>
            <SkeletonLoader width="w-24" height="h-16" />
          </div>
          <div className="console-panel p-6 rounded-none aero-border relative overflow-hidden">
            <div className="text-xs font-heading tracking-widest text-white/40 mb-6">SATELLITES OVERHEAD</div>
            <SkeletonLoader width="w-24" height="h-16" />
          </div>
          <div className="console-panel p-6 rounded-none aero-border relative overflow-hidden">
            <div className="text-xs font-heading tracking-widest text-white/40 mb-6">POSITIONAL DOP (PDOP)</div>
            <SkeletonLoader width="w-24" height="h-16" />
          </div>
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Data implementation will go here once API is wired up */}
          {/* Example of how the architecture classes will be used:
              <div className="console-panel p-6 rounded-none aero-border relative">
                <div className="text-xs font-heading tracking-widest text-white/40 mb-2">KP INDEX</div>
                <div className="tele-xl kp-safe glitch-active" data-text="2.1">2.1</div>
              </div>
          */}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <EmptyState 
            title="ACQUIRING TELEMETRY" 
            message="Connecting to space weather models and satellite ephemeris streams..."
          />
        </motion.div>
      )}
    </div>
  );
};
