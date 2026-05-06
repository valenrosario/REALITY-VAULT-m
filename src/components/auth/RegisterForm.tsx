import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../../../firebase';
import { AuthFormProps, User } from '../../../types';
import { motion } from 'motion/react';
import { User as UserIcon, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { AVATAR_OPTIONS } from '../../../constants';

export const RegisterForm: React.FC<AuthFormProps> = ({ onSuccess, onSwitchMode }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUsername(e.target.value);
  };

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
    
    // Validaciones
    if (!username || !email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (!username.trim() || username.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      const { user: firebaseUser } = userCredential;

      const newUser: User = {
        uid: firebaseUser.uid,
        email: trimmedEmail,
        username: trimmedUsername,
        avatar: AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)],
        favorites: [],
        watchedEpisodes: [],
        isPremium: false
      };

      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
      }
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Register error code:', err.code);
      console.error('Register error message:', err.message);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está registrado. ¿Quieres iniciar sesión?');
      } else if (err.code === 'auth/invalid-email') {
        setError('El formato del email no es válido.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Las credenciales proporcionadas no son válidas.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es muy débil (mínimo 6 caracteres).');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Inténtalo más tarde.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('El registro con email no está habilitado en Firebase Console.');
      } else {
        setError(err.message || 'Error al crear la cuenta. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-pink-500 font-gravity">
          Únete al Club
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-widest uppercase text-center">
          Tu identidad digital empieza aquí
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm"
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </motion.div>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Nombre de usuario</label>
          <div className="relative group">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
            <input 
              type="text"
              value={username}
              onChange={handleUsernameChange}
              className="w-full h-12 md:h-14 pl-12 pr-4 bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 rounded-2xl focus:border-pink-500 focus:ring-0 outline-none transition-all text-base"
              placeholder="Ej: PinkPrincess99"
            />
          </div>
        </div>

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
              placeholder="Mínimo 8 caracteres"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full h-12 md:h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-pink-500/20"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Crear Cuenta
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <button 
            onClick={onSwitchMode}
            className="text-pink-500 font-bold hover:underline"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
};
