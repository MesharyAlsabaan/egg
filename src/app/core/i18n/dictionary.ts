/**
 * Every string the site renders, in both languages.
 *
 * Sourcing rule: a fact only lands here if it comes from the brand file
 * ("family egg FINAL 31-8-2026.pdf" — stationery or packaging artwork), from
 * the farm footage and photography, or from a written confirmation by the
 * owner. Nothing is estimated or inferred. See docs/DELIVERY-REPORT.md.
 *
 * Each fact appears exactly ONCE in this file. If you find yourself writing
 * the same number in two sections, the section split is wrong — fix that
 * instead of repeating it.
 */

export type Lang = 'ar' | 'en';

export interface Dictionary {
  meta: {
    title: string;
    description: string;
    ogAlt: string;
  };
  site: {
    name: string;
    tagline: string;
    skip: string;
    menuOpen: string;
    menuClose: string;
    langToggle: string;
    langOther: string;
    rights: string;
  };
  nav: { id: string; label: string }[];
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
const FIGURES = {
  /** Only the heritage section prints this, never the figures strip. */
  years: '60',
  eggsPerDay: '430,000',
  cartonsPerDay: '1,200',
  producingBirds: '600,000',
  rearingBirds: '200,000',
  birdsPerHouse: '100,000',
} as const;

const AR: Dictionary = {
  meta: {
    title: 'بيض العائلة للتجارة | إنتاج وتوريد بيض سعودي لتجار الجملة',
    description:
      'شركة بيض العائلة للتجارة — مزرعة إنتاج بيض في مرات بمنطقة الرياض، بخط إنتاج مؤتمت بالكامل وطاقة تصل إلى 430,000 بيضة يومياً. توريد لتجار الجملة والموزعين والأسواق.',
    ogAlt: 'لقطة جوية لمزرعة بيض العائلة في مرات: صفوف حظائر الإنتاج والصوامع وحقل الألواح الشمسية',
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
  },
  nav: [
    { id: 'automation', label: 'الإنتاج' },
    { id: 'products', label: 'المنتجات' },
    { id: 'facility', label: 'المزرعة' },
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
    sizes: [
      { id: 'xx', name: 'XX' },
      { id: 'xl', name: 'XL' },
      { id: 'l1', name: 'L1' },
      { id: 'l2', name: 'L2' },
      { id: 'm', name: 'M' },
      { id: 's', name: 'S' },
    ],
    packLabel: 'العبوات',
    packs: [
      { name: 'طبق', unit: '30 بيضة' },
      { name: 'كرتون', unit: '360 بيضة (12 طبق × 30)' },
    ],
    specs: [
      { label: 'الصنف', value: 'بيض طازج' },
      { label: 'مدة الصلاحية', value: '3 أشهر من تاريخ الإنتاج' },
      { label: 'درجة التخزين', value: '4-18°C' },
      { label: 'الرطوبة النسبية', value: '75-80%' },
    ],
  },
  heritage: {
    eyebrow: 'الخبرة',
    title: '60 عامًا من الخبرة المتوارثة',
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
    trucksNote: 'أسطول جاهز للتوصيل لأي مكان يطلبه العميل',
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
    description:
      'Family Eggs For Trading Co. — an egg farm in Marat, Riyadh Region, running a fully automated production line with a capacity of up to 430,000 eggs per day. Supplying wholesalers, distributors and retail markets.',
    ogAlt:
      'Aerial view of the Family Eggs farm in Marat: rows of production houses, feed silos and the on-site solar array',
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
  },
  nav: [
    { id: 'automation', label: 'Production' },
    { id: 'products', label: 'Products' },
    { id: 'facility', label: 'The farm' },
    { id: 'contact', label: 'Contact' },
  ],
  cta: 'Request a quote',
  hero: {
    title: 'Saudi eggs. Production capacity you can rely on.',
    lede: '430,000 eggs every day through an automated production system built for retailers and distributors.',
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
    sizes: [
      { id: 'xx', name: 'XX' },
      { id: 'xl', name: 'XL' },
      { id: 'l1', name: 'L1' },
      { id: 'l2', name: 'L2' },
      { id: 'm', name: 'M' },
      { id: 's', name: 'S' },
    ],
    packLabel: 'Packs',
    packs: [
      { name: 'Tray', unit: '30 eggs' },
      { name: 'Carton', unit: '360 eggs (12 trays × 30)' },
    ],
    specs: [
      { label: 'Type', value: 'Fresh eggs' },
      { label: 'Shelf life', value: '3 months from production date' },
      { label: 'Storage', value: '4-18°C' },
      { label: 'Relative humidity', value: '75-80%' },
    ],
  },
  heritage: {
    eyebrow: 'Expertise',
    title: '60 years of expertise, passed down through generations.',
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
    trucksNote: 'A fleet ready to deliver wherever the customer needs',
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
