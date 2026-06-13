import React from 'react';
import type { SeverityLevel } from '@/types';

interface StatusBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ severity, className = '' }) => {
  const getSeverityClasses = (level: SeverityLevel) => {
    switch (level) {
      case 'NOMINAL':
        return 'border-neon-cyan/40 text-neon-cyan bg-neon-cyan/10 shadow-glow-cyan';
      case 'CAUTION':
        return 'border-amber/40 text-amber bg-amber/10 shadow-glow-amber';
      case 'WARNING':
        return 'border-crimson/40 text-crimson bg-crimson/10 shadow-glow-crimson';
      case 'CRITICAL':
        return 'border-crimson text-white bg-crimson shadow-glow-crimson animate-pulse-slow';
      default:
        return 'border-border-dim text-white/60 bg-surface-2';
    }
  };

  return (
    <span 
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded border 
        font-heading text-xs font-bold uppercase tracking-wider
        ${getSeverityClasses(severity)} ${className}
      `}
    >
      {severity}
    </span>
  );
};
