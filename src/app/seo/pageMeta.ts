import type { Language } from '../contexts/LanguageContext';
import { SITE_ORIGIN } from './site';

export const ROOT_PAGE_META: Record<
  string,
  { es_CR: { title: string; description: string }; en_US: { title: string; description: string } }
> = {
  '/': {
    es_CR: {
      title: 'Zuma Solutions | Odoo, IA y consultoría financiera',
      description:
        'Soluciones empresariales integrales: Odoo, inteligencia artificial aplicada y asesoría financiera de alto nivel.',
    },
    en_US: {
      title: 'Zuma Solutions | Odoo, AI & financial consulting',
      description:
        'Business solutions combining Odoo, applied artificial intelligence, and high-level financial advisory.',
    },
  },
  '/servicios': {
    es_CR: {
      title: 'Servicios | Zuma Solutions',
      description:
        'Odoo, consultoría financiera, IA aplicada y mentoría a partners. Soluciones integrales para tu negocio.',
    },
    en_US: {
      title: 'Services | Zuma Solutions',
      description:
        'Odoo, financial consulting, applied AI, and partner mentoring. Comprehensive solutions for your business.',
    },
  },
  '/nosotros': {
    es_CR: {
      title: 'Nosotros | Zuma Solutions',
      description: 'Hub de especialización técnica en Odoo, finanzas e IA aplicada.',
    },
    en_US: {
      title: 'About us | Zuma Solutions',
      description: 'A technical specialization hub for Odoo, finance, and applied AI.',
    },
  },
  '/contacto': {
    es_CR: {
      title: 'Contacto | Zuma Solutions',
      description: 'Escríbenos para transformar tu negocio con Odoo, IA y consultoría financiera.',
    },
    en_US: {
      title: 'Contact | Zuma Solutions',
      description: 'Reach out to transform your business with Odoo, AI, and financial consulting.',
    },
  },
};

export function normalizePathname(pathname: string): string {
  const p = pathname.replace(/\/$/, '') || '/';
  return p;
}

export function canonicalUrlForPath(pathname: string): string {
  const path = normalizePathname(pathname);
  if (path === '/') return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path}`;
}

export function metaForRootPath(pathname: string, language: Language) {
  const path = normalizePathname(pathname);
  const page = ROOT_PAGE_META[path];
  if (page) return page[language];
  return language === 'en_US'
    ? {
        title: 'Page not found | Zuma Solutions',
        description: 'The page you are looking for does not exist.',
      }
    : {
        title: 'Página no encontrada | Zuma Solutions',
        description: 'La página que buscas no existe.',
      };
}
