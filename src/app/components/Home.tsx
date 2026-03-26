import { Link } from 'react-router';
import { ArrowRight, Code, TrendingUp, Brain, Shield } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { useLanguage } from '../contexts/LanguageContext';

export function Home() {
  const { t } = useLanguage();
  
  const services = [
    {
      icon: Code,
      title: t('home.services.odoo.title'),
      description: t('home.services.odoo.description'),
    },
    {
      icon: TrendingUp,
      title: t('home.services.financial.title'),
      description: t('home.services.financial.description'),
    },
    {
      icon: Brain,
      title: t('home.services.ai.title'),
      description: t('home.services.ai.description'),
    },
    {
      icon: Shield,
      title: t('home.services.mentoring.title'),
      description: t('home.services.mentoring.description'),
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-gray-50 dark:from-gray-900 dark:to-gray-950 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,140,0,0.3),transparent_50%)]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl mb-6">
                {t('home.hero.title')}{' '}
                <span className="text-orange-600 dark:text-orange-500">{t('home.hero.titleHighlight')}</span>
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/servicios"
                  className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  {t('home.hero.servicesBtn')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/contacto"
                  className="inline-flex items-center px-6 py-3 border-2 border-orange-600 text-orange-600 dark:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {t('home.hero.contactBtn')}
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758518729908-d4220a678d81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbnN1bHRpbmclMjB0ZWFtJTIwbWVldGluZ3xlbnwxfHx8fDE3NzMxOTgwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Business consulting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4">{t('home.services.heading')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('home.services.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
                    <Icon className="w-6 h-6 text-orange-600 dark:text-orange-500 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl mb-3">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/servicios"
              className="inline-flex items-center text-orange-600 dark:text-orange-500 hover:underline"
            >
              {t('home.services.viewAll')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl mb-6">
                {t('home.whyUs.heading')}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl mb-2">{t('home.whyUs.hub.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('home.whyUs.hub.description')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl mb-2">{t('home.whyUs.localization.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('home.whyUs.localization.description')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl mb-2">{t('home.whyUs.aiDisruption.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('home.whyUs.aiDisruption.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzMyMzIzNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Artificial Intelligence"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6">
            {t('home.cta.heading')}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {t('home.cta.subtitle')}
          </p>
          <Link
            to="/contacto"
            className="inline-flex items-center px-8 py-4 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {t('home.cta.button')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}