import React from 'react';
import { X as XIcon, Heart, User as UserIcon, Globe } from 'lucide-react';
import { AVATAR_OPTIONS } from '../../constants';
import { User } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAvatar: string;
  setSelectedAvatar: (avatar: string) => void;
  handleLogin: (info: { username: string; avatar: string }) => void;
}

const AuthModal = ({
  isOpen,
  onClose,
  selectedAvatar,
  setSelectedAvatar,
  handleLogin
}: AuthModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white/98 backdrop-blur-2xl border-2 border-pink-200 rounded-[2.5rem] w-full max-w-sm p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(236,72,153,0.3)] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-300/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>

        <button onClick={onClose} className="absolute top-6 right-6 text-pink-400 hover:text-pink-600 transition-colors z-20 bg-pink-50 hover:bg-pink-100 p-2 rounded-full">
          <XIcon size={20} />
        </button>

        <div className="text-center mb-6 relative z-10">
          <div className="mx-auto w-14 h-14 bg-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-pink-200/50 transform -rotate-3 hover:rotate-3 transition-transform duration-300">
            <Heart size={28} className="text-white fill-white" />
          </div>
          <h2 className="font-gravity font-bold text-2xl text-pink-600 mb-1 drop-shadow-sm">
            VIP ACCESS
          </h2>
          <p className="text-pink-400 font-medium text-xs">Crea tu identidad digital Y2K ✨</p>
        </div>

        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            const formData = new FormData(e.currentTarget); 
            handleLogin({ 
              username: formData.get('username') as string, 
              avatar: selectedAvatar
            }); 
          }} 
          className="space-y-4 relative z-10"
        >
          <div className="bg-pink-50/80 p-4 rounded-2xl border border-pink-100">
            <label className="block text-pink-500 font-bold mb-2 text-[9px] uppercase tracking-widest text-center">Elige tu Avatar</label>
            <div className="flex gap-3 justify-center overflow-x-auto pb-2 scrollbar-hide">
              {AVATAR_OPTIONS.map((avatar, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 cursor-pointer transition-all duration-300 shadow-sm ${selectedAvatar === avatar ? 'border-pink-500 scale-110 ring-4 ring-pink-200 shadow-md' : 'border-pink-200 hover:border-pink-400 hover:scale-105 opacity-80 hover:opacity-100'}`}
                >
                  <img src={avatar || undefined} alt="avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-pink-500 font-bold mb-2 text-xs uppercase tracking-widest pl-1">Nickname</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-5 h-5" />
              <input 
                name="username"
                type="text" 
                placeholder="Ej. GlitterQueen" 
                className="w-full bg-white border-2 border-pink-100 rounded-2xl px-12 py-3 text-pink-700 placeholder-pink-300 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all text-base font-medium shadow-inner"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-pink-500 font-bold mb-2 text-xs uppercase tracking-widest pl-1">Idioma Preferido</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-5 h-5" />
              <select 
                name="language"
                className="w-full bg-white border-2 border-pink-100 rounded-2xl px-12 py-3 text-pink-700 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all text-base font-medium shadow-inner appearance-none cursor-pointer"
                required
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
                <option value="fr">Français</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-pink-300">
                ▼
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button className="w-full py-4 text-lg font-bold font-gravity uppercase tracking-wider bg-pink-600 text-white rounded-2xl hover:bg-pink-700 transition-all duration-300 shadow-[0_8px_20px_rgba(236,72,153,0.3)] hover:shadow-[0_12px_25_rgba(236,72,153,0.4)] hover:-translate-y-1 active:translate-y-0">
              Entrar al Club 💖
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
