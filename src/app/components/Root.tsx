import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { applyPageMeta } from '../seo/applyMeta';
import { canonicalUrlForPath, metaForRootPath } from '../seo/pageMeta';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

export function Root() {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const meta = metaForRootPath(pathname, language);
    applyPageMeta({
      title: meta.title,
      description: meta.description,
      canonicalHref: canonicalUrlForPath(pathname),
    });
  }, [pathname, language]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}