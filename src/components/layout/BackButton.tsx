import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ to = '/console', label = 'BACK TO CONSOLE' }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="group flex items-center space-x-2 text-white/50 hover:text-neon-cyan transition-colors duration-300 focus:outline-none mb-6"
    >
      <svg 
        className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span className="font-heading text-sm font-bold tracking-widest uppercase">{label}</span>
    </button>
  );
};
