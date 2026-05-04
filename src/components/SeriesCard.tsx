import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { Series } from '../../types';

interface SeriesCardProps {
  serie: Series;
  isFav: boolean;
  onToggleFav: (e: React.MouseEvent) => void;
  onClick: () => void;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ serie, isFav, onToggleFav, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md transition-all duration-300 transform hover:scale-105 ring-2 ring-transparent hover:ring-white ring-offset-2 ring-offset-transparent">
        <img 
          src={serie.coverImage || undefined} 
          alt={serie.title} 
          loading="lazy"
          className="w-full h-full object-cover"
        />
        
        {serie.isComingSoon && (
            <div className="absolute bottom-0 left-0 right-0 z-20">
               <div className="w-full font-gravity text-white font-bold text-xs py-1 bg-purple-600/90 backdrop-blur-md text-center flex items-center justify-center gap-1">
                <Sparkles size={12} /> MUY PRONTO
              </div>
            </div>
        )}

        {!serie.isComingSoon && (
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFav(e); }}
            className={`absolute top-2 right-2 bg-black/40 hover:bg-pink-500 text-white rounded-full p-2 transition-all z-30 ${isFav ? 'opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'}`}
          >
              <Heart size={16} className={isFav ? "text-pink-500 fill-current" : "text-white"} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SeriesCard;
