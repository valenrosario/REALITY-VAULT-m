import React from 'react';
import { Sparkles } from 'lucide-react';

const MagicLoader = () => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-pink-50/90 dark:bg-slate-900/90 backdrop-blur-md fade-in">
    <div className="flex flex-col items-center pop-in relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-400/30 dark:bg-pink-600/30 blur-3xl rounded-full animate-pulse pointer-events-none"></div>
      
      <div className="relative w-24 h-24 z-10">
        <div className="absolute inset-0 flex items-center justify-center magic-star text-pink-500 dark:text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">
           <Sparkles size={64} fill="currentColor" />
        </div>
      </div>
      <p className="mt-4 font-gravity text-pink-600 dark:text-pink-300 font-bold animate-pulse text-xl z-10 drop-shadow-sm">Cargando Magia...</p>
    </div>
  </div>
);

export default MagicLoader;
