import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Film, 
  Settings as SettingsIcon, 
  LogOut, 
  Upload, 
  Plus, 
  GripVertical, 
  Image as ImageIcon, 
  Eye, EyeOff, 
  Save, 
  Lock, 
  AlertCircle, 
  Loader2,
  ChevronDown,
  ChevronUp,
  Trash2,
  Users,
  Sparkles,
  Tv,
  ArrowLeft
} from 'lucide-react';
import { db } from '../../../firebase';
import { collection, getDocs, doc, setDoc, writeBatch, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';
import { Series, Episode, Season, AppConfig, GalleryImage } from '../../../types';
import { SERIES_DATA, MARQUEE_TEXT, SOCIAL_LINKS } from '../../../constants';
import { uploadToCloudinary } from '../../utils/cloudinary';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const ToastContext = createContext<(msg: string, type?: 'success' | 'error') => void>(() => {});

// ==========================================
// 1. ADMIN PROTECTED ROUTE (Contraseña: PARIS)
// ==========================================
export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('reality_vault_admin_token') === 'PARIS';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'PARIS') {
      sessionStorage.setItem('reality_vault_admin_token', 'PARIS');
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Contraseña incorrecta. Acceso denegado.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-yellow-400/20 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-slate-200 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10"
        >
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl text-pink-500 mb-4 border border-pink-200 shadow-sm">
              <Lock size={32} />
            </div>
            <img 
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhzZL1Es97pu0JBD5-MiY7rIoTOR03xFtlQ3LZgOMrbrqo3O4LWU4043kzyJdF2S74RPcHBXuZ8yDcsVCnI0kmfHoZG8VOV92nkdepVGwJ5YTu2BxWtVzd_svrZ5-CLhORLDw9Qf343uUtsexkC_24tXf3g61AkUTOrCTe2vaXw3lH4rcOcP6n7k3sz55E/s1845/REALITY%20VAULT%20LOGO%20BLANCO.png" 
              alt="Reality Vault" 
              className="w-48 object-contain mx-auto mb-2 bg-slate-900 p-2 rounded-xl"
            />
            <p className="text-xs text-slate-500 tracking-wider font-semibold uppercase">
              Panel Administrador
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs flex items-center gap-2.5"
              >
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Contraseña de Acceso
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña..."
                  className="w-full bg-white/80 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:border-[#00dbef] focus:ring-4 focus:ring-[#00dbef]/10 transition-all shadow-sm"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-4 bg-[#5500bd] hover:bg-[#5500bd]/90 rounded-2xl text-white font-bold text-sm tracking-widest uppercase transition-all shadow-[0_8px_20px_rgba(85,0,189,0.3)] active:scale-95"
            >
              Ingresar al Panel
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <button 
              type="button" 
              onClick={() => window.location.href = '/'} 
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← Volver al sitio principal
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

export const ConfirmContext = createContext<(msg: string, onConfirm: () => void) => void>(() => {});

// ==========================================
// 2. LAYOUT BASE DEL PANEL (Sidebar + Content)
// ==========================================
export const AdminDashboard = ({ onExit }: { onExit?: () => void }) => {
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: () => {} });
  const [toastMessage, setToastMessage] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  
  const requestConfirm = (message: string, onConfirm: () => void) => {
    setConfirmModal({ isOpen: true, message, onConfirm });
  };
  
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({msg, type});
    setTimeout(() => setToastMessage(null), 3000);
  };
  const [activeTab, setActiveTab] = useState<'home' | 'series' | 'banners' | 'settings'>('home');
  const [series, setSeries] = useState<Series[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleLogout = () => {
    sessionStorage.removeItem('reality_vault_admin_token');
    window.location.reload();
  };

  useEffect(() => {
    // Escuchar series en tiempo real
    const unsubscribeSeries = onSnapshot(collection(db, 'series'), (snapshot) => {
      const seriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Series));
      seriesData.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setSeries(seriesData);
      setIsLoading(false);
    });

    const unsubscribeBanners = onSnapshot(collection(db, 'heroBanners'), (snapshot) => {
      const bannerData = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      bannerData.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
      setBanners(bannerData);
    });

    // Escuchar configuración global
    const unsubscribeConfig = onSnapshot(doc(db, 'appConfig', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as AppConfig;
        setConfig({
          marqueeText: MARQUEE_TEXT,
          socialLinks: SOCIAL_LINKS,
          retroSectionTitle: 'Años 2000s (Retro)',
          ...data
        });
      } else {
        setConfig({ marqueeText: MARQUEE_TEXT, socialLinks: SOCIAL_LINKS, retroSectionTitle: 'Años 2000s (Retro)' });
      }
    });

    // Conteo de usuarios en Firestore
    getDocs(collection(db, 'users'))
      .then(snap => setTotalUsers(snap.size))
      .catch(console.error);

    return () => {
      unsubscribeSeries();
      unsubscribeBanners();
      unsubscribeConfig();
    };
  }, []);

  const migrateDataToFirestore = async () => {
    setIsLoading(true);
    try {
      const batch = writeBatch(db);
      SERIES_DATA.forEach((s, i) => {
        const seriesRef = doc(db, 'series', s.id);
        batch.set(seriesRef, { ...s, order: i });
      });
      const configRef = doc(db, 'appConfig', 'global');
      batch.set(configRef, { marqueeText: MARQUEE_TEXT, socialLinks: SOCIAL_LINKS, retroSectionTitle: 'Años 2000s (Retro)' });
      
      await batch.commit();
      showToast('¡Base de datos populada exitosamente!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Error al migrar datos a Firestore', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToastContext.Provider value={showToast}>
    <ConfirmContext.Provider value={requestConfirm}>
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-[9999] px-6 py-3 rounded-2xl shadow-xl border font-bold text-sm transition-all animate-in fade-in slide-in-from-top-5 ${toastMessage.type === 'success' ? 'bg-green-500 text-white border-green-600' : 'bg-red-500 text-white border-red-600'}`}>
          {toastMessage.msg}
        </div>
      )}
      <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
        {/* Sidebar */}
      <aside className="w-64 bg-white/70 backdrop-blur-xl border-r border-slate-200 flex flex-col p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-20">
        <div className="mb-10 text-center">
          <img 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhzZL1Es97pu0JBD5-MiY7rIoTOR03xFtlQ3LZgOMrbrqo3O4LWU4043kzyJdF2S74RPcHBXuZ8yDcsVCnI0kmfHoZG8VOV92nkdepVGwJ5YTu2BxWtVzd_svrZ5-CLhORLDw9Qf343uUtsexkC_24tXf3g61AkUTOrCTe2vaXw3lH4rcOcP6n7k3sz55E/s1845/REALITY%20VAULT%20LOGO%20BLANCO.png" 
            alt="Reality Vault" 
            className="h-10 object-contain mx-auto mb-2 bg-slate-900 p-1 rounded-lg"
          />
        </div>
        
        {onExit && (
          <button
            onClick={onExit}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 font-bold transition-all mb-4 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
          >
            <ArrowLeft size={20} />
            Volver al Inicio
          </button>
        )}
        
        <nav className="flex-1 space-y-3">
          <SidebarButton 
            active={activeTab === 'home'} 
            icon={<LayoutDashboard size={20} />} 
            label="Inicio" 
            onClick={() => setActiveTab('home')} 
          />
          <SidebarButton 
            active={activeTab === 'series'} 
            icon={<Film size={20} />} 
            label="Gestor de Series" 
            onClick={() => setActiveTab('series')} 
          />
          <SidebarButton 
            active={activeTab === 'banners'} 
            icon={<ImageIcon size={20} />} 
            label="Gestor de Banners" 
            onClick={() => setActiveTab('banners')} 
          />
          <SidebarButton 
            active={activeTab === 'settings'} 
            icon={<SettingsIcon size={20} />} 
            label="Configuración" 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>

        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors font-bold text-sm mt-auto border border-transparent hover:border-red-100"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </aside>

      {/* Area de Contenido */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 p-8 md:p-10 relative">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-full text-pink-500 gap-3">
            <Loader2 className="animate-spin" size={36} />
            <span className="font-gravity text-sm tracking-wider">Cargando Panel...</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div 
                key="home" 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-4xl font-gravity text-slate-900 mb-2">Bienvenido al Panel 👋</h1>
                  <p className="text-slate-500 text-sm">Gestiona el catálogo de series, episodios y configuración global en tiempo real.</p>
                </div>
                
                {/* Metrica principal */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Usuarios Registrados</p>
                      <h3 className="text-4xl font-gravity text-cyan-500 font-bold">{totalUsers}</h3>
                    </div>
                    <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-2xl text-cyan-500">
                      <Users size={32} />
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Series Totales</p>
                      <h3 className="text-4xl font-gravity text-purple-500 font-bold">{series.length}</h3>
                    </div>
                    <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl text-purple-500">
                      <Film size={32} />
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Estado Servidor</p>
                      <h3 className="text-xl font-bold text-lime-500 flex items-center gap-2 mt-2">
                        <span className="w-3 h-3 bg-lime-500 rounded-full animate-ping"></span>
                        Conectado
                      </h3>
                    </div>
                    <div className="p-4 bg-lime-50 border border-lime-100 rounded-2xl text-lime-500">
                      <Tv size={32} />
                    </div>
                  </div>
                </div>

                {series.length === 0 && (
                  <div className="bg-white/80 border border-pink-200 p-8 rounded-3xl text-center space-y-4 backdrop-blur-xl shadow-sm">
                    <Sparkles className="mx-auto text-pink-500" size={40} />
                    <h3 className="text-2xl font-gravity text-slate-800">Base de datos de series vacía</h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                      Puedes inicializar Firestore cargando el catálogo estático predeterminado.
                    </p>
                    <button 
                      onClick={migrateDataToFirestore} 
                      className="bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 text-white hover:opacity-90 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-md"
                    >
                      Inicializar Datos en Firestore
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'series' && (
              <motion.div 
                key="series" 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -15 }}
              >
                <SeriesManager series={series} />
              </motion.div>
            )}

            {activeTab === 'banners' && (
              <motion.div 
                key="banners" 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -15 }}
              >
                <BannersManager banners={banners} series={series} />
              </motion.div>
            )}

            {activeTab === 'settings' && config && (
              <motion.div 
                key="settings" 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -15 }}
              >
                <ConfigManager config={config} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Modal de Confirmación */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-2">¿Estás seguro?</h3>
              <p className="text-slate-600 text-sm mb-6">{confirmModal.message}</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    confirmModal.onConfirm();
                    setConfirmModal({ ...confirmModal, isOpen: false });
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors shadow-md"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </ConfirmContext.Provider>
    </ToastContext.Provider>
  );
};

const SidebarButton = ({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${
      active 
        ? 'bg-[#ffb9ff]/20 text-[#5500bd] shadow-sm border border-[#ffb9ff]/30' 
        : 'text-slate-500 hover:text-slate-900 hover:bg-white/50 border border-transparent'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// ==========================================
// 3. GESTOR DE SERIES (Drag & Drop + Editor)
// ==========================================
const SeriesManager = ({ series }: { series: Series[] }) => {
  const showToast = useContext(ToastContext);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);
  const [items, setItems] = useState<Series[]>(series);
  
  useEffect(() => {
    setItems(series);
  }, [series]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex) as Series[];
      setItems(newItems);
      
      // Reordenar en Firestore actualizando order
      const batch = writeBatch(db);
      newItems.forEach((item: Series, index: number) => {
        batch.update(doc(db, 'series', item.id), { order: index });
      });
      try {
        await batch.commit();
      } catch (error) {
        console.error("Error al reordenar series en Firestore:", error);
      }
    }
  };

  const createNewSeries = async () => {
    const PLACEHOLDERS = [
      "https://res.cloudinary.com/hf3ijl6p/image/upload/v1786260552/POSTER_PLACEHOLDER_rcprmd.png",
      "https://res.cloudinary.com/hf3ijl6p/image/upload/v1786260552/POSTER_PLACEHOLDER_3_nps6pv.png",
      "https://res.cloudinary.com/hf3ijl6p/image/upload/v1786260552/POSTER_PLACEHOLDER_2_jpmeco.png",
      "https://res.cloudinary.com/hf3ijl6p/image/upload/v1786260552/POSTER_PLACEHOLDER_1_cpamop.png"
    ];
    const randomPlaceholder = PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];
    const newId = `serie-${Date.now()}`;
    const newSeriesObj: Series = {
      id: newId,
      order: items.length,
      title: 'Nueva Serie',
      description: 'Escribe una descripción para esta serie...',
      coverImage: randomPlaceholder,
      bannerImage: randomPlaceholder,
      tags: ['Reality', 'Drama'],
      year: '2026',
      seasons: [
        {
          id: 's1',
          title: 'Temporada 1',
          episodes: []
        }
      ],
      isComingSoon: false
    };

    try {
      await setDoc(doc(db, 'series', newId), newSeriesObj);
      setEditingSeries(newSeriesObj);
    } catch (err) {
      console.error(err);
      showToast('Error creando nueva serie', 'error');
    }
  };

  const toggleSeriesVisibility = async (e: React.MouseEvent, seriesId: string, currentHidden: boolean) => {
    e.stopPropagation();
    try {
      await updateDoc(doc(db, "series", seriesId), { isHidden: !currentHidden });
    } catch (error) {
      console.error("Error al cambiar visibilidad:", error);
      showToast("Error al cambiar visibilidad", 'error');
    }
  };

  if (editingSeries) {
    return <SeriesEditor serie={editingSeries} onBack={() => setEditingSeries(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-gravity text-slate-900">Gestor de Series</h1>
          <p className="text-slate-500 text-xs mt-1">Arrastra las tarjetas para reordenar el catálogo en el inicio.</p>
        </div>
        <button 
          onClick={createNewSeries}
          className="bg-black text-white hover:bg-zinc-800 font-bold py-2.5 px-6 rounded-lg transition-colors shadow-md flex items-center gap-2 text-sm"
        >
          <Plus size={18} /> Nueva Serie
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {items.map(s => (
              <SortableSeriesCard key={s.id} series={s} onClick={() => setEditingSeries(s)} onToggleHidden={(e: any) => toggleSeriesVisibility(e, s.id, !!s.isHidden)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

const SortableSeriesCard: React.FC<{ series: Series, onClick: () => void, onToggleHidden: (e: React.MouseEvent) => void }> = ({ series, onClick, onToggleHidden }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: series.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div 
      ref={setNodeRef} style={style}
      className={`bg-white/80 backdrop-blur-xl border ${series.isHidden ? 'border-slate-400 opacity-60 grayscale-[0.5]' : 'border-slate-200'} rounded-2xl overflow-hidden cursor-pointer hover:border-[#00dbef] hover:shadow-[0_0_15px_rgba(0,219,239,0.3)] transition-all hover:-translate-y-1 group relative shadow-sm`}
    >
      <button 
        onClick={onToggleHidden}
        className="absolute top-2 right-2 z-30 bg-white/90 backdrop-blur-md p-1.5 rounded-lg hover:bg-slate-200 transition-colors border border-slate-200 shadow-sm"
        title={series.isHidden ? "Mostrar serie" : "Ocultar serie"}
      >
        {series.isHidden ? <EyeOff size={16} className="text-slate-500" /> : <Eye size={16} className="text-slate-700" />}
      </button>
      <div 
        {...attributes} {...listeners}
        className="absolute top-2 left-2 z-20 bg-white/90 backdrop-blur-md p-1.5 rounded-lg cursor-grab hover:bg-[#00dbef]/10 transition-colors border border-slate-200 shadow-sm"
        title="Arrastrar para reordenar"
      >
        <GripVertical size={16} className="text-slate-700" />
      </div>

      <div className="aspect-[2/3] relative" onClick={onClick}>
        <img src={series.coverImage} alt={series.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="font-bold bg-[#fe5802] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-105">
            Editar Serie
          </span>
        </div>
      </div>

      <div className="p-3" onClick={onClick}>
        <h3 className="font-bold text-sm truncate text-slate-900">{series.title}</h3>
        <span className={`inline-block text-[9px] uppercase font-bold px-2 py-0.5 rounded-md mt-1 ${series.isComingSoon ? 'bg-[#00dbef]/20 text-[#0442d9] border border-[#00dbef]/30' : 'bg-[#ffb9ff]/30 text-[#f10813] border border-[#ffb9ff]/50'}`}>
          {series.isComingSoon ? 'Muy Pronto' : 'Publicada'}
        </span>
        {series.isHidden && (
          <span className="inline-block text-[9px] uppercase font-bold px-2 py-0.5 rounded-md mt-1 ml-2 bg-slate-200 text-slate-600 border border-slate-300">Oculta</span>
        )}
      </div>
    </div>
  );
};

// ==========================================
// BANNERS MANAGER
// ==========================================
const BannersManager = ({ banners, series }: { banners: any[], series: any[] }) => {
  const showToast = useContext(ToastContext);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>(banners);

  useEffect(() => {
    setItems(banners);
  }, [banners]);

  useEffect(() => {
    const initializeBanners = async () => {
      try {
        const snap = await getDocs(collection(db, 'heroBanners'));
        if (snap.empty) {
          const batch = writeBatch(db);
          const seriesToMigrate = SERIES_DATA.slice(0, 4);
          
          seriesToMigrate.forEach((serie, index) => {
            const newId = `banner-migrated-${serie.id}`;
            const newBanner = {
              id: newId,
              order: index,
              desktopImage: serie.bannerImage || serie.coverImage || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
              mobileImage: serie.mobileBannerImage || serie.coverImage || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
              logoUrl: serie.logoUrl || '',
              logoSize: 'medium',
              title: serie.title,
              subtitle: serie.bannerText || (serie.isComingSoon ? 'Muy Pronto' : 'Todos los episodios disponibles'),
              badge: serie.contentRating || 'TV-14',
              isVisible: true
            };
            batch.set(doc(db, 'heroBanners', newId), newBanner);
          });
          
          await batch.commit();
        }
      } catch (err) {
        console.error('Error initializing banners:', err);
      }
    };
    
    initializeBanners();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      
      const batch = writeBatch(db);
      newItems.forEach((item: any, index: number) => {
        batch.update(doc(db, 'heroBanners', item.id), { order: index });
      });
      try {
        await batch.commit();
      } catch (error) {
        console.error("Error reordenando banners:", error);
      }
    }
  };

  const createNewBanner = async () => {
    const newId = `banner-${Date.now()}`;
    const newBanner = {
      id: newId,
      order: items.length,
      desktopImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
      title: 'Nuevo Banner',
      logoSize: 'medium',
      isVisible: true
    };
    try {
      await setDoc(doc(db, 'heroBanners', newId), newBanner);
      setEditingBanner(newBanner);
    } catch (err) {
      console.error(err);
      showToast('Error creando nuevo banner', 'error');
    }
  };

  if (editingBanner) {
    return <BannerEditor banner={editingBanner} onBack={() => setEditingBanner(null)} series={series} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-gravity text-slate-900">Gestor de Banners</h1>
          <p className="text-slate-500 text-xs mt-1">Arrastra para reordenar los banners del carrusel principal.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={createNewBanner}
            className="bg-black text-white hover:bg-zinc-800 font-bold py-2.5 px-6 rounded-lg transition-colors shadow-md flex items-center gap-2 text-sm"
          >
            <Plus size={18} /> Nuevo Banner
          </button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(b => (
              <SortableBannerCard key={b.id} banner={b} onClick={() => setEditingBanner(b)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

const SortableBannerCard: React.FC<{ banner: any, onClick: () => void }> = ({ banner, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: banner.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const isHidden = banner.isVisible === false;
  
  return (
    <div 
      ref={setNodeRef} style={style}
      className={`bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:border-[#0281c8] transition-all hover:-translate-y-1 group relative shadow-sm ${isHidden ? 'opacity-60 grayscale' : ''}`}
    >
      <div 
        {...attributes} {...listeners}
        className="absolute top-2 left-2 z-20 bg-white/90 backdrop-blur-md p-1.5 rounded-lg cursor-grab hover:bg-[#0281c8]/10 transition-colors border border-slate-200 shadow-sm"
      >
        <GripVertical size={16} className="text-slate-700" />
      </div>
      
      {isHidden && (
        <div className="absolute top-2 right-2 z-20 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-md">
          Oculto
        </div>
      )}

      <div className="aspect-video relative" onClick={onClick}>
        <img src={banner.desktopImage} alt={banner.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="font-bold bg-[#fe5802] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-105">
            Editar Banner
          </span>
        </div>
      </div>
      <div className="p-3 bg-white" onClick={onClick}>
        <h3 className="font-bold text-sm truncate text-slate-900">{banner.title || 'Sin Título'}</h3>
      </div>
    </div>
  );
};

const BannerEditor = ({ banner, onBack, series }: { banner: any, onBack: () => void, series: any[] }) => {
  const showToast = useContext(ToastContext);
  const requestConfirm = useContext(ConfirmContext);
  const [formData, setFormData] = useState<any>({ isVisible: true, ...banner });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k, v === undefined ? '' : v])
      );
      await setDoc(doc(db, 'heroBanners', formData.id), dataToSave as any);
      showToast('¡Banner guardado!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Error guardando banner', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    requestConfirm('¿Eliminar banner?', async () => {
      try {
        await deleteDoc(doc(db, 'heroBanners', formData.id));
        onBack();
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <div className="pb-24 space-y-8">
      <div className="flex justify-between items-center bg-white/70 backdrop-blur-xl border border-slate-200 p-4 rounded-3xl sticky top-0 z-40 shadow-sm">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-900 flex items-center gap-2 font-bold text-sm px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
          ← Volver a Banners
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => setFormData({...formData, isVisible: !formData.isVisible})} 
            className={`px-4 py-2 rounded-2xl flex items-center gap-2 font-bold text-xs transition-all border ${formData.isVisible ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-800 text-white border-slate-800'}`}
          >
            {formData.isVisible ? 'Ocultar' : 'Mostrar'}
          </button>
          <button onClick={handleDelete} className="bg-[#f6042e]/10 hover:bg-[#f6042e]/20 text-[#f6042e] px-4 py-2 rounded-2xl flex items-center gap-2 font-bold text-xs transition-all border border-[#f6042e]/20">
            <Trash2 size={16} /> Eliminar
          </button>
          <button onClick={handleSave} disabled={isSaving} className="bg-black text-white hover:bg-zinc-800 font-bold py-2.5 px-6 rounded-lg transition-colors shadow-md flex items-center gap-2 text-xs disabled:opacity-50">
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>Guardar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-xl font-gravity text-[#0281c8] mb-2">Imágenes</h3>
          <ImageUploader label="Imagen Desktop" url={formData.desktopImage} onUpload={(url) => setFormData({...formData, desktopImage: url})} />
          <ImageUploader label="Imagen Mobile" url={formData.mobileImage} onUpload={(url) => setFormData({...formData, mobileImage: url})} />
          <ImageUploader label="Logo (Opcional)" url={formData.logoUrl || ''} onUpload={(url) => setFormData({...formData, logoUrl: url})} />
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-xl font-gravity text-[#0281c8] mb-2">Textos y Logo</h3>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Serie Vinculada (Opcional)</label>
            <select 
              value={formData.seriesId || ''} 
              onChange={e => setFormData({...formData, seriesId: e.target.value})}
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#5500bd] text-sm text-slate-900"
            >
              <option value="">Ninguna (Banner estático)</option>
              {series.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Tamaño del Logo</label>
            <select 
              value={formData.logoSize || 'medium'} 
              onChange={e => setFormData({...formData, logoSize: e.target.value})}
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#5500bd] text-sm text-slate-900"
            >
              <option value="small">Pequeño</option>
              <option value="medium">Mediano</option>
              <option value="large">Grande</option>
              <option value="xlarge">Extra Grande</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Título</label>
            <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#5500bd] text-sm text-slate-900" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Subtítulo</label>
            <input type="text" value={formData.subtitle || ''} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#5500bd] text-sm text-slate-900" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Badge (ej: TV-MA)</label>
            <input type="text" value={formData.badge || ''} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#5500bd] text-sm text-slate-900" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Top Badge (Arriba del título)</label>
            <input type="text" value={formData.topBadge || ''} onChange={e => setFormData({...formData, topBadge: e.target.value})} placeholder="Ej: Nueva Temporada" className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#5500bd] text-sm text-slate-900" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Feature Badges (Separados por coma)</label>
            <input type="text" value={(formData.featureBadges || []).join(', ')} onChange={e => setFormData({...formData, featureBadges: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} placeholder="Ej: HD, CC, 16+" className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#5500bd] text-sm text-slate-900" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Texto Customizado (Pie)</label>
            <textarea value={formData.customText || ''} onChange={e => setFormData({...formData, customText: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#5500bd] text-sm text-slate-900 resize-none h-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. EDITOR DE SERIE & MODAL DE PREVISUALIZACIÓN
// ==========================================

const StringArrayInput = ({ label, value, onChange, placeholder }: { label: string, value: string[], onChange: (val: string[]) => void, placeholder?: string }) => {
  const [localVal, setLocalVal] = useState(value?.join(', ') || '');
  
  useEffect(() => {
    setLocalVal(value?.join(', ') || '');
  }, [value]);

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{label}</label>
      <input 
        type="text" 
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={() => onChange(localVal.split(',').map(t => t.trim()).filter(Boolean))}
        placeholder={placeholder}
        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
      />
    </div>
  );
};
const SeriesEditor = ({ serie, onBack }: { serie: Series, onBack: () => void }) => {
  const showToast = useContext(ToastContext);
  const requestConfirm = useContext(ConfirmContext);
  const [formData, setFormData] = useState<Series>(serie);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchingTMDB, setIsSearchingTMDB] = useState(false);
  const [isTmdbLoading, setIsTmdbLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleGalleryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = (formData.gallery || []).findIndex(item => item.id === active.id);
      const newIndex = (formData.gallery || []).findIndex(item => item.id === over.id);
      const newGallery = arrayMove(formData.gallery || [], oldIndex, newIndex);
      setFormData({...formData, gallery: newGallery});
    }
  };

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsSearchingTMDB(true);
      const timer = setTimeout(async () => {
        try {
          const apiKey = import.meta.env.VITE_TMDB_API_KEY;
          if (!apiKey) return;
          const res = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=es-ES&query=${encodeURIComponent(searchQuery)}`);
          if (res.ok) {
            const data = await res.json();
            setSearchResults(data.results || []);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsSearchingTMDB(false);
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsSearchingTMDB(false);
    }
  }, [searchQuery]);

  const handleTmdbAutocomplete = async (idToFetch: string) => {
    if (!idToFetch) return;
    setIsTmdbLoading(true);
    try {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      if (!apiKey) {
        throw new Error("VITE_TMDB_API_KEY no está configurada");
      }

      const res = await fetch(`https://api.themoviedb.org/3/tv/${idToFetch}?api_key=${apiKey}&language=es-MX&append_to_response=content_ratings,credits`);
      if (!res.ok) throw new Error("Serie no encontrada");
      const data = await res.json();

      const title = data.name;
      const year = data.first_air_date ? data.first_air_date.split('-')[0] : '';
      const description = data.overview;
      
      let topBadge = '';
      if (data.content_ratings?.results) {
        const rating = data.content_ratings.results.find((r: any) => r.iso_3166_1 === 'US' || r.iso_3166_1 === 'ES' || r.iso_3166_1 === 'MX');
        if (rating) topBadge = rating.rating || "";
      }
      
      const cast = data.credits?.cast?.slice(0, 4).map((c: any) => c.name) || [];
      const tags = data.genres?.map((g: any) => g.name) || [];
      
      let seasonsData: Season[] = [];
      if (data.seasons) {
        for (const season of data.seasons) {
          if (season.season_number === 0) continue;
          
          const seasonRes = await fetch(`https://api.themoviedb.org/3/tv/${idToFetch}/season/${season.season_number}?api_key=${apiKey}&language=es-MX`);
          if (seasonRes.ok) {
            const seasonData = await seasonRes.json();
            const episodes: Episode[] = seasonData.episodes?.map((episode: any) => ({
              id: `s${seasonData.season_number}e${episode.episode_number}`,
              order: episode.episode_number,
              title: episode.name || `Episodio ${episode.episode_number}`,
              description: episode.overview || 'Sin descripción disponible.',
              duration: episode.runtime ? `${episode.runtime} min` : '45 min',
              thumbnail: episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : '',
              videoUrl: ''
            })) || [];
            
            seasonsData.push({
              id: `s-${season.season_number}`,
              title: season.name,
              episodes
            });
          }
        }
      }

      setFormData(prev => ({
        ...prev,
        title: title || prev.title || '',
        year: year || prev.year || '',
        description: description || prev.description || '',
        topBadge: topBadge || prev.topBadge || '',
        cast: cast.length > 0 ? cast : prev.cast,
        tags: tags.length > 0 ? tags : prev.tags,
        seasons: seasonsData.length > 0 ? seasonsData : prev.seasons
      }));
      
    } catch (err: any) {
      console.error(err);
      requestConfirm(`No se pudo autocompletar: ${err.message}`, () => {});
    } finally {
      setIsTmdbLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k, v === undefined ? '' : v])
      );
      await setDoc(doc(db, 'series', formData.id), dataToSave as any);
      showToast('¡Serie guardada en Firestore!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Error guardando la serie', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    requestConfirm(`¿Estás seguro de eliminar la serie "${formData.title}"?`, async () => {
      try {
        await deleteDoc(doc(db, 'series', formData.id));
        onBack();
      } catch (err) {
        console.error(err);
        showToast('Error al eliminar la serie', 'error');
      }
    });
  };

  return (
    <div className="pb-24 space-y-8">
      {/* Header bar */}
      <div className="flex justify-between items-center bg-white/70 backdrop-blur-xl border border-slate-200 p-4 rounded-3xl sticky top-0 z-40 shadow-sm">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-900 flex items-center gap-2 font-bold text-sm px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
          ← Volver a Series
        </button>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-2xl flex items-center gap-2 font-bold text-xs transition-all border border-slate-200"
          >
            <Eye size={16} /> Vista Previa
          </button>

          <button 
            onClick={handleDelete}
            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-2xl flex items-center gap-2 font-bold text-xs transition-all border border-red-200"
          >
            <Trash2 size={16} /> Eliminar
          </button>

          <button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="bg-black text-white hover:bg-zinc-800 font-bold py-2.5 px-6 rounded-lg transition-colors shadow-md flex items-center gap-2 text-xs disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Info Principal */}
          <div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-2xl font-gravity text-pink-500 mb-4">Información de la Serie</h3>
            
            <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100 relative z-50">
              <div className="w-full relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar serie en TMDB..."
                  className="w-full bg-white border border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900"
                />
                {isSearchingTMDB && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-pink-500" size={16} />}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
                    {searchResults.map(result => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                          handleTmdbAutocomplete(result.id.toString());
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-zinc-800 text-white text-sm border-b border-zinc-800/50 last:border-0 transition-colors flex justify-between items-center"
                      >
                        <span>{result.name}</span>
                        <span className="text-zinc-500 text-xs">{result.first_air_date ? `(${result.first_air_date.split('-')[0]})` : ''}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Título de la Serie</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Descripción Corta</label>
              <textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                rows={3} 
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm resize-none text-slate-900" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Año</label>
                <input 
                  type="text" 
                  value={formData.year} 
                  onChange={e => setFormData({...formData, year: e.target.value})} 
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
                />
              </div>

              <StringArrayInput 
                label="Tags (Separados por coma)" 
                value={formData.tags} 
                onChange={val => setFormData({...formData, tags: val})} 
              />
            </div>

            <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl space-y-4">
              <h4 className="font-gravity text-pink-500 text-lg">Información de "Acerca de"</h4>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Título para Acerca de</label>
                <input 
                  type="text" 
                  value={formData.aboutTitle || ''} 
                  onChange={e => setFormData({...formData, aboutTitle: e.target.value})} 
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Subtítulo/Género para Acerca de</label>
                <input 
                  type="text" 
                  value={formData.aboutSubtitle || ''} 
                  onChange={e => setFormData({...formData, aboutSubtitle: e.target.value})} 
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Descripción larga para Acerca de</label>
                <textarea 
                  value={formData.aboutDescription || ''} 
                  onChange={e => setFormData({...formData, aboutDescription: e.target.value})} 
                  rows={3} 
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm resize-none text-slate-900" 
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl space-y-4">
              <h4 className="font-gravity text-pink-500 text-lg">Cadena e Idiomas</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Cadena</label>
                  <input 
                    type="text" 
                    value={formData.studio || ''} 
                    onChange={e => setFormData({...formData, studio: e.target.value})} 
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">URL del Logo de la Cadena</label>
                  <input 
                    type="text" 
                    value={formData.networkLogoUrl || ''} 
                    onChange={e => setFormData({...formData, networkLogoUrl: e.target.value})} 
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Audio Original</label>
                  <input 
                    type="text" 
                    value={formData.originalAudio || ''} 
                    onChange={e => setFormData({...formData, originalAudio: e.target.value})} 
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
                  />
                </div>
                <StringArrayInput 
                  label="Subtítulos (Separados por coma)" 
                  value={formData.subtitleLanguages || []} 
                  onChange={val => setFormData({...formData, subtitleLanguages: val})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Región de Origen</label>
                  <input 
                    type="text" 
                    value={formData.regionOfOrigin || ''} 
                    onChange={e => setFormData({...formData, regionOfOrigin: e.target.value})} 
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Copyright</label>
                  <input 
                    type="text" 
                    value={formData.copyright || ''} 
                    onChange={e => setFormData({...formData, copyright: e.target.value})} 
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Clasificación (Rating)</label>
                  <input 
                    type="text" 
                    value={formData.contentRating || ''} 
                    onChange={e => setFormData({...formData, contentRating: e.target.value})} 
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
                  />
                </div>
              </div>
            </div>

            <StringArrayInput 
              label="Protagonistas / Elenco (Separados por coma)" 
              value={formData.cast || []} 
              onChange={val => setFormData({...formData, cast: val})} 
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Top Badge</label>
                <input 
                  type="text" 
                  value={formData.topBadge || ''} 
                  onChange={e => setFormData({...formData, topBadge: e.target.value})} 
                  placeholder="Ej: Con doblaje"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
                />
              </div>

              <StringArrayInput 
                label="Feature Badges (Por coma)" 
                value={formData.featureBadges || []} 
                onChange={val => setFormData({...formData, featureBadges: val})} 
                placeholder="Ej: HD, CC, 16+"
              />
            </div>

            {/* Switch Muy Pronto / Publicada */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl mt-4">
              <div>
                <span className="font-bold text-sm block text-slate-800">Estado de Publicación</span>
                <span className="text-xs text-slate-500">Marcar como "Muy Pronto" desactiva la reproducción directa</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold ${formData.isComingSoon ? 'text-cyan-500' : 'text-pink-500'}`}>
                  {formData.isComingSoon ? 'Muy Pronto' : 'Publicada'}
                </span>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isComingSoon: !formData.isComingSoon})}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${formData.isComingSoon ? 'bg-cyan-500' : 'bg-pink-500'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.isComingSoon ? 'translate-x-8' : 'translate-x-1'} shadow-sm`} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <span className="font-bold text-sm block text-slate-800">Ocultar serie al público (Borrador)</span>
                <span className="text-xs text-slate-500">Solo visible para el administrador</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold ${formData.isHidden ? 'text-slate-500' : 'text-pink-500'}`}>
                  {formData.isHidden ? 'Oculta' : 'Visible'}
                </span>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isHidden: !formData.isHidden})}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${formData.isHidden ? 'bg-slate-400' : 'bg-pink-500'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.isHidden ? 'translate-x-8' : 'translate-x-1'} shadow-sm`} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Manager de Temporadas y Episodios */}
          <div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-gravity text-pink-500">Temporadas y Episodios</h3>
              <button 
                onClick={() => {
                  const newSeasonId = `s${formData.seasons.length + 1}`;
                  setFormData({
                    ...formData,
                    seasons: [...formData.seasons, { id: newSeasonId, title: `Temporada ${formData.seasons.length + 1}`, episodes: [] }]
                  });
                }}
                className="bg-black text-white hover:bg-zinc-800 font-bold py-2.5 px-6 rounded-lg transition-colors shadow-md flex items-center gap-2 text-xs"
              >
                <Plus size={16} /> Nueva Temporada
              </button>
            </div>

            <div className="space-y-4">
              {formData.seasons.map((season, index) => (
                <SeasonAccordion 
                  key={season.id} 
                  season={season} 
                  onChange={(newSeason) => {
                    const newSeasons = [...formData.seasons];
                    newSeasons[index] = newSeason;
                    setFormData({ ...formData, seasons: newSeasons });
                  }}
                  onDelete={() => {
                    const newSeasons = formData.seasons.filter((_, idx) => idx !== index);
                    setFormData({ ...formData, seasons: newSeasons });
                  }}
                />
              ))}
            </div>
          </div>
          {/* Galería de Imágenes */}
          <div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xl font-gravity text-[#0281c8] mb-2">Galería de Imágenes</h3>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleGalleryDragEnd}>
              <SortableContext items={(formData.gallery || []).map(g => g.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {(formData.gallery || []).map((img, idx) => (
                    <SortableGalleryItem
                      key={img.id}
                      img={img}
                      onRemove={() => {
                        const newGallery = [...(formData.gallery || [])];
                        newGallery.splice(idx, 1);
                        setFormData({...formData, gallery: newGallery});
                      }}
                      onUpdateTags={(tags) => {
                        const newGallery = [...(formData.gallery || [])];
                        newGallery[idx].tags = tags;
                        setFormData({...formData, gallery: newGallery});
                      }}
                    />
                  ))}
                  <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-50 relative group hover:border-[#136bcf] transition-colors cursor-pointer">
                    <Upload size={24} className="text-slate-400 group-hover:text-[#136bcf] mb-2" />
                    <span className="text-xs font-bold text-slate-500 group-hover:text-[#136bcf]">Añadir</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        try {
                          const uploadPromises = Array.from(files).map(async (file: File) => {
                            const url = await uploadToCloudinary(file);
                            return { id: Date.now().toString() + Math.random().toString(36).substring(7), url, category: 'galeria' };
                          });
                          const newImages = await Promise.all(uploadPromises);
                          setFormData({
                            ...formData, 
                            gallery: [...(formData.gallery || []), ...newImages]
                          });
                        } catch(err) {
                          console.error(err);
                          showToast('Error subiendo imágenes de galería', 'error');
                        }
                      }}
                    />
                  </div>
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Subida de Imágenes */}
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xl font-gravity text-pink-500 mb-2">Imágenes Principales</h3>
            <ImageUploader 
              label="Portada (Cover Image)" 
              url={formData.coverImage} 
              onUpload={(url) => setFormData({...formData, coverImage: url})} 
            />
            <ImageUploader 
              label="Banner Home Desktop" 
              url={formData.bannerImage || ''} 
              onUpload={(url) => setFormData({...formData, bannerImage: url})} 
            />
            <ImageUploader 
              label="Banner Home Mobile" 
              url={formData.mobileBannerImage || ''} 
              onUpload={(url) => setFormData({...formData, mobileBannerImage: url})} 
            />
            <ImageUploader 
              label="Imagen Amplia (Wide Image)" 
              url={formData.wideImage || ''} 
              onUpload={(url) => setFormData({...formData, wideImage: url})} 
            />
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xl font-gravity text-pink-500 mb-2">Logos</h3>
            <ImageUploader 
              label="Logo de la Serie (Universal)" 
              url={formData.logoUrl || ''} 
              onUpload={(url) => setFormData({...formData, logoUrl: url, mobileLogoUrl: url, detailLogoUrl: url})} 
              containerClassName=""
              dropzoneClassName="aspect-video rounded-xl overflow-hidden border-dashed border-2 border-pink-300 dark:border-pink-500/50 bg-pink-50/50 dark:bg-white/5 hover:bg-pink-100/50 transition-colors relative group flex items-center justify-center"
            />
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xl font-gravity text-pink-500 mb-2">Banners de Detalle</h3>
            <ImageUploader 
              label="Detail Banner Desktop" 
              url={formData.detailBannerDesktop || ''} 
              onUpload={(url) => setFormData({...formData, detailBannerDesktop: url})} 
            />
            <ImageUploader 
              label="Detail Banner Mobile" 
              url={formData.detailBannerMobile || ''} 
              onUpload={(url) => setFormData({...formData, detailBannerMobile: url})} 
            />
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xl font-gravity text-pink-500 mb-2">Campos Gráficos</h3>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Banner Text</label>
              <input 
                type="text" 
                value={formData.bannerText || ''} 
                onChange={e => setFormData({...formData, bannerText: e.target.value})} 
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Theme Color (HEX)</label>
              <div className="flex gap-3">
                <input 
                  type="color" 
                  value={formData.themeColor || '#ec4899'} 
                  onChange={e => setFormData({...formData, themeColor: e.target.value})} 
                  className="w-12 h-12 rounded-xl bg-transparent border-0 cursor-pointer p-0" 
                />
                <input 
                  type="text" 
                  value={formData.themeColor || ''} 
                  onChange={e => setFormData({...formData, themeColor: e.target.value})} 
                  placeholder="#ec4899"
                  className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm uppercase text-slate-900" 
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal de Previsualización */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full relative shadow-xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h4 className="font-gravity text-pink-500 text-lg">VISTA PREVIA CARD</h4>
                <button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Exact Card Preview */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-[2/3] relative">
                  <img src={formData.coverImage} alt={formData.title} className="w-full h-full object-cover" />
                  {formData.isComingSoon && (
                    <div className="absolute top-2 right-2 bg-cyan-100 text-cyan-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-cyan-200 shadow-sm">
                      Muy Pronto
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-lg text-slate-900">{formData.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{formData.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {formData.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-pink-50 text-pink-600 px-2 py-0.5 rounded-md border border-pink-100">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold tracking-wider"
              >
                Cerrar Previsualización
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SortableGalleryItem = ({ 
  img, 
  onRemove, 
  onUpdateTags 
}: { 
  key?: string;
  img: GalleryImage, 
  onRemove: () => void, 
  onUpdateTags: (tags: string[]) => void 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: img.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [localTags, setLocalTags] = useState(img.tags ? img.tags.join(', ') : '');

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-200 dark:border-white/10 transition-colors relative group">
      <div className="w-full aspect-[3/4] rounded-lg overflow-hidden cursor-grab active:cursor-grabbing relative mb-3" {...attributes} {...listeners}>
        <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
        <button 
          type="button"
          onPointerDown={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-2 right-2 text-white p-1.5 rounded-lg shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-pink-500 hover:bg-pink-600"
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      <div className="flex flex-col gap-1.5 w-full mt-auto">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tags (Separados por coma)</label>
        <input 
          type="text" 
          value={localTags}
          onPointerDown={(e) => e.stopPropagation()}
          onChange={(e) => setLocalTags(e.target.value)}
          onBlur={() => {
            const tagsArray = localTags.split(',').map(t => t.trim()).filter(Boolean);
            onUpdateTags(tagsArray);
          }}
          placeholder="Tags (Y2K, Set...)"
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-pink-500 text-xs text-slate-900"
        />
      </div>
    </div>
  );
};

// Componente para Subir Imagen a Storage
const ImageUploader = ({ 
  label, 
  url, 
  onUpload,
  containerClassName = "bg-white/70 backdrop-blur-xl border border-slate-200 p-5 rounded-3xl space-y-3 shadow-sm",
  dropzoneClassName = "aspect-video bg-slate-50 rounded-2xl overflow-hidden border border-dashed border-slate-300 relative group flex items-center justify-center"
}: { 
  label: string; 
  url: string; 
  onUpload: (url: string) => void;
  containerClassName?: string;
  dropzoneClassName?: string;
}) => {
  const showToast = useContext(ToastContext);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      console.error("Faltan las credenciales de Cloudinary en el archivo .env");
      showToast("Error: Faltan credenciales de Cloudinary.", 'error');
      setIsUploading(false);
      return;
    }

    try {
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      const response = await fetch(url, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Error en Cloudinary');
      const data = await response.json();
      onUpload(data.secure_url);
    } catch (error) {
      console.error("Detalle del error:", error);
      showToast("Fallo la subida de la imagen", 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={containerClassName}>
      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">{label}</h4>
      <div className={dropzoneClassName}>
        {url ? (
          <img src={url} alt={label} className="w-full h-full object-contain" />
        ) : (
          <ImageIcon className="text-slate-300" size={40} />
        )}
        <label className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
          {isUploading ? (
            <Loader2 className="animate-spin text-pink-500" size={28} />
          ) : (
            <>
              <Upload className="text-pink-500 mb-1" size={24} />
              <span className="font-bold text-xs text-slate-900">Cambiar Imagen</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={isUploading} />
        </label>
      </div>
    </div>
  );
};

// ==========================================
// 5. ACCORDION DE TEMPORADAS Y EPISODIOS
// ==========================================
const SeasonAccordion: React.FC<{ 
  season: Season, 
  onChange: (s: Season) => void,
  onDelete: () => void 
}> = ({ season, onChange, onDelete }) => {
  const requestConfirm = useContext(ConfirmContext);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<Episode[]>(season.episodes);

  useEffect(() => {
    setItems(season.episodes);
  }, [season.episodes]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex) as Episode[];
      setItems(newItems);
      onChange({ ...season, episodes: newItems });
    }
  };

  return (
    <div className="bg-white/80 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {isOpen ? <ChevronUp size={20} className="text-pink-500" /> : <ChevronDown size={20} className="text-pink-500" />}
          <input 
            type="text" 
            value={season.title}
            onClick={e => e.stopPropagation()}
            onChange={e => onChange({ ...season, title: e.target.value })}
            className="bg-transparent font-bold text-base focus:outline-none border-b border-transparent focus:border-pink-500 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const newEp: Episode = {
                id: `${season.id}-ep-${Date.now()}`,
                title: `Episodio ${items.length + 1}`,
                description: '',
                duration: '20 min',
                thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
                videoUrl: '',
                isComingSoon: false
              };
              onChange({ ...season, episodes: [...items, newEp] });
              setIsOpen(true);
            }}
            className="text-xs bg-pink-100 hover:bg-pink-200 text-pink-700 px-3 py-1.5 rounded-xl font-bold transition-all"
          >
            + Episodio
          </button>

          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              requestConfirm('¿Eliminar temporada?', () => onDelete());
            }}
            className="text-xs text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100"
          >
            <div className="p-4 space-y-4 bg-slate-50/50">
              {items.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No hay episodios creados en esta temporada.</p>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    {items.map((ep, index) => (
                      <SortableEpisodeCard 
                        key={ep.id} 
                        episode={ep} 
                        onChange={(newEp) => {
                          const newEpisodes = [...items];
                          newEpisodes[index] = newEp;
                          onChange({ ...season, episodes: newEpisodes });
                        }}
                        onDelete={() => {
                          requestConfirm('¿Eliminar este episodio?', () => {
                            const newEpisodes = items.filter((_, idx) => idx !== index);
                            onChange({ ...season, episodes: newEpisodes });
                          });
                        }}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SortableEpisodeCard: React.FC<{ 
  episode: Episode, 
  onChange: (ep: Episode) => void,
  onDelete: () => void 
}> = ({ episode, onChange, onDelete }) => {
  const showToast = useContext(ToastContext);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: episode.id });
  const [isUploading, setIsUploading] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 relative shadow-sm">
      <div {...attributes} {...listeners} className="cursor-grab text-slate-400 hover:text-slate-600 flex items-center justify-center p-1">
        <GripVertical size={20} />
      </div>
      
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <input 
            type="text" 
            value={episode.title}
            onChange={e => onChange({ ...episode, title: e.target.value })}
            className="w-full bg-transparent font-bold text-sm focus:outline-none border-b border-slate-200 focus:border-pink-500 pb-1 text-slate-900"
            placeholder="Título del Episodio"
          />
          
          {/* Toggle Muy Pronto */}
          <button 
            type="button"
            onClick={() => onChange({...episode, isComingSoon: !episode.isComingSoon})}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${episode.isComingSoon ? 'bg-cyan-100 text-cyan-700 border border-cyan-200' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'}`}
            title="Marcar como Muy Pronto"
          >
            {episode.isComingSoon && <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>}
            Muy Pronto
          </button>

          <button 
            onClick={onDelete}
            className="text-slate-400 hover:text-red-500 p-1 transition-colors"
            title="Eliminar Episodio"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={episode.duration}
            onChange={e => onChange({ ...episode, duration: e.target.value })}
            className="w-28 bg-slate-50 text-xs rounded-xl px-3 py-2 border border-slate-200 focus:border-pink-500 focus:outline-none text-slate-900"
            placeholder="Duración"
          />
          <input 
            type="text" 
            value={episode.videoUrl}
            onChange={e => onChange({ ...episode, videoUrl: e.target.value })}
            className="flex-1 bg-slate-50 text-xs rounded-xl px-3 py-2 border border-slate-200 focus:border-pink-500 focus:outline-none text-slate-900"
            placeholder="URL del Video (MP4 / iframe)"
          />
        </div>
        
        <textarea 
          value={episode.description}
          onChange={e => onChange({ ...episode, description: e.target.value })}
          className="w-full bg-slate-50 text-xs rounded-xl px-3 py-2 border border-slate-200 focus:border-pink-500 focus:outline-none resize-none h-16 text-slate-900"
          placeholder="Descripción del episodio..."
        />
      </div>
      
      <div className="w-full md:w-36 flex flex-col gap-2 shrink-0">
        <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
          {episode.thumbnail ? (
            <img src={episode.thumbnail} alt={episode.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">Sin Imagen</div>
          )}
        </div>
        <label className="text-[10px] text-center bg-slate-100 hover:bg-slate-200 py-2 rounded-xl cursor-pointer transition-colors font-bold text-slate-700 flex items-center justify-center gap-1 border border-slate-200">
          {isUploading ? <Loader2 className="animate-spin" size={12} /> : <Upload size={12} />}
          <span>{isUploading ? 'Subiendo...' : 'Thumbnail'}</span>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            disabled={isUploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                setIsUploading(true);
                
                const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
                const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
                if (!cloudName || !uploadPreset) {
                  console.error("Faltan las credenciales de Cloudinary en el archivo .env");
                  showToast("Error: Faltan credenciales de Cloudinary.", 'error');
                  setIsUploading(false);
                  return;
                }

                try {
                  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
                  const formData = new FormData();
                  formData.append('file', file);
                  formData.append('upload_preset', uploadPreset);
                  const response = await fetch(url, { method: 'POST', body: formData });
                  if (!response.ok) throw new Error('Error en Cloudinary');
                  const data = await response.json();
                  onChange({ ...episode, thumbnail: data.secure_url });
                } catch (error) {
                  console.error("Detalle del error:", error);
                  showToast("Fallo la subida de la imagen", 'error');
                } finally {
                  setIsUploading(false);
                }
              }
            }} 
          />
        </label>
      </div>
    </div>
  );
};

// ==========================================
// 6. CONFIGURACIÓN GLOBAL (Marquee + Redes)
// ==========================================
const ConfigManager = ({ config }: { config: AppConfig }) => {
  const showToast = useContext(ToastContext);
  const [formData, setFormData] = useState<AppConfig>(config);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      marqueeText: MARQUEE_TEXT,
      socialLinks: SOCIAL_LINKS,
      retroSectionTitle: 'Años 2000s (Retro)',
      ...config
    });
  }, [config]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k, v === undefined ? '' : v])
      );
      await setDoc(doc(db, 'appConfig', 'global'), dataToSave as any);
      showToast('¡Configuración guardada!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Error guardando configuración', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-gravity text-slate-900">Configuración Global</h1>
          <p className="text-slate-500 text-xs mt-1">Ajusta los avisos y enlaces del sitio.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving} 
          className="bg-black text-white hover:bg-zinc-800 font-bold py-2.5 px-6 rounded-lg transition-colors shadow-md flex items-center gap-2 text-xs disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl space-y-6 shadow-sm">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Título de la Sección Retro (Slider de Series)
          </label>
          <input 
            type="text"
            value={formData.retroSectionTitle ?? 'Años 2000s (Retro)'} 
            onChange={e => setFormData({...formData, retroSectionTitle: e.target.value})} 
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900 font-medium" 
            placeholder="Ej: Años 2000s (Retro)"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Marquee Text (Barra de noticias animada)
          </label>
          <textarea 
            rows={2}
            value={formData.marqueeText} 
            onChange={e => setFormData({...formData, marqueeText: e.target.value})} 
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm resize-none text-slate-900" 
          />
        </div>
        
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Enlaces de Redes Sociales
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.socialLinks.map((social, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-pink-500 capitalize">{social.platform}</span>
                <input 
                  type="text" 
                  value={social.url}
                  onChange={e => {
                    const newLinks = [...formData.socialLinks];
                    newLinks[index].url = e.target.value;
                    setFormData({ ...formData, socialLinks: newLinks });
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-pink-500"
                  placeholder="https://..."
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
