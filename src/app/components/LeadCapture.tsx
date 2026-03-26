import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Users, 
  Target, 
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { LogoLight, LogoMarkLight } from './LogoLight';
import { LogoDark, LogoMarkDark } from './LogoDark';
import { useTheme } from 'next-themes';
import { useLanguage } from '../contexts/LanguageContext';

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  industria: string;
  empleados: string;
  currentErp: string;
  erpName: string;
  serviciosInteres: string[];
  timeline: string;
  presupuesto: string;
  notas: string;
}

export function LeadCapture() {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    industria: '',
    empleados: '',
    currentErp: '',
    erpName: '',
    serviciosInteres: [],
    timeline: '',
    presupuesto: '',
    notas: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  /**
   * Turnstile must mount after the step-3 container exists. A single init call often ran while
   * `turnstileContainerRef` was still null (AnimatePresence / motion), so nothing rendered.
   * Also: if the api.js tag exists but `load` already fired, listening for `load` never runs init.
   */
  useLayoutEffect(() => {
    if (currentStep !== 3 || !turnstileSiteKey) return;

    let cancelled = false;
    let rafId = 0;
    let pollId = 0;

    const renderWidget = (): boolean => {
      if (cancelled) return true;
      const turnstile = (window as any).turnstile;
      const el = turnstileContainerRef.current;
      if (!turnstile || !el || !el.isConnected) return false;
      if (turnstileWidgetIdRef.current) return true;
      try {
        turnstileWidgetIdRef.current = turnstile.render(el, {
          sitekey: turnstileSiteKey,
          theme: 'auto',
          callback: (token: string) => {
            setTurnstileToken(token);
            setSubmitError('');
          },
          'expired-callback': () => setTurnstileToken(''),
          'error-callback': () => {
            setTurnstileToken('');
            setSubmitError(t('leadCapture.errors.captchaFailed'));
          },
        });
        return true;
      } catch {
        return false;
      }
    };

    const scheduleUntilRendered = () => {
      let frames = 0;
      const maxFrames = 120;
      const tick = () => {
        if (cancelled) return;
        if (renderWidget()) return;
        frames += 1;
        if (frames >= maxFrames) return;
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    };

    const onApiReady = () => {
      if (pollId) {
        window.clearInterval(pollId);
        pollId = 0;
      }
      if (cancelled) return;
      scheduleUntilRendered();
    };

    if ((window as any).turnstile) {
      onApiReady();
    } else {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"]'
      );
      if (existingScript) {
        existingScript.addEventListener('load', onApiReady, { once: true });
        pollId = window.setInterval(() => {
          if ((window as any).turnstile) {
            window.clearInterval(pollId);
            pollId = 0;
            onApiReady();
          }
        }, 50);
        window.setTimeout(() => {
          if (pollId) {
            window.clearInterval(pollId);
            pollId = 0;
          }
        }, 15000);
      } else {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.addEventListener('load', onApiReady, { once: true });
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (pollId) window.clearInterval(pollId);
      const turnstile = (window as any).turnstile;
      const id = turnstileWidgetIdRef.current;
      if (turnstile && id) {
        try {
          turnstile.remove(id);
        } catch {
          /* ignore */
        }
      }
      turnstileWidgetIdRef.current = null;
      setTurnstileToken('');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `t` changes identity each render; only re-init when step/siteKey changes
  }, [currentStep, turnstileSiteKey]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.nombre.trim()) newErrors.nombre = 'Required';
      if (!formData.email.trim()) newErrors.email = 'Required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
      if (!formData.empresa.trim()) newErrors.empresa = 'Required';
    }

    if (step === 2) {
      if (!formData.industria) newErrors.industria = 'Required';
      if (!formData.empleados) newErrors.empleados = 'Required';
    }

    if (step === 3) {
      if (formData.serviciosInteres.length === 0) {
        newErrors.serviciosInteres = 'Select at least one service';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    if (currentStep === 3) {
      const turnstile = (window as any).turnstile;
      const id = turnstileWidgetIdRef.current;
      if (turnstile && id) {
        try {
          turnstile.remove(id);
        } catch {
          /* ignore */
        }
      }
      turnstileWidgetIdRef.current = null;
      setTurnstileToken('');
    }
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  const readTurnstileToken = async () => {
    // Turnstile can show a green check before the token is available to JS callbacks.
    // Retry briefly when the user presses submit.
    const turnstile = (window as any).turnstile;
    const id = turnstileWidgetIdRef.current;
    if (!turnstile || !id || typeof turnstile.getResponse !== 'function') return '';

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const token = turnstile.getResponse(id);
        if (token) return token;
      } catch {
        // ignore
      }
      await sleep(300);
    }

    return '';
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    if (!turnstileSiteKey) {
      setSubmitError(t('leadCapture.errors.captchaUnavailable'));
      return;
    }

    // In some cases the Turnstile callback may be delayed; read the token directly.
    let tokenToSend = turnstileToken;
    if (!tokenToSend) {
      tokenToSend = await readTurnstileToken();
      if (tokenToSend) setTurnstileToken(tokenToSend);
    }

    if (!tokenToSend) {
      setSubmitError(t('leadCapture.errors.captchaRequired'));
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: 'consulta-gratuita',
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          empresa: formData.empresa,
          industria: formData.industria,
          empleados: formData.empleados,
          currentErp: formData.currentErp,
          erpName: formData.erpName,
          serviciosInteres: formData.serviciosInteres,
          timeline: formData.timeline,
          presupuesto: formData.presupuesto,
          notas: formData.notas,
          turnstileToken: tokenToSend,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload?.ok) {
        const base = payload?.message || 'Could not submit form';
        const detail = payload?.code ? `${base} (${payload.code})` : base;
        throw new Error(detail);
      }

      sessionStorage.setItem('leadFormData', JSON.stringify(formData));
      navigate('/gracias');
    } catch (error) {
      console.error(error);
      const fallback = t('leadCapture.errors.submitFailed');
      const msg = error instanceof Error ? error.message : '';
      setSubmitError(msg && msg !== 'Could not submit form' ? msg : fallback);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleService = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      serviciosInteres: prev.serviciosInteres.includes(value)
        ? prev.serviciosInteres.filter((v) => v !== value)
        : [...prev.serviciosInteres, value],
    }));
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {resolvedTheme === 'dark' ? (
            <>
              <LogoMarkDark className="h-8 w-auto md:hidden" />
              <LogoDark className="hidden h-10 w-auto md:block" />
            </>
          ) : (
            <>
              <LogoMarkLight className="h-8 w-auto md:hidden" />
              <LogoLight className="hidden h-10 w-auto md:block" />
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-4">{t('leadCapture.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">{t('leadCapture.subtitle')}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {String(t('leadCapture.stepProgress'))
                .replace('{n}', String(currentStep))
                .replace('{m}', String(totalSteps))}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-orange-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Contact Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950 rounded-lg flex items-center justify-center mr-4">
                    <Building2 className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl">{t('leadCapture.step1.title')}</h2>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm mb-2">{t('leadCapture.step1.name')}</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.nombre ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-orange-600`}
                    />
                    {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm mb-2">{t('leadCapture.step1.email')}</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                        } bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-orange-600`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm mb-2">{t('leadCapture.step1.phone')}</label>
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-orange-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">{t('leadCapture.step1.company')}</label>
                    <input
                      type="text"
                      value={formData.empresa}
                      onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.empresa ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-orange-600`}
                    />
                    {errors.empresa && <p className="text-red-500 text-sm mt-1">{errors.empresa}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: About Business */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl">{t('leadCapture.step2.title')}</h2>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm mb-2">{t('leadCapture.step2.industry')}</label>
                    <select
                      value={formData.industria}
                      onChange={(e) => setFormData({ ...formData, industria: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.industria ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-orange-600`}
                    >
                      <option value="">{t('leadCapture.step2.industryPlaceholder')}</option>
                      <option value="retail">{t('leadCapture.step2.industries.retail')}</option>
                      <option value="manufacturing">{t('leadCapture.step2.industries.manufacturing')}</option>
                      <option value="services">{t('leadCapture.step2.industries.services')}</option>
                      <option value="healthcare">{t('leadCapture.step2.industries.healthcare')}</option>
                      <option value="technology">{t('leadCapture.step2.industries.technology')}</option>
                      <option value="other">{t('leadCapture.step2.industries.other')}</option>
                    </select>
                    {errors.industria && <p className="text-red-500 text-sm mt-1">{errors.industria}</p>}
                  </div>

                  <div>
                    <label className="block text-sm mb-2">{t('leadCapture.step2.employees')}</label>
                    <select
                      value={formData.empleados}
                      onChange={(e) => setFormData({ ...formData, empleados: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.empleados ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-orange-600`}
                    >
                      <option value="">{t('leadCapture.step2.employeesPlaceholder')}</option>
                      <option value="1-10">{t('leadCapture.step2.employeeSizes.small')}</option>
                      <option value="11-50">{t('leadCapture.step2.employeeSizes.medium')}</option>
                      <option value="51-200">{t('leadCapture.step2.employeeSizes.large')}</option>
                      <option value="200+">{t('leadCapture.step2.employeeSizes.enterprise')}</option>
                    </select>
                    {errors.empleados && <p className="text-red-500 text-sm mt-1">{errors.empleados}</p>}
                  </div>

                  <div>
                    <label className="block text-sm mb-2">{t('leadCapture.step2.currentErp')}</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="currentErp"
                          value="yes"
                          checked={formData.currentErp === 'yes'}
                          onChange={(e) => setFormData({ ...formData, currentErp: e.target.value })}
                          className="text-orange-600 focus:ring-orange-600"
                        />
                        <span>{t('leadCapture.step2.currentErpYes')}</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="currentErp"
                          value="no"
                          checked={formData.currentErp === 'no'}
                          onChange={(e) => setFormData({ ...formData, currentErp: e.target.value, erpName: '' })}
                          className="text-orange-600 focus:ring-orange-600"
                        />
                        <span>{t('leadCapture.step2.currentErpNo')}</span>
                      </label>
                    </div>
                  </div>

                  {formData.currentErp === 'yes' && (
                    <div>
                      <label className="block text-sm mb-2">{t('leadCapture.step2.erpName')}</label>
                      <input
                        type="text"
                        value={formData.erpName}
                        onChange={(e) => setFormData({ ...formData, erpName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-orange-600"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Services and Needs */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950 rounded-lg flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl">{t('leadCapture.step3.title')}</h2>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm mb-3">{t('leadCapture.step3.services')}</label>
                    <div className="space-y-3">
                      {[
                        { value: 'odoo', label: t('leadCapture.step3.odoo') },
                        { value: 'financial', label: t('leadCapture.step3.financial') },
                        { value: 'ai', label: t('leadCapture.step3.ai') },
                        { value: 'mentoring', label: t('leadCapture.step3.mentoring') },
                      ].map((servicio) => (
                        <button
                          key={servicio.value}
                          type="button"
                          onClick={() => toggleService(servicio.value)}
                          className={`w-full px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                            formData.serviciosInteres.includes(servicio.value)
                              ? 'border-orange-600 bg-orange-50 dark:bg-orange-950'
                              : 'border-gray-300 dark:border-gray-700 hover:border-orange-400'
                          }`}
                        >
                          <span>{servicio.label}</span>
                          {formData.serviciosInteres.includes(servicio.value) && (
                            <CheckCircle2 className="w-5 h-5 text-orange-600" />
                          )}
                        </button>
                      ))}
                    </div>
                    {errors.serviciosInteres && <p className="text-red-500 text-sm mt-1">{errors.serviciosInteres}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm mb-2">{t('leadCapture.step3.timeline')}</label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-orange-600"
                      >
                        <option value="">{t('leadCapture.step3.timelinePlaceholder')}</option>
                        <option value="immediate">{t('leadCapture.step3.timelines.immediate')}</option>
                        <option value="short">{t('leadCapture.step3.timelines.short')}</option>
                        <option value="medium">{t('leadCapture.step3.timelines.medium')}</option>
                        <option value="long">{t('leadCapture.step3.timelines.long')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">{t('leadCapture.step3.budget')}</label>
                      <select
                        value={formData.presupuesto}
                        onChange={(e) => setFormData({ ...formData, presupuesto: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-orange-600"
                      >
                        <option value="">{t('leadCapture.step3.budgetPlaceholder')}</option>
                        <option value="small">{t('leadCapture.step3.budgets.small')}</option>
                        <option value="medium">{t('leadCapture.step3.budgets.medium')}</option>
                        <option value="large">{t('leadCapture.step3.budgets.large')}</option>
                        <option value="enterprise">{t('leadCapture.step3.budgets.enterprise')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">{t('leadCapture.step3.notes')}</label>
                    <textarea
                      value={formData.notas}
                      onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                      rows={4}
                      placeholder={t('leadCapture.step3.notesPlaceholder')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-orange-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">{t('leadCapture.step3.captcha')}</label>
                    {turnstileSiteKey ? (
                      <div ref={turnstileContainerRef} className="min-h-[70px]" />
                    ) : (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {t('leadCapture.errors.captchaUnavailable')}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {submitError && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-6">{submitError}</p>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleBack}
              disabled={currentStep === 1 || submitting}
              className="inline-flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('leadCapture.buttons.back')}
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {t('leadCapture.buttons.next')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !turnstileSiteKey}
                className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? t('leadCapture.buttons.submitting') : t('leadCapture.buttons.submit')}
                <CheckCircle2 className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
