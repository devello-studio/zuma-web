import { Mail, MapPin, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function Contacto() {
  const { t } = useLanguage();
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    empresa: '',
    telefono: '',
    servicio: '',
    mensaje: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!turnstileSiteKey) return;

    const initializeTurnstile = () => {
      const turnstile = (window as any).turnstile;
      if (!turnstile || !turnstileContainerRef.current || turnstileWidgetIdRef.current) return;

      turnstileWidgetIdRef.current = turnstile.render(turnstileContainerRef.current, {
        sitekey: turnstileSiteKey,
        theme: 'auto',
        callback: (token: string) => {
          setTurnstileToken(token);
          setErrorMessage('');
        },
        'expired-callback': () => {
          setTurnstileToken('');
        },
        'error-callback': () => {
          setTurnstileToken('');
          setErrorMessage('Captcha validation failed. Please retry.');
        },
      });
    };

    if ((window as any).turnstile) {
      initializeTurnstile();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"]'
    );

    if (existingScript) {
      existingScript.addEventListener('load', initializeTurnstile, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.addEventListener('load', initializeTurnstile, { once: true });
    document.head.appendChild(script);
  }, [turnstileSiteKey]);

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      empresa: '',
      telefono: '',
      servicio: '',
      mensaje: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileSiteKey) {
      setErrorMessage('Form is unavailable right now. Please try again later.');
      return;
    }

    if (!turnstileToken) {
      setErrorMessage('Please complete the captcha before sending.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload?.ok) {
        const base = payload?.message || 'Could not submit form';
        const detail = payload?.code ? `${base} (${payload.code})` : base;
        throw new Error(detail);
      }

      setSubmitted(true);
      resetForm();
      setTurnstileToken('');
      setTimeout(() => setSubmitted(false), 4000);
      const turnstile = (window as any).turnstile;
      if (turnstile && turnstileWidgetIdRef.current) {
        turnstile.reset(turnstileWidgetIdRef.current);
      }
    } catch (error) {
      console.error(error);
      const fallback = 'We could not send your message. Please try again in a moment.';
      const msg = error instanceof Error ? error.message : '';
      setErrorMessage(
        msg && msg !== 'Could not submit form' ? msg : fallback,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-gray-50 dark:from-gray-900 dark:to-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6">
              {t('contact.hero.title')}
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              {t('contact.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl mb-6">{t('contact.info.title')}</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-1">{t('contact.info.location')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('contact.info.locationValue')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-1">{t('contact.info.email')}</h3>
                    <a
                      href="mailto:info@zumasolutions.io"
                      className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                    >
                      info@zumasolutions.io
                    </a>
                  </div>
                </div>
                {/* Phone — uncomment when we have a working number (re-add `Phone` to lucide-react imports above).
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-1">{t('contact.info.phone')}</h3>
                    <a
                      href="tel:+50612345678"
                      className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                    >
                      +506 1234 5678
                    </a>
                  </div>
                </div>
                */}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl">
              <h2 className="text-3xl mb-6">{t('contact.form.title')}</h2>
              {submitted ? (
                <div className="bg-green-100 dark:bg-green-950 border border-green-500 text-green-800 dark:text-green-200 px-6 py-4 rounded-lg">
                  <p className="font-semibold">{t('contact.form.success')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage ? (
                    <div className="bg-red-100 dark:bg-red-950 border border-red-500 text-red-800 dark:text-red-200 px-6 py-4 rounded-lg">
                      <p className="font-semibold">{errorMessage}</p>
                    </div>
                  ) : null}
                  <div>
                    <label htmlFor="nombre" className="block text-sm mb-2">
                      {t('contact.form.name')}
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      required
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder={t('contact.form.namePlaceholder')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-orange-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm mb-2">
                      {t('contact.form.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('contact.form.emailPlaceholder')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-orange-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="empresa" className="block text-sm mb-2">
                      {t('contact.form.company')}
                    </label>
                    <input
                      type="text"
                      id="empresa"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                      placeholder={t('contact.form.companyPlaceholder')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-orange-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="servicio" className="block text-sm mb-2">
                      {t('contact.form.service')}
                    </label>
                    <select
                      id="servicio"
                      name="servicio"
                      value={formData.servicio}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-orange-600"
                    >
                      <option value="">{t('contact.form.servicePlaceholder')}</option>
                      <option value="odoo">{t('contact.form.services.odoo')}</option>
                      <option value="financial">{t('contact.form.services.financial')}</option>
                      <option value="ai">{t('contact.form.services.ai')}</option>
                      <option value="mentoring">{t('contact.form.services.mentoring')}</option>
                      <option value="other">{t('contact.form.services.other')}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="mensaje" className="block text-sm mb-2">
                      {t('contact.form.message')}
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows={5}
                      value={formData.mensaje}
                      onChange={handleChange}
                      placeholder={t('contact.form.messagePlaceholder')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-orange-600"
                    />
                  </div>
                  <div>
                    {turnstileSiteKey ? (
                      <div ref={turnstileContainerRef} />
                    ) : (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Captcha is not configured.
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={submitting || !turnstileToken}
                    className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>{submitting ? 'Sending...' : t('contact.form.submit')}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}