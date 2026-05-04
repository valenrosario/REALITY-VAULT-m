import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Play, Heart, Plus, Info, Star, Zap } from 'lucide-react';
import { Series, Episode, User } from '../../types';
import SeasonSlider from './SeasonSlider';

interface SeriesDetailViewProps {
  selectedSeries: Series;
  favorites: string[];
  toggleFavorite: (e: React.MouseEvent, id: string) => void;
  handleBackToHome: () => void;
  handleWatchClick: (episode: Episode) => void;
  onFlashClick?: () => void;
  activeEpisode: Episode | null;
  user: User | null;
  watchedEpisodes: string[];
}

const SeriesDetailView = ({
  selectedSeries,
  favorites,
  toggleFavorite,
  handleBackToHome,
  handleWatchClick,
  onFlashClick,
  activeEpisode,
  user,
  watchedEpisodes
}: SeriesDetailViewProps) => {
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const isFav = favorites.includes(selectedSeries.id);

  return (
    <div className={`min-h-screen bg-black ${selectedSeries.id === 'serie-1' ? 'pb-0 md:pb-20' : 'pb-20'} fade-in`}>
      <div className="relative w-full bg-black overflow-hidden">
          <div className="relative w-full h-auto">
            <picture className="w-full h-auto block">
              <source media="(max-width: 768px)" srcSet={selectedSeries.detailBannerMobile || selectedSeries.coverImage || undefined} />
              <img 
                src={selectedSeries.detailBannerDesktop || selectedSeries.bannerImage || selectedSeries.coverImage || undefined} 
                alt={selectedSeries.title} 
                className="w-full h-auto block object-contain object-center transition-all duration-700"
              />
            </picture>

            {/* Overlay PNG solicitado */}
            <img 
              src="/src/assets/images/regenerated_image_1777741269617.png" 
              className="absolute inset-0 w-full h-full object-cover z-5 pointer-events-none" 
              alt="Banner Overlay" 
              referrerPolicy="no-referrer"
            />

            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
          </div>

          <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-30 opacity-50 hover:opacity-100 transition-opacity pointer-events-none">
            <img 
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgMJ-pH_Y36jVEiqf37tJlAcWHHe17x0TrhCYFAsEdaxUgvfRk1nuuLa8hFdegCm2eXFXD2KcDNexTGzttQFJzMz9VJhVnrww8jKxKXqG3cWWNadkJ9xeNJm5Q5ZRWJrfkdILtrBRHCYHf9BzEVcJdYzdYtSqW0hfQaq8jpLlqAlCaQ7ZzJIisUk164XhA/s1684/REALITY%20VAULT%20LOGO%20tr.png" 
              alt="Reality Vault" 
              className="h-4 md:h-8 w-auto object-contain drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Corner Decorative Image (Específico para serie-1) */}
          {selectedSeries.id === "serie-1" && (
            <div className="hidden md:block absolute bottom-[10%] right-[2%] md:bottom-[15%] md:right-[3%] z-[31] pointer-events-none sm:pointer-events-auto">
              <motion.img 
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.1, rotate: -5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onFlashClick) onFlashClick();
                }}
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjG765V9SZYe_xm6L7OR40vFg458HzgB846wX2jdgFf-bukpEJgiQ6ZMgPwNpu7Mfk0FUGmABIgMj5GTKdH8tnr_7R7r6X2fRplfiOznnkA6gKcV6Nft6udNMbGsro3GaWzn6fs_6tBkRJFMVzZuGJ-R-yyoQHjaC052-T-X5wp9JbaX7Vhg4gcKNker00/s2007/moda%20granjera.png" 
                alt="Moda Granjera Deco" 
                className="w-24 h-auto md:w-32 lg:w-44 cursor-pointer pointer-events-auto"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

        <button 
          onClick={handleBackToHome} 
          className="absolute top-20 md:top-24 left-6 z-50 flex items-center justify-center text-white bg-black/60 hover:bg-pink-600 backdrop-blur-xl w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 border border-white/20 shadow-2xl hover:scale-110 active:scale-95 group/back"
          title="Volver"
        >
          <ArrowLeft size={20} className="group-hover/back:-translate-x-1 transition-transform" /> 
        </button>

        <div className="absolute inset-x-0 bottom-0 top-auto md:bottom-auto md:top-0 w-full p-4 pb-8 pt-0 md:p-12 md:pb-12 md:pt-32 lg:p-16 lg:pt-36 flex flex-col justify-end md:justify-start items-start z-20">
          <div className="max-w-2xl space-y-3 md:space-y-6 animate-in slide-in-from-left-10 duration-700 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            
            {selectedSeries.logoUrl ? (
              <img 
                src={selectedSeries.detailLogoUrl || selectedSeries.logoUrl || undefined} 
                alt={selectedSeries.title} 
                className="max-h-16 sm:max-h-24 md:max-h-32 lg:max-h-40 w-auto object-contain drop-shadow-2xl mb-0 md:mb-1" 
              />
            ) : (
              <h1 className="font-gravity text-3xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 drop-shadow-sm mb-0 md:mb-1">
                {selectedSeries.title}
              </h1>
            )}

            <h2 className="text-white font-gravity font-bold text-sm md:text-xl mb-0 md:mb-1 drop-shadow-md">
              {selectedSeries.bannerText || (selectedSeries.isComingSoon ? 'Muy Pronto' : 'Todos los episodios disponibles')}
            </h2>

            <div className="flex items-center flex-wrap gap-1.5 md:gap-3 text-[10px] md:text-base font-medium text-white/60">
              <span className="bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded text-white border border-white/10">Reality</span>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              <span>{selectedSeries.year}</span>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              {selectedSeries.tags.slice(0, 2).map((tag, i) => (
                <React.Fragment key={tag}>
                  {i > 0 && <span className="w-1 h-1 bg-white/30 rounded-full" />}
                  <span>{tag}</span>
                </React.Fragment>
              ))}
              {selectedSeries.isComingSoon && (
                <>
                  <span className="w-1 h-1 bg-white/30 rounded-full" />
                  <span className="text-pink-400 font-bold flex items-center gap-1">
                    <Sparkles size={14} /> PRÓXIMAMENTE
                  </span>
                </>
              )}
            </div>

            <p className="text-white/90 text-sm md:text-lg leading-relaxed line-clamp-3 md:line-clamp-4 max-w-xl drop-shadow-md py-1">
              {selectedSeries.description}
            </p>

            {selectedSeries.cast && (
              <div className="text-xs md:text-sm text-white/70">
                <span className="uppercase tracking-wider text-white/50 text-[10px] md:text-xs font-bold mr-2">Protagonistas:</span>
                {selectedSeries.cast.join(", ")}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center pt-2 w-full md:w-auto pb-4">
               <div className="flex items-center gap-4 mt-0 w-full md:w-auto">
                  {!selectedSeries.isComingSoon && (
                     <button 
                      onClick={() => {
                         const firstEp = selectedSeries.seasons[0]?.episodes[0];
                         if(firstEp) handleWatchClick(firstEp);
                      }}
                      className="bg-white text-black hover:bg-pink-500 hover:text-white px-8 py-3 rounded-2xl font-bold font-gravity flex items-center justify-center gap-2 transition-all duration-300 flex-1 md:flex-none text-base shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95"
                     >
                       <Play size={20} fill="currentColor" /> Reproducir
                     </button>
                  )}
                  <button 
                    onClick={(e) => toggleFavorite(e, selectedSeries.id)}
                    className={`p-3 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-lg active:scale-95 ${isFav ? 'bg-pink-100 dark:bg-pink-500/20 border-pink-400 dark:border-pink-500 text-pink-600 dark:text-pink-500 hover:bg-pink-200 dark:hover:bg-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'bg-white/50 dark:bg-white/10 border-gray-300 dark:border-white/30 hover:bg-white/80 dark:hover:bg-white/20 text-gray-700 dark:text-white hover:border-pink-300 dark:hover:border-white/50'}`}
                    title="Añadir a mi lista"
                  >
                    {isFav ? <Heart size={24} fill="currentColor" /> : <Plus size={24} />}
                  </button>
               </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 relative z-30">
        <div className="space-y-12">
          {selectedSeries.seasons.map((season) => (
            <SeasonSlider 
              key={season.id} 
              season={season} 
              activeEpisode={activeEpisode} 
              onEpisodeClick={handleWatchClick} 
              user={user}
              isComingSoon={selectedSeries.isComingSoon}
              watchedEpisodes={watchedEpisodes}
            />
          ))}
        </div>
      </div>

      <div className={`max-w-7xl mx-auto px-4 md:px-8 ${selectedSeries.id === 'serie-1' ? 'pb-8 md:pb-20' : 'pb-20'} mt-10 md:mt-12 pt-8 md:pt-12 relative`}>
        <div className="absolute top-0 left-4 right-4 md:left-8 md:right-8 h-px bg-gradient-to-r from-transparent via-pink-200 dark:via-white/20 to-transparent"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
          <div className="md:col-span-5 space-y-4 md:space-y-6">
            <h3 className="text-xl md:text-2xl font-gravity font-bold text-pink-600 dark:text-white flex items-center gap-2">
              <Info size={20} className="md:w-6 md:h-6 text-pink-500" /> Acerca de
            </h3>
            <div className="bg-zinc-900/80 rounded-2xl md:rounded-3xl p-5 md:p-8 border border-white/5 shadow-2xl transition-all duration-300 hover:bg-zinc-800/80">
              <h4 className="font-bold text-lg md:text-xl text-white mb-1">{selectedSeries.title}</h4>
              <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-4">
                {selectedSeries.tags[0]}
              </p>
              
              <div className="relative">
                <p className={`text-white/70 text-sm md:text-base leading-relaxed ${!isAboutExpanded ? 'line-clamp-4' : ''}`}>
                  {selectedSeries.aboutDescription || selectedSeries.description}
                </p>
                
                {(selectedSeries.aboutDescription || selectedSeries.description).length > 150 && (
                  <button 
                    onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                    className="text-pink-400 hover:text-pink-300 text-sm font-bold mt-4 hover:underline focus:outline-none transition-colors"
                  >
                    {isAboutExpanded ? "Leer menos" : "Leer más"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4 md:space-y-6">
            <h3 className="text-xl md:text-2xl font-gravity font-bold text-purple-600 dark:text-white flex items-center gap-2">
              <Star size={20} className="md:w-6 md:h-6 text-purple-500" /> Info
            </h3>
            
            <div className="space-y-4 bg-zinc-900/80 rounded-2xl md:rounded-3xl p-5 md:p-8 border border-white/5 shadow-2xl">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider font-bold mb-1">Estudio</p>
                <p className="text-white text-sm font-medium">{selectedSeries.studio || "N/A"}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider font-bold mb-1">Lanzamiento</p>
                <p className="text-white text-sm font-medium">{selectedSeries.year}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider font-bold mb-1">Clasificación</p>
                <p className="text-white text-xs font-bold bg-zinc-800 px-2 py-1 rounded-md inline-block border border-white/10">
                  {selectedSeries.contentRating || "TV-14"}
                </p>
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider font-bold mb-1">Región</p>
                <p className="text-white text-sm font-medium">{selectedSeries.regionOfOrigin || "Estados Unidos"}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 space-y-6">
            <h3 className="text-2xl font-gravity font-bold text-blue-600 dark:text-white flex items-center gap-2">
              <Zap size={24} className="text-blue-500" /> Idiomas
            </h3>
            
            <div className="space-y-5 bg-zinc-900/80 rounded-3xl p-6 md:p-8 border border-white/5 shadow-2xl">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider font-bold mb-1">Audio Original</p>
                <p className="text-white text-sm font-medium">{selectedSeries.originalAudio || "Inglés"}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider font-bold mb-1">Subtítulos</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(selectedSeries.subtitleLanguages || ["Español"]).map(lang => (
                    <span key={lang} className="text-white text-xs bg-zinc-800 px-3 py-1 rounded-full border border-white/10">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-white/30 text-[10px] uppercase tracking-wider font-bold mb-1">Copyright</p>
                <p className="text-white/40 text-xs">{selectedSeries.copyright || `© ${selectedSeries.year} ${selectedSeries.studio || "Studio"}`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Only: Extra deco at bottom (Requested for The Simple Life) */}
      {selectedSeries.id === "serie-1" && (
        <div className="md:hidden w-full overflow-hidden relative m-0 p-0 flex">
           <motion.img 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             whileTap={{ scale: 0.98 }}
             onClick={(e) => {
               e.stopPropagation();
               if (onFlashClick) onFlashClick();
             }}
             src="https://s4.ezgif.com/tmp/ezgif-4a0e5706c0260b34.gif"
             alt="Moda Granjera Mobile Bottom"
             className="w-full h-auto cursor-pointer block m-0 p-0"
             referrerPolicy="no-referrer"
           />
        </div>
      )}
    </div>
  );
};

export default SeriesDetailView;
