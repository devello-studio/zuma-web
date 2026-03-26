import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { LogoLight } from './LogoLight';
import { LogoDark } from './LogoDark';
import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div>
            {mounted && resolvedTheme === 'dark' ? (
              <LogoDark className="h-10 w-auto mb-4" />
            ) : (
              <LogoLight className="h-10 w-auto mb-4" />
            )}
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('footer.companyDesc')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 text-orange-600 dark:text-orange-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">{t('contact.info.locationValue')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="w-4 h-4 mt-1 text-orange-600 dark:text-orange-500 flex-shrink-0" />
                <a href="mailto:info@zumasolutions.com" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">
                  info@zumasolutions.com
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-4 h-4 mt-1 text-orange-600 dark:text-orange-500 flex-shrink-0" />
                <a href="tel:+50612345678" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">
                  +506 1234 5678
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Zuma Solutions. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}