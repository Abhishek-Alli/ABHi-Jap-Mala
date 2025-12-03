import React from 'react';

interface FloatingTextProps {
  text: string;
  x: number;
  y: number;
  className?: string;
}

export const FloatingTextItem: React.FC<FloatingTextProps> = ({ text, x, y, className }) => {
  return (
    <div
      className={`fixed pointer-events-none animate-float-up font-bold text-2xl text-saffron-400 select-none z-50 ${className}`}
      style={{ 
        left: x, 
        top: y,
        textShadow: '0px 2px 4px rgba(0,0,0,0.5)'
      }}
    >
      {text}
    </div>
  );
};
