/**
 * Every string the site renders, in both languages.
 *
 * Sourcing rule: a fact only lands here if it comes from the brand file
 * ("family egg FINAL 31-8-2026.pdf" — stationery or packaging artwork), from
 * the farm footage and photography, or from a written confirmation by the
 * owner. Nothing is estimated or inferred. See docs/DELIVERY-REPORT.md.
 *
 * Each fact is WRITTEN exactly once: numbers live in FIGURES and product
 * values in SPEC, and every sentence that mentions one interpolates it. The
 * commercial pages restate capacity and packs because a buyer landing on
 * them from search never sees the home page — but they restate it from the
 * same constant, so the figure can only ever change in one place.
 *
 * Copy on the wholesale and international pages that describes a PROCESS
 * (how an enquiry is handled, what an importer should send) is not a factual
 * claim about capability, but it speaks for the company. It is listed for
 * owner sign-off in docs/seo-growth/08-CONTENT-STRATEGY.md.
 */

import type { PageKey } from '../pages';

export type Lang = 'ar' | 'en';

export type BuyerType = 'distributor' | 'retail' | 'horeca' | 'institutional' | 'importer' | 'other';
export type ProductInterest = 'cartons' | 'trays' | 'both' | 'unsure';
export type Channel = 'whatsapp' | 'email';

interface PageMeta {
  title: string;
  description: string;
}

export interface Dictionary {
  meta: PageMeta & { ogAlt: string };
  /** Titles and descriptions for every page other than home. */
  pageMeta: Record<Exclude<PageKey, 'home'>, PageMeta>;
  site: {
    name: string;
    tagline: string;
    skip: string;
    menuOpen: string;
    menuClose: string;
    langToggle: string;
    langOther: string;
    rights: string;
    home: string;
    breadcrumb: string;
  };
  /**
   * Header and footer links. An entry with `page` is a separate page; one
   * without is a section anchor on the home page.
   */
  nav: { id: string; label: string; page?: PageKey }[];
  cta: string;
  hero: {
    title: string;
    lede: string;
    scroll: string;
    posterAlt: string;
    playLabel: string;
    pauseLabel: string;
  };
  figures: {
    eyebrow: string;
    title: string;
    items: { value: string; unit: string; label: string }[];
  };
  automation: {
    eyebrow: string;
    title: string;
    body: string;
    videoAlt: string;
    /** Slot reserved for the illustrated characters, to be added later. */
    steps: { no: string; label: string }[];
  };
  products: {
    eyebrow: string;
    title: string;
    body: string;
    sizesLabel: string;
    sizes: { id: string; name: string }[];
    packLabel: string;
    packs: { name: string; unit: string }[];
    specs: { label: string; value: string }[];
  };
  heritage: {
    eyebrow: string;
    title: string;
    body: string;
    imageAlt: string;
  };
  facility: {
    eyebrow: string;
    title: string;
    body: string;
    houseNote: string;
    mainAlt: string;
    solarAlt: string;
    trucksAlt: string;
    solarNote: string;
    trucksNote: string;
  };
  /** Home-page signpost to the two commercial pages. */
  partners: {
    eyebrow: string;
    title: string;
    body: string;
    items: { page: Exclude<PageKey, 'home'>; title: string; body: string; link: string }[];
  };
  wholesale: {
    eyebrow: string;
    title: string;
    lede: string;
    buyersTitle: string;
    buyers: { title: string; body: string }[];
    supplyTitle: string;
    supplyBody: string;
    stepsTitle: string;
    steps: { title: string; body: string }[];
    faqTitle: string;
    faq: { q: string; a: string }[];
    formTitle: string;
    formBody: string;
    intlLink: string;
  };
  international: {
    eyebrow: string;
    title: string;
    lede: string;
    noteTitle: string;
    note: string;
    aboutTitle: string;
    about: { label: string; value: string }[];
    askTitle: string;
    ask: string[];
    formTitle: string;
    formBody: string;
    wholesaleLink: string;
  };
  form: {
    name: string;
    company: string;
    country: string;
    countryDefault: string;
    email: string;
    phone: string;
    buyer: string;
    buyerPlaceholder: string;
    buyerOptions: { id: BuyerType; label: string }[];
    product: string;
    productOptions: { id: ProductInterest; label: string }[];
    volume: string;
    volumeHint: string;
    message: string;
    /** Honeypot label — never visible; read only by bots that fill every field. */
    trap: string;
    channel: string;
    channels: Record<Channel, string>;
    /** Button when the website delivers the enquiry itself. */
    submit: string;
    /** Button when the enquiry is handed to the visitor's own app. */
    submitHandoff: Record<Channel, string>;
    sending: string;
    optional: string;
    errors: {
      required: string;
      email: string;
      phone: string;
      contact: string;
      summary: string;
      captcha: string;
    };
    privacy: { server: string; handoff: string; link: string };
    success: { title: string; body: string; again: string };
    failure: { title: string; body: string; busy: string; retry: string; alternatives: string };
    handoff: {
      title: string;
      body: Record<Channel, string>;
      fallback: string;
      fallbackLink: string;
      again: string;
    };
    /** First line of the composed message, and the email subject. */
    heading: string;
  };
  /** Privacy notice. Factual description of what the site does; owner/legal review pending. */
  privacy: {
    eyebrow: string;
    title: string;
    lede: string;
    sections: { title: string; body: string[] }[];
    analytics: { title: string; on: string; off: string };
    updated: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    phone: string;
    whatsapp: string;
    email: string;
    office: string;
    farm: string;
  };
  footer: {
    nav: string;
    contact: string;
  };
}

/** Numerals are written the same way in both languages, per the brief. */
export const FIGURES = {
  /** Only the heritage section prints this, never the figures strip. */
  years: '60',
  eggsPerDay: '430,000',
  cartonsPerDay: '1,200',
  producingBirds: '600,000',
  rearingBirds: '200,000',
  birdsPerHouse: '100,000',
} as const;

/** Pack and storage values, from the carton artwork. */
export const SPEC = {
  trayEggs: '30',
  cartonEggs: '360',
  traysPerCarton: '12',
  shelfLifeMonths: '3',
  storage: '4-18°C',
  humidity: '75-80%',
  grades: 'XX · XL · L1 · L2 · M · S',
} as const;

/** Language-neutral facts: identical in both dictionaries, so kept once. */
export const CONTACT = {
  /** Brand file, business card. This is the WhatsApp line. */
  whatsappDisplay: '+966 50 748 8650',
  whatsappHref: '+966507488650',
  whatsapp: '966507488650',
  /** Carton artwork. The landline — never shown as the WhatsApp number. */
  phoneDisplay: '+966 56 030 5001',
  phoneHref: '+966560305001',
  /** Confirmed by the owner as the address to publish. */
  email: 'info@familyeggs.sa',
  site: 'familyeggs.sa',
  officeLines: {
    ar: ['6621 طريق النهضة، الربوة', 'الرياض 12823-2778، المملكة العربية السعودية'],
    en: ['6621 Al Nahda Road, Al Rabwah', 'Riyadh 12823-2778, Saudi Arabia'],
  },
  farmLines: {
    ar: ['مرات — طريق لبخة المقتسم', 'ص.ب 12816، الرياض 4814'],
    en: ['Marat — Labkhat Al-Muqtasim Road', 'P.O. Box 12816, Riyadh 4814'],
  },
} as const;

/** Office address on one line, for running text — derived, never retyped. */
const CONTACT_AR_OFFICE = CONTACT.officeLines.ar.join('، ');
const CONTACT_EN_OFFICE = CONTACT.officeLines.en.join(', ');

const SIZES = [
  { id: 'xx', name: 'XX' },
  { id: 'xl', name: 'XL' },
  { id: 'l1', name: 'L1' },
  { id: 'l2', name: 'L2' },
  { id: 'm', name: 'M' },
  { id: 's', name: 'S' },
];

const AR: Dictionary = {
  meta: {
    title: 'بيض العائلة للتجارة | إنتاج وتوريد بيض سعودي لتجار الجملة',
    description: `شركة بيض العائلة للتجارة — مزرعة إنتاج بيض في مرات بمنطقة الرياض، بخط إنتاج مؤتمت بالكامل وطاقة تصل إلى ${FIGURES.eggsPerDay} بيضة يومياً. توريد لتجار الجملة والموزعين والأسواق.`,
    ogAlt: 'لقطة جوية لمزرعة بيض العائلة في مرات: صفوف حظائر الإنتاج والصوامع وحقل الألواح الشمسية',
  },
  pageMeta: {
    wholesale: {
      title: 'توريد بيض بالجملة في السعودية | بيض العائلة للتجارة',
      description: `توريد بيض مائدة طازج بالجملة للموزعين وتجار الجملة والأسواق والمطاعم والفنادق في المملكة: ستة مقاسات، أطباق ${SPEC.trayEggs} وكراتين ${SPEC.cartonEggs} بيضة، وإنتاج يصل إلى ${FIGURES.eggsPerDay} بيضة يومياً من مزرعتنا في مرات.`,
    },
    privacy: {
      title: 'إشعار الخصوصية | بيض العائلة للتجارة',
      description: 'كيف يتعامل موقع بيض العائلة للتجارة مع البيانات التي ترسلها عبر نماذج الطلب وقنوات التواصل.',
    },
    international: {
      title: 'طلبات الاستيراد والمشترين الدوليين | بيض العائلة للتجارة',
      description:
        'للمستوردين والموزعين في دول الخليج والأسواق الأخرى: أرسل طلب توريد إلى منتِج بيض مائدة سعودي بخط فرز وتعبئة مؤتمت. نتحقق من اشتراطات سوقكم قبل تقديم عرض السعر.',
    },
  },
  site: {
    name: 'شركة بيض العائلة للتجارة',
    tagline: 'بيض سعودي طازج',
    skip: 'تخطَّ إلى المحتوى',
    menuOpen: 'فتح القائمة',
    menuClose: 'إغلاق القائمة',
    langToggle: 'English',
    langOther: 'التبديل إلى الإنجليزية',
    rights: 'جميع الحقوق محفوظة.',
    home: 'الرئيسية',
    breadcrumb: 'مسار التنقل',
  },
  nav: [
    { id: 'automation', label: 'الإنتاج' },
    { id: 'products', label: 'المنتجات' },
    { id: 'wholesale', label: 'التوريد بالجملة', page: 'wholesale' },
    { id: 'international', label: 'المشترون الدوليون', page: 'international' },
    { id: 'contact', label: 'تواصل معنا' },
  ],
  cta: 'اطلب عرض سعر',
  hero: {
    title: 'بيض سعودي، بطاقة إنتاجية تثق بها',
    lede: '430 ألف بيضة يوميًا عبر منظومة إنتاج مؤتمتة تخدم التجار والموزعين.',
    scroll: 'تابع للأسفل',
    posterAlt:
      'لقطة جوية لمزرعة بيض العائلة: صف من حظائر الإنتاج وصوامع الأعلاف على امتداد الطريق الداخلي',
    playLabel: 'تشغيل حركة الخلفية',
    pauseLabel: 'إيقاف حركة الخلفية',
  },
  figures: {
    eyebrow: 'الأرقام',
    title: 'حجم يُعتمد عليه.',
    items: [
      { value: FIGURES.eggsPerDay, unit: '', label: 'بيضة يومياً' },
      { value: FIGURES.cartonsPerDay, unit: '', label: 'كرتون يومياً' },
      { value: FIGURES.producingBirds, unit: '', label: 'طير منتج' },
      { value: FIGURES.rearingBirds, unit: '', label: 'طير في حظائر التربية' },
    ],
  },
  automation: {
    eyebrow: 'الإنتاج المؤتمت',
    title: 'من الحظيرة إلى العبوة… دون ملامسة بشرية',
    body: 'يمر البيض عبر منظومة إنتاج مؤتمتة بالكامل، تبدأ بالجمع اليومي وتستمر عبر الفحص والفرز حسب المقاس والتعبئة، دون ملامسة بشرية مباشرة.',
    videoAlt: 'البيض يتحرك آلياً على السير داخل صالة الإنتاج، بلا تدخل يدوي',
    steps: [
      { no: '01', label: 'الجمع' },
      { no: '02', label: 'الفحص' },
      { no: '03', label: 'الفرز' },
      { no: '04', label: 'التعبئة' },
    ],
  },
  products: {
    eyebrow: 'المنتجات',
    title: 'المقاسات والعبوات.',
    body: 'ستة مقاسات متوفرة، وعبوتان جاهزتان للتوريد.',
    sizesLabel: 'المقاسات المتوفرة',
    sizes: SIZES,
    packLabel: 'العبوات',
    packs: [
      { name: 'طبق', unit: `${SPEC.trayEggs} بيضة` },
      { name: 'كرتون', unit: `${SPEC.cartonEggs} بيضة (${SPEC.traysPerCarton} طبق × ${SPEC.trayEggs})` },
    ],
    specs: [
      { label: 'الصنف', value: 'بيض طازج' },
      { label: 'مدة الصلاحية', value: `${SPEC.shelfLifeMonths} أشهر من تاريخ الإنتاج` },
      { label: 'درجة التخزين', value: SPEC.storage },
      { label: 'الرطوبة النسبية', value: SPEC.humidity },
    ],
  },
  heritage: {
    eyebrow: 'الخبرة',
    title: `${FIGURES.years} عامًا من الخبرة المتوارثة`,
    body: 'خبرة عائلية ممتدة عبر الأجيال في إنتاج البيض، تجمع بين المعرفة المتوارثة وتقنيات الإنتاج الحديثة لتقديم منتج سعودي موثوق لقطاع التجزئة والتوزيع.',
    imageAlt: 'مزرعة بيض العائلة وقت الغروب: حظائر الإنتاج وحقل الألواح الشمسية',
  },
  facility: {
    eyebrow: 'المنشأة',
    title: 'مزرعة بُنيت للتوريد المستمر.',
    body: 'حظائر إنتاج متتابعة وصوامع أعلاف ومبانٍ تشغيلية على مساحة مفتوحة في مرات، يغذّيها حقل ألواح شمسية داخل الموقع.',
    houseNote: `كل حظيرة إنتاج تضم ${FIGURES.birdsPerHouse} طير`,
    mainAlt:
      'لقطة جوية نهارية للمزرعة: صفوف حظائر الإنتاج وصوامع الأعلاف وحقل الألواح الشمسية على يمين الموقع',
    solarAlt: 'حقل الألواح الشمسية داخل الموقع، وصفوف إضافية قيد التركيب',
    trucksAlt: 'ساحة التحميل: شاحنة مقطورة وصهريج ومركبات خدمة تحت المظلات',
    solarNote: 'طاقة شمسية داخل الموقع',
    trucksNote: 'أسطول توصيل يعمل من المزرعة',
  },
  partners: {
    eyebrow: 'التوريد التجاري',
    title: 'طلبات التوريد للشركات.',
    body: 'نستقبل طلبات التوريد من داخل المملكة وخارجها. اختر المسار الأقرب لنشاطك.',
    items: [
      {
        page: 'wholesale',
        title: 'التوريد بالجملة داخل المملكة',
        body: 'للموزعين وتجار الجملة والأسواق والمطاعم والفنادق وشركات التموين داخل المملكة.',
        link: 'تفاصيل التوريد بالجملة',
      },
      {
        page: 'international',
        title: 'المستوردون والمشترون الدوليون',
        body: 'لشركات الاستيراد والتوزيع في دول الخليج والأسواق الأخرى.',
        link: 'طلبات الاستيراد',
      },
    ],
  },
  wholesale: {
    eyebrow: 'التوريد بالجملة',
    title: 'توريد بيض المائدة بالجملة في السعودية',
    lede: 'بيض طازج من مزرعتنا في مرات بمنطقة الرياض، مفروز حسب المقاس ومعبّأ آلياً، للموزعين وتجار الجملة ومنافذ البيع وقطاع الضيافة.',
    buyersTitle: 'جهات نستقبل طلباتها',
    buyers: [
      {
        title: 'الموزعون وتجار الجملة',
        body: `التوريد بالكرتون (${SPEC.cartonEggs} بيضة)، واختيار المقاسات من الستة المتوفرة.`,
      },
      {
        title: 'الأسواق ومنافذ التجزئة',
        body: `أطباق ${SPEC.trayEggs} بيضة أو كراتين ${SPEC.cartonEggs} بيضة، بحسب احتياج المنفذ.`,
      },
      {
        title: 'المطاعم والفنادق وشركات التموين',
        body: 'بالطبق أو بالكرتون، وتُتفق الكميات والمواعيد عند الطلب.',
      },
      {
        title: 'المشتريات المؤسسية',
        body: 'نرحّب بطلبات جهات الإعاشة والمؤسسات، وتُتفق الشروط مع كل طلب.',
      },
    ],
    supplyTitle: 'ما نوفّره',
    supplyBody: `طاقة إنتاج يومية تصل إلى ${FIGURES.eggsPerDay} بيضة — نحو ${FIGURES.cartonsPerDay} كرتون — عبر خط جمع وفحص وفرز وتعبئة مؤتمت. تُؤكَّد الكميات المتاحة لكل طلب على حدة.`,
    stepsTitle: 'كيف يتم الطلب',
    steps: [
      {
        title: 'أرسل احتياجك',
        body: 'المقاسات والعبوة والكمية التقريبية ومدينة التسليم وتكرار التوريد.',
      },
      {
        title: 'نؤكد التفاصيل',
        body: 'نردّ عليك لتأكيد التوفر والسعر وترتيبات التسليم.',
      },
      {
        title: 'يبدأ التوريد',
        body: 'وفق ما يُتفق عليه من كميات ومواعيد وطريقة تسليم.',
      },
    ],
    faqTitle: 'أسئلة شائعة',
    faq: [
      {
        q: 'ما مقاسات البيض المتوفرة؟',
        a: `ستة مقاسات: ${SPEC.grades}.`,
      },
      {
        q: 'ما العبوات المتاحة للتوريد؟',
        a: `طبق يحتوي ${SPEC.trayEggs} بيضة، وكرتون يحتوي ${SPEC.cartonEggs} بيضة (${SPEC.traysPerCarton} طبقاً).`,
      },
      {
        q: 'ما مدة صلاحية البيض وشروط تخزينه؟',
        a: `${SPEC.shelfLifeMonths} أشهر من تاريخ الإنتاج، عند درجة حرارة ${SPEC.storage} ورطوبة نسبية ${SPEC.humidity}.`,
      },
      {
        q: 'ما الطاقة الإنتاجية اليومية؟',
        a: `تصل إلى ${FIGURES.eggsPerDay} بيضة يومياً، أي نحو ${FIGURES.cartonsPerDay} كرتون.`,
      },
      {
        q: 'كيف يتم ترتيب التسليم؟',
        a: 'يُتفق على مكان التسليم وموعده مع كل عميل عند تأكيد الطلب.',
      },
      {
        q: 'كيف أطلب عرض سعر؟',
        a: 'عبر النموذج في هذه الصفحة، أو مباشرة عبر واتساب أو الهاتف أو البريد الإلكتروني.',
      },
    ],
    formTitle: 'اطلب عرض سعر للتوريد',
    formBody: 'الحقول المعلَّمة بـ«اختياري» يمكن تركها فارغة. سنردّ على طلبك عبر البريد الإلكتروني أو الهاتف.',
    intlLink: 'تشتري من خارج المملكة؟ صفحة المشترين الدوليين',
  },
  international: {
    eyebrow: 'المشترون الدوليون',
    title: 'بيض مائدة سعودي للمستوردين والموزعين في الخارج',
    lede: 'نستقبل طلبات شركات الاستيراد والتوزيع في دول الخليج والأسواق الأخرى، وندرس كل طلب على حدة.',
    noteTitle: 'قبل أن ترسل طلبك',
    note: 'يخضع التصدير لاشتراطات الاستيراد في بلد الوجهة وللموافقات اللازمة لكل شحنة. نتحقق من إمكانية التوريد إلى سوقكم قبل تقديم أي عرض سعر.',
    aboutTitle: 'عن المنتِج',
    about: [
      { label: 'المزرعة', value: 'مرات، منطقة الرياض، المملكة العربية السعودية' },
      { label: 'الطاقة الإنتاجية', value: `حتى ${FIGURES.eggsPerDay} بيضة يومياً` },
      { label: 'خط الإنتاج', value: 'جمع وفحص وفرز وتعبئة مؤتمتة' },
      { label: 'المقاسات', value: SPEC.grades },
    ],
    askTitle: 'ما يساعدنا على الرد بسرعة',
    ask: [
      'بلد الوجهة، ومدينة أو ميناء التسليم',
      'نوع نشاطكم: استيراد أو توزيع أو تجزئة أو تموين',
      'المقاسات والعبوة المطلوبة',
      'الكمية التقريبية وتكرار الشحن',
      'المستندات والشهادات التي تشترطها الجهات في بلدكم',
      'شروط التسليم المفضّلة (Incoterms)',
    ],
    formTitle: 'أرسل طلب استيراد',
    formBody: 'كلما كانت التفاصيل أوضح، كان ردّنا أسرع وأدق.',
    wholesaleLink: 'داخل المملكة؟ صفحة التوريد بالجملة',
  },
  form: {
    name: 'الاسم الكامل',
    company: 'اسم الشركة',
    country: 'الدولة',
    countryDefault: 'المملكة العربية السعودية',
    email: 'البريد الإلكتروني',
    phone: 'رقم الجوال أو الهاتف',
    buyer: 'نوع النشاط',
    buyerPlaceholder: 'اختر نوع النشاط',
    buyerOptions: [
      { id: 'distributor', label: 'موزع أو تاجر جملة' },
      { id: 'retail', label: 'سوق أو منفذ تجزئة' },
      { id: 'horeca', label: 'مطعم أو فندق أو شركة تموين' },
      { id: 'institutional', label: 'جهة مؤسسية' },
      { id: 'importer', label: 'مستورد أو موزع خارج المملكة' },
      { id: 'other', label: 'أخرى' },
    ],
    product: 'العبوة المطلوبة',
    productOptions: [
      { id: 'cartons', label: `كرتون (${SPEC.cartonEggs} بيضة)` },
      { id: 'trays', label: `طبق (${SPEC.trayEggs} بيضة)` },
      { id: 'both', label: 'الاثنان' },
      { id: 'unsure', label: 'لم أحدد بعد' },
    ],
    volume: 'الكمية التقريبية',
    volumeHint: 'مثال: 50 كرتون أسبوعياً',
    message: 'تفاصيل إضافية',
    trap: 'اترك هذا الحقل فارغاً',
    channel: 'أرسل الطلب عبر',
    channels: { whatsapp: 'واتساب', email: 'البريد الإلكتروني' },
    submit: 'إرسال الطلب',
    submitHandoff: { whatsapp: 'المتابعة عبر واتساب', email: 'المتابعة عبر البريد الإلكتروني' },
    sending: 'جارٍ الإرسال…',
    optional: 'اختياري',
    errors: {
      required: 'هذا الحقل مطلوب.',
      email: 'أدخل بريداً إلكترونياً صحيحاً.',
      phone: 'أدخل رقماً صحيحاً، مثل ‎+966 5x xxx xxxx.',
      contact: 'أدخل البريد الإلكتروني أو رقم الهاتف لنتمكن من الرد.',
      summary: 'راجع الحقول المحددة أدناه.',
      captcha: 'أكمل التحقق الأمني قبل الإرسال.',
    },
    privacy: {
      server: 'تُرسل بياناتك بالبريد الإلكتروني إلى بيض العائلة (info@familyeggs.sa) للرد على طلبك، ولا يحفظها الموقع.',
      handoff:
        'لا يحفظ الموقع بياناتك. تُفتح الرسالة في تطبيق واتساب أو البريد لديك، ولا تصلنا إلا بعد أن تضغط «إرسال» هناك.',
      link: 'إشعار الخصوصية',
    },
    success: {
      title: 'تم إرسال طلبك',
      body: 'شكراً لك. وصل طلبك إلى فريقنا، وسنردّ عليك عبر البريد الإلكتروني أو الهاتف.',
      again: 'إرسال طلب آخر',
    },
    failure: {
      title: 'لم يُرسَل طلبك',
      body: 'حدث خطأ أثناء الإرسال. بياناتك ما زالت في النموذج — حاول مرة أخرى، أو أرسلها عبر واتساب أو البريد الإلكتروني.',
      busy: 'محاولات كثيرة خلال وقت قصير. انتظر بضع دقائق، أو تواصل معنا عبر واتساب أو البريد الإلكتروني.',
      retry: 'حاول مرة أخرى',
      alternatives: 'أو أرسل الطلب نفسه عبر:',
    },
    handoff: {
      title: 'رسالتك جاهزة — لم تُرسَل بعد',
      body: {
        whatsapp: 'فتحنا واتساب وفيه نص طلبك. لن يصلنا الطلب إلا بعد أن تضغط «إرسال» هناك.',
        email: 'فتحنا تطبيق البريد وفيه نص طلبك. لن يصلنا الطلب إلا بعد أن تضغط «إرسال» هناك.',
      },
      fallback: 'إن لم يُفتح التطبيق:',
      fallbackLink: 'افتح الرسالة يدوياً',
      again: 'تعديل الطلب',
    },
    heading: 'طلب توريد عبر موقع بيض العائلة',
  },
  privacy: {
    eyebrow: 'الخصوصية',
    title: 'إشعار الخصوصية',
    lede: 'كيف يتعامل هذا الموقع مع البيانات التي تشاركها مع شركة بيض العائلة للتجارة.',
    sections: [
      {
        title: 'من نحن',
        body: [
          `شركة بيض العائلة للتجارة، ${CONTACT_AR_OFFICE}. لأي سؤال عن هذا الإشعار أو عن بياناتك راسلنا على info@familyeggs.sa.`,
        ],
      },
      {
        title: 'نماذج الطلب',
        body: [
          'عند إرسال طلب تصل إلى بيض العائلة البيانات التي تكتبها: الاسم والشركة والدولة والبريد الإلكتروني أو الهاتف ونوع النشاط وتفاصيل احتياجك، ليتسنّى الرد على طلبك.',
          'إذا أرسل النموذج طلبك مباشرة، فإنه يصل بالبريد الإلكتروني إلى info@familyeggs.sa، ولا يحفظ الموقع نسخة منه. لا تسجّل سجلات الخادم إلا ما إذا أُرسل الطلب، مع نوع النشاط والصفحة واللغة، دون أي من محتواه.',
          'إذا اخترت واتساب أو البريد الإلكتروني بدلاً من ذلك، تُرسل الرسالة من تطبيقك أنت، وفق شروط تلك الخدمة.',
        ],
      },
      {
        title: 'الحماية من الرسائل المزعجة',
        body: [
          'عند تفعيل خدمة Cloudflare Turnstile يُحمَّل النموذج منها للتحقق من أن المرسل شخص لا برنامج آلي، وتتلقى Cloudflare لهذا الغرض عنوان IP ومعلومات المتصفح.',
          'ويحتفظ خادمنا بعنوان IP في الذاكرة نحو عشر دقائق فقط للحد من تكرار الإرسال، ولا يكتبه في أي سجل.',
        ],
      },
      {
        title: 'الاستضافة والأمان',
        body: [
          'يُقدَّم الموقع عبر Cloudflare ويُستضاف على Railway. وكأي خادم ويب، تعالج هاتان الخدمتان بيانات تقنية مثل عنوان IP لتشغيل الموقع وحمايته.',
        ],
      },
      {
        title: 'التواصل بشأن بياناتك',
        body: ['للاستفسار عن هذا الإشعار أو عن البيانات التي أرسلتها إلينا: info@familyeggs.sa.'],
      },
    ],
    analytics: {
      title: 'التحليلات',
      on: 'نستخدم Google Analytics لفهم طريقة استخدام الموقع، مثل الصفحات التي تُزار ووقت إرسال الطلبات. لا يُرسل محتوى النموذج إلى Google Analytics أبداً، وميزات الإعلانات معطّلة.',
      off: 'لا يستخدم هذا الموقع ملفات تعريف ارتباط للتحليلات أو الإعلانات. والشيء الوحيد الذي يحفظه في متصفحك هو آخر لغة اخترتها (في التخزين المحلي)، ولا يُرسل إلى أي جهة.',
    },
    updated: 'آخر تحديث: 19 أكتوبر 2026',
  },
  contact: {
    eyebrow: 'التواصل',
    title: 'تواصل معنا',
    body: 'للاستفسار عن التوريد وعروض الأسعار.',
    phone: 'هاتف',
    whatsapp: 'واتساب',
    email: 'البريد الإلكتروني',
    office: 'مقر الشركة',
    farm: 'المزرعة',
  },
  footer: {
    nav: 'روابط',
    contact: 'التواصل',
  },
};

const EN: Dictionary = {
  meta: {
    title: 'Family Eggs For Trading | Saudi egg production and wholesale supply',
    description: `Family Eggs For Trading Co. — an egg farm in Marat, Riyadh Region, with a fully automated line producing up to ${FIGURES.eggsPerDay} eggs a day. Supplying wholesalers, distributors and retailers.`,
    ogAlt:
      'Aerial view of the Family Eggs farm in Marat: rows of production houses, feed silos and the on-site solar array',
  },
  pageMeta: {
    wholesale: {
      title: 'Wholesale Egg Supplier in Saudi Arabia | Family Eggs',
      description: `Fresh table eggs in bulk for distributors, supermarkets, restaurants and hotels in Saudi Arabia: six grades, ${SPEC.trayEggs}-egg trays and ${SPEC.cartonEggs}-egg cartons, up to ${FIGURES.eggsPerDay} eggs a day.`,
    },
    privacy: {
      title: 'Privacy notice | Family Eggs For Trading',
      description: 'How the Family Eggs For Trading website handles the information you send through enquiry forms and contact channels.',
    },
    international: {
      title: 'Saudi Egg Supplier for GCC & International Buyers | Family Eggs',
      description:
        'Importers and distributors in the GCC and beyond: send a supply enquiry to a Saudi table-egg producer with automated grading and packing. We check your market’s import requirements before we quote.',
    },
  },
  site: {
    name: 'Family Eggs For Trading Co.',
    tagline: 'Fresh Saudi eggs',
    skip: 'Skip to content',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    langToggle: 'العربية',
    langOther: 'Switch to Arabic',
    rights: 'All rights reserved.',
    home: 'Home',
    breadcrumb: 'Breadcrumb',
  },
  nav: [
    { id: 'automation', label: 'Production' },
    { id: 'products', label: 'Products' },
    { id: 'wholesale', label: 'Wholesale', page: 'wholesale' },
    { id: 'international', label: 'International buyers', page: 'international' },
    { id: 'contact', label: 'Contact' },
  ],
  cta: 'Request a quote',
  hero: {
    title: 'Saudi eggs. Production capacity you can rely on.',
    lede: `${FIGURES.eggsPerDay} eggs every day through an automated production system built for retailers and distributors.`,
    scroll: 'Scroll',
    posterAlt:
      'Aerial view of the Family Eggs farm: a row of production houses and feed silos along the internal road',
    playLabel: 'Play background motion',
    pauseLabel: 'Pause background motion',
  },
  figures: {
    eyebrow: 'By the numbers',
    title: 'Capacity you can plan around.',
    items: [
      { value: FIGURES.eggsPerDay, unit: '', label: 'eggs per day' },
      { value: FIGURES.cartonsPerDay, unit: '', label: 'cartons per day' },
      { value: FIGURES.producingBirds, unit: '', label: 'producing birds' },
      { value: FIGURES.rearingBirds, unit: '', label: 'birds in rearing houses' },
    ],
  },
  automation: {
    eyebrow: 'Automated production',
    title: 'From the poultry house to the pack — without human contact.',
    body: 'Eggs move through a fully automated production system, from daily collection to inspection, size grading and packing, without direct human handling.',
    videoAlt: 'Eggs travelling automatically along the conveyor inside the production hall, untouched by hand',
    steps: [
      { no: '01', label: 'Collection' },
      { no: '02', label: 'Inspection' },
      { no: '03', label: 'Grading' },
      { no: '04', label: 'Packing' },
    ],
  },
  products: {
    eyebrow: 'Products',
    title: 'Sizes and packaging.',
    body: 'Six available grades, and two packs ready for supply.',
    sizesLabel: 'Available sizes',
    sizes: SIZES,
    packLabel: 'Packs',
    packs: [
      { name: 'Tray', unit: `${SPEC.trayEggs} eggs` },
      { name: 'Carton', unit: `${SPEC.cartonEggs} eggs (${SPEC.traysPerCarton} trays × ${SPEC.trayEggs})` },
    ],
    specs: [
      { label: 'Type', value: 'Fresh eggs' },
      { label: 'Shelf life', value: `${SPEC.shelfLifeMonths} months from production date` },
      { label: 'Storage', value: SPEC.storage },
      { label: 'Relative humidity', value: SPEC.humidity },
    ],
  },
  heritage: {
    eyebrow: 'Expertise',
    title: `${FIGURES.years} years of expertise, passed down through generations.`,
    body: 'A family legacy in egg production, combining generations of experience with modern production technology to provide reliable Saudi eggs for retailers and distributors.',
    imageAlt: 'The Family Eggs farm at dusk: production houses and the solar array',
  },
  facility: {
    eyebrow: 'The facility',
    title: 'Built for continuous supply.',
    body: 'Successive production houses, feed silos and operations buildings on open ground in Marat, powered by an on-site solar array.',
    houseNote: `Each production house holds ${FIGURES.birdsPerHouse} birds`,
    mainAlt:
      'Daytime aerial of the farm: rows of production houses, feed silos and the solar array to the right of the site',
    solarAlt: 'The on-site solar array, with further rows under installation',
    trucksAlt: 'The loading yard: a trailer, a tanker and service vehicles under the canopies',
    solarNote: 'On-site solar power',
    trucksNote: 'A delivery fleet operating from the farm',
  },
  partners: {
    eyebrow: 'Commercial supply',
    title: 'Supply enquiries for businesses.',
    body: 'We take supply enquiries from inside Saudi Arabia and abroad. Choose the route that fits your business.',
    items: [
      {
        page: 'wholesale',
        title: 'Wholesale supply in Saudi Arabia',
        body: 'For distributors, wholesalers, supermarkets, restaurants, hotels and caterers in Saudi Arabia.',
        link: 'Wholesale supply details',
      },
      {
        page: 'international',
        title: 'Importers and international buyers',
        body: 'For import and distribution companies in the GCC and other markets.',
        link: 'International enquiries',
      },
    ],
  },
  wholesale: {
    eyebrow: 'Wholesale supply',
    title: 'Wholesale table eggs, supplied from a Saudi farm',
    lede: 'Fresh eggs from our farm in Marat, Riyadh Region — size-graded and machine-packed, for distributors, wholesalers, retailers and the hospitality trade.',
    buyersTitle: 'Who we take enquiries from',
    buyers: [
      {
        title: 'Distributors and wholesalers',
        body: `Supply by the carton (${SPEC.cartonEggs} eggs), choosing from the six available grades.`,
      },
      {
        title: 'Supermarkets and retailers',
        body: `Trays of ${SPEC.trayEggs} eggs or cartons of ${SPEC.cartonEggs}, depending on what the outlet needs.`,
      },
      {
        title: 'Restaurants, hotels and caterers',
        body: 'By the tray or by the carton, with quantities and timing agreed when you order.',
      },
      {
        title: 'Institutional procurement',
        body: 'Enquiries from catering contractors and institutions are welcome; terms are agreed per enquiry.',
      },
    ],
    supplyTitle: 'What we supply',
    supplyBody: `Daily production capacity of up to ${FIGURES.eggsPerDay} eggs — around ${FIGURES.cartonsPerDay} cartons — through an automated collection, inspection, grading and packing line. Available quantities are confirmed for each order.`,
    stepsTitle: 'How ordering works',
    steps: [
      {
        title: 'Send your requirements',
        body: 'Grades, pack, approximate quantity, delivery city and how often you need supply.',
      },
      {
        title: 'We confirm the details',
        body: 'We reply to confirm availability, price and delivery arrangements.',
      },
      {
        title: 'Supply begins',
        body: 'On the quantities, timing and delivery method agreed with you.',
      },
    ],
    faqTitle: 'Frequently asked questions',
    faq: [
      {
        q: 'Which egg grades do you supply?',
        a: `Six grades: ${SPEC.grades}.`,
      },
      {
        q: 'What pack sizes are available?',
        a: `A tray of ${SPEC.trayEggs} eggs, and a carton of ${SPEC.cartonEggs} eggs (${SPEC.traysPerCarton} trays).`,
      },
      {
        q: 'What is the shelf life, and how should the eggs be stored?',
        a: `${SPEC.shelfLifeMonths} months from the production date, stored at ${SPEC.storage} and ${SPEC.humidity} relative humidity.`,
      },
      {
        q: 'What is your daily production capacity?',
        a: `Up to ${FIGURES.eggsPerDay} eggs a day, or around ${FIGURES.cartonsPerDay} cartons.`,
      },
      {
        q: 'How is delivery arranged?',
        a: 'Delivery location and timing are agreed with each customer when the order is confirmed.',
      },
      {
        q: 'How do I request a quote?',
        a: 'Use the form on this page, or contact us directly by WhatsApp, phone or email.',
      },
    ],
    formTitle: 'Request a supply quote',
    formBody: 'Fields marked “optional” can be left blank. We reply to your enquiry by email or phone.',
    intlLink: 'Buying from outside Saudi Arabia? See international enquiries',
  },
  international: {
    eyebrow: 'International buyers',
    title: 'Saudi table eggs for importers and distributors abroad',
    lede: 'We take enquiries from import and distribution companies in the GCC and other markets, and review each one individually.',
    noteTitle: 'Before you send an enquiry',
    note: 'Export supply is subject to the destination country’s import requirements and to the approvals each shipment needs. We confirm that we can supply your market before we send any quotation.',
    aboutTitle: 'About the producer',
    about: [
      { label: 'Farm', value: 'Marat, Riyadh Region, Saudi Arabia' },
      { label: 'Capacity', value: `Up to ${FIGURES.eggsPerDay} eggs per day` },
      { label: 'Production line', value: 'Automated collection, inspection, grading and packing' },
      { label: 'Grades', value: SPEC.grades },
    ],
    askTitle: 'What helps us reply quickly',
    ask: [
      'Destination country, and delivery city or port',
      'Your business: importer, distributor, retailer or foodservice',
      'Grades and pack required',
      'Approximate volume and shipment frequency',
      'The documents and certificates your authorities require',
      'Preferred delivery terms (Incoterms)',
    ],
    formTitle: 'Send an import enquiry',
    formBody: 'The more specific the details, the faster and more precise our reply.',
    wholesaleLink: 'Buying inside Saudi Arabia? See wholesale supply',
  },
  form: {
    name: 'Full name',
    company: 'Company name',
    country: 'Country',
    countryDefault: 'Saudi Arabia',
    email: 'Business email',
    phone: 'Mobile or phone number',
    buyer: 'Type of business',
    buyerPlaceholder: 'Choose your type of business',
    buyerOptions: [
      { id: 'distributor', label: 'Distributor or wholesaler' },
      { id: 'retail', label: 'Supermarket or retailer' },
      { id: 'horeca', label: 'Restaurant, hotel or caterer' },
      { id: 'institutional', label: 'Institutional buyer' },
      { id: 'importer', label: 'Importer or distributor outside Saudi Arabia' },
      { id: 'other', label: 'Other' },
    ],
    product: 'Pack required',
    productOptions: [
      { id: 'cartons', label: `Carton (${SPEC.cartonEggs} eggs)` },
      { id: 'trays', label: `Tray (${SPEC.trayEggs} eggs)` },
      { id: 'both', label: 'Both' },
      { id: 'unsure', label: 'Not decided yet' },
    ],
    volume: 'Approximate volume',
    volumeHint: 'For example: 50 cartons a week',
    message: 'Anything else we should know',
    trap: 'Leave this field empty',
    channel: 'Send the request by',
    channels: { whatsapp: 'WhatsApp', email: 'Email' },
    submit: 'Send enquiry',
    submitHandoff: { whatsapp: 'Continue in WhatsApp', email: 'Continue by email' },
    sending: 'Sending…',
    optional: 'optional',
    errors: {
      required: 'This field is required.',
      email: 'Enter a valid email address.',
      phone: 'Enter a valid number, such as +966 5x xxx xxxx.',
      contact: 'Enter an email address or a phone number so we can reply.',
      summary: 'Please check the highlighted fields below.',
      captcha: 'Please complete the security check before sending.',
    },
    privacy: {
      server:
        'Your details are emailed to Family Eggs (info@familyeggs.sa) for a reply to your enquiry. The website does not store them.',
      handoff:
        'The website stores none of your details. The message opens in your own WhatsApp or email app and only reaches us when you press Send there.',
      link: 'Privacy notice',
    },
    success: {
      title: 'Your enquiry has been sent',
      body: 'Thank you. Your enquiry has reached our team, and we will reply by email or phone.',
      again: 'Send another enquiry',
    },
    failure: {
      title: 'Your enquiry was not sent',
      body: 'Something went wrong while sending. Your details are still in the form — please try again, or send them by WhatsApp or email instead.',
      busy: 'Too many attempts in a short time. Please wait a few minutes, or contact us by WhatsApp or email.',
      retry: 'Try again',
      alternatives: 'Or send the same enquiry by:',
    },
    handoff: {
      title: 'Your message is ready — not sent yet',
      body: {
        whatsapp: 'WhatsApp is open with your enquiry filled in. It only reaches us when you press Send there.',
        email: 'Your email app is open with your enquiry filled in. It only reaches us when you press Send there.',
      },
      fallback: 'If the app did not open:',
      fallbackLink: 'Open the message manually',
      again: 'Edit the enquiry',
    },
    heading: 'Supply enquiry via the Family Eggs website',
  },
  privacy: {
    eyebrow: 'Privacy',
    title: 'Privacy notice',
    lede: 'How this website handles the information you share with Family Eggs For Trading Co.',
    sections: [
      {
        title: 'Who we are',
        body: [
          `Family Eggs For Trading Co., ${CONTACT_EN_OFFICE}. For any question about this notice or your information, email info@familyeggs.sa.`,
        ],
      },
      {
        title: 'Enquiry forms',
        body: [
          'When you send an enquiry, the details you enter — name, company, country, email or phone, type of business and your requirements — are sent to Family Eggs so the company can reply.',
          'If the form sends your enquiry directly, it is delivered by email to info@familyeggs.sa and the website keeps no copy. Server logs record only whether an enquiry was sent, with its type of business, page and language — never its contents.',
          'If you choose WhatsApp or email instead, the message is sent from your own app, under that service’s terms.',
        ],
      },
      {
        title: 'Spam protection',
        body: [
          'When Cloudflare Turnstile is switched on, the form loads it from Cloudflare to check that a person, not a program, is sending the enquiry. Cloudflare receives your IP address and browser information for that check.',
          'Our server keeps your IP address in memory for about ten minutes, only to limit repeated submissions, and does not write it to any log.',
        ],
      },
      {
        title: 'Hosting and security',
        body: [
          'The website is delivered through Cloudflare and hosted on Railway. Like any web server, they process technical data such as your IP address to run and protect the site.',
        ],
      },
      {
        title: 'Questions about your information',
        body: ['For questions about this notice or about information you sent us: info@familyeggs.sa.'],
      },
    ],
    analytics: {
      title: 'Analytics',
      on: 'We use Google Analytics to understand how the website is used, such as which pages are visited and when an enquiry is sent. Form contents are never sent to Google Analytics, and advertising features are switched off.',
      off: 'This website does not use analytics or advertising cookies. The only thing it stores in your browser is your last language choice (in local storage), and that is never sent anywhere.',
    },
    updated: 'Last updated: 19 October 2026',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Contact us',
    body: 'For supply enquiries and pricing.',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    email: 'Email',
    office: 'Head office',
    farm: 'Farm',
  },
  footer: {
    nav: 'Links',
    contact: 'Contact',
  },
};

export const DICTIONARIES: Record<Lang, Dictionary> = { ar: AR, en: EN };
