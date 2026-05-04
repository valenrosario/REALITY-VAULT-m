import React from 'react';
import { X as XIcon, Check, Info } from 'lucide-react';
import Button from './Button';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: 'info' | 'error' | 'success';
}

const AlertModal = ({ isOpen, title, message, onClose, type = 'info' }: AlertModalProps) => {
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

export default AlertModal;
