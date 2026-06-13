import { create } from 'zustand';
import type { RiskState } from '@/types';

interface MissionState {
  /** The current calculated risk state of the mission */
  riskState: RiskState;
  /** Set a new risk state — typically called after fetching telemetry/forecast */
  setRiskState: (state: RiskState) => void;
}

export const useMissionStore = create<MissionState>((set) => ({
  riskState: 'UNKNOWN',
  
  setRiskState: (state: RiskState) => {
    set({ riskState: state });
    
    // Architecture: Automatically apply the corresponding CSS class to the body element
    // This allows global styling to react to the mission risk state
    if (typeof window !== 'undefined') {
      document.body.classList.remove('risk-state-safe', 'risk-state-degraded', 'risk-state-high');
      
      switch (state) {
        case 'SAFE':
          document.body.classList.add('risk-state-safe');
          break;
        case 'DEGRADED':
          document.body.classList.add('risk-state-degraded');
          break;
        case 'HIGH_RISK':
          document.body.classList.add('risk-state-high');
          break;
      }
    }
  },
}));
