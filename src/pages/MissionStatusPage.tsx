import React from 'react';
import { motion } from 'framer-motion';
import { BackButton } from '@/components/layout/BackButton';
import { useMissionStatus } from '@/hooks/useMissionStatus';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';

export const MissionStatusPage: React.FC = () => {
  const { data, loading, error } = useMissionStatus();

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto w-full">
      <BackButton />
      
      <header className="mb-8 border-b border-border-dim pb-6">
        <h1 className="font-heading text-3xl font-bold tracking-wider text-white uppercase flex items-center">
          <span className="w-3 h-3 bg-neon-cyan mr-4 hidden md:block"></span>
          Mission Status
        </h1>
        <p className="font-body text-white/50 mt-2">Overall mission readiness and estimated accuracy</p>
      </header>

      {error ? (
        <div className="p-4 border border-crimson/30 bg-crimson/10 rounded text-crimson text-sm">
          {error}
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="console-panel p-6 rounded-lg">
              <SkeletonLoader width="w-24" height="h-4" className="mb-4" />
              <SkeletonLoader width="w-16" height="h-10" />
            </div>
          ))}
          <div className="lg:col-span-4 console-panel p-6 rounded-lg h-64">
            <SkeletonLoader width="w-32" height="h-6" className="mb-6" />
            <SkeletonLoader width="w-full" height="h-20" className="mb-4" />
            <SkeletonLoader width="w-full" height="h-20" />
          </div>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Data implementation will go here once API is wired up */}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <EmptyState 
            title="ANALYSING READINESS" 
            message="Calculating composite risk score and mission viability metrics..."
          />
        </motion.div>
      )}
    </div>
  );
};
