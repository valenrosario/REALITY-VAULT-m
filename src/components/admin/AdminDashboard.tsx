import React, { useState, useEffect } from 'react';
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
  Eye, 
  Save, 
  Lock, 
  AlertCircle, 
  Loader2,
  ChevronDown,
  ChevronUp,
  Trash2,
  Users,
  Sparkles,
  Tv
} from 'lucide-react';
import { db } from '../../../firebase';
import { collection, getDocs, doc, setDoc, writeBatch, onSnapshot, deleteDoc } from 'firebase/firestore';
import { Series, Episode, Season, AppConfig } from '../../../types';
import { SERIES_DATA, MARQUEE_TEXT, SOCIAL_LINKS } from '../../../constants';
import { uploadImageToStorage } from '../../utils/firebaseStorage';

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
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLaRnLFdLrePsKdNQ1RUssbDupY8Vtjwnr8dEOmvRkpltkC0tSv-OEST91VTmX_O6wbVfdlxptgjszgZYli20-P01OE-faxg-EMP4SGdbMQMMEYBSut7D6MT7eizTzfYIm8mZn8uCyth31mXnp7YA7imudZK820qOopBYiJuFKMexY0P49eKeM71uWVZk/s1612/REALITY%20VAULT%20LOGO-Recuperado-Recuperado.png" 
              alt="Reality Vault" 
              className="w-48 object-contain mx-auto mb-2"
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

// ==========================================
// 2. LAYOUT BASE DEL PANEL (Sidebar + Content)
// ==========================================
export const AdminDashboard = () => {
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
        setConfig(docSnap.data() as AppConfig);
      } else {
        setConfig({ marqueeText: MARQUEE_TEXT, socialLinks: SOCIAL_LINKS });
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
      batch.set(configRef, { marqueeText: MARQUEE_TEXT, socialLinks: SOCIAL_LINKS });
      
      await batch.commit();
      alert('¡Base de datos populada exitosamente!');
    } catch (e) {
      console.error(e);
      alert('Error al migrar datos a Firestore');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white/70 backdrop-blur-xl border-r border-slate-200 flex flex-col p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-20">
        <div className="mb-10 text-center">
          <img 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLaRnLFdLrePsKdNQ1RUssbDupY8Vtjwnr8dEOmvRkpltkC0tSv-OEST91VTmX_O6wbVfdlxptgjszgZYli20-P01OE-faxg-EMP4SGdbMQMMEYBSut7D6MT7eizTzfYIm8mZn8uCyth31mXnp7YA7imudZK820qOopBYiJuFKMexY0P49eKeM71uWVZk/s1612/REALITY%20VAULT%20LOGO-Recuperado-Recuperado.png" 
            alt="Reality Vault" 
            className="h-10 object-contain mx-auto mb-2"
          />
          <p className="text-[10px] text-purple-500 tracking-wider font-semibold uppercase mt-1">
            Admin Control Center
          </p>
        </div>
        
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
                <BannersManager banners={banners} />
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
    </div>
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
    const newId = `serie-${Date.now()}`;
    const newSeriesObj: Series = {
      id: newId,
      order: items.length,
      title: 'Nueva Serie',
      description: 'Escribe una descripción para esta serie...',
      coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
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
      alert('Error creando nueva serie');
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
          className="bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500 text-white hover:opacity-90 px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-sm transition-all shadow-sm"
        >
          <Plus size={18} /> Nueva Serie
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {items.map(s => (
              <SortableSeriesCard key={s.id} series={s} onClick={() => setEditingSeries(s)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

const SortableSeriesCard: React.FC<{ series: Series, onClick: () => void }> = ({ series, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: series.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div 
      ref={setNodeRef} style={style}
      className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:border-[#00dbef] hover:shadow-[0_0_15px_rgba(0,219,239,0.3)] transition-all hover:-translate-y-1 group relative shadow-sm"
    >
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
      </div>
    </div>
  );
};

// ==========================================
// BANNERS MANAGER
// ==========================================
const BannersManager = ({ banners }: { banners: any[] }) => {
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
      alert('Error creando nuevo banner');
    }
  };

  if (editingBanner) {
    return <BannerEditor banner={editingBanner} onBack={() => setEditingBanner(null)} />;
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
            className="bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500 text-white hover:opacity-90 px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-sm transition-all shadow-sm"
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

const BannerEditor = ({ banner, onBack }: { banner: any, onBack: () => void }) => {
  const [formData, setFormData] = useState<any>({ isVisible: true, ...banner });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'heroBanners', formData.id), formData);
      alert('¡Banner guardado!');
    } catch (e) {
      console.error(e);
      alert('Error guardando banner');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`¿Eliminar banner?`)) {
      try {
        await deleteDoc(doc(db, 'heroBanners', formData.id));
        onBack();
      } catch (err) {
        console.error(err);
      }
    }
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
          <button onClick={handleSave} disabled={isSaving} className="bg-[#5500bd] hover:bg-[#5500bd]/90 text-white font-bold px-6 py-2 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 text-xs disabled:opacity-50">
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
const SeriesEditor = ({ serie, onBack }: { serie: Series, onBack: () => void }) => {
  const [formData, setFormData] = useState<Series>(serie);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'series', formData.id), formData);
      alert('¡Serie guardada en Firestore!');
    } catch (e) {
      console.error(e);
      alert('Error guardando la serie');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`¿Estás seguro de eliminar la serie "${formData.title}"?`)) {
      try {
        await deleteDoc(doc(db, 'series', formData.id));
        onBack();
      } catch (err) {
        console.error(err);
        alert('Error al eliminar la serie');
      }
    }
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
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-5 py-2 rounded-2xl flex items-center gap-2 font-bold text-xs transition-all shadow-sm disabled:opacity-50"
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Tags (Separados por coma)</label>
                <input 
                  type="text" 
                  value={formData.tags.join(', ')} 
                  onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})} 
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
                />
              </div>
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
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all border border-slate-200"
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
              label="Logo Principal" 
              url={formData.logoUrl || ''} 
              onUpload={(url) => setFormData({...formData, logoUrl: url})} 
            />
            <ImageUploader 
              label="Logo Mobile" 
              url={formData.mobileLogoUrl || ''} 
              onUpload={(url) => setFormData({...formData, mobileLogoUrl: url})} 
            />
            <ImageUploader 
              label="Logo Detalle (Detail Logo)" 
              url={formData.detailLogoUrl || ''} 
              onUpload={(url) => setFormData({...formData, detailLogoUrl: url})} 
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

          {/* Galería de Imágenes */}
          <div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xl font-gravity text-[#0281c8] mb-2">Galería de Imágenes</h3>
            <div className="grid grid-cols-2 gap-4">
              {(formData.gallery || []).map((img, idx) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200">
                  <div className="aspect-[4/3] bg-slate-100">
                    <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <button 
                      onClick={() => {
                        const newGallery = [...(formData.gallery || [])];
                        newGallery.splice(idx, 1);
                        setFormData({...formData, gallery: newGallery});
                      }}
                      className="self-end bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <input 
                      type="text" 
                      value={img.category}
                      onChange={(e) => {
                        const newGallery = [...(formData.gallery || [])];
                        newGallery[idx].category = e.target.value;
                        setFormData({...formData, gallery: newGallery});
                      }}
                      placeholder="Tag (ej. Promo)"
                      className="w-full bg-white/90 text-slate-900 text-[10px] font-bold px-2 py-1 rounded focus:outline-none"
                    />
                  </div>
                </div>
              ))}
              <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-50 relative group hover:border-[#136bcf] transition-colors cursor-pointer">
                <Upload size={24} className="text-slate-400 group-hover:text-[#136bcf] mb-2" />
                <span className="text-xs font-bold text-slate-500 group-hover:text-[#136bcf]">Añadir a Galería</span>
                <input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadImageToStorage(file, 'gallery');
                      setFormData({
                        ...formData, 
                        gallery: [...(formData.gallery || []), { id: Date.now().toString(), url, category: 'General' }]
                      });
                    } catch(err) {
                      console.error(err);
                      alert('Error subiendo imagen de galería');
                    }
                  }}
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

// Componente para Subir Imagen a Storage
const ImageUploader = ({ label, url, onUpload }: { label: string, url: string, onUpload: (url: string) => void }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const newUrl = await uploadImageToStorage(file, 'series');
      onUpload(newUrl);
    } catch (err) {
      console.error(err);
      alert('Error subiendo la imagen a Firebase Storage');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-5 rounded-3xl space-y-3 shadow-sm">
      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">{label}</h4>
      <div className="aspect-video bg-slate-50 rounded-2xl overflow-hidden border border-dashed border-slate-300 relative group flex items-center justify-center">
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
              if (confirm('¿Eliminar temporada?')) onDelete();
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
                          const newEpisodes = items.filter((_, idx) => idx !== index);
                          onChange({ ...season, episodes: newEpisodes });
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
                try {
                  const url = await uploadImageToStorage(file, 'episodes');
                  onChange({ ...episode, thumbnail: url });
                } catch (err) {
                  console.error(err);
                  alert('Error al subir la miniatura');
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
  const [formData, setFormData] = useState<AppConfig>(config);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'appConfig', 'global'), formData);
      alert('¡Configuración guardada!');
    } catch (e) {
      console.error(e);
      alert('Error guardando configuración');
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
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-sm transition-all shadow-sm disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl space-y-6 shadow-sm">
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
