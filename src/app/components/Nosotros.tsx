import { Target, Eye, Heart, Globe, Award, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../contexts/LanguageContext';

export function Nosotros() {
  const { t } = useLanguage();
  
  const values = [
    {
      icon: Award,
      title: t('about.values.excellence.title'),
      description: t('about.values.excellence.description'),
    },
    {
      icon: Heart,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description'),
    },
    {
      icon: Users,
      title: t('about.values.collaboration.title'),
      description: t('about.values.collaboration.description'),
    },
    {
      icon: Eye,
      title: t('about.values.integrity.title'),
      description: t('about.values.integrity.description'),
    },
  ];

  const roadmap = [
    {
      phase: 'Fase I',
      title: t('about.roadmap.phase1.title'),
      markets: t('about.roadmap.phase1.markets'),
      description: t('about.roadmap.phase1.description'),
    },
    {
      phase: 'Fase II',
      title: t('about.roadmap.phase2.title'),
      markets: t('about.roadmap.phase2.markets'),
      description: t('about.roadmap.phase2.description'),
    },
    {
      phase: 'Fase III',
      title: t('about.roadmap.phase3.title'),
      markets: t('about.roadmap.phase3.markets'),
      description: t('about.roadmap.phase3.description'),
    },
    {
      phase: 'Fase IV',
      title: t('about.roadmap.phase4.title'),
      markets: t('about.roadmap.phase4.markets'),
      description: t('about.roadmap.phase4.description'),
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-gray-50 dark:from-gray-900 dark:to-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6">
              {t('about.hero.title')}{' '}
              <span className="text-orange-600 dark:text-orange-500">{t('about.hero.titleHighlight')}</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              {t('about.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-orange-50 to-transparent dark:from-gray-900 dark:to-transparent p-8 rounded-2xl border border-orange-200 dark:border-orange-900">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl mb-4">{t('about.mission.title')}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('about.mission.text')}
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-transparent dark:from-gray-900 dark:to-transparent p-8 rounded-2xl border border-orange-200 dark:border-orange-900">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl mb-4">{t('about.vision.title')}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('about.vision.text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4">{t('about.values.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('about.team.description')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-950 p-6 rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                  </div>
                  <h3 className="text-xl mb-3">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Internationalization Roadmap */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Globe className="w-12 h-12 text-orange-600 dark:text-orange-500 mx-auto mb-4" />
            <h2 className="text-3xl lg:text-4xl mb-4">{t('about.roadmap.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('about.roadmap.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roadmap.map((phase, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 relative"
              >
                <div className="absolute -top-4 left-8 px-4 py-1 bg-orange-600 text-white text-sm rounded-full">
                  {phase.phase}
                </div>
                <h3 className="text-2xl mt-4 mb-2">{phase.title}</h3>
                <p className="text-orange-600 dark:text-orange-500 mb-4 font-medium">{phase.markets}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}