import { ui, type Lang } from './ui';

export function getLang(locale: string | undefined): Lang {
  if (locale === 'es' || locale === 'ca') return locale;
  return 'en';
}

export function useTranslations(locale: string | undefined) {
  return ui[getLang(locale)];
}
