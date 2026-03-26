import { Link } from 'react-router';
import { CheckCircle2, Download, ArrowLeft, Clock, Mail, FileCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { LogoLight } from './LogoLight';
import { LogoDark } from './LogoDark';
import { useTheme } from 'next-themes';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';

export function ThankYou() {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    // Retrieve form data from sessionStorage
    const data = sessionStorage.getItem('leadFormData');
    if (data) {
      setFormData(JSON.parse(data));
    }
  }, []);

  const handleDownload = () => {
    // In a real application, this would trigger a PDF download
    console.log('Downloading PDF...');
    alert(t('thankYou.downloadBtn'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {resolvedTheme === 'dark' ? (
            <LogoDark className="h-10 w-auto" />
          ) : (
            <LogoLight className="h-10 w-auto" />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-12"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
          </motion.div>

          {/* Thank You Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl mb-4">{t('thankYou.title')}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('thankYou.subtitle')}
            </p>
          </div>

          {/* Confirmation Details */}
          {formData && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
              <h2 className="text-xl mb-4">{t('thankYou.confirmation')}</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">{t('thankYou.name')}:</dt>
                  <dd className="font-medium">{formData.nombre}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">{t('thankYou.email')}:</dt>
                  <dd className="font-medium">{formData.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">{t('thankYou.company')}:</dt>
                  <dd className="font-medium">{formData.empresa}</dd>
                </div>
                {formData.serviciosInteres && formData.serviciosInteres.length > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">{t('thankYou.services')}:</dt>
                    <dd className="font-medium">{formData.serviciosInteres.join(', ')}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-6 mb-8">
            <h2 className="text-xl mb-4">{t('thankYou.nextSteps')}</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t('thankYou.step1.title')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('thankYou.step1.description')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t('thankYou.step2.title')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('thankYou.step2.description')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t('thankYou.step3.title')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('thankYou.step3.description')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Download CTA */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center mb-8">
            <h3 className="text-xl mb-2">{t('thankYou.downloadCta')}</h3>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-lg mt-4"
            >
              <Download className="w-5 h-5 mr-2" />
              {t('thankYou.downloadBtn')}
            </button>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center text-orange-600 dark:text-orange-500 hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('thankYou.backHome')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}