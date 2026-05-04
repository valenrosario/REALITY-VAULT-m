export interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
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

export interface Series {
  id: string;
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
  aboutDescription?: string;
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

export interface SocialLink {
  platform: string;
  url: string;
  iconName: string;
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