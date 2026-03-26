import { Link, useLocation } from 'react-router';
import { Menu, X, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { LogoLight, LogoMarkLight } from './LogoLight';
import { LogoDark, LogoMarkDark } from './LogoDark';
import { useLanguage } from '../contexts/LanguageContext';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { resolvedTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.services'), path: '/servicios' },
    { name: t('nav.about'), path: '/nosotros' },
    { name: t('nav.contact'), path: '/contacto' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es_CR' ? 'en_US' : 'es_CR');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            {mounted && resolvedTheme === 'dark' ? (
              <>
                <LogoMarkDark className="h-8 w-auto shrink-0 md:hidden" />
                <LogoDark className="hidden h-10 w-auto shrink-0 md:block" />
              </>
            ) : (
              <>
                <LogoMarkLight className="h-8 w-auto shrink-0 md:hidden" />
                <LogoLight className="hidden h-10 w-auto shrink-0 md:block" />
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors ${
                  isActive(link.path)
                    ? 'text-orange-600 dark:text-orange-500'
                    : 'text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Language Toggle */}
            {mounted && (
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center space-x-1"
                aria-label="Toggle language"
                title={language === 'es_CR' ? 'Switch to English' : 'Cambiar a Español'}
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">{language === 'es_CR' ? 'EN' : 'ES'}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {mounted && (
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center space-x-1"
                aria-label="Toggle language"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-medium">{language === 'es_CR' ? 'EN' : 'ES'}</span>
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`transition-colors ${
                    isActive(link.path)
                      ? 'text-orange-600 dark:text-orange-500'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}