import React from 'react';
import { BEADS_PER_MALA } from '../constants';

interface CircularProgressProps {
  count: number;
  size?: number;
  strokeWidth?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ 
  count, 
  size = 280, 
  strokeWidth = 12 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = count / BEADS_PER_MALA;
  const dashoffset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg] transition-all duration-300"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#3f3f46" // zinc-700
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#saffronGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
        <defs>
          <linearGradient id="saffronGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Decorative center mandala hint */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
         <div className="w-full h-full rounded-full border-4 border-dashed border-orange-500 animate-[spin_60s_linear_infinite]" />
      </div>
    </div>
  );
};
