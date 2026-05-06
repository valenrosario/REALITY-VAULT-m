import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase';
import { AuthFormProps } from '../../../types';
import { motion } from 'motion/react';
import { Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export const LoginForm: React.FC<AuthFormProps> = ({ onSuccess, onSwitchMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    const trimmedEmail = email.trim();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Login error code:', err.code);
      console.error('Login error message:', err.message);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Credenciales inválidas. Revisa tu email y contraseña.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El formato del email no es válido.');
      } else if (err.code === 'auth/user-disabled') {
        setError('Esta cuenta ha sido deshabilitada.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Inténtalo más tarde.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('El inicio de sesión con email no está habilitado en Firebase Console.');
      } else {
        setError(err.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-pink-500 font-gravity">
          ¡Hola de nuevo!
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-widest uppercase">
          Ingresa a tu zona de miembros
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm"
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </motion.div>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
            <input 
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full h-12 md:h-14 pl-12 pr-4 bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 rounded-2xl focus:border-pink-500 focus:ring-0 outline-none transition-all text-base"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Contraseña</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
            <input 
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full h-12 md:h-14 pl-12 pr-4 bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 rounded-2xl focus:border-pink-500 focus:ring-0 outline-none transition-all text-base"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full h-12 md:h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:active:scale-100"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Entrar <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ¿No tienes cuenta?{' '}
          <button 
            onClick={onSwitchMode}
            className="text-pink-500 font-bold hover:underline"
          >
            Regístrate gratis
          </button>
        </p>
      </div>
    </div>
  );
};
