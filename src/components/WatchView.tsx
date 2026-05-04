import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Episode, Series } from '../../types';
import Button from './Button';

interface WatchViewProps {
  activeEpisode: Episode;
  selectedSeries: Series | null;
  handleBackToSeries: () => void;
  showAlert: (title: string, msg: string, type?: 'info' | 'error' | 'success') => void;
}

const WatchView = ({
  activeEpisode,
  selectedSeries,
  handleBackToSeries,
  showAlert
}: WatchViewProps) => {
  const getEmbedUrl = (url: string) => {
    if (!url) return undefined;
    
    // Google Drive: Convert /view to /preview if not already done
    if (url.includes('drive.google.com')) {
      return url.replace(/\/view.*/, '/preview');
    }
    
    // YouTube: Convert standard watch links to embed links
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return url;
  };

  const processedVideoUrl = getEmbedUrl(activeEpisode.videoUrl);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center fade-in">
      <div className="w-full flex justify-between items-center mb-6">
         <button 
          onClick={handleBackToSeries} 
          className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold font-gravity hover:underline bg-white/50 dark:bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/30"
        >
          <ArrowLeft size={20} /> Volver
        </button>
        <div className="text-right">
           <h2 className="font-gravity text-xl text-pink-700 dark:text-pink-300 hidden md:block">{activeEpisode.title}</h2>
        </div>
      </div>
      
      <div className="w-full bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-pink-200/50 dark:border-pink-800/50 mb-6 relative z-10">
        <div className="relative pt-[56.25%]">
          <iframe 
            className="absolute top-0 left-0 w-full h-full"
            src={processedVideoUrl || undefined} 
            title={activeEpisode.title} 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60px',
            height: '60px',
            backgroundColor: 'transparent',
            zIndex: 20
          }}></div>
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

export default WatchView;
