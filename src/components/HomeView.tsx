import React, { useState, useEffect } from 'react';
import { Search, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SERIES_DATA, SOUND_EFFECTS } from '../../constants';
import { Series } from '../../types';
import SeriesCard from './SeriesCard';

import { playSound } from '../utils/sound';
interface HomeViewProps {
  favorites: string[];
  onToggleFav: (e: React.MouseEvent, id: string) => void;
  onSeriesClick: (series: Series) => void;
  searchQuery: string;
  onGifClick: () => void;
}

const HomeView = ({ 
  favorites, 
  onToggleFav, 
  onSeriesClick,
  searchQuery,
  onGifClick
}: HomeViewProps) => {
  const favoriteSeries = SERIES_DATA.filter(s => favorites.includes(s.id) && s.id !== "serie-charm-school");
  
  const currentSeries = SERIES_DATA[0];

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    const filteredSeries = SERIES_DATA.filter(serie => 
      serie.id !== "serie-charm-school" && (
      serie.title.toLowerCase().includes(query) ||
      serie.description.toLowerCase().includes(query) ||
      serie.tags.some(tag => tag.toLowerCase().includes(query)) ||
      (serie.cast && serie.cast.some(actor => actor.toLowerCase().includes(query))) ||
      serie.seasons.some(season => 
        season.episodes.some(ep => 
          ep.title.toLowerCase().includes(query) || 
          ep.description.toLowerCase().includes(query)
        )
      ))
    );

    return (
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500">
              <Search size={24} />
            </div>
            <h2 className="font-gravity text-3xl font-bold text-white tracking-tight">
              Resultados para <span className="text-pink-500 italic">"{searchQuery}"</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm md:text-base ml-13">
            Encontramos {filteredSeries.length} {filteredSeries.length === 1 ? 'coincidencia' : 'coincidencias'} para tu búsqueda.
          </p>
        </motion.div>

        {filteredSeries.length > 0 ? (
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-x-6 md:gap-y-10"
          >
            {filteredSeries.map((serie) => (
              <motion.div 
                key={serie.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.95, y: 20 },
                  show: { opacity: 1, scale: 1, y: 0 }
                }}
              >
                <SeriesCard 
                  serie={serie} 
                  isFav={favorites.includes(serie.id)}
                  onToggleFav={(e) => onToggleFav(e, serie.id)}
                  onClick={() => onSeriesClick(serie)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="bg-white/5 p-10 rounded-3xl backdrop-blur-md border border-white/10 max-w-md">
              <div className="w-20 h-20 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-500 mx-auto mb-6">
                <Search size={40} className="opacity-50" />
              </div>
              <p className="font-gravity text-2xl font-bold text-white mb-3">No hay resultados</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 px-4">
                Lo sentimos, no pudimos encontrar ninguna serie que coincida con "<span className="text-white">{searchQuery}</span>". 
                Prueba con otro título, género o el nombre de algún protagonista.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-pink-500 hover:bg-pink-600 text-white font-gravity font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)]"
              >
                Ver todo el catálogo
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-12 fade-in">
      <div 
        onClick={() => onSeriesClick(currentSeries)}
        className="w-full relative group cursor-pointer bg-black"
        style={{ maxWidth: '2880px', margin: '0 auto' }}
      >
        {/* Desktop Version */}
        <div className="hidden md:block w-full relative">
          <picture className="w-full block">
            <source media="(max-width: 768px)" srcSet={currentSeries.mobileBannerImage || currentSeries.coverImage || undefined} />
            <img 
              src={currentSeries.bannerImage || currentSeries.coverImage || undefined} 
              alt={currentSeries.title} 
              className="w-full object-contain object-center block"
            />
          </picture>
          
          <img 
            src="/src/assets/images/regenerated_image_1777741269617.png" 
            className="absolute inset-0 w-full h-full object-cover z-[5] pointer-events-none" 
            alt="Banner Overlay" 
            referrerPolicy="no-referrer"
          />
          
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[6]" />
          <div className="absolute inset-0 flex flex-col justify-start items-start p-16 pt-20 lg:pt-24 z-10">
            <div className="max-w-2xl relative drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              {currentSeries.logoUrl ? (
                <img src={currentSeries.logoUrl || undefined} alt={currentSeries.title} className="h-40 lg:h-52 w-auto object-contain mb-2 self-start" />
              ) : (
                <h1 className="font-gravity text-5xl font-extrabold text-white mb-2 leading-none">
                  {currentSeries.title}
                </h1>
              )}
              
              <h2 className="text-white font-gravity font-bold text-xl mb-2">
                {currentSeries.bannerText || (currentSeries.isComingSoon ? 'Muy Pronto' : 'Todos los episodios disponibles')}
              </h2>

              <div className="flex items-center gap-2 text-gray-300 text-xs font-medium">
                 <span className="bg-white/20 px-1.5 py-0.5 rounded text-white border border-white/10">{currentSeries.contentRating || "TV-14"}</span>
                 <span>{currentSeries.year}</span>
                 <span>•</span>
                 <span>{currentSeries.genre}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Version - 1080x1440 Poster */}
        <div className="md:hidden w-full relative">
          <img 
            src={currentSeries.mobileBannerImage || currentSeries.coverImage || undefined} 
            alt={currentSeries.title} 
            className="w-full aspect-[3/4] object-cover block"
          />
          
          {/* Stronger bottom gradient for text contrast */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/60 to-transparent" />

          {/* Bottom UI inside card */}
          <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center gap-4">
            {/* Logo centered */}
            {currentSeries.logoUrl && (
              <img 
                src={currentSeries.logoUrl} 
                className="h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]" 
                alt="Logo" 
              />
            )}

            {/* Buttons */}
            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={(e) => { e.stopPropagation(); onSeriesClick(currentSeries); }}
                className="flex-[3] bg-white text-black font-inter font-black py-3 rounded-lg flex items-center justify-center gap-2 text-[14px] active:scale-95 transition-transform"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72l11-6.86L8 5.14z"/></svg>
                Reproducir
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleFav(e, currentSeries.id); }}
                className="flex-[2] bg-[#2a2a2a]/60 text-white font-inter font-black py-3 rounded-lg flex items-center justify-center gap-2 text-[14px] backdrop-blur-md border border-white/10 active:scale-95 transition-transform"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Mi lista
              </button>
            </div>
          </div>
        </div>
      </div>


      {favoriteSeries.length > 0 && (
        <div className="w-full px-4 md:px-12 mt-4 md:mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h2 className="font-gravity text-xl md:text-2xl font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2 drop-shadow-sm">
              <Heart className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" /> Mi Lista
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 p-2">
              {favoriteSeries.map(serie => (
                <div 
                  key={serie.id} 
                  onClick={() => onSeriesClick(serie)}
                  className="aspect-[16/9] cursor-pointer group/card relative"
                >
                   <div className="w-full h-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 ring-2 ring-transparent hover:ring-white ring-offset-2 ring-offset-transparent">
                      <img 
                        src={serie.wideImage || `https://placehold.co/800x449/FF00FF/FFFFFF/png?text=${encodeURIComponent(serie.title)}` || undefined}
                        alt={serie.title} 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        onClick={(e) => { e.stopPropagation(); onToggleFav(e, serie.id); }}
                        className="absolute top-2 right-2 bg-black/40 hover:bg-pink-500 text-white rounded-full p-2 transition-all z-30"
                      >
                          <Heart size={16} className="text-pink-500 fill-current" />
                      </button>
                   </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="w-full px-4 md:px-12 mt-8 md:mt-12" id="series-section">
        <h2 className="font-gravity text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 pl-3 border-l-4 border-pink-500">
          Todas las Series
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
          {SERIES_DATA.filter(s => s.id !== "serie-charm-school").map((serie) => (
            <SeriesCard 
              key={serie.id} 
              serie={serie} 
              isFav={favorites.includes(serie.id)}
              onToggleFav={(e) => onToggleFav(e, serie.id)}
              onClick={() => onSeriesClick(serie)}
            />
          ))}
        </div>
      </div>

      <div className="w-full px-4 md:px-12 pb-12 mt-8 md:mt-12">
        <div className="w-full cursor-pointer" onClick={onGifClick}>
          <img 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLh225Rmw7rsWKKBunjaSP6-SkAFZuh6xgakMguBTQgnU_5o71egK_GLaFN7JuwU2SkXAK_LY9mwKTiugHqkiO5rYmIgr_y4l-nDwYZkcqwi11fWGO-1oko3Jgm_j3KIrPnbnHsW3cYHDMVFz4hsrrTZ9Ek16g0CT7QONTaTmNMMkk77Hhus2cPooo-QA/s2396/Sin%20t%C3%ADtulo-2.gif" 
            alt="Banner Decorativo Desktop" 
            className="hidden md:block w-full h-auto"
            referrerPolicy="no-referrer"
          />
          <img 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgQeFDn-Tp0vjSdoki8PRL3uw-NNp78WveoKZuIuuRfDWyYNdhVLxnNCBVF-MqH2k2ghP4d7WEwXcSsT0J5TfHURtn4YWdRh6T0D22W_ThdDP5W5IaFPDbEHE_NjYelC4KI3lgcBwH483aOU1UWNBP7Ax7eAfRhdwvyizuy8Ry3157ilv8pJWwnKn_z4Vk/s402/Sin%20t%C3%ADtulo.gif" 
            alt="Banner Decorativo Móvil" 
            className="block md:hidden w-full h-auto"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeView;
