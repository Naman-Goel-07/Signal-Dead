import React from 'react';
import { motion } from 'framer-motion';
import { BackButton } from '@/components/layout/BackButton';
import { useForecast } from '@/hooks/useForecast';
import { EmptyState } from '@/components/ui/EmptyState';

export const ForecastPage: React.FC = () => {
  const { data, loading, error } = useForecast();

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto w-full">
      <BackButton />
      
      <header className="mb-12 border-b border-border-dim pb-6">
        <h1 className="font-heading text-3xl font-bold tracking-wider text-white uppercase flex items-center">
          <span className="w-3 h-3 bg-neon-cyan mr-4 hidden md:block"></span>
          24H Forecast
        </h1>
        <p className="font-body text-white/50 mt-2">Predictive timeline of expected GNSS degradation</p>
      </header>

      {error ? (
        <div className="p-4 border border-crimson/30 bg-crimson/10 rounded text-crimson text-sm">
          {error}
        </div>
      ) : loading ? (
        <div className="space-y-8">
          <div className="flex justify-between text-xs font-mono text-white/40 px-2">
            <span>T+00:00</span>
            <span>T+12:00</span>
            <span>T+24:00</span>
          </div>
          {/* DNA Sequencer loading state architecture */}
          <div className="w-full h-8 flex rounded overflow-hidden opacity-50 border border-border-dim">
            {[...Array(24)].map((_, i) => (
              <motion.div 
                key={i}
                className="flex-1 bg-surface-2 border-r border-surface-0 last:border-r-0"
                initial={{ opacity: 0.2 }}
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <span className="inline-flex items-center text-xs font-heading tracking-widest text-neon-cyan uppercase animate-pulse">
              <svg className="w-4 h-4 mr-2 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              GENERATING PREDICTIVE MODEL
            </span>
          </div>
        </div>
      ) : data ? (
        <div className="space-y-12">
          {/* Data implementation will go here once API is wired up */}
          {/* 
            DNA Timeline Architecture Example:
            <div className="w-full h-8 flex rounded overflow-hidden">
              <div className="flex-[3] dna-safe"></div>
              <div className="flex-[1] dna-degraded"></div>
              <div className="flex-[2] dna-high"></div>
              <div className="flex-[6] dna-safe"></div>
            </div>
          */}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <EmptyState 
            title="FORECAST UNAVAILABLE" 
            message="Awaiting sufficient data to generate 24-hour predictive timeline."
            loading={false}
          />
        </motion.div>
      )}
    </div>
  );
};
