export interface Episode {
  id: string;
  order?: number;
  title: string;
  thumbnail: string;
  videoUrl: string;
  embedCode?: string;
  duration: string;
  description: string;
  badge?: string;
  isComingSoon?: boolean;
}

export interface Season {
  id: string;
  title: string;
  episodes: Episode[];
}

export interface GalleryImage {
  id: string;
  url: string;
  tags?: string[];
  category?: 'galeria' | 'descargable';
}

export interface Series {
  id: string;
  order?: number;
  title: string;
  logoUrl?: string;
  mobileLogoUrl?: string;
  detailLogoUrl?: string;
  coverImage: string;
  bannerImage?: string;
  mobileBannerImage?: string;
  wideImage?: string;
  detailBannerDesktop?: string;
  detailBannerMobile?: string;
  description: string;
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutDescription?: string;
  networkLogoUrl?: string;
  bannerText?: string;
  tags: string[];
  cast?: string[];
  year: string;
  genre?: string;
  seasons: Season[];
  isComingSoon?: boolean;
  isPremium?: boolean;
  themeColor?: string;
  studio?: string;
  contentRating?: string;
  regionOfOrigin?: string;
  originalAudio?: string;
  audioLanguages?: string[];
  subtitleLanguages?: string[];
  copyright?: string;
  gallery?: GalleryImage[];
  topBadge?: string;
  featureBadges?: string[];
  bannerCustomText?: string;
  isVisible?: boolean;
  isThirdBanner?: boolean;
  isFourthBanner?: boolean;
  isHidden?: boolean;
}

export interface HeroBanner {
  id: string;
  order?: number;
  seriesId?: string;
  desktopImage: string;
  mobileImage: string;
  logoUrl?: string;
  logoSize?: 'small' | 'medium' | 'large' | 'xlarge';
  title?: string;
  subtitle?: string;
  badge?: string;
  customText?: string;
  isVisible?: boolean;
  topBadge?: string;
  featureBadges?: string[];
  bannerCustomText?: string;
  isThirdBanner?: boolean;
  isFourthBanner?: boolean;
}

export interface User {
  uid: string;
  email: string;
  username: string;
  avatar: string;
  favorites: string[];
  watchedEpisodes: string[];
  isPremium?: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  isReady: boolean;
}

export interface AuthFormProps {
  onSuccess?: () => void;
  onSwitchMode?: () => void;
}

export interface SocialLink {
  platform: string;
  url: string;
  iconName: string;
}

export interface AppConfig {
  marqueeText: string;
  socialLinks: SocialLink[];
  retroSectionTitle?: string;
}

export interface Sparkle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  velocity?: {
    x: number;
    y: number;
  };
}

export interface ComingSoonItem {
  id: string;
  title: string;
  image: string;
  date: string;
}

// types.ts

// Definimos los nombres de fuentes permitidos para evitar errores de compilación
export type AppFontFamily = 'font-sans' | 'font-gravity' | 'font-mono';

export interface TextComponentProps {
  content: string;
  fontFamily?: AppFontFamily; // Propiedad opcional para cambiar la fuente
  className?: string;
}