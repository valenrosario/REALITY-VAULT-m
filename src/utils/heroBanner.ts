import { HeroBanner, Series } from '../../types';

export type LogoSize = 'small' | 'medium' | 'large' | 'xlarge';

// Banner listo para pintar: combina los campos del banner (panel de control)
// con los de la serie vinculada. Lo que se edita en el banner siempre gana.
export interface ResolvedHeroBanner {
  key: string;
  series?: Series;
  desktopImage: string;
  mobileImage: string;
  logoUrl?: string;
  mobileLogoUrl?: string;
  logoSize: LogoSize;
  title: string;
  topBadge?: string;
  subtitle: string;
  badge: string;
  metaText?: string;
  year: string;
  genre: string;
  featureBadges: string[];
  description?: string;
  footerText?: string;
  isComingSoon: boolean;
  primaryButtonText: string;
  linkUrl?: string;
  showMyListButton: boolean;
  showDesktopButtons: boolean;
  overlayOpacity: number;
}

const str = (v: unknown): string | undefined =>
  typeof v === 'string' && v.trim() ? v.trim() : undefined;

export const resolveHeroBanner = (
  raw: Partial<HeroBanner> & Partial<Series> & Record<string, any>,
  seriesData: Series[],
  index = 0
): ResolvedHeroBanner => {
  // Banners creados por la migración automática guardaban la serie solo en el id
  const migratedSeriesId = typeof raw.id === 'string' && raw.id.startsWith('banner-migrated-')
    ? raw.id.slice('banner-migrated-'.length)
    : undefined;
  // seriesId vacío ('') = el admin eligió "Ninguna" a propósito
  const linkedSeriesId = raw.seriesId !== undefined ? str(raw.seriesId) : migratedSeriesId;

  // Banner con serie vinculada, o banner "legacy" que en realidad es una serie
  const series: Series | undefined = linkedSeriesId
    ? seriesData.find(s => s.id === linkedSeriesId)
    : raw.id && String(raw.id).startsWith('serie-')
      ? (seriesData.find(s => s.id === raw.id) || (raw as Series))
      : undefined;

  const isComingSoon = typeof raw.isComingSoon === 'boolean'
    ? raw.isComingSoon
    : Boolean(series?.isComingSoon);

  const desktopImage =
    str(raw.desktopImage) || str(raw.bannerImage) || str(series?.bannerImage) ||
    str(raw.coverImage) || str(series?.coverImage) || '';
  const mobileImage =
    str(raw.mobileImage) || str(raw.mobileBannerImage) || str(series?.mobileBannerImage) ||
    str(raw.coverImage) || str(series?.coverImage) || desktopImage;

  const logoUrl = str(raw.logoUrl) || str(series?.logoUrl);
  const overlay = Number(raw.overlayOpacity);

  return {
    key: String(raw.id ?? `banner-${index}`),
    series,
    desktopImage,
    mobileImage,
    logoUrl,
    mobileLogoUrl: str(raw.mobileLogoUrl) || str(raw.logoUrl) || str(series?.mobileLogoUrl) || logoUrl,
    logoSize: (['small', 'medium', 'large', 'xlarge'].includes(raw.logoSize as string) ? raw.logoSize : 'medium') as LogoSize,
    title: str(raw.title) || str(series?.title) || '',
    topBadge: str(raw.topBadge) || str(series?.topBadge),
    subtitle:
      str(raw.subtitle) || str(raw.bannerText) || str(series?.bannerText) ||
      (isComingSoon ? 'Muy Pronto' : 'Todos los episodios disponibles'),
    badge: str(raw.badge) || str(raw.contentRating) || str(series?.contentRating) || 'TV-14',
    metaText: str(raw.bannerCustomText) || str(series?.bannerCustomText),
    year: str(raw.year) || str(series?.year) || '2000',
    genre: str(raw.genre) || str(series?.genre) || 'Reality',
    featureBadges: (raw.featureBadges && raw.featureBadges.length ? raw.featureBadges : series?.featureBadges || []).filter(Boolean),
    description: str(raw.description) || str(series?.description),
    footerText: str(raw.customText),
    isComingSoon,
    primaryButtonText: str(raw.primaryButtonText) || (isComingSoon ? 'Próximamente' : 'Reproducir'),
    linkUrl: str(raw.linkUrl),
    showMyListButton: raw.showMyListButton !== false && Boolean(series) && !isComingSoon,
    showDesktopButtons: raw.showDesktopButtons !== false,
    overlayOpacity: Number.isFinite(overlay) ? Math.min(100, Math.max(0, overlay)) : 35,
  };
};

export const LOGO_SIZE_DESKTOP: Record<LogoSize, string> = {
  small: 'max-w-[200px] md:max-w-[280px] lg:max-w-[340px] max-h-[70px] md:max-h-[90px] lg:max-h-[120px]',
  medium: 'max-w-[280px] md:max-w-[400px] lg:max-w-[500px] max-h-[100px] md:max-h-[140px] lg:max-h-[180px]',
  large: 'max-w-[320px] md:max-w-[480px] lg:max-w-[620px] max-h-[120px] md:max-h-[180px] lg:max-h-[230px]',
  xlarge: 'max-w-[360px] md:max-w-[560px] lg:max-w-[760px] max-h-[140px] md:max-h-[220px] lg:max-h-[280px]',
};

export const LOGO_SIZE_MOBILE: Record<LogoSize, string> = {
  small: 'max-w-[65%] max-h-[70px]',
  medium: 'max-w-[85%] max-h-[100px]',
  large: 'max-w-[90%] max-h-[130px]',
  xlarge: 'max-w-[95%] max-h-[160px]',
};
