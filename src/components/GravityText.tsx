import React from 'react';
import { AppFontFamily } from '../../types';

interface GravityTextProps {
  children: React.ReactNode;
  font?: AppFontFamily;
  className?: string;
}

/**
 * Componente que utiliza la fuente Gravity Grotesk Bold.
 * Se puede usar la clase de Tailwind 'font-gravity' directamente.
 */
export const GravityText: React.FC<GravityTextProps> = ({ 
  children, 
  font = 'font-gravity', 
  className = '' 
}) => {
  return (
    <div className={`${font} ${className}`}>
      {children}
    </div>
  );
};

export const GravityShowcase: React.FC = () => {
  return (
    <section className="py-20 flex flex-col items-center justify-center bg-[#050505] text-white p-8 border-y border-white/5">
      <GravityText className="text-6xl md:text-8xl tracking-tight uppercase leading-none text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
        Gravity Bold
      </GravityText>
      <p className="mt-4 font-mono text-[10px] text-pink-500 tracking-[0.4em] uppercase">
        Network Identity System
      </p>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
        <div className="group p-8 border border-white/5 bg-white/[0.02] rounded-3xl backdrop-blur-xl hover:border-pink-500/30 transition-all duration-500">
          <h3 className="font-gravity text-2xl mb-4 text-white uppercase tracking-tighter">Tipografía Principal</h3>
          <p className="text-sm text-gray-400 leading-relaxed font-sans opacity-80 group-hover:opacity-100 transition-opacity">
            Gravity Grotesk Bold es la piedra angular de nuestra identidad visual. 
            Su peso y compresión proporcionan ese impacto característico del diseño retro-futurista.
          </p>
        </div>
        <div className="group p-8 border border-white/5 bg-white/[0.02] rounded-3xl backdrop-blur-xl hover:border-purple-500/30 transition-all duration-500">
          <h3 className="font-gravity text-2xl mb-4 text-white uppercase tracking-tighter">Estética Y2K</h3>
          <p className="text-sm text-gray-400 leading-relaxed font-sans opacity-80 group-hover:opacity-100 transition-opacity">
            Diseñada para cortes limpios y legibilidad extrema en pantallas digitales, 
            evocando la era dorada de los gráficos por computadora de finales de los 90.
          </p>
        </div>
      </div>
    </section>
  );
};
