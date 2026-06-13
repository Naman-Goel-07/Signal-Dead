import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'amber' | 'crimson' | 'white';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  color = 'cyan'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  const colorClasses = {
    cyan: 'border-neon-cyan',
    amber: 'border-amber',
    crimson: 'border-crimson',
    white: 'border-white',
  }[color];

  return (
    <div className={`relative ${sizeClasses}`}>
      {/* Outer ring */}
      <div className={`absolute inset-0 rounded-full border-2 border-t-transparent border-r-transparent border-b-transparent border-l-[color:inherit] ${colorClasses} opacity-20`} />
      
      {/* Inner spinning sweep */}
      <div className={`absolute inset-0 rounded-full border-2 border-t-[color:inherit] border-r-transparent border-b-transparent border-l-transparent ${colorClasses} animate-spin`} />
    </div>
  );
};
