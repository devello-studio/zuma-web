import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en_US' | 'es_CR';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'language';

function isLanguage(value: string | null): value is Language {
  return value === 'en_US' || value === 'es_CR';
}

function languageFromBrowser(): Language {
  if (typeof window === 'undefined') return 'es_CR';
  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const raw of candidates) {
    const tag = raw.toLowerCase();
    if (tag.startsWith('es')) return 'es_CR';
    if (tag.startsWith('en')) return 'en_US';
  }
  return 'es_CR';
}

function readInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'es_CR';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLanguage(saved)) return saved;
  } catch {
    /* ignore */
  }
  return languageFromBrowser();
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore quota / private mode */
    }
  };

  const t = (key: string): any => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    // Return the value as-is (can be string, array, object, etc.)
    return value !== undefined ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

const translations: Record<Language, any> = {
  es_CR: {
    nav: {
      home: 'Inicio',
      services: 'Servicios',
      about: 'Nosotros',
      contact: 'Contacto',
    },
    home: {
      hero: {
        title: 'Transformamos Empresas con',
        titleHighlight: 'lo Mejor de la Tecnología',
        subtitle: 'Soluciones empresariales integrales que fusionan la potencia de Odoo con inteligencia artificial y asesoría financiera de alto nivel.',
        servicesBtn: 'Nuestros Servicios',
        contactBtn: 'Contáctanos',
      },
      services: {
        heading: 'Nuestros Servicios',
        subtitle: 'Ofrecemos soluciones completas para impulsar el crecimiento y eficiencia de tu organización',
        viewAll: 'Ver todos los servicios',
        odoo: {
          title: 'Implementación Odoo',
          description: 'Implementaciones estandarizadas con enfoque en gobierno de datos, facturación electrónica y control gerencial.',
        },
        financial: {
          title: 'Consultoría Financiera',
          description: 'Asesoría contable y fiscal de alto alcance con KPIs y estados financieros estratégicos.',
        },
        ai: {
          title: 'Soluciones de IA',
          description: 'Integración de inteligencia artificial aplicada para transformar tu ERP en un sistema predictivo y proactivo.',
        },
        mentoring: {
          title: 'Mentoría a Partners',
          description: 'Servicios de formación avanzada y soporte técnico especializado para Partners de Odoo.',
        },
      },
      whyUs: {
        heading: '¿Por Qué Elegir Zuma Solutions?',
        hub: {
          title: 'Hub de Especialización',
          description: 'No solo implementamos, sino que elevamos el estándar técnico del ecosistema Odoo.',
        },
        localization: {
          title: 'Localización y Cumplimiento',
          description: 'Garantizamos adaptación impecable a la facturación electrónica y normativas contables de la región.',
        },
        aiDisruption: {
          title: 'Disrupción mediante IA',
          description: 'Integramos agentes inteligentes dentro del flujo operativo de Odoo para un sistema de gestión predictivo.',
        },
      },
      cta: {
        heading: '¿Listo para Transformar tu Empresa?',
        subtitle: 'Contáctanos hoy y descubre cómo podemos ayudarte a alcanzar tus objetivos empresariales.',
        button: 'Solicitar Consulta',
      },
    },
    services: {
      hero: {
        title: 'Servicios de',
        titleHighlight: 'Excelencia',
        subtitle: 'Ofrecemos soluciones empresariales integrales que fusionan la potencia del ecosistema Odoo con la vanguardia de la Inteligencia Artificial y asesoría contable de alto alcance.',
      },
      odoo: {
        title: 'Implementación y Desarrollo Odoo',
        description: 'Implementaciones estandarizadas para clientes finales con metodología ágil Quickstart.',
        features: [
          'Análisis de procesos as-is / to-be',
          'Configuración de módulos Core (Ventas, CRM, Inventario, Compras)',
          'Integración de facturación electrónica (Costa Rica, Guatemala, México)',
          'Capacitación y documentación completa',
          'Soporte post-implementación con SLAs definidos',
        ],
      },
      financial: {
        title: 'Consultoría Financiera y Contable',
        description: 'Asesoría contable y fiscal de alto alcance con estrategia financiera integrada.',
        features: [
          'Diseño de plan de cuentas y políticas contables',
          'Configuración de centros de costo y reportes gerenciales',
          'Tableros de KPIs financieros en tiempo real',
          'Cierre fiscal y cumplimiento normativo',
          'Análisis financiero estratégico',
        ],
      },
      ai: {
        title: 'Soluciones Basadas en IA',
        description: 'Integración de inteligencia artificial para transformar tu ERP en un sistema predictivo.',
        features: [
          'IA Predictiva para inventarios y flujo de caja',
          'OCR Avanzado para automatización de documentos',
          'Agentes Inteligentes para atención al cliente',
          'Análisis de datos con Machine Learning',
          'Integración de modelos LLM personalizados',
        ],
      },
      mentoring: {
        title: 'Mentoría a Partners Odoo',
        description: 'Modelo "Seniority as a Service" para elevar el estándar técnico del ecosistema.',
        features: [
          'Formación avanzada en metodología Quickstart',
          'Apoyo en pre-ventas y arquitectura técnica',
          'Alquiler de localizaciones bajo marca blanca',
          'Soporte técnico L3 especializado',
          'Acuerdos claros de no competencia',
        ],
      },
      cta: {
        heading: '¿Interesado en Nuestros Servicios?',
        subtitle: 'Contáctanos para una consulta personalizada y descubre cómo podemos ayudarte.',
        button: 'Solicitar Información',
      },
    },
    about: {
      hero: {
        title: 'Sobre',
        titleHighlight: 'Nosotros',
        subtitle: 'Somos un hub de especialización técnica que fusiona consultoría Odoo, asesoría financiera y soluciones de IA aplicada.',
      },
      mission: {
        title: 'Nuestra Misión',
        text: 'Ser el hub técnico de referencia en LATAM que combina excelencia en implementaciones Odoo, asesoría fiscal estratégica y disrupción mediante IA, ayudando a empresas y partners a maximizar el valor de su inversión tecnológica.',
      },
      vision: {
        title: 'Nuestra Visión',
        text: 'Para 2027, ser el aliado estratégico número uno para Partners Odoo en Centroamérica y México, reconocidos por elevar el estándar de calidad del ecosistema y por transformar ERPs tradicionales en plataformas inteligentes de toma de decisiones.',
      },
      values: {
        title: 'Nuestros Valores',
        excellence: {
          title: 'Excelencia Técnica',
          description: 'Cada proyecto es ejecutado con los más altos estándares de calidad.',
        },
        innovation: {
          title: 'Innovación Continua',
          description: 'Nos mantenemos a la vanguardia en tecnología y mejores prácticas.',
        },
        collaboration: {
          title: 'Colaboración',
          description: 'Trabajamos en equipo con nuestros clientes y partners para lograr objetivos comunes.',
        },
        integrity: {
          title: 'Integridad',
          description: 'Actuamos con transparencia y ética en todas nuestras relaciones comerciales.',
        },
      },
      roadmap: {
        title: 'Roadmap de Internacionalización',
        subtitle: 'Plan estratégico de expansión regional',
        phase1: {
          title: 'Validación Comercial',
          markets: 'Costa Rica',
          description: 'Cliente ancla firmado, primeras implementaciones exitosas y equipo core consolidado.',
        },
        phase2: {
          title: 'Consolidación',
          markets: 'Costa Rica & Guatemala',
          description: 'Liderazgo en localización contable y servicios de Staff Augmentation para partners locales.',
        },
        phase3: {
          title: 'Expansión Regional',
          markets: 'Chile, Colombia, México',
          description: 'Penetración estratégica con alianzas con implementadores locales y certificación en módulos avanzados.',
        },
        phase4: {
          title: 'Consolidación como Hub',
          markets: 'América Central & México',
          description: 'Posicionamiento como centro de excelencia técnica regional con certificación Odoo Gold Partner.',
        },
      },
      team: {
        title: 'Nuestro Equipo',
        description: 'Profesionales altamente calificados con amplia experiencia en tecnología, finanzas e inteligencia artificial.',
      },
    },
    contact: {
      hero: {
        title: 'Contacto',
        subtitle: 'Estamos aquí para ayudarte a transformar tu negocio. Contáctanos y descubre cómo podemos colaborar.',
      },
      info: {
        title: 'Información de Contacto',
        email: 'Correo Electrónico',
        phone: 'Teléfono',
        location: 'Ubicación',
        locationValue: 'San José, Costa Rica',
      },
      form: {
        title: 'Envíanos un Mensaje',
        name: 'Nombre Completo',
        namePlaceholder: 'Tu nombre',
        email: 'Correo Electrónico',
        emailPlaceholder: 'tu@email.com',
        company: 'Empresa',
        companyPlaceholder: 'Nombre de tu empresa',
        service: 'Servicio de Interés',
        servicePlaceholder: 'Selecciona un servicio',
        services: {
          odoo: 'Implementación Odoo',
          financial: 'Consultoría Financiera',
          ai: 'Soluciones de IA',
          mentoring: 'Mentoría a Partners',
          other: 'Otro',
        },
        message: 'Mensaje',
        messagePlaceholder: 'Cuéntanos sobre tu proyecto o necesidad...',
        submit: 'Enviar Mensaje',
        sending: 'Enviando...',
        success: '¡Mensaje enviado exitosamente! Te contactaremos pronto.',
      },
    },
    footer: {
      company: 'Empresa',
      companyDesc: 'Hub de especialización técnica que fusiona consultoría Odoo, asesoría financiera y soluciones de IA aplicada.',
      quickLinks: 'Enlaces Rápidos',
      services: 'Servicios',
      contact: 'Contacto',
      legal: 'Legal',
      privacy: 'Privacidad',
      terms: 'Términos',
      rights: 'Todos los derechos reservados.',
    },
    leadCapture: {
      title: 'Consulta Gratuita',
      subtitle: 'Obtén una evaluación personalizada de tus necesidades empresariales',
      step1: {
        title: 'Información de Contacto',
        name: 'Nombre Completo',
        email: 'Correo Electrónico',
        phone: 'Teléfono',
        company: 'Empresa',
      },
      step2: {
        title: 'Sobre tu Negocio',
        industry: 'Industria',
        industryPlaceholder: 'Selecciona tu industria',
        industries: {
          retail: 'Comercio Minorista',
          manufacturing: 'Manufactura',
          services: 'Servicios',
          healthcare: 'Salud',
          technology: 'Tecnología',
          other: 'Otro',
        },
        employees: 'Número de Empleados',
        employeesPlaceholder: 'Selecciona el tamaño',
        employeeSizes: {
          small: '1-10 empleados',
          medium: '11-50 empleados',
          large: '51-200 empleados',
          enterprise: '200+ empleados',
        },
        currentErp: '¿Actualmente usas un ERP?',
        currentErpYes: 'Sí',
        currentErpNo: 'No',
        erpName: '¿Cuál ERP usas?',
      },
      step3: {
        title: 'Tus Necesidades',
        services: 'Servicios de Interés',
        odoo: 'Implementación Odoo',
        financial: 'Consultoría Financiera',
        ai: 'Soluciones de IA',
        mentoring: 'Mentoría a Partners',
        timeline: 'Timeline del Proyecto',
        timelinePlaceholder: 'Selecciona un timeline',
        timelines: {
          immediate: 'Inmediato (1-2 meses)',
          short: 'Corto plazo (3-6 meses)',
          medium: 'Mediano plazo (6-12 meses)',
          long: 'Largo plazo (12+ meses)',
        },
        budget: 'Presupuesto Estimado',
        budgetPlaceholder: 'Selecciona un rango',
        budgets: {
          small: 'Menos de $10,000',
          medium: '$10,000 - $50,000',
          large: '$50,000 - $100,000',
          enterprise: 'Más de $100,000',
        },
        notes: 'Notas Adicionales',
        notesPlaceholder: 'Cuéntanos más sobre tu proyecto...',
      },
      buttons: {
        next: 'Siguiente',
        back: 'Atrás',
        submit: 'Enviar Solicitud',
        submitting: 'Enviando...',
      },
    },
    thankYou: {
      title: '¡Gracias por tu Interés!',
      subtitle: 'Hemos recibido tu solicitud y nos pondremos en contacto contigo pronto.',
      confirmation: 'Detalles de Confirmación',
      name: 'Nombre',
      email: 'Email',
      company: 'Empresa',
      services: 'Servicios de Interés',
      nextSteps: 'Próximos Pasos',
      step1: {
        title: 'Revisión de Solicitud',
        description: 'Nuestro equipo revisará tu información y necesidades.',
      },
      step2: {
        title: 'Contacto Inicial',
        description: 'Te contactaremos en 24-48 horas para agendar una consulta.',
      },
      step3: {
        title: 'Consulta Personalizada',
        description: 'Discutiremos tu proyecto y cómo podemos ayudarte.',
      },
      downloadCta: 'Descarga Nuestro Portafolio',
      downloadBtn: 'Descargar PDF',
      backHome: 'Volver al Inicio',
    },
  },
  en_US: {
    nav: {
      home: 'Home',
      services: 'Services',
      about: 'About Us',
      contact: 'Contact',
    },
    home: {
      hero: {
        title: 'We Transform Businesses with',
        titleHighlight: 'the Best of Technology',
        subtitle: 'Comprehensive business solutions that merge the power of Odoo with artificial intelligence and high-level financial consulting.',
        servicesBtn: 'Our Services',
        contactBtn: 'Contact Us',
      },
      services: {
        heading: 'Our Services',
        subtitle: 'We offer complete solutions to drive your organization\'s growth and efficiency',
        viewAll: 'View all services',
        odoo: {
          title: 'Odoo Implementation',
          description: 'Standardized implementations focused on data governance, electronic invoicing, and management control.',
        },
        financial: {
          title: 'Financial Consulting',
          description: 'High-level accounting and tax advisory with KPIs and strategic financial statements.',
        },
        ai: {
          title: 'AI Solutions',
          description: 'Applied artificial intelligence integration to transform your ERP into a predictive and proactive system.',
        },
        mentoring: {
          title: 'Partner Mentoring',
          description: 'Advanced training services and specialized technical support for Odoo Partners.',
        },
      },
      whyUs: {
        heading: 'Why Choose Zuma Solutions?',
        hub: {
          title: 'Specialization Hub',
          description: 'We don\'t just implement, we elevate the technical standard of the Odoo ecosystem.',
        },
        localization: {
          title: 'Localization & Compliance',
          description: 'We guarantee impeccable adaptation to electronic invoicing and regional accounting regulations.',
        },
        aiDisruption: {
          title: 'AI-Driven Disruption',
          description: 'We integrate intelligent agents into Odoo\'s operational flow for a predictive management system.',
        },
      },
      cta: {
        heading: 'Ready to Transform Your Business?',
        subtitle: 'Contact us today and discover how we can help you achieve your business goals.',
        button: 'Request Consultation',
      },
    },
    services: {
      hero: {
        title: 'Services of',
        titleHighlight: 'Excellence',
        subtitle: 'We offer comprehensive business solutions that merge the power of the Odoo ecosystem with cutting-edge Artificial Intelligence and high-level accounting advisory.',
      },
      odoo: {
        title: 'Odoo Implementation & Development',
        description: 'Standardized implementations for end clients with agile Quickstart methodology.',
        features: [
          'As-is / to-be process analysis',
          'Core modules configuration (Sales, CRM, Inventory, Purchasing)',
          'Electronic invoicing integration (Costa Rica, Guatemala, Mexico)',
          'Complete training and documentation',
          'Post-implementation support with defined SLAs',
        ],
      },
      financial: {
        title: 'Financial & Accounting Consulting',
        description: 'High-level accounting and tax advisory with integrated financial strategy.',
        features: [
          'Chart of accounts and accounting policies design',
          'Cost center configuration and management reports',
          'Real-time financial KPI dashboards',
          'Tax closing and regulatory compliance',
          'Strategic financial analysis',
        ],
      },
      ai: {
        title: 'AI-Based Solutions',
        description: 'Artificial intelligence integration to transform your ERP into a predictive system.',
        features: [
          'Predictive AI for inventory and cash flow',
          'Advanced OCR for document automation',
          'Intelligent Agents for customer service',
          'Data analysis with Machine Learning',
          'Custom LLM model integration',
        ],
      },
      mentoring: {
        title: 'Odoo Partner Mentoring',
        description: '"Seniority as a Service" model to elevate the technical standard of the ecosystem.',
        features: [
          'Advanced training in Quickstart methodology',
          'Support in pre-sales and technical architecture',
          'White-label localization rental',
          'Specialized L3 technical support',
          'Clear non-compete agreements',
        ],
      },
      cta: {
        heading: 'Interested in Our Services?',
        subtitle: 'Contact us for a personalized consultation and discover how we can help you.',
        button: 'Request Information',
      },
    },
    about: {
      hero: {
        title: 'About',
        titleHighlight: 'Us',
        subtitle: 'We are a technical specialization hub that merges Odoo consulting, financial advisory, and applied AI solutions.',
      },
      mission: {
        title: 'Our Mission',
        text: 'To be the reference technical hub in LATAM that combines excellence in Odoo implementations, strategic tax advisory, and AI-driven disruption, helping companies and partners maximize the value of their technology investment.',
      },
      vision: {
        title: 'Our Vision',
        text: 'By 2027, to be the number one strategic ally for Odoo Partners in Central America and Mexico, recognized for elevating the ecosystem\'s quality standard and for transforming traditional ERPs into intelligent decision-making platforms.',
      },
      values: {
        title: 'Our Values',
        excellence: {
          title: 'Technical Excellence',
          description: 'Every project is executed with the highest quality standards.',
        },
        innovation: {
          title: 'Continuous Innovation',
          description: 'We stay at the forefront of technology and best practices.',
        },
        collaboration: {
          title: 'Collaboration',
          description: 'We work as a team with our clients and partners to achieve common goals.',
        },
        integrity: {
          title: 'Integrity',
          description: 'We act with transparency and ethics in all our business relationships.',
        },
      },
      roadmap: {
        title: 'Internationalization Roadmap',
        subtitle: 'Strategic regional expansion plan',
        phase1: {
          title: 'Commercial Validation',
          markets: 'Costa Rica',
          description: 'Anchor client signed, first successful implementations, and core team consolidated.',
        },
        phase2: {
          title: 'Consolidation',
          markets: 'Costa Rica & Guatemala',
          description: 'Leadership in accounting localization and Staff Augmentation services for local partners.',
        },
        phase3: {
          title: 'Regional Expansion',
          markets: 'Chile, Colombia, Mexico',
          description: 'Strategic penetration with alliances with local implementers and certification in advanced modules.',
        },
        phase4: {
          title: 'Hub Consolidation',
          markets: 'Central America & Mexico',
          description: 'Positioning as a regional technical excellence center with Odoo Gold Partner certification.',
        },
      },
      team: {
        title: 'Our Team',
        description: 'Highly qualified professionals with extensive experience in technology, finance, and artificial intelligence.',
      },
    },
    contact: {
      hero: {
        title: 'Contact',
        subtitle: 'We\'re here to help you transform your business. Contact us and discover how we can collaborate.',
      },
      info: {
        title: 'Contact Information',
        email: 'Email',
        phone: 'Phone',
        location: 'Location',
        locationValue: 'San José, Costa Rica',
      },
      form: {
        title: 'Send Us a Message',
        name: 'Full Name',
        namePlaceholder: 'Your name',
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        company: 'Company',
        companyPlaceholder: 'Your company name',
        service: 'Service of Interest',
        servicePlaceholder: 'Select a service',
        services: {
          odoo: 'Odoo Implementation',
          financial: 'Financial Consulting',
          ai: 'AI Solutions',
          mentoring: 'Partner Mentoring',
          other: 'Other',
        },
        message: 'Message',
        messagePlaceholder: 'Tell us about your project or need...',
        submit: 'Send Message',
        sending: 'Sending...',
        success: 'Message sent successfully! We\'ll contact you soon.',
      },
    },
    footer: {
      company: 'Company',
      companyDesc: 'Technical specialization hub that merges Odoo consulting, financial advisory, and applied AI solutions.',
      quickLinks: 'Quick Links',
      services: 'Services',
      contact: 'Contact',
      legal: 'Legal',
      privacy: 'Privacy',
      terms: 'Terms',
      rights: 'All rights reserved.',
    },
    leadCapture: {
      title: 'Free Consultation',
      subtitle: 'Get a personalized assessment of your business needs',
      step1: {
        title: 'Contact Information',
        name: 'Full Name',
        email: 'Email',
        phone: 'Phone',
        company: 'Company',
      },
      step2: {
        title: 'About Your Business',
        industry: 'Industry',
        industryPlaceholder: 'Select your industry',
        industries: {
          retail: 'Retail',
          manufacturing: 'Manufacturing',
          services: 'Services',
          healthcare: 'Healthcare',
          technology: 'Technology',
          other: 'Other',
        },
        employees: 'Number of Employees',
        employeesPlaceholder: 'Select size',
        employeeSizes: {
          small: '1-10 employees',
          medium: '11-50 employees',
          large: '51-200 employees',
          enterprise: '200+ employees',
        },
        currentErp: 'Currently using an ERP?',
        currentErpYes: 'Yes',
        currentErpNo: 'No',
        erpName: 'Which ERP do you use?',
      },
      step3: {
        title: 'Your Needs',
        services: 'Services of Interest',
        odoo: 'Odoo Implementation',
        financial: 'Financial Consulting',
        ai: 'AI Solutions',
        mentoring: 'Partner Mentoring',
        timeline: 'Project Timeline',
        timelinePlaceholder: 'Select a timeline',
        timelines: {
          immediate: 'Immediate (1-2 months)',
          short: 'Short term (3-6 months)',
          medium: 'Medium term (6-12 months)',
          long: 'Long term (12+ months)',
        },
        budget: 'Estimated Budget',
        budgetPlaceholder: 'Select a range',
        budgets: {
          small: 'Less than $10,000',
          medium: '$10,000 - $50,000',
          large: '$50,000 - $100,000',
          enterprise: 'More than $100,000',
        },
        notes: 'Additional Notes',
        notesPlaceholder: 'Tell us more about your project...',
      },
      buttons: {
        next: 'Next',
        back: 'Back',
        submit: 'Submit Request',
        submitting: 'Submitting...',
      },
    },
    thankYou: {
      title: 'Thank You for Your Interest!',
      subtitle: 'We\'ve received your request and will contact you soon.',
      confirmation: 'Confirmation Details',
      name: 'Name',
      email: 'Email',
      company: 'Company',
      services: 'Services of Interest',
      nextSteps: 'Next Steps',
      step1: {
        title: 'Request Review',
        description: 'Our team will review your information and needs.',
      },
      step2: {
        title: 'Initial Contact',
        description: 'We\'ll contact you within 24-48 hours to schedule a consultation.',
      },
      step3: {
        title: 'Personalized Consultation',
        description: 'We\'ll discuss your project and how we can help you.',
      },
      downloadCta: 'Download Our Portfolio',
      downloadBtn: 'Download PDF',
      backHome: 'Back to Home',
    },
  },
};