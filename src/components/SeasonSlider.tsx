import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Lock, Play, Check } from 'lucide-react';
import { Episode, User } from '../../types';

interface SeasonSliderProps {
  season: any;
  activeEpisode: Episode | null;
  onEpisodeClick: (ep: Episode) => void;
  user: User | null;
  isComingSoon?: boolean;
  watchedEpisodes?: string[];
}

const SeasonSlider: React.FC<SeasonSliderProps> = ({ season, activeEpisode, onEpisodeClick, user, isComingSoon, watchedEpisodes }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (activeEpisode && scrollContainerRef.current) {
       const index = season.episodes.findIndex((ep: any) => ep.id === activeEpisode.id);
       if (index !== -1) {
          const isMobile = window.innerWidth < 768;
          const cardWidth = isMobile ? 216 : 296; 
          const containerWidth = scrollContainerRef.current.clientWidth;
          const scrollPos = (index * cardWidth) - (containerWidth / 2) + (cardWidth / 2);
          scrollContainerRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
       }
    }
  }, [activeEpisode, season]);

  return (
    <div className="relative group/slider mb-12">
      <h3 className="font-gravity text-lg md:text-2xl font-bold text-white mb-3 md:mb-4 ml-1 md:ml-2 pl-2 md:pl-3 border-l-4 border-pink-500">
        {season.title}
      </h3>
      
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-white/80 dark:hover:bg-white/20 hover:scale-110 hidden md:flex items-center justify-center shadow-lg"
        aria-label="Scroll Left"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-white/80 dark:hover:bg-white/20 hover:scale-110 hidden md:flex items-center justify-center shadow-lg"
        aria-label="Scroll Right"
      >
        <ChevronRight size={24} />
      </button>

      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto pt-4 pb-8 gap-4 snap-x snap-mandatory scroll-smooth px-4 no-scrollbar"
      >
        {season.episodes.map((ep: any) => {
          const isActive = activeEpisode?.id === ep.id;
          const isWatched = watchedEpisodes?.includes(ep.id);
          const isEpComingSoon = ep.isComingSoon || isComingSoon;
          return (
            <div 
              key={ep.id} 
              className={`min-w-[170px] w-[170px] sm:min-w-[200px] sm:w-[200px] md:min-w-[280px] md:w-[280px] flex flex-col gap-2 md:gap-3 p-0 rounded-xl transition-all duration-300 ease-in-out group snap-center relative
                ${isActive ? 'z-10' : 'hover:z-10'}
                ${isEpComingSoon ? 'cursor-default' : 'cursor-pointer'}
              `}
              onClick={() => !isEpComingSoon && onEpisodeClick(ep)}
            >
              <div className={`w-full aspect-video rounded-lg overflow-hidden relative shrink-0 shadow-lg border border-white/10 transition-all duration-300 ${isActive ? 'ring-2 ring-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]' : 'group-hover:ring-1 group-hover:ring-white/30 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]'} ${isWatched ? 'opacity-80' : ''}`}>
                <img src={ep.thumbnail || undefined} alt={ep.title} loading="lazy" className="w-full h-full object-cover transition-opacity duration-300" />
                
                {isWatched && (
                  <div className="absolute top-2 left-2 z-20 bg-green-500/90 backdrop-blur-sm text-white p-1 rounded-full shadow-lg border border-white/20 animate-in zoom-in duration-300">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}

                {ep.isComingSoon && (
                  <div className="absolute top-2 right-2 z-20 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg border border-white/20">
                    Proximamente
                  </div>
                )}

                <div className={`absolute inset-0 transition-all duration-300 flex items-center justify-center ${isActive ? 'bg-black/40' : 'bg-black/40 opacity-0 group-hover:opacity-100'}`}>
                  <div className="rounded-full p-3 bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-xl">
                      {isEpComingSoon ? <Lock size={24} className="text-white/50" /> : (user || isComingSoon ? <Play size={24} fill="currentColor" /> : <Lock size={24} />)}
                  </div>
                </div>

                <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-black/80 text-white px-1.5 py-0.5 rounded border border-white/10">
                  {ep.duration}
                </span>
              </div>

              <div className="flex flex-col gap-1 px-1">
                  <h4 className={`font-bold text-sm leading-tight ${isActive ? 'text-pink-500 dark:text-pink-400' : 'text-gray-100 dark:text-gray-100 group-hover:text-pink-400 dark:group-hover:text-white'}`}>
                    {ep.title}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {ep.description}
                  </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="absolute bottom-2 left-0 w-full h-0.5 bg-white/10 rounded-full overflow-hidden mx-4">
        <div 
          className="h-full bg-white/40 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${Math.max(5, scrollProgress)}%` }} 
        />
      </div>
    </div>
  );
};

export default SeasonSlider;
