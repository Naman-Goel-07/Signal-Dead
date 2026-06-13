import React from 'react';
import { motion } from 'framer-motion';
import { BackButton } from '@/components/layout/BackButton';
import { useAdvisory } from '@/hooks/useAdvisory';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';

export const AdvisoryPage: React.FC = () => {
  const { data, loading, error } = useAdvisory();

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto w-full">
      <BackButton />
      
      <header className="mb-8 border-b border-border-dim pb-6">
        <h1 className="font-heading text-3xl font-bold tracking-wider text-white uppercase flex items-center">
          <span className="w-3 h-3 bg-neon-cyan mr-4 hidden md:block"></span>
          Mission Advisory
        </h1>
        <p className="font-body text-white/50 mt-2">Plain-English operational guidance based on risk factors</p>
      </header>

      {error ? (
        <div className="p-4 border border-crimson/30 bg-crimson/10 rounded text-crimson text-sm">
          {error}
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="console-panel p-6 rounded-lg flex space-x-4">
              <SkeletonLoader width="w-2" height="h-full" rounded="sm" className="flex-shrink-0" />
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <SkeletonLoader width="w-1/3" height="h-5" />
                  <SkeletonLoader width="w-20" height="h-6" rounded="full" />
                </div>
                <SkeletonLoader width="w-full" height="h-4" />
                <SkeletonLoader width="w-4/5" height="h-4" />
              </div>
            </div>
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="space-y-4">
          {/* Data implementation will go here once API is wired up */}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <EmptyState 
            title="NO ACTIVE ADVISORIES" 
            message="Awaiting operational guidance. Conditions appear stable at this time."
            loading={false}
          />
        </motion.div>
      )}
    </div>
  );
};
