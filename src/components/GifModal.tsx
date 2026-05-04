import React from 'react';
import { X as XIcon } from 'lucide-react';

interface GifModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const GifModal = ({ isOpen, onClose, imageUrl }: GifModalProps) => {
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

export default GifModal;
