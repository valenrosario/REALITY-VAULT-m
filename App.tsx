import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Play, 
  Lock, 
  User as UserIcon, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  X as XIcon,
  ChevronRight,
  ChevronLeft, // Importado para el carrusel
  Tv,
  LogOut,
  ArrowLeft,
  Sparkles,
  Star,
  Info,
  Zap,
  Sun,
  Moon,
  Search,
  Plus,
  Check,
  Key,
  Maximize,
  Minimize,
  TrendingUp
} from 'lucide-react';
import { SERIES_DATA, APP_NAME, APP_LOGO_URL, AVATAR_OPTIONS, SOCIAL_LINKS, MARQUEE_TEXT, SOUND_EFFECTS } from './constants';
import { Series, Episode, AuthState } from './types';
import SeriesDetailView from './src/components/SeriesDetailView';
// import BlingCursor from './BlingCursor';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useAuth, AuthProvider } from './src/contexts/AuthContext';
import { LoginForm } from './src/components/auth/LoginForm';
import { RegisterForm } from './src/components/auth/RegisterForm';


// ==========================================
// COMPONENTES UI REUTILIZABLES
// ==========================================

// --- HELPER DE SONIDO ---
const playSound = (type: keyof typeof SOUND_EFFECTS) => {
  try {
    const audio = new Audio(SOUND_EFFECTS[type]);
    audio.volume = 0.4; // Volumen sutil
    audio.play().catch(e => console.log("Audio play failed (user interaction needed first)", e));
  } catch (e) {
    console.error("Error playing sound", e);
  }
};

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: { children?: React.ReactNode, onClick?: () => void, variant?: 'primary' | 'secondary' | 'danger' | 'solid' | 'outline' | 'white', className?: string, disabled?: boolean }) => {
  
  const handleClick = (e: React.MouseEvent) => {
    if (!disabled) {
      playSound('click');
      onClick?.();
    }
  };

  // Estilo Base (Layout + Typography)
  const baseStyle = "font-gravity font-bold text-sm uppercase tracking-wider px-6 py-2.5 rounded-full transition-all duration-300 select-none shadow-lg relative overflow-hidden flex items-center justify-center gap-2 group";
  
  const variants = {
    // Primary: Liquid Glass con Borde Rosita (Ahora usa el componente LiquidGlass)
    primary: "border border-pink-300 dark:border-pink-500 text-pink-700 dark:text-white hover:border-pink-400 hover:text-pink-800 dark:hover:text-pink-100 hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
    
    // Secondary: Glass más sutil
    secondary: "backdrop-blur-xl border bg-white/10 dark:bg-white/5 border-white/40 dark:border-white/20 text-gray-700 dark:text-gray-200 hover:bg-white/30 hover:border-pink-300/50 hover:text-pink-600 dark:hover:text-pink-300 hover:scale-105 active:scale-95 disabled:opacity-50",
    
    // Danger: Glass Rojo
    danger: "backdrop-blur-xl border bg-red-500/10 border-red-400 text-red-600 dark:text-red-300 hover:bg-red-500/30 hover:border-red-500 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:scale-105 active:scale-95",

    // Solid: Botón Sólido (Estilo "Antes")
    solid: "bg-pink-600 text-white border-2 border-pink-600 hover:bg-white/30 hover:border-white/60 hover:backdrop-blur-3xl hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:scale-105 active:scale-95",

    // Outline: Borde Blanco (Estilo "Antes")
    outline: "bg-transparent border-2 border-white text-white hover:bg-white/20 hover:scale-105 active:scale-95",

    // White: Botón Blanco
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

// --- COMPONENTE DE DESLIZADOR DE TEMPORADA ---
const SeasonSlider = ({ season, activeEpisode, onEpisodeClick, user, isComingSoon, watchedEpisodes }: { season: any, activeEpisode: any, onEpisodeClick: (ep: any) => void, user: any, isComingSoon?: boolean, watchedEpisodes?: string[], key?: any }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const episodeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
      // Check inicial
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Auto-centrar episodio activo
  useEffect(() => {
    if (activeEpisode && episodeRefs.current[activeEpisode.id] && scrollContainerRef.current) {
      const element = episodeRefs.current[activeEpisode.id];
      const container = scrollContainerRef.current;
      
      if (element && container) {
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const scrollLeft = element.offsetLeft - (container.clientWidth / 2) + (element.clientWidth / 2);
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeEpisode]);

  return (
    <div className="relative group/slider mb-12">
      <h3 className="font-gravity text-2xl font-bold text-white mb-4 ml-2 pl-3 border-l-4 border-pink-500">
        {season.title}
      </h3>
      
      {/* Botones de Scroll (Estilo Liquid Glass) */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-white/80 dark:hover:bg-white/20 hover:scale-110 hidden md:flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        aria-label="Scroll Left"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-white/80 dark:hover:bg-white/20 hover:scale-110 hidden md:flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]"
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
              ref={el => episodeRefs.current[ep.id] = el}
              className={`min-w-[200px] w-[200px] md:min-w-[280px] md:w-[280px] flex flex-col gap-3 p-0 rounded-xl transition-all duration-300 ease-in-out group snap-center relative
                ${isActive ? 'z-10 scale-[1.02]' : 'hover:z-10'}
                ${isEpComingSoon && !user?.isPremium ? 'cursor-default' : 'cursor-pointer'}
              `}
              onClick={() => (!isEpComingSoon || user?.isPremium) && onEpisodeClick(ep)}
            >
              {/* Thumbnail Container */}
              <div 
                className={`w-full aspect-video rounded-lg overflow-hidden relative shrink-0 shadow-lg border border-white/10 transition-all duration-500 
                  ${isActive ? 'ring-4 ring-pink-500 shadow-[0_0_25px_rgba(236,72,153,0.6)]' : 'group-hover:ring-2 group-hover:ring-white/50 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]'} 
                  ${isWatched ? 'opacity-80' : ''}
                `}
              >
                <img src={ep.thumbnail || undefined} alt={ep.title} loading="lazy" className={`w-full h-full object-cover transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} referrerPolicy="no-referrer" />
                
                {/* Watched Badge */}
                {isWatched && (
                  <div className="absolute top-2 left-2 z-20 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg border border-white/20 animate-in zoom-in duration-300">
                    Visto
                  </div>
                )}

                {/* Coming Soon Badge (Episode Level) */}
                {ep.isComingSoon && (
                  <div className="absolute top-2 right-2 z-20 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg border border-white/20">
                    Proximamente
                  </div>
                )}

                {/* Overlay Play Button */}
                <div className={`absolute inset-0 transition-opacity duration-300 flex items-center justify-center ${isActive ? 'bg-pink-500/20' : 'bg-black/40 opacity-0 group-hover:opacity-100'}`}>
                  <div className={`rounded-full p-3 backdrop-blur-md border border-white/30 text-white shadow-xl transform transition-transform duration-300 ${isActive ? 'scale-110 bg-pink-500' : 'bg-white/20'}`}>
                      {isEpComingSoon && !user?.isPremium ? <Lock size={24} className="text-white/50" /> : (user || isComingSoon ? <Play size={24} fill="currentColor" /> : <Lock size={24} />)}
                  </div>
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-black/80 text-white px-1.5 py-0.5 rounded border border-white/10">
                  {ep.duration}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1 px-1">
                  <h4 className={`font-gravity font-bold text-sm md:text-base leading-tight transition-colors duration-300 
                    ${isActive ? 'text-pink-500' : 'text-gray-100 group-hover:text-pink-400'}
                  `}>
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

      {/* Progress Bar (Apple TV Style) */}
      <div className="absolute bottom-2 left-0 w-full h-0.5 bg-white/10 rounded-full overflow-hidden mx-4">
        <div 
          className="h-full bg-white/40 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${Math.max(5, scrollProgress)}%` }} 
        />
      </div>
    </div>
  );
};

// Loader Mágico con Varita
const MagicLoader = () => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-pink-50/90 dark:bg-slate-900/90 backdrop-blur-md fade-in">
    <div className="flex flex-col items-center pop-in relative">
      {/* Burst Effect Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-400/30 dark:bg-pink-600/30 blur-3xl rounded-full animate-pulse pointer-events-none"></div>
      
      <div className="relative w-24 h-24 z-10">
        {/* Varita (Icono o SVG simple) */}
        <div className="absolute inset-0 flex items-center justify-center magic-star text-pink-500 dark:text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">
           <Sparkles size={64} fill="currentColor" />
        </div>
      </div>
      <p className="mt-4 font-gravity text-pink-600 dark:text-pink-300 font-bold animate-pulse text-xl z-10 drop-shadow-sm">Cargando Magia...</p>
    </div>
  </div>
);

// Barra de Noticias (Marquee)
const NewsMarquee = () => (
  <div className="bg-[#e30119] text-white py-1.5 overflow-hidden border-b-2 border-[#e30119]/80 relative z-50 transition-colors">
    <div className="animate-marquee font-gravity text-sm font-bold tracking-widest uppercase">
      {MARQUEE_TEXT}
    </div>
  </div>
);

// Modal Genérico (Alertas Estilosas)
const GifModal = ({ isOpen, onClose, imageUrl }: { isOpen: boolean, onClose: () => void, imageUrl: string }) => {
  if (!isOpen) return null;
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] md:max-w-md w-fit animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-pink-500 text-white p-1.5 rounded-full hover:bg-pink-600 transition-colors shadow-lg z-50"
        >
          <XIcon size={20} />
        </button>
        <img 
          src={imageUrl} 
          alt="GIF Modal Content" 
          className="block w-auto h-auto max-h-[75vh] max-w-full rounded-2xl shadow-2xl border-4 border-pink-200/20"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};

const AlertModal = ({ isOpen, title, message, onClose, type = 'info' }: { isOpen: boolean, title: string, message: string, onClose: () => void, type?: 'info' | 'error' | 'success' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-pink-300 dark:border-pink-600 rounded-3xl w-full max-w-sm p-6 shadow-[0_0_40px_rgba(236,72,153,0.3)] text-center relative">
        <div className="mb-4 flex justify-center">
           {type === 'error' ? (
             <div className="p-3 bg-red-100/50 dark:bg-red-900/30 rounded-full text-red-500 dark:text-red-400 shadow-inner"><XIcon size={32} /></div>
           ) : type === 'success' ? (
             <div className="p-3 bg-green-100/50 dark:bg-green-900/30 rounded-full text-green-500 dark:text-green-400 shadow-inner"><Check size={32} /></div>
           ) : (
             <div className="p-3 bg-blue-100/50 dark:bg-blue-900/30 rounded-full text-blue-500 dark:text-blue-400 shadow-inner"><Info size={32} /></div>
           )}
        </div>
        <h3 className="font-gravity text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <Button onClick={onClose} variant="primary">Entendido</Button>
      </div>
    </div>
  );
};

const ComingSoonModal = ({ series, onClose }: { series: Series | null, onClose: () => void }) => {
  if (!series) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-pink-300 dark:border-pink-600 rounded-3xl w-full max-w-sm p-8 shadow-[0_0_40px_rgba(236,72,153,0.3)] text-center relative flex flex-col items-center" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-pink-500 transition-colors">
          <XIcon size={20} />
        </button>
        <div className="flex justify-center items-center w-full mb-6">
          <img 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjRkFFESEtncD14JVS-3HzgsBtiaSoUdIXXQJyVYOFhWmqnHLROyBDldh6n20XHbCOqJHqtUXZ_k8LETnd1-H0AUuIP_2hUlr7UcQtGKPWf1mnuq2fz1MWAXGSXKmo1AK-66agSyspbWfQWWoXC-9-_JQZYKAK_QaNmHQHI5HIcQhqFtaaQ_AZKs7APack/s800/cx.png" 
            alt={series.title} 
            className="h-24 w-auto object-contain drop-shadow-md"
            referrerPolicy="no-referrer"
          />
        </div>
        <h3 className="font-gravity text-2xl font-bold text-pink-600 dark:text-pink-400 mb-2">¡Muy Pronto!</h3>
        <p className="text-gray-600 dark:text-gray-300 font-medium mb-6">
          Esta serie estará disponible próximamente en Reality Vault. ¡Mantente atento!
        </p>
        
        <img 
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgE01Vz8lW86A8J8JXj227-s_9FbHGymo6JBszE2J2L1fzGFAd69o5UgyWZS55gtNZzL03Hh4oiMfLCArzZyBTVe4Fl0cbgEhAf9ey__c0BsgoCnqDuQrwfQItIzGbwUAfDKDUKGnfjeC1QBGM-eyGlXWup8w3oDtSoO3ltRzE8eWqIsaYBS4bySg-mAu4/s1684/REALITY%20VAULT%20LOGO.png" 
          alt="Reality Vault Logo" 
          className="h-8 w-auto object-contain mb-4 drop-shadow-sm"
          referrerPolicy="no-referrer"
        />
        
        <button 
          onClick={onClose}
          className="w-full text-white font-bold font-gravity py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
          style={{ backgroundColor: '#e30119' }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

// --- MODAL PARA FLASH (RUFFLE) ---
const FlashPlayerModal = ({ isOpen, onClose, swfUrl }: { isOpen: boolean, onClose: () => void, swfUrl: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const windowObj = window as any;
      if (!windowObj.RufflePlayer) {
        windowObj.RufflePlayer = {};
      }
      
      const ruffle = windowObj.RufflePlayer.newest();
      if (ruffle) {
        const player = ruffle.createPlayer();
        containerRef.current.appendChild(player);
        player.style.width = "100%";
        player.style.height = "100%";
        // Ruffle config to remove letterboxing and black borders
        player.config = {
          letterbox: "off",
          scale: "exactFit",
          forceScale: true,
          quality: "high",
          backgroundColor: "#ffffff"
        };
        player.load(swfUrl);
      }

      return () => {
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      };
    }
  }, [isOpen, swfUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white border-4 border-pink-400/50 rounded-[40px] w-full max-w-lg aspect-square p-0.5 shadow-[0_0_70px_rgba(236,72,153,0.5)] relative overflow-hidden">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 p-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg border-2 border-white"
        >
          <XIcon size={20} />
        </button>
        <div ref={containerRef} className="w-full h-full rounded-[34px] overflow-hidden bg-white" id="flash-container"></div>
      </div>
    </div>
  );
};

// --- COMPONENTE DE DONACIÓN PAYPAL ---
const PayPalButton = () => {
  const handleDonateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Dimensiones de la ventana emergente
    const width = 500;
    const height = 700;
    
    // Calcular la posición para centrar la ventana
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    // Abrir ventana emergente (popup)
    window.open(
      'https://www.paypal.com/donate/?hosted_button_id=UEFUB3EHB2FQC',
      'PayPalDonation',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=no,location=no,toolbar=no,menubar=no`
    );
  };

  return (
    <div className="flex justify-center my-4 hover:scale-105 transition-transform">
      <button onClick={handleDonateClick} className="focus:outline-none">
        <img 
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiEFZIGUIWjul8XK2cQKY2Faz6ulFiTAzMVDCkC_MJ7d9qLKc7uVeGsjtb9RRBVy2jxRyVnm6pJLrF0fOHcbxHHUWzBB2W0fbwpfPVNKOh-98Xz8sXa4zlTdpeel_bu02iOCaVEX7eapRBAZddWNd9QiYNSKbliYtfJonAprnDrjFGtV2vGpumgUE2IAww/s92/BOTON.png" 
          alt="Donate with PayPal button" 
          title="PayPal - The safer, easier way to pay online!" 
          referrerPolicy="no-referrer"
        />
      </button>
    </div>
  );
};

// --- COMPONENTE SKELETON TARJETA DE SERIE ---
const SeriesCardSkeleton = () => (
  <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-md bg-gray-200 dark:bg-gray-800 animate-pulse">
  </div>
);

const WideSeriesCardSkeleton = () => (
  <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-md bg-gray-200 dark:bg-gray-800 animate-pulse">
  </div>
);

// --- COMPONENTE TARJETA DE SERIE ---
const SeriesCard = ({ serie, isFav, onToggleFav, onClick, overlayImage }: { serie: Series, isFav: boolean, onToggleFav: (e: React.MouseEvent) => void, onClick: () => void, key?: any, overlayImage?: string }) => {
  
  const handleCardClick = () => {
    onClick();
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative cursor-pointer"
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-md transition-all duration-300 transform hover:scale-105 ring-2 ring-transparent hover:ring-white ring-offset-2 ring-offset-transparent">
        <img 
          src={serie.coverImage || undefined} 
          alt={serie.title} 
          loading="lazy"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        
        {overlayImage && (
          <img 
            src={overlayImage} 
            alt="Overlay" 
            className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none" 
            referrerPolicy="no-referrer"
          />
        )}
        
        {/* Overlay "MUY PRONTO" */}
        {serie.isComingSoon && (
            <div className="absolute bottom-0 left-0 right-0 z-20">
               <div className="w-full font-gravity text-white font-bold text-xs py-1 bg-purple-600/90 backdrop-blur-md text-center flex items-center justify-center gap-1">
                <Sparkles size={12} /> MUY PRONTO
              </div>
            </div>
        )}

        {/* Botón Fav */}
        {!serie.isComingSoon && (
          <motion.button 
            key={`card-fav-${serie.id}-${isFav}`}
            onClick={(e) => { e.stopPropagation(); onToggleFav(e); }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            animate={isFav ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
            className="absolute top-2 right-2 bg-black/40 hover:bg-pink-500 text-white rounded-full p-2 transition-all z-30 opacity-0 group-hover:opacity-100"
          >
              <Heart size={16} className={isFav ? "text-pink-500 fill-current" : "text-white"} />
          </motion.button>
        )}
      </div>
    </div>
  );
};

const topSeriesData = [
  {
    id: "serie-1",
    topImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhs2fYQxd5x1vbaw00EnExlExaYq4-wr1re61Xbntj7XbqmCorLdfkbQ2H0UjbU-E5KiX_mEeqqR5FrfjXQ1M08o_TqFWojmTPNBPeKbrhbcuYBG-F5GoxrFouoL97pUr-B74LEI2g8qSFhXlZF8BB_AC201Rk-AUj9NQm4duER6b_DQEkrGoG-LtmkpIc/s560/1.png"
  },
  {
    id: "serie-2",
    topImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZgHOr4BnIeGPIyLFW_cy6twkFOrqOlZO70_m6Ya_9XSckJ36Ip24-PP7CNFtPW1vqSDXd1BgfrLHG1e0sRqIvphKwHUQ2l4nqUcw-83IJJPV0D982PRxOABDvkpy1IZsbr8eEbLruN7J0GGbjPiMTm8-KNGKY0Pk5ciMLDdvS5xS33tCwRpOPP4v14nM/s560/2.png"
  },
  {
    id: "serie-3",
    topImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgtaZwYStlDVdLKbP46LwswgHeEAJ44yJexGpfLrVXojw_veyyEpt1kyCmI8eLcU-oWca2srWjfIaovr_FJZFTIsh2MyHu0Iq8beKKeVX8NO90ivQAdbND6oCm76wH6G-cxwfZzQZhlCGIBYg-6Q7u5Qj61BlpsDYL-ydgTewR-77Ql6fH8iGce0ijvs9g/s560/3.png"
  }
];

// --- HOME VIEW COMPONENT ---
const HomeView = ({ 
  favorites, 
  onToggleFav, 
  onSeriesClick,
  searchQuery,
  onGifClick,
  isLoadingSeries,
  watchedEpisodes
}: { 
  favorites: string[], 
  onToggleFav: (e: React.MouseEvent, id: string) => void, 
  onSeriesClick: (series: Series) => void,
  searchQuery: string,
  onGifClick: () => void,
  isLoadingSeries?: boolean,
  watchedEpisodes: string[]
}) => {
  const retroSeries = SERIES_DATA.filter(s => !s.isComingSoon && s.id !== "serie-charm-school");
  const comingSoonSeries = SERIES_DATA.filter(s => s.isComingSoon && s.id !== "serie-charm-school");
  const favoriteSeries = SERIES_DATA.filter(s => favorites.includes(s.id) && s.id !== "serie-charm-school");
  
  const banners = [
    {
      ...SERIES_DATA.find(s => s.id === "serie-1")!,
      mobileBannerImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh-pXI-BYvApJ1ahhjrbrjM0QooO3dAq3pZ_PrerEQcyO9bv4k1xOI_J5oWDDZMKTkR22YI-UTdeMX75yrXi7Ru8hAUiGg8850I83A-8_hp0Pu-WwYGZCO6c6s0pkMGfoO-h7s5u3JLMJVQgUuzf0syOzbWtASlJRatRB4vGjSkqZnjqIh-5gYX3np_Qls/s2160/3.png",
      bannerImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOomfkLFt78XcgzdaNS81yWn2PjfGg83VubO4g-zB7VZ42EW5F7YoWfzV2l7px3_jf1lBAoRNACoWTYK8pRNyoZaQqWDER5GuNcW31jjbe8iDkiBR17QLIMtFkZ-mQa0_XcBu7H0lgpBF7TDjTKAG2idEa8SECFMeyg9de13orTKHNLxkZOChx7lGKpKA/s3225/cc.png",
      mobileLogoUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4SXg7NW32uFbjkEdyGKvnOEncgKN_UmWk497bhne7KyH_CrAlNF9xGY8BEs-cc6UumqRwxw68VRzI03ePXbWt0nJHmX1TgIVFdbBqZlVsmWvqCk3K-cKchhf1tOh4FwXX-adTsZ-21ufQIpuMGTcTNKY9fa23lbiREdQma_PET6s7PWhsiML-E4dPwBs/s352/1.png",
      logoUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4SXg7NW32uFbjkEdyGKvnOEncgKN_UmWk497bhne7KyH_CrAlNF9xGY8BEs-cc6UumqRwxw68VRzI03ePXbWt0nJHmX1TgIVFdbBqZlVsmWvqCk3K-cKchhf1tOh4FwXX-adTsZ-21ufQIpuMGTcTNKY9fa23lbiREdQma_PET6s7PWhsiML-E4dPwBs/s352/1.png",
      bannerCustomText: "Segunda Temporada Disponible",
      bannerText: "Segunda Temporada Disponible",
      isThirdBanner: true // Marker for custom sizing
    } as any,
    SERIES_DATA.find(s => s.id === "serie-3")!,
    SERIES_DATA.find(s => s.id === "serie-1")!,
    {
      ...SERIES_DATA.find(s => s.id === "serie-2")!,
      mobileBannerImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNTTC68GkkBhUfpbIVnLQeUU6VQG5rwLFd9u5i2k2QucydcVyCPsd_XJkYdaGFXDON3zXgIeRMbFxVyCIFuU3VHE4c-Ydrd2vWBD9bG_rHgMFqRDIXIWLDOsqRfs826vzEUm3Nl7gjJuVHVN4mvI8f9US-IjjiL2X4R0D0BfMHOeiFlczJwzVlygj03w0/s2160/sa.png",
      bannerImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg1kYHW8sP2GgNuuyFFgQ3bkQJnzMKlqXf1a8EB3WsUEt-9CqTPAjaBT5xcaCdtYTwEU-2jZ1wdhfJqgFRZ-koCoLuy_BX0CW3-7mOrtnqumJ4yQAKtQGEI2ehZ0z1kwwdiiiI5WLls29L7oJ-Te4D2Aonnwk4lH9LM5ttAh-0i7ufU70fqSz_ZIdh59RU/s1440/compose.png",
      mobileLogoUrl: "https://imageservice.disco.peacocktv.com/uuid/501d6b9d-7b2c-35e9-8936-0475a0661330/LOGO_TITLE_WIDE?language=eng&proposition=NBCUOTT&version=778f50c2-4e62-3788-9d20-823d3a1b15c2",
      logoUrl: "https://imageservice.disco.peacocktv.com/uuid/501d6b9d-7b2c-35e9-8936-0475a0661330/LOGO_TITLE_WIDE?language=eng&proposition=NBCUOTT&version=778f50c2-4e62-3788-9d20-823d3a1b15c2",
      isFourthBanner: true
    } as any
  ].filter(Boolean);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Auto-avance del carrusel
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 15000); // Cambiar cada 15 segundos
    return () => clearInterval(interval);
  }, [banners.length]);

  const nextBanner = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentBannerIndex(prev => (prev + 1) % banners.length);
  };

  const prevBanner = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentBannerIndex(prev => (prev - 1 + banners.length) % banners.length);
  };

  const currentSeries = banners.length > 0 ? banners[currentBannerIndex] : SERIES_DATA[0];

  // SEARCH MODE
  if (searchQuery) {
    const normalizeString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const query = normalizeString(searchQuery);
    
    const filteredSeries = SERIES_DATA.filter(serie => 
      serie.id !== "serie-charm-school" && (
      normalizeString(serie.title).includes(query) ||
      normalizeString(serie.description).includes(query) ||
      serie.tags.some(tag => normalizeString(tag).includes(query)) ||
      (serie.cast && serie.cast.some(actor => normalizeString(actor).includes(query))) ||
      serie.seasons.some(season => 
        season.episodes.some(ep => 
          normalizeString(ep.title).includes(query) || 
          normalizeString(ep.description).includes(query)
        )
      ))
    );

    return (
      <div className="max-w-6xl mx-auto px-4 py-8 fade-in min-h-[60vh] pt-24">
        <h2 id="series-section" className="font-gravity text-2xl font-bold text-pink-600 dark:text-pink-400 mb-6 flex items-center gap-2">
          <Search size={24} /> Resultados de búsqueda: "{searchQuery}"
        </h2>
        {isLoadingSeries ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <SeriesCardSkeleton key={`search-skeleton-${i}`} />
            ))}
          </div>
        ) : filteredSeries.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredSeries.map((serie) => (
              <SeriesCard 
                key={serie.id} 
                serie={serie} 
                isFav={favorites.includes(serie.id)}
                onToggleFav={(e) => onToggleFav(e, serie.id)}
                onClick={() => onSeriesClick(serie)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-xl">No encontramos nada con esa búsqueda :(</p>
            <p className="text-sm mt-2">Intenta con otro título o actor.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-12 fade-in relative">
      {/* Hero Carousel Dinámico */}
      <div 
        onClick={() => onSeriesClick(SERIES_DATA.find(s => s.id === currentSeries.id) || currentSeries)}
        className="relative w-full overflow-hidden mx-auto max-w-none group transition-all duration-300 cursor-pointer bg-black"
        style={{ maxWidth: '2880px' }}
      >
        <div className="hidden md:block w-full relative">
          {/* We need a hidden spacer image to define the natural height of the container since children are absolute */}
          <picture className="w-full h-auto block invisible pointer-events-none">
            <source media="(max-width: 768px)" srcSet={currentSeries.mobileBannerImage || currentSeries.coverImage || undefined} />
            <img 
              src={currentSeries.bannerImage || currentSeries.coverImage || undefined} 
              alt="Spacer" 
              className="w-full h-auto"
            />
          </picture>

          <AnimatePresence initial={false} mode="popLayout">
            <motion.div 
              key={currentSeries.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full"
            >
                <picture className="w-full h-auto block">
                  <source media="(max-width: 768px)" srcSet={currentSeries.mobileBannerImage || currentSeries.coverImage || undefined} />
                  <img 
                    src={currentSeries.bannerImage || currentSeries.coverImage || undefined} 
                    alt={currentSeries.title} 
                    className="w-full h-auto block object-contain object-center"
                    referrerPolicy="no-referrer"
                  />
                </picture>
                
                <div className="absolute inset-0 flex flex-col justify-start items-start p-6 pt-12 md:p-16 md:pt-20 lg:pt-24 z-10">
                  <div className="max-w-2xl relative drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      {currentSeries.logoUrl ? (
                        <img 
                          src={currentSeries.logoUrl || undefined} 
                          alt={currentSeries.title} 
                          className={`w-auto object-contain mb-2 self-start ${currentSeries.id === 'serie-3' ? 'h-8 md:h-12 lg:h-16' : ('isThirdBanner' in currentSeries) ? 'h-16 md:h-20 lg:h-24' : ('isFourthBanner' in currentSeries) ? 'h-10 md:h-16 lg:h-24' : 'h-12 md:h-24 lg:h-32'}`} 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <h1 className="font-gravity text-3xl md:text-5xl font-extrabold text-white mb-2 leading-none">
                          {currentSeries.title}
                        </h1>
                      )}
                      
                      <h2 className="text-white font-gravity font-bold text-base md:text-xl mb-2">
                        {currentSeries.bannerText || (currentSeries.isComingSoon ? 'Muy Pronto' : 'Todos los episodios disponibles')}
                      </h2>

                      <div className="flex items-center gap-2 text-gray-300 text-[10px] md:text-xs font-medium">
                         <span className="bg-white/20 px-1.5 py-0.5 rounded text-white border border-white/10">{currentSeries.contentRating || "TV-14"}</span>
                         {('bannerCustomText' in currentSeries) && (currentSeries as any).bannerCustomText ? (
                            <span className="text-white">{String((currentSeries as any).bannerCustomText)}</span>
                         ) : (
                           <>
                             <span>{currentSeries.year}</span>
                             <span>•</span>
                             <span>{currentSeries.genre}</span>
                           </>
                         )}
                      </div>
                    </motion.div>
                  </div>
                </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Version - 1080x1440 Poster aspect ratio */}
        <div className="md:hidden w-full relative aspect-[2/3] overflow-hidden">
          <img 
            src={currentSeries.mobileBannerImage || currentSeries.coverImage || undefined} 
            alt={currentSeries.title} 
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Bottom UI inside card */}
          <div className="absolute inset-x-0 bottom-0 p-5 pb-8 flex flex-col items-center justify-end z-10 h-full">
            {/* Logo */}
            {(currentSeries.mobileLogoUrl || currentSeries.logoUrl) && (
              <img 
                src={currentSeries.mobileLogoUrl || currentSeries.logoUrl} 
                className={`${currentSeries.id === 'serie-3' ? 'w-[120px]' : ('isThirdBanner' in currentSeries) ? 'w-[240px]' : ('isFourthBanner' in currentSeries) ? 'w-[160px]' : 'w-[210px]'} h-auto max-w-[85%] object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.6)] mb-3`} 
                alt="Logo" 
              />
            )}
            
            {/* Metadata */}
            <div className="flex items-center gap-2 text-white/90 text-[13px] font-medium drop-shadow-md mb-3">
               <span className="bg-white/20 px-1.5 py-0.5 rounded text-white border border-white/10">{currentSeries.contentRating || "TV-14"}</span>
               {('bannerCustomText' in currentSeries) && (currentSeries as any).bannerCustomText ? (
                 <span>{String((currentSeries as any).bannerCustomText)}</span>
               ) : (
                 <>
                   <span>{currentSeries.year}</span>
                   <span>•</span>
                   <span>{currentSeries.genre}</span>
                 </>
               )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 w-full">
              {currentSeries.id === "serie-3" ? (
                <button 
                  onClick={(e) => { e.stopPropagation(); onSeriesClick(SERIES_DATA.find(s => s.id === currentSeries.id) || currentSeries); }}
                  className="flex-1 bg-white text-black font-inter font-black py-4 rounded-xl flex items-center justify-center gap-2 text-[15px] active:scale-95 transition-transform shadow-lg"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72l11-6.86L8 5.14z"/></svg>
                  Próximamente
                </button>
              ) : (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onSeriesClick(SERIES_DATA.find(s => s.id === currentSeries.id) || currentSeries); }}
                    className="flex-[3] bg-white text-black font-inter font-black py-4 rounded-xl flex items-center justify-center gap-2 text-[15px] active:scale-95 transition-transform shadow-lg"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72l11-6.86L8 5.14z"/></svg>
                    Reproducir
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleFav(e, currentSeries.id); }}
                    className="flex-[2] bg-[#2a2a2a]/60 text-white font-inter font-black py-4 rounded-xl flex items-center justify-center gap-2 text-[15px] backdrop-blur-md border border-white/10 active:scale-95 transition-transform shadow-md"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Mi lista
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Logo Reality Vault */}
        <div className="absolute top-4 right-4 md:top-auto md:bottom-6 md:right-6 z-20 pointer-events-none">
          <img 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgMJ-pH_Y36jVEiqf37tJlAcWHHe17x0TrhCYFAsEdaxUgvfRk1nuuLa8hFdegCm2eXFXD2KcDNexTGzttQFJzMz9VJhVnrww8jKxKXqG3cWWNadkJ9xeNJm5Q5ZRWJrfkdILtrBRHCYHf9BzEVcJdYzdYtSqW0hfQaq8jpLlqAlCaQ7ZzJIisUk164XhA/s1684/REALITY%20VAULT%20LOGO%20tr.png" 
            alt="Reality Vault Logo" 
            className="h-4 md:h-6 w-auto opacity-80 drop-shadow-md"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Controles del Carrusel */}
        {banners.length > 1 && (
          <>
            <button 
              onClick={prevBanner}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-pink-500/50 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20 z-20"
            >
              <ChevronLeft size={32} />
            </button>
            
            <button 
              onClick={nextBanner}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-pink-500/50 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20 z-20"
            >
              <ChevronRight size={32} />
            </button>

            {/* Indicadores (Puntos) */}
            <div className="absolute bottom-2 md:bottom-10 right-1/2 translate-x-1/2 flex gap-2 z-20">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setCurrentBannerIndex(idx); }}
                  className={`w-2 h-2 rounded-full transition-all shadow-sm backdrop-blur-sm ${idx === currentBannerIndex ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/80'}`}
                />
              ))}
            </div>
          </>
        )}

      </div>

      {/* Sección Favoritos (Mi Lista) */}
      {(isLoadingSeries || favoriteSeries.length > 0) && (
        <div className="w-full px-4 md:px-12 mt-8 md:mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h2 className="font-gravity text-xl md:text-2xl font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2 drop-shadow-sm">
              <Heart className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" /> Mi Lista
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 p-2">
            {isLoadingSeries ? (
              Array.from({ length: 4 }).map((_, i) => (
                <WideSeriesCardSkeleton key={`fav-skeleton-${i}`} />
              ))
            ) : (
              favoriteSeries.map(serie => {
                const totalEpisodes = serie.seasons.reduce((acc, season) => acc + season.episodes.length, 0);
                const watchedCount = serie.seasons.reduce((acc, season) => {
                  return acc + season.episodes.filter(ep => watchedEpisodes.includes(ep.id)).length;
                }, 0);
                const progressPercent = totalEpisodes > 0 ? (watchedCount / totalEpisodes) * 100 : 0;
                const isStartedButNotFinished = watchedCount > 0 && watchedCount < totalEpisodes;

                return (
                  <div 
                    key={serie.id} 
                    onClick={() => onSeriesClick(serie)}
                    className="aspect-[16/9] cursor-pointer group/card relative"
                  >
                     <div className="w-full h-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 ring-2 ring-transparent hover:ring-white ring-offset-2 ring-offset-transparent relative">
                        <img 
                          src={serie.wideImage || `https://placehold.co/800x449/FF00FF/FFFFFF/png?text=${encodeURIComponent(serie.title)}` || undefined}
                          alt={serie.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {/* Botón Fav (para quitar) */}
                        <motion.button 
                          key={`fav-remove-${serie.id}`}
                          onClick={(e) => { e.stopPropagation(); onToggleFav(e, serie.id); }}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                          className="absolute top-2 right-2 bg-black/40 hover:bg-pink-500 text-white rounded-full p-2 transition-all z-30"
                        >
                            <Heart size={16} className="text-pink-500 fill-current" />
                        </motion.button>
                        
                        {/* Progress Bar */}
                        {isStartedButNotFinished && (
                          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-800/80 backdrop-blur-sm z-20">
                            <div 
                              className="h-full bg-[#e30119] shadow-[0_0_10px_rgba(227,1,25,0.8)] transition-all duration-500" 
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        )}
                     </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Catálogo Retro - Horizontal Slider */}
      <div className="w-full px-4 md:px-12 mt-8 md:mt-12">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <h2 className="font-gravity text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2 drop-shadow-sm">
            <Tv className="w-5 h-5 md:w-7 md:h-7" />
            Reality
          </h2>
          <div className="hidden md:block h-1 flex-1 bg-gradient-to-r from-purple-300 to-transparent dark:from-purple-900 ml-6 rounded-full opacity-50"></div>
        </div>

        <div className="relative group/slider">
          <div className="flex overflow-x-auto gap-2 md:gap-6 py-4 md:py-6 px-2 md:px-4 snap-x snap-mandatory scroll-smooth no-scrollbar">
            {isLoadingSeries ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="min-w-[160px] w-[160px] md:min-w-[240px] md:w-[240px] snap-center">
                  <SeriesCardSkeleton />
                </div>
              ))
            ) : (
              retroSeries.map((serie) => (
                <div key={serie.id} className="min-w-[160px] w-[160px] md:min-w-[240px] md:w-[240px] snap-center">
                  <SeriesCard 
                    serie={serie} 
                    isFav={favorites.includes(serie.id)}
                    onToggleFav={(e) => onToggleFav(e, serie.id)}
                    onClick={() => onSeriesClick(serie)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top 3 Series Más Vistas */}
      <div className="w-full px-4 md:px-12 mt-8 md:mt-12">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <h2 className="font-gravity text-xl md:text-2xl font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2 drop-shadow-sm">
            <TrendingUp className="w-5 h-5 md:w-7 md:h-7" />
            Top 3 Más Vistas
          </h2>
          <div className="hidden md:block h-1 flex-1 bg-gradient-to-r from-pink-300 to-transparent dark:from-pink-900 ml-6 rounded-full opacity-50"></div>
        </div>

        <div className="relative group/slider">
          <div className="flex overflow-x-auto gap-2 md:gap-6 py-4 md:py-6 px-2 md:px-4 snap-x snap-mandatory scroll-smooth no-scrollbar">
            {topSeriesData.map((topItem, index) => {
              const serie = SERIES_DATA.find(s => s.id === topItem.id);
              if (!serie) return null;
              return (
                <div key={`top-${index}`} className="min-w-[160px] w-[160px] md:min-w-[240px] md:w-[240px] snap-center">
                  <SeriesCard 
                    serie={serie} 
                    isFav={favorites.includes(serie.id)}
                    onToggleFav={(e) => onToggleFav(e, serie.id)}
                    onClick={() => onSeriesClick(serie)}
                    overlayImage={topItem.topImage}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Próximamente - Horizontal Slider */}
      {(isLoadingSeries || comingSoonSeries.length > 0) && (
        <div className="w-full px-4 md:px-12 pb-8">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h2 className="font-gravity text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 drop-shadow-sm">
              <Sparkles className="w-5 h-5 md:w-7 md:h-7" />
              Próximamente
            </h2>
            <div className="hidden md:block h-1 flex-1 bg-gradient-to-r from-blue-300 to-transparent dark:from-blue-900 ml-6 rounded-full opacity-50"></div>
          </div>

          <div className="relative group/slider">
            <div className="flex overflow-x-auto gap-3 md:gap-6 py-4 md:py-6 px-2 md:px-4 snap-x snap-mandatory scroll-smooth no-scrollbar">
              {isLoadingSeries ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={`coming-skeleton-${i}`} className="min-w-[200px] md:min-w-[280px] lg:min-w-[320px] aspect-[16/9] snap-center">
                    <WideSeriesCardSkeleton />
                  </div>
                ))
              ) : (
                comingSoonSeries.map((serie) => (
                  <div 
                    key={serie.id} 
                    onClick={() => onSeriesClick(serie)}
                    className="min-w-[200px] md:min-w-[280px] lg:min-w-[320px] aspect-[16/9] snap-center cursor-pointer group/card relative"
                  >
                     <div className="w-full h-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 ring-2 ring-transparent hover:ring-white ring-offset-2 ring-offset-transparent">
                        <img 
                          src={serie.wideImage || `https://placehold.co/800x449/0000FF/FFFFFF/png?text=${encodeURIComponent(serie.title)}` || undefined}
                          alt={serie.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {/* Badge Próximamente */}
                        <div className="absolute bottom-4 left-4 z-20">
                          <span className="bg-blue-600 text-white text-xs md:text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                            Próximamente
                          </span>
                        </div>
                     </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// ==========================================
// APLICACIÓN PRINCIPAL
// ==========================================

function App() {
  // ESTADOS
  const { user, logout, updateUserData, loading: authLoading } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);

  const [isFetchingSeries, setIsFetchingSeries] = useState(true);
  const [view, setView] = useState<'home' | 'series' | 'watch' | 'my-list'>('home');
  
  // Favoritos (IDs)
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Derivada: Lista de Series favoritas
  const favoriteSeries = React.useMemo(() => SERIES_DATA.filter(s => favorites.includes(s.id)), [favorites]);
  
  // Datos seleccionados
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  
  // Episodios vistos (IDs)
  const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([]);
  
  // Alert State
  const [alert, setAlert] = useState<{open: boolean, title: string, msg: string, type: 'info' | 'error' | 'success'}>({
    open: false, title: '', msg: '', type: 'info'
  });

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // About Description Expanded State
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  // GIF Modal State
  const [isGifModalOpen, setIsGifModalOpen] = useState(false);
  
  // Flash Modal State
  const [isFlashModalOpen, setIsFlashModalOpen] = useState(false);
  
  // Coming Soon Modal State
  const [comingSoonModalSeries, setComingSoonModalSeries] = useState<Series | null>(null);

  // Fullscreen State
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    // Preload Images
    const imagesToLoad = SERIES_DATA.flatMap(s => [s.coverImage, s.bannerImage, s.mobileBannerImage, s.logoUrl].filter(Boolean)) as string[];
    imagesToLoad.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    if (user) {
      setFavorites(user.favorites || []);
      setWatchedEpisodes(user.watchedEpisodes || []);
    } else {
      setFavorites([]);
      setWatchedEpisodes([]);
    }
    
    setIsFetchingSeries(false);
  }, [user]);

  // --- HANDLERS ---

  const handleLogout = async () => {
    try {
      await logout();
      setView('home');
      showAlert("¡Bye Bye!", "Has cerrado sesión correctamente. ¡Vuelve pronto!", 'info');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.uid }),
      });
      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error(session.error || 'Error al crear la sesión de pago');
      }
    } catch (error: any) {
      console.error('Error:', error);
      showAlert('Error', error.message, 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      if (user && auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        updateDoc(docRef, { isPremium: true }).catch(error => {
          try { handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser?.uid}`); } catch(e) { console.error(e); }
        });
        updateUserData({ isPremium: true });
      }
      showAlert('¡Felicidades!', 'Ahora eres usuario Premium. Disfruta de las series antes que nadie.', 'success');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('payment') === 'cancelled') {
      showAlert('Pago cancelado', 'No se ha realizado ningún cargo.', 'info');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user?.uid]);

  const toggleFavorite = (e: React.MouseEvent, seriesId: string) => {
    e.stopPropagation();
    
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    
    playSound('success'); // Sonido de éxito al añadir/quitar fav
    
    if (favorites.includes(seriesId)) {
      const nextFavs = favorites.filter(id => id !== seriesId);
      setFavorites(nextFavs);
      updateUserData({ favorites: nextFavs });
    } else {
      const nextFavs = [...favorites, seriesId];
      setFavorites(nextFavs);
      updateUserData({ favorites: nextFavs });
    }
  };

  const handleSeriesClick = (series: Series) => {
    if (series.id === "serie-NYGTW" && !user?.isPremium) {
      setComingSoonModalSeries(series);
      return;
    }
    const targetSeries = series.id === "serie-1-extra" 
      ? SERIES_DATA.find(s => s.id === "serie-1") || series 
      : series;
    setSelectedSeries(targetSeries);
    setIsAboutExpanded(false); // Resetear estado de "Leer más"
    setView('series');
    window.scrollTo(0,0);
  };

  const handleWatchClick = (episode: Episode) => {
    // Si la serie está en "Coming Soon" o es la serie-3, mostrar alerta específica
    if ((selectedSeries?.isComingSoon || selectedSeries?.id === "serie-3") && !user?.isPremium) {
      showAlert("¡Contenido Premium!", "Esta serie está disponible en acceso anticipado solo para usuarios Premium.", "info");
      return;
    }

    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    setActiveEpisode(episode); // Immediate feedback for selection/highlight
    setLoading(true);

    setTimeout(() => {
      // Marcar como visto
      if (!watchedEpisodes.includes(episode.id)) {
        const nextWatched = [...watchedEpisodes, episode.id];
        setWatchedEpisodes(nextWatched);
        updateUserData({ watchedEpisodes: nextWatched });
      }
      setView('watch');
      setLoading(false);
      window.scrollTo(0,0);
    }, 1500);
  };

  const showAlert = (title: string, msg: string, type: 'info' | 'error' | 'success' = 'info') => {
    setAlert({ open: true, title, msg, type });
  };

  const handleBackToHome = () => {
    setView('home');
    setSelectedSeries(null);
    setActiveEpisode(null);
    setSearchQuery('');
    window.scrollTo(0, 0);
  };

  const handleBackToSeries = () => {
    setView('series');
    // NO limpiamos el episodio activo para mantener el estado visual de "visto recientemente"
    // setActiveEpisode(null); 
    window.scrollTo(0, 0);
  };

  // --- RENDERIZADO DE VISTAS (SUB-COMPONENTES LIGEROS O FUNCIONES SIN HOOKS) ---

  const renderSeriesDetail = () => {
    if (!selectedSeries) return null;

    return (
      <SeriesDetailView 
        selectedSeries={selectedSeries}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        handleBackToHome={handleBackToHome}
        handleWatchClick={handleWatchClick}
        onFlashClick={() => {
          setIsFlashModalOpen(true);
          playSound('click');
        }}
        activeEpisode={activeEpisode}
        user={user}
        watchedEpisodes={watchedEpisodes}
      />
    );
  };

  const renderWatch = () => {
    if (!activeEpisode) return null;
    
    // Fix Google Drive URLs: replace /view with /preview for embedding
    const processedVideoUrl = activeEpisode.videoUrl ? activeEpisode.videoUrl.replace(/\/view.*/, '/preview') : undefined;

    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center fade-in pt-24">
        <div className="w-full flex justify-between items-center mb-6">
           <button 
            onClick={handleBackToSeries} 
            className="flex items-center gap-2 text-[#fe000b] font-bold hover:bg-[#fe000b]/10 bg-white/10 dark:bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-[#fe000b] transition-all duration-300"
          >
            <ArrowLeft size={20} /> Volver
          </button>
          <div className="text-right">
             <h2 className="font-gravity text-xl text-pink-700 dark:text-pink-300 hidden md:block">{activeEpisode.title}</h2>
          </div>
        </div>
        
        {/* Contenedor de Video Optimizado */}
        <div 
          ref={videoContainerRef}
          className={`w-full bg-black overflow-hidden relative z-10 mb-6 transition-all ${isFullscreen ? 'rounded-none border-none' : 'rounded-3xl shadow-2xl border-4 border-pink-200/50 dark:border-pink-800/50'}`}
        >
          <div className="relative pt-[56.25%]"> {/* Aspect Ratio 16:9 */}
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src={processedVideoUrl || undefined} 
              title={activeEpisode.title} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            ></iframe>
            {/* El "parche" que bloquea el clic en el botón de la esquina */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '60px',  // Ancho suficiente para tapar el botón
              height: '60px', // Alto suficiente para tapar el botón
              backgroundColor: 'transparent', // Ponle 'black' si además de bloquear el clic quieres que no se vea
              zIndex: 20
            }}></div>

            {/* Botón de Pantalla Completa Personalizado */}
            <button 
              onClick={toggleFullscreen}
              className="absolute top-4 left-4 md:top-6 md:left-6 z-30 p-2 bg-black/50 hover:bg-pink-500/80 text-white rounded-full backdrop-blur-md transition-all border border-white/20"
              title="Pantalla Completa"
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>

            {/* Logo Reality Vault en el reproductor */}
            <div className={`absolute z-20 pointer-events-none transition-all duration-300 ${isFullscreen ? 'bottom-24 right-4 md:bottom-20 md:right-8' : 'bottom-4 right-4 md:bottom-6 md:right-6'}`}>
              <img 
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgMJ-pH_Y36jVEiqf37tJlAcWHHe17x0TrhCYFAsEdaxUgvfRk1nuuLa8hFdegCm2eXFXD2KcDNexTGzttQFJzMz9VJhVnrww8jKxKXqG3cWWNadkJ9xeNJm5Q5ZRWJrfkdILtrBRHCYHf9BzEVcJdYzdYtSqW0hfQaq8jpLlqAlCaQ7ZzJIisUk164XhA/s1684/REALITY%20VAULT%20LOGO%20tr.png" 
                alt="Reality Vault Logo" 
                className="h-3 md:h-5 w-auto opacity-70 drop-shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-pink-100/50 dark:border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
               <div>
                  <h1 className="font-bold text-2xl text-gray-800 dark:text-gray-100 mb-1">{activeEpisode.title}</h1>
                  <p className="text-gray-500 dark:text-gray-400">{activeEpisode.description}</p>
               </div>
               <div className="flex gap-2">
                 <Button 
                   variant="secondary" 
                   onClick={async () => {
                     const shareData = {
                       title: `${activeEpisode.title} - Reality Vault`,
                       text: `¡Mira este episodio de ${selectedSeries?.title}: ${activeEpisode.title}!`,
                       url: window.location.href,
                     };

                     try {
                       if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                         await navigator.share(shareData);
                       } else {
                         await navigator.clipboard.writeText(window.location.href);
                         showAlert('Compartir', '¡Enlace copiado al portapapeles!');
                       }
                     } catch (err) {
                       if ((err as Error).name !== 'AbortError') {
                         await navigator.clipboard.writeText(window.location.href);
                         showAlert('Compartir', '¡Enlace copiado al portapapeles!');
                       }
                     }
                   }}
                 >
                   Compartir
                 </Button>
               </div>
            </div>
        </div>
      </div>
    );
  };

  const renderAuthModal = () => (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={() => setIsAuthOpen(false)}
    >
      <div 
        className="bg-white dark:bg-[#0c0c0c] border-2 border-pink-500/20 dark:border-pink-500/30 rounded-[2.5rem] w-full max-w-sm p-6 md:p-10 shadow-[0_20px_50px_rgba(236,72,153,0.3)] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <button 
          onClick={() => setIsAuthOpen(false)} 
          className="absolute top-6 right-6 text-gray-400 hover:text-pink-500 transition-colors z-20 bg-pink-500/5 hover:bg-pink-500/10 p-2 rounded-full"
        >
          <XIcon size={20} />
        </button>

        <div className="mb-4 relative z-10 flex flex-col items-center justify-center">
          <img 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhTV6Vzz_NAWGFiObIBsPVY7yDJwjiHFpHKUk2xip81boEcZUPHBmrbNuCymVEcLAhSVSVMysOYCoJ_-j-ULpd_wA_C9T-Kx3UbGD1v6n7T75ezjZqnMP3OsNVDgHtotFsRcL25XXDrBINbtVK06rMs0JR-QEIhNDsrIuTcS6BUxQPpt8xrT8BEhyphenhyphen26VQA/s1612/xxx.png" 
            alt="Logo" 
            className="h-7 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {authMode === 'login' ? (
          <LoginForm 
            onSuccess={() => {
              setIsAuthOpen(false);
              showAlert("¡Hola!", "Bienvenido de nuevo.", "success");
            }}
            onSwitchMode={() => setAuthMode('signup')}
          />
        ) : (
          <RegisterForm 
            onSuccess={() => {
              setIsAuthOpen(false);
              showAlert("¡Éxito!", "Tu cuenta ha sido creada.", "success");
            }}
            onSwitchMode={() => setAuthMode('login')}
          />
        )}
      </div>
    </div>
  );

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isNavSolid = isScrolled || (view === 'my-list') || searchQuery.length > 0;
  const navBgClass = isNavSolid 
    ? 'bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-b border-gray-200 dark:border-white/10 shadow-xl' 
    : 'bg-black/30 backdrop-blur-md border-b border-white/5 shadow-lg';
  const navTextClass = !isNavSolid ? 'text-white' : (isScrolled ? 'text-gray-800 dark:text-gray-200' : 'text-gray-800 dark:text-white');

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-800 dark:text-gray-100 font-sans selection:bg-pink-300 selection:text-pink-900 flex flex-col transition-colors">
      
      {/* Loader Global */}
      {loading && <MagicLoader />}

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 py-2 md:py-3 ${navBgClass}`}>
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Left Side: Logo & Main Nav */}
          <div className="flex items-center gap-6 md:gap-10">
            {/* Logo */}
            <div className="cursor-pointer select-none relative group shrink-0" onClick={handleBackToHome}>
              <img 
                src={isNavSolid 
                  ? "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhTV6Vzz_NAWGFiObIBsPVY7yDJwjiHFpHKUk2xip81boEcZUPHBmrbNuCymVEcLAhSVSVMysOYCoJ_-j-ULpd_wA_C9T-Kx3UbGD1v6n7T75ezjZqnMP3OsNVDgHtotFsRcL25XXDrBINbtVK06rMs0JR-QEIhNDsrIuTcS6BUxQPpt8xrT8BEhyphenhyphen26VQA/s1612/xxx.png"
                  : "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLaRnLFdLrePsKdNQ1RUssbDupY8Vtjwnr8dEOmvRkpltkC0tSv-OEST91VTmX_O6wbVfdlxptgjszgZYli20-P01OE-faxg-EMP4SGdbMQMMEYBSut7D6MT7eizTzfYIm8mZn8uCyth31mXnp7YA7imudZK820qOopBYiJuFKMexY0P49eKeM71uWVZk/s1612/REALITY%20VAULT%20LOGO-Recuperado-Recuperado.png"
                } 
                alt="Logo" 
                className="w-[117.986px] h-auto object-contain transition-all duration-300 group-hover:brightness-110" 
                referrerPolicy="no-referrer" 
              />
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-5 md:gap-8">
              {[
                { name: 'Inicio', view: 'home', id: 'inicio' },
                { name: 'Series', view: 'home', id: 'series' },
                { name: 'Mi Lista', view: 'my-list', id: 'mi-lista' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.id === 'mi-lista') {
                      if (!user) {
                        setIsAuthOpen(true);
                      } else {
                        setView('my-list');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    } else if (item.id === 'series') {
                      setView('home');
                      setTimeout(() => {
                        const target = document.getElementById('series-section');
                        if (target) {
                          target.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          window.scrollTo({ top: 800, behavior: 'smooth' });
                        }
                      }, 100);
                    } else {
                      handleBackToHome();
                    }
                  }}
                  className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-all hover:text-pink-500 relative group/link px-1 py-1 ${navTextClass} ${view === item.view && (item.id !== 'series' || (view === 'home' && !searchQuery)) ? 'text-pink-500' : ''}`}
                >
                  {item.name}
                  <div className={`absolute -bottom-1 left-0 h-0.5 bg-pink-500 transition-all group-hover/link:w-full ${view === item.view && (view !== 'home' || item.id === 'inicio') ? 'w-full' : 'w-0'}`}></div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Tools & Profile */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Search Bar */}
            <div 
              className={`flex items-center transition-all duration-500 ease-out h-9 md:h-10 group/search
                ${searchQuery 
                  ? 'bg-black/30 dark:bg-white/10 backdrop-blur-xl border border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.2)]' 
                  : 'bg-white/5 border border-transparent hover:border-white/20'
                } 
                rounded-full px-3 md:px-4`}
            >
              <Search 
                size={18} 
                className={`cursor-pointer transition-all duration-300 transform group-hover/search:scale-110
                  ${searchQuery ? 'text-pink-500' : (!isNavSolid ? 'text-white/60 group-hover/search:text-white' : 'text-gray-400 group-hover/search:text-gray-600')}`}
                onClick={() => document.getElementById('navbar-search')?.focus()}
              />
              <input
                id="navbar-search"
                type="text"
                placeholder="Buscar series, actores..."
                value={searchQuery}
                onFocus={() => {
                  playSound('nav');
                }}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value && view !== 'home') setView('home');
                }}
                className={`bg-transparent focus:outline-none text-[13px] transition-all duration-500 ease-in-out placeholder:text-gray-500 font-medium
                  ${searchQuery ? 'w-24 sm:w-40 md:w-72 ml-3' : 'w-0 focus:w-24 sm:focus:w-40 md:focus:w-60 focus:ml-3'} 
                  ${!isNavSolid ? 'text-white' : 'text-gray-800 dark:text-white'}`}
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    playSound('click');
                  }} 
                  className="ml-2 text-gray-400 hover:text-pink-500 transition-colors p-1"
                >
                  <XIcon size={16} />
                </button>
              )}
            </div>

            {/* Mobile List Access (only icon) */}
            <button 
              className={`md:hidden p-2 transition-colors ${!isNavSolid ? 'text-white' : 'text-gray-500 hover:text-pink-500'}`}
              onClick={() => {
                if (!user) {
                  setIsAuthOpen(true);
                } else {
                  setView('my-list');
                }
              }}
              title="Mi Lista"
            >
              <Heart size={22} className={view === 'my-list' ? 'fill-pink-500 text-pink-500' : ''} />
            </button>

            {/* Profile / Auth */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden lg:flex flex-col items-end">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isNavSolid ? 'text-pink-500' : 'text-pink-400'}`}>
                      {user.isPremium ? 'Premium' : 'Miembro'}
                    </span>
                    <span className={`text-xs font-bold leading-none ${!isNavSolid ? 'text-white' : 'text-gray-800 dark:text-white'}`}>{user.username}</span>
                  </div>
                  <div className="relative group/user">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg p-0.5 bg-gradient-to-br from-pink-500 to-purple-600 shadow-xl cursor-pointer transform transition-transform group-hover/user:scale-105">
                      <img 
                        src={user.avatar || undefined} 
                        alt="User" 
                        className="w-full h-full rounded-md object-cover border border-black/20" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                    {/* Logout/Menu Dropdown */}
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-white/10 overflow-hidden scale-0 group-hover/user:scale-100 origin-top-right transition-all duration-200">
                      <div className="p-4 border-b border-gray-100 dark:border-white/5">
                        <p className="text-xs font-bold dark:text-white">{user.username}</p>
                        <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button 
                        onClick={() => { setView('my-list'); window.scrollTo(0,0); }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <Heart size={14} className="text-pink-500" />
                        Mi Lista
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={14} />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] px-5 py-2 md:px-6 md:py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 ${!isNavSolid ? 'bg-white text-black hover:bg-pink-50' : 'bg-pink-500 text-white shadow-lg'}`}
                >
                  Entrar
                </button>
              )}
            </div>
          </div>

        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">

        {view === 'my-list' && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-36 pb-12 fade-in min-h-[70vh]">
            <div className="flex items-center justify-between mb-10">
              <h1 className="font-gravity text-3xl md:text-5xl bg-white text-black flex items-center gap-4 px-4 py-2 rounded-xl">
                <Heart className="text-pink-500 fill-pink-500" size={32} /> Mi Lista
              </h1>
              <span className="text-xs font-bold uppercase tracking-widest text-black bg-white/5 px-4 py-2 rounded-full border border-white/10">
                {favoriteSeries.length} Títulos
              </span>
            </div>

            {favoriteSeries.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {favoriteSeries.map((series) => (
                  <motion.div
                    key={series.id}
                    layoutId={`series-${series.id}`}
                    className="relative group cursor-pointer"
                    onClick={() => handleSeriesClick(series)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl bg-white/5 border border-white/10 transition-all group-hover:border-pink-500/50">
                      <img 
                        src={series.coverImage} 
                        alt={series.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <p className="text-xs font-bold text-white line-clamp-2">{series.title}</p>
                        <button className="mt-2 w-full bg-pink-500 text-white py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider">Ver Ahora</button>
                      </div>
                    </div>
                    {series.isPremium && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase shadow-lg z-10">
                        Premium
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                  <Plus size={48} className="text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">Tu lista está vacía</h3>
                <p className="text-sm text-gray-600 mb-8 max-w-xs">Agregas series a tu lista para tenerlas siempre a mano.</p>
                <button 
                  onClick={handleBackToHome}
                  className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all shadow-xl"
                >
                  Explorar Catálogo
                </button>
              </div>
            )}
          </div>
        )}

        {view === 'home' && (
          <HomeView 
            favorites={favorites} 
            watchedEpisodes={watchedEpisodes}
            onToggleFav={toggleFavorite} 
            onSeriesClick={handleSeriesClick} 
            searchQuery={searchQuery} 
            onGifClick={() => setIsGifModalOpen(true)}
            isLoadingSeries={isFetchingSeries}
          />
        )}
        {view === 'series' && renderSeriesDetail()}
        {view === 'watch' && renderWatch()}
      </main>

      {/* Global Loaders & Modals */}
      {authLoading && <MagicLoader />}
      {loading && <MagicLoader />}

      {/* Footer */}
      <footer className="bg-white/60 dark:bg-black/80 backdrop-blur border-t border-pink-200/50 dark:border-pink-900/50 mt-12 py-12 relative z-10 transition-colors">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhzZL1Es97pu0JBD5-MiY7rIoTOR03xFtlQ3LZgOMrbrqo3O4LWU4043kzyJdF2S74RPcHBXuZ8yDcsVCnI0kmfHoZG8VOV92nkdepVGwJ5YTu2BxWtVzd_svrZ5-CLhORLDw9Qf343uUtsexkC_24tXf3g61AkUTOrCTe2vaXw3lH4rcOcP6n7k3sz55E/s1845/REALITY%20VAULT%20LOGO%20BLANCO.png" 
              alt="Reality Vault Logo" 
              className="h-12 w-auto object-contain drop-shadow-sm"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Botón de PayPal */}
          <PayPalButton />

          <div className="flex justify-center gap-6 mb-8 mt-6">
            {SOCIAL_LINKS.map((link, index) => {
              const icons: any = { instagram: Instagram, twitter: Twitter, tiktok: Tv, mail: Mail }; 
              const Icon = icons[link.iconName] || Mail;
              return (
                <a 
                  key={index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-pink-50/50 dark:bg-slate-800/50 backdrop-blur text-pink-500 dark:text-pink-400 rounded-full hover:bg-pink-500 hover:text-white dark:hover:bg-pink-600 hover:-translate-y-1 transition-all duration-300 shadow-sm border border-pink-100 dark:border-slate-700"
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">
            © {new Date().getFullYear()} {APP_NAME}. Hecho con <Heart size={10} className="inline text-pink-400" fill="currentColor"/> y glitter.
          </p>
        </div>
      </footer>

      {/* Modals */}
      {isAuthOpen && renderAuthModal()}
      <GifModal 
        isOpen={isGifModalOpen} 
        onClose={() => setIsGifModalOpen(false)} 
        imageUrl="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh673EsuOdqFMKCIRUL2zNRiHSQzM_iuPmbCMNKo8H_VWnnejCNSwRmrv2vUAm1YBQeB4T8L9jLFd_QxYtuHAnLfbEMUoN4t7KN8RC6KO3WcsD381Yo1Q6mppWmJ5B8WL02uwZH-cpymi46TlhyphenhyphenVezxxpGRTa20mvWme9hyHV0ykQrCZ1HMqXLrNl99uGw/s1440/CNSLIME.jpg" 
      />
      <AlertModal 
        isOpen={alert.open} 
        title={alert.title} 
        message={alert.msg} 
        type={alert.type}
        onClose={() => setAlert(prev => ({ ...prev, open: false }))} 
      />
      <ComingSoonModal 
        series={comingSoonModalSeries} 
        onClose={() => setComingSoonModalSeries(null)} 
      />
      <FlashPlayerModal 
        isOpen={isFlashModalOpen}
        onClose={() => setIsFlashModalOpen(false)}
        swfUrl="modagranjersaSL.swf"
      />

    </div>
  );
}

function AppWrapped() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWrapped;