import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'AWAITING SIGNAL',
  message = 'Establishing secure connection to telemetry uplink...',
  icon,
  loading = true,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[200px] border border-dashed border-border-dim rounded-lg bg-surface-1/50 backdrop-blur-sm">
      <div className="mb-4 text-neon-cyan/60">
        {icon ? icon : loading ? <LoadingSpinner size="lg" /> : null}
      </div>
      <h3 className="font-heading text-xl font-semibold tracking-wider text-white/80 mb-2 uppercase">
        {title}
      </h3>
      <p className="font-body text-sm text-white/50 max-w-sm">
        {message}
      </p>
    </div>
  );
};
