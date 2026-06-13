import React from 'react';
import type { RiskState } from '@/types';

interface RiskIndicatorProps {
  state: RiskState;
  showLabel?: boolean;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({ state, showLabel = false }) => {
  const getRiskColor = (risk: RiskState) => {
    switch (risk) {
      case 'SAFE': return 'bg-neon-cyan shadow-glow-cyan';
      case 'DEGRADED': return 'bg-amber shadow-glow-amber';
      case 'HIGH_RISK': return 'bg-crimson shadow-glow-crimson animate-pulse';
      default: return 'bg-white/20';
    }
  };

  const getRiskLabel = (risk: RiskState) => {
    switch (risk) {
      case 'SAFE': return 'NOMINAL';
      case 'DEGRADED': return 'DEGRADED';
      case 'HIGH_RISK': return 'HIGH RISK';
      default: return 'UNKNOWN';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${getRiskColor(state)}`} />
      {showLabel && (
        <span className="font-heading text-xs font-bold uppercase tracking-widest text-white/80">
          {getRiskLabel(state)}
        </span>
      )}
    </div>
  );
};
