import React from 'react';
import { SOUND_EFFECTS } from '../../constants';

import { playSound } from '../utils/sound';

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'solid' | 'outline' | 'white';
  className?: string;
  disabled?: boolean;
}

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: ButtonProps) => {
  
  const handleClick = (e: React.MouseEvent) => {
    if (!disabled) {
      playSound('click');
      onClick?.();
    }
  };

  const baseStyle = "font-gravity font-bold text-sm uppercase tracking-wider px-6 py-2.5 rounded-full transition-all duration-300 select-none shadow-lg relative overflow-hidden flex items-center justify-center gap-2 group";
  
  const variants = {
    primary: "border border-pink-300 dark:border-pink-500 text-pink-700 dark:text-white hover:border-pink-400 hover:text-pink-800 dark:hover:text-pink-100 hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "backdrop-blur-xl border bg-white/10 dark:bg-white/5 border-white/40 dark:border-white/20 text-gray-700 dark:text-gray-200 hover:bg-white/30 hover:border-pink-300/50 hover:text-pink-600 dark:hover:text-pink-300 hover:scale-105 active:scale-95 disabled:opacity-50",
    danger: "backdrop-blur-xl border bg-red-500/10 border-red-400 text-red-600 dark:text-red-300 hover:bg-red-500/30 hover:border-red-500 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:scale-105 active:scale-95",
    solid: "bg-pink-600 text-white border-2 border-pink-600 hover:bg-white/30 hover:border-white/60 hover:backdrop-blur-3xl hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:scale-105 active:scale-95",
    outline: "bg-transparent border-2 border-white text-white hover:bg-white/20 hover:scale-105 active:scale-95",
    white: "bg-white text-pink-600 border-2 border-white hover:bg-gray-100 hover:text-pink-700 hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.37)] hover:scale-105 active:scale-95"
  };

  return (
    <button onClick={handleClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {variant === 'primary' && (
        <div className="absolute inset-0 z-0 pointer-events-none bg-pink-500/20 backdrop-blur-md">
        </div>
      )}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default Button;
