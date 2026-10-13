import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, Plus, Check, Clock } from 'lucide-react';
import { Series } from '../../types';
import { resolveHeroBanner, ResolvedHeroBanner, LOGO_SIZE_DESKTOP, LOGO_SIZE_MOBILE } from '../utils/heroBanner';

interface HeroCarouselProps {
  banners: any[];
  seriesData: Series[];
  favorites: string[];
  autoplaySeconds?: number;
  onSeriesClick: (series: Series) => void;
  onToggleFav: (e: React.MouseEvent, id: string) => void;
}

const MIN_SWIPE_DISTANCE = 50;

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  banners,
  seriesData,
  favorites,
  autoplaySeconds = 15,
  onSeriesClick,
  onToggleFav,
}) => {
  const slides = useMemo(
    () => banners
      .map((b, i) => resolveHeroBanner(b, seriesData, i))
      .filter(b => b.desktopImage || b.mobileImage),
    [banners, seriesData]
  );

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [slides.length, index]);

  // Pausar cuando la pestaña no está visible
  useEffect(() => {
    const onVisibility = () => setIsPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const count = slides.length;
  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Precargar la siguiente imagen para que la transición no parpadee
  useEffect(() => {
    if (count < 2) return;
    const upcoming = slides[(index + 1) % count];
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const img = new Image();
    img.src = isMobile ? upcoming.mobileImage : upcoming.desktopImage;
  }, [index, slides, count]);

  if (count === 0) return null;

  const current: ResolvedHeroBanner = slides[Math.min(index, count - 1)];
  const autoplay = autoplaySeconds > 0 && count > 1;
  const isFav = current.series ? favorites.includes(current.series.id) : false;

  const openBanner = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (current.series) {
      onSeriesClick(current.series);
    } else if (current.linkUrl) {
      window.open(current.linkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const toggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (current.series) onToggleFav(e, current.series.id);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    setIsPaused(false);
    if (touchStart.current === null || touchEnd.current === null) return;
    const distance = touchStart.current - touchEnd.current;
    if (distance > MIN_SWIPE_DISTANCE) next();
    if (distance < -MIN_SWIPE_DISTANCE) prev();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  };

  const overlay = current.overlayOpacity / 100;
  const isClickable = Boolean(current.series || current.linkUrl);
  const PrimaryIcon = current.isComingSoon ? Clock : Play;

  const metaLine = (className: string) => (
    <div className={className}>
      <span className="bg-white/20 px-1.5 py-0.5 rounded text-white border border-white/10">{current.badge}</span>
      {current.metaText ? (
        <span className="text-white">{current.metaText}</span>
      ) : (
        <>
          <span>{current.year}</span>
          <span>•</span>
          <span>{current.genre}</span>
        </>
      )}
      {current.featureBadges.map(fb => (
        <span key={fb} className="px-1.5 py-0.5 rounded border border-white/30 text-white/90">{fb}</span>
      ))}
    </div>
  );

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Destacados"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onClick={openBanner}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`relative w-full overflow-hidden mx-auto max-w-none group transition-all duration-300 bg-black min-h-[65vh] md:min-h-[75vh] flex items-center outline-none ${isClickable ? 'cursor-pointer' : ''}`}
      style={{ maxWidth: '2880px' }}
    >
      {/* Desktop */}
      <div className="hidden md:block w-full relative min-h-[65vh] md:min-h-[75vh]">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={current.desktopImage || current.mobileImage}
              alt={current.title}
              className="absolute inset-0 w-full h-full block object-cover object-center"
              referrerPolicy="no-referrer"
            />

            {/* Degradado para que el texto se lea sobre cualquier imagen */}
            {overlay > 0 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, rgba(0,0,0,${overlay}) 0%, rgba(0,0,0,${overlay * 0.6}) 35%, rgba(0,0,0,0) 65%), linear-gradient(0deg, rgba(0,0,0,${overlay * 0.8}) 0%, rgba(0,0,0,0) 30%)`,
                }}
              />
            )}

            <div className="absolute inset-0 flex flex-col justify-center items-start p-8 pt-32 pl-12 md:pl-24 lg:pl-40 z-10">
              <div className="max-w-4xl relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  {current.topBadge && (
                    <span className="inline-block mb-4 bg-pink-500 text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-lg">
                      {current.topBadge}
                    </span>
                  )}

                  {current.logoUrl ? (
                    <img
                      src={current.logoUrl}
                      alt={current.title}
                      className={`${LOGO_SIZE_DESKTOP[current.logoSize]} w-auto h-auto object-contain object-left mb-6 drop-shadow-lg`}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <h1 className="font-gravity text-3xl md:text-5xl font-extrabold text-white mb-2 leading-none drop-shadow-lg">
                      {current.title}
                    </h1>
                  )}

                  <h2 className="text-white font-gravity font-bold text-base md:text-xl mb-2 drop-shadow-md">
                    {current.subtitle}
                  </h2>

                  {metaLine('flex flex-wrap items-center gap-2 text-gray-300 text-[10px] md:text-xs font-medium')}

                  {current.description && (
                    <p className="text-gray-300 text-sm md:text-base line-clamp-2 md:line-clamp-3 mt-4 mb-6 font-inter font-medium leading-relaxed drop-shadow-sm max-w-xl">
                      {current.description}
                    </p>
                  )}

                  {current.showDesktopButtons && isClickable && (
                    <div className={`flex items-center gap-3 ${current.description ? '' : 'mt-6'}`}>
                      <button
                        onClick={openBanner}
                        className="bg-white text-black font-inter font-black px-7 py-3 rounded-xl flex items-center gap-2 text-sm uppercase hover:bg-white/90 active:scale-95 transition-all shadow-lg"
                      >
                        <PrimaryIcon size={18} className={current.isComingSoon ? '' : 'fill-black'} />
                        {current.primaryButtonText}
                      </button>
                      {current.showMyListButton && (
                        <button
                          onClick={toggleFav}
                          aria-pressed={isFav}
                          className="bg-[#2a2a2a]/60 hover:bg-[#2a2a2a]/80 text-white font-inter font-black px-6 py-3 rounded-xl flex items-center gap-2 text-sm uppercase backdrop-blur-md border border-white/10 active:scale-95 transition-all shadow-md"
                        >
                          {isFav ? <Check size={18} /> : <Plus size={18} />}
                          Mi Lista
                        </button>
                      )}
                    </div>
                  )}

                  {current.footerText && (
                    <p className="mt-4 text-white/70 text-xs font-medium max-w-xl drop-shadow-sm">{current.footerText}</p>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile - póster vertical */}
      <div className="md:hidden w-full relative min-h-[65vh] overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.img
            key={current.key}
            src={current.mobileImage || current.desktopImage}
            alt={current.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {overlay > 0 && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(0deg, rgba(0,0,0,${Math.min(1, overlay * 1.4)}) 0%, rgba(0,0,0,0) 45%)` }}
          />
        )}

        <div className="absolute inset-x-0 bottom-0 p-5 pb-8 flex flex-col items-center justify-end z-10 h-full">
          {current.topBadge && (
            <span className="mb-3 bg-pink-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg">
              {current.topBadge}
            </span>
          )}

          {current.mobileLogoUrl ? (
            <img
              src={current.mobileLogoUrl}
              className={`${LOGO_SIZE_MOBILE[current.logoSize]} w-auto h-auto object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.6)] mb-4`}
              alt={current.title}
              referrerPolicy="no-referrer"
            />
          ) : (
            <h1 className="font-gravity text-3xl font-extrabold text-white mb-3 text-center leading-none drop-shadow-lg">
              {current.title}
            </h1>
          )}

          {metaLine('flex flex-wrap items-center justify-center gap-2 text-white/90 text-[13px] font-medium drop-shadow-md mb-3')}

          {current.footerText && (
            <p className="text-white/80 text-xs text-center mb-3 drop-shadow-md">{current.footerText}</p>
          )}

          {isClickable && (
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={openBanner}
                className={`${current.showMyListButton ? 'flex-[3]' : 'flex-1'} bg-white text-black font-inter font-black py-4 rounded-xl flex items-center justify-center gap-2 text-[15px] uppercase active:scale-95 transition-transform shadow-lg`}
              >
                <PrimaryIcon size={20} className={current.isComingSoon ? '' : 'fill-black'} />
                {current.primaryButtonText}
              </button>
              {current.showMyListButton && (
                <button
                  onClick={toggleFav}
                  aria-pressed={isFav}
                  className="flex-[2] bg-[#2a2a2a]/60 text-white font-inter font-black py-4 rounded-xl flex items-center justify-center gap-2 text-[15px] backdrop-blur-md border border-white/10 active:scale-95 transition-transform shadow-md"
                >
                  {isFav ? <Check size={20} /> : <Plus size={20} />}
                  MI LISTA
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Controles */}
      {count > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Banner anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/60 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hidden md:block z-20"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Banner siguiente"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/60 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hidden md:block z-20"
          >
            <ChevronRight size={32} />
          </button>

          {/* Indicadores con progreso del autoplay */}
          <div className="absolute bottom-2 md:bottom-10 right-1/2 translate-x-1/2 flex gap-2 z-20">
            {slides.map((s, i) => (
              <button
                key={s.key}
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                aria-label={`Ir al banner ${i + 1}`}
                aria-current={i === index}
                className={`relative overflow-hidden transition-all duration-300 rounded-full ${i === index ? 'w-6 md:w-8 h-2 md:h-2.5 bg-white/40' : 'w-2 md:w-2.5 h-2 md:h-2.5 bg-white/40 hover:bg-white/60'}`}
              >
                {i === index && (
                  <span
                    key={`${s.key}-${index}`}
                    className="absolute inset-0 bg-pink-500 origin-left rounded-full"
                    style={autoplay ? {
                      animation: `hero-progress ${autoplaySeconds}s linear forwards`,
                      animationPlayState: isPaused ? 'paused' : 'running',
                    } : undefined}
                    onAnimationEnd={autoplay ? next : undefined}
                  />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroCarousel;
