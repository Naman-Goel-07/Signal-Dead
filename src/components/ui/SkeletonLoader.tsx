import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-6', 
  rounded = 'md' 
}) => {
  const roundedClass = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[rounded];

  return <div className={`bg-surface-2 animate-pulse border border-border-dim ${width} ${height} ${roundedClass} ${className}`} aria-hidden="true" />
};
