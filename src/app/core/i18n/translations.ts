export type Lang = 'en' | 'ar';

/**
 * Single source of truth for all on-page copy, in both English and Arabic.
 * Structured so components read strongly-typed values: i18n.t().hero.title
 */
export interface Dictionary {
  nav: {
    home: string;
    about: string;
    products: string;
    why: string;
    process: string;
    gallery: string;
    contact: string;
    cta: string;
  };
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    desc: string;
    ctaContact: string;
    ctaProducts: string;
    stat1: string;
    stat1Label: string;
    stat2: string;
    stat2Label: string;
    stat3: string;
    stat3Label: string;
  };
  about: {
    eyebrow: string;
    title: string;
    story: string;
    mission: string;
    missionText: string;
    vision: string;
    visionText: string;
    quality: string;
    qualityText: string;
  };
  products: {
    eyebrow: string;
    title: string;
    desc: string;
    items: { name: string; desc: string; tag: string }[];
    cta: string;
  };
  why: {
    eyebrow: string;
    title: string;
    desc: string;
    items: { title: string; desc: string }[];
  };
  process: {
    eyebrow: string;
    title: string;
    desc: string;
    steps: { title: string; desc: string }[];
  };
  stats: {
    title: string;
    items: { value: number; suffix: string; label: string }[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    items: { quote: string; name: string; role: string }[];
  };
  partners: {
    eyebrow: string;
    title: string;
    desc: string;
    certs: string[];
  };
  gallery: {
    eyebrow: string;
    title: string;
    desc: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    desc: string;
    addressLabel: string;
    address: string;
    phoneLabel: string;
    phone: string;
    emailLabel: string;
    email: string;
    hoursLabel: string;
    hours: string;
    formName: string;
    formEmail: string;
    formPhone: string;
    formMessage: string;
    formSubmit: string;
    formSuccess: string;
  };
  footer: {
    about: string;
    quick: string;
    contact: string;
    social: string;
    rights: string;
    made: string;
  };
  marquee: string[];
}

const en: Dictionary = {
  nav: {
    home: 'Home',
    about: 'About',
    products: 'Products',
    why: 'Why Us',
    process: 'Process',
    gallery: 'Gallery',
    contact: 'Contact',
    cta: 'Get a Quote',
  },
  hero: {
    badge: 'Farm-fresh • Saudi made',
    title: 'Fresh Eggs',
    titleAccent: 'Delivered Every Day',
    desc: 'Family Eggs For Trading Co. brings you premium, farm-fresh eggs — naturally nourished, carefully graded and delivered daily with the quality and care your family deserves.',
    ctaContact: 'Contact Us',
    ctaProducts: 'View Products',
    stat1: '100%',
    stat1Label: 'Fresh Saudi eggs',
    stat2: '360',
    stat2Label: 'Eggs per box',
    stat3: '3 mo',
    stat3Label: 'Shelf life',
  },
  about: {
    eyebrow: 'About Us',
    title: 'A family name built on trust',
    story:
      'Family Eggs For Trading Co. raises healthy hens on modern farms near Marat in the Riyadh region of Saudi Arabia. We combine solar-powered facilities with genuine family care to produce fresh Saudi white eggs that reach your table at their absolute freshest.',
    mission: 'Our Mission',
    missionText:
      'To deliver consistently fresh, safe and nutritious eggs to every home and business through responsible farming and reliable daily distribution.',
    vision: 'Our Vision',
    visionText:
      'To be the most trusted name in egg production in the Kingdom — a model of sustainable, quality-driven local food production.',
    quality: 'Quality Commitment',
    qualityText:
      'Every egg is graded, inspected and traceable. We hold ourselves to strict hygiene and food-safety standards at every stage, from hen house to home.',
  },
  products: {
    eyebrow: 'Our Products',
    title: 'Fresh Saudi white eggs',
    desc: 'Fresh white eggs, available in retail cartons, 30-egg trays and 360-egg boxes for homes and businesses.',
    items: [
      {
        name: 'Retail Carton',
        desc: 'Small cartons of fresh white eggs — convenient for everyday family use at home.',
        tag: 'Retail',
      },
      {
        name: 'Tray of 30 Eggs',
        desc: 'A full tray of 30 fresh white eggs — ideal for families, bakeries and restaurants.',
        tag: 'Most popular',
      },
      {
        name: 'Box of 360 Eggs',
        desc: 'A box of 12 trays (360 eggs) for wholesale orders and food businesses.',
        tag: 'Wholesale',
      },
    ],
    cta: 'Request pricing',
  },
  why: {
    eyebrow: 'Why Choose Us',
    title: 'Quality you can taste, trust you can rely on',
    desc: 'Every choice we make is designed around freshness, safety and the people we serve.',
    items: [
      { title: 'Fresh Daily', desc: 'Eggs are collected, graded and packed every day to keep them fresh.' },
      { title: 'Solar-Powered Farms', desc: 'Our farms run on eco-friendly solar energy systems.' },
      { title: 'Careful Grading', desc: 'Each egg is candled and graded on modern automated lines.' },
      { title: 'Modern Facilities', desc: 'Climate-controlled hen houses with modern grading and packing.' },
      { title: 'Fresh Saudi Eggs', desc: '100% local Saudi production, from our farms near Marat, Riyadh.' },
    ],
  },
  process: {
    eyebrow: 'Production Process',
    title: 'From our farm to your table',
    desc: 'Five carefully controlled steps ensure every egg arrives fresh, clean and safe.',
    steps: [
      { title: 'Farm Care', desc: 'Healthy hens raised in clean, climate-controlled, solar-powered houses.' },
      { title: 'Collection', desc: 'Eggs are gently collected on automated belts multiple times a day.' },
      { title: 'Quality Inspection', desc: 'Each egg is candled and graded for shell quality and freshness.' },
      { title: 'Packaging', desc: 'Sorted by size and sealed in clean, food-grade trays and cartons.' },
      { title: 'Distribution', desc: 'Delivered same-day through our temperature-controlled fleet.' },
    ],
  },
  stats: {
    title: 'Our product at a glance',
    items: [
      { value: 30, suffix: '', label: 'Eggs per tray' },
      { value: 360, suffix: '', label: 'Eggs per box' },
      { value: 3, suffix: ' mo', label: 'Shelf life' },
      { value: 100, suffix: '%', label: 'Fresh Saudi eggs' },
    ],
  },
  testimonials: {
    eyebrow: 'Testimonials',
    title: 'What our customers say',
    items: [
      {
        quote:
          'The freshness is unbeatable. Our customers immediately noticed the difference in quality once we switched to Family Eggs.',
        name: 'Khalid Al-Otaibi',
        role: 'Supermarket Owner, Riyadh',
      },
      {
        quote:
          'Reliable daily delivery and consistent grading. As a bakery, that consistency is everything to us.',
        name: 'Sara Pastries',
        role: 'Head Chef, Jeddah',
      },
      {
        quote:
          'Clean packaging, golden yolks, and a team that genuinely cares. A true family business you can trust.',
        name: 'Mohammed Al-Harbi',
        role: 'Restaurant Group, Dammam',
      },
    ],
  },
  partners: {
    eyebrow: 'Partners & Certifications',
    title: 'Backed by standards, chosen by leaders',
    desc: 'We work hand in hand with leading retailers and meet the certifications that matter.',
    certs: ['SFDA Compliant', 'ISO 22000', 'HACCP', 'Halal Certified', 'GMP'],
  },
  gallery: {
    eyebrow: 'Gallery',
    title: 'Inside our farms & facilities',
    desc: 'A look at the people, places and processes behind every fresh egg.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Let’s talk fresh eggs',
    desc: 'Questions, bulk orders or partnership enquiries — our team is ready to help.',
    addressLabel: 'Visit us',
    address: 'Marat — Labkhat Al-Muqtasim Rd, P.O. Box 12816, Riyadh, Kingdom of Saudi Arabia',
    phoneLabel: 'Call us',
    phone: '+966 50 748 8650',
    emailLabel: 'Email us',
    email: 'AL-HOMODI@HOTMAIL.COM',
    hoursLabel: 'Working hours',
    hours: 'Sat – Thu, 8:00 AM – 6:00 PM',
    formName: 'Full name',
    formEmail: 'Email address',
    formPhone: 'Phone number',
    formMessage: 'How can we help?',
    formSubmit: 'Send message',
    formSuccess: 'Thank you! We’re opening WhatsApp so you can send us your message directly. If it doesn’t open, message us at +966 50 748 8650.',
  },
  footer: {
    about:
      'Family Eggs For Trading Co. — premium Saudi farm-fresh eggs, delivered every day with quality and care.',
    quick: 'Quick Links',
    contact: 'Contact',
    social: 'Follow Us',
    rights: 'All rights reserved.',
    made: 'Fresh from our family to yours.',
  },
  marquee: ['Farm Fresh Daily', 'ISO 22000 Certified', 'HACCP', 'SFDA Compliant', 'Halal Certified', 'Solar-Powered Farms', '100% Saudi Eggs', 'Graded & Inspected'],
};

const ar: Dictionary = {
  nav: {
    home: 'الرئيسية',
    about: 'من نحن',
    products: 'المنتجات',
    why: 'لماذا نحن',
    process: 'مراحل الإنتاج',
    gallery: 'المعرض',
    contact: 'تواصل معنا',
    cta: 'اطلب عرض سعر',
  },
  hero: {
    badge: 'طازج من المزرعة • صناعة سعودية',
    title: 'بيض طازج',
    titleAccent: 'يصلك كل يوم',
    desc: 'شركة بيض العائلة للتجارة تقدّم لك بيضاً طازجاً وفاخراً من المزرعة — مغذّى طبيعياً، مفروز بعناية، ويصلك يومياً بالجودة والاهتمام الذي تستحقه عائلتك.',
    ctaContact: 'تواصل معنا',
    ctaProducts: 'تصفّح المنتجات',
    stat1: '100%',
    stat1Label: 'بيض سعودي طازج',
    stat2: '360',
    stat2Label: 'بيضة في الكرتون',
    stat3: '3 أشهر',
    stat3Label: 'مدة الصلاحية',
  },
  about: {
    eyebrow: 'من نحن',
    title: 'اسم عائلي بُني على الثقة',
    story:
      'تربّي شركة بيض العائلة للتجارة دجاجاً سليماً في مزارع حديثة بمحافظة مرات في منطقة الرياض بالمملكة العربية السعودية. نجمع بين المرافق العاملة بالطاقة الشمسية واهتمام العائلة الحقيقي لإنتاج بيض سعودي أبيض طازج يصل إلى مائدتك في أفضل درجات طزاجته.',
    mission: 'رسالتنا',
    missionText:
      'توصيل بيض طازج وآمن وغني بالعناصر الغذائية إلى كل منزل ومنشأة من خلال تربية مسؤولة وتوزيع يومي موثوق.',
    vision: 'رؤيتنا',
    visionText:
      'أن نكون الاسم الأكثر ثقة في إنتاج البيض في المملكة — نموذجاً للإنتاج الغذائي المحلي المستدام عالي الجودة.',
    quality: 'التزامنا بالجودة',
    qualityText:
      'كل بيضة تُفرز وتُفحص ويمكن تتبّعها. نلتزم بأعلى معايير النظافة وسلامة الغذاء في كل مرحلة، من المزرعة إلى المنزل.',
  },
  products: {
    eyebrow: 'منتجاتنا',
    title: 'بيض أبيض سعودي طازج',
    desc: 'بيض أبيض طازج، متوفّر بعبوات الأفراد، وأطباق 30 بيضة، وكراتين 360 بيضة للمنازل والمنشآت.',
    items: [
      { name: 'عبوة أفراد', desc: 'عبوات صغيرة من البيض الأبيض الطازج، مناسبة للاستهلاك المنزلي اليومي.', tag: 'للأفراد' },
      { name: 'طبق 30 بيضة', desc: 'طبق كامل من 30 بيضة بيضاء طازجة، الخيار الأمثل للعائلات والمخابز والمطاعم.', tag: 'الأكثر طلباً' },
      { name: 'كرتون 360 بيضة', desc: 'كرتون يضم 12 طبقاً (360 بيضة) للبيع بالجملة والمنشآت الغذائية.', tag: 'جملة' },
    ],
    cta: 'اطلب الأسعار',
  },
  why: {
    eyebrow: 'لماذا نحن',
    title: 'جودة تتذوّقها وثقة تعتمد عليها',
    desc: 'كل قرار نتخذه مصمّم حول الطزاجة والسلامة والأشخاص الذين نخدمهم.',
    items: [
      { title: 'طازج يومياً', desc: 'يُجمع البيض ويُفرز ويُعبّأ يومياً للحفاظ على طزاجته.' },
      { title: 'طاقة شمسية', desc: 'مزارعنا مزوّدة بأنظمة طاقة شمسية صديقة للبيئة.' },
      { title: 'فرز وفحص دقيق', desc: 'فحص بالإضاءة وفرز آلي لكل بيضة على خطوط حديثة.' },
      { title: 'مرافق حديثة', desc: 'حظائر مكيّفة وخطوط تدريج وتعبئة حديثة.' },
      { title: 'بيض سعودي طازج', desc: 'إنتاج محلي سعودي 100% من مزارعنا بمحافظة مرات.' },
    ],
  },
  process: {
    eyebrow: 'مراحل الإنتاج',
    title: 'من مزرعتنا إلى مائدتك',
    desc: 'خمس مراحل دقيقة الضبط تضمن وصول كل بيضة طازجة ونظيفة وآمنة.',
    steps: [
      { title: 'رعاية المزرعة', desc: 'دجاج سليم يُربّى في حظائر نظيفة ومكيّفة تعمل بالطاقة الشمسية.' },
      { title: 'الجمع', desc: 'يُجمع البيض بلطف عبر سيور آلية عدة مرات يومياً.' },
      { title: 'فحص الجودة', desc: 'تُفحص كل بيضة بالإضاءة وتُفرز حسب جودة القشرة والطزاجة.' },
      { title: 'التعبئة', desc: 'تُصنّف حسب الحجم وتُغلّف في أطباق وكراتين نظيفة آمنة غذائياً.' },
      { title: 'التوزيع', desc: 'يصل في نفس اليوم عبر أسطولنا المبرّد.' },
    ],
  },
  stats: {
    title: 'منتجنا بالأرقام',
    items: [
      { value: 30, suffix: '', label: 'بيضة في الطبق' },
      { value: 360, suffix: '', label: 'بيضة في الكرتون' },
      { value: 3, suffix: ' أشهر', label: 'مدة الصلاحية' },
      { value: 100, suffix: '%', label: 'بيض سعودي طازج' },
    ],
  },
  testimonials: {
    eyebrow: 'آراء العملاء',
    title: 'ماذا يقول عملاؤنا',
    items: [
      { quote: 'الطزاجة لا تُضاهى. لاحظ عملاؤنا الفرق في الجودة فور تحوّلنا إلى بيض العائلة.', name: 'خالد العتيبي', role: 'صاحب سوبرماركت، الرياض' },
      { quote: 'توصيل يومي موثوق وفرز ثابت. وكوننا مخبزاً، فإن هذا الثبات يعني لنا كل شيء.', name: 'حلويات سارة', role: 'رئيسة الطهاة، جدة' },
      { quote: 'تغليف نظيف، وصفار ذهبي، وفريق يهتم بصدق. عمل عائلي حقيقي يمكنك الوثوق به.', name: 'محمد الحربي', role: 'مجموعة مطاعم، الدمام' },
    ],
  },
  partners: {
    eyebrow: 'الشركاء والشهادات',
    title: 'مدعومون بالمعايير، مختارون من الكبار',
    desc: 'نعمل جنباً إلى جنب مع كبرى المتاجر ونستوفي الشهادات التي تهمّك.',
    certs: ['متوافق مع الغذاء والدواء', 'آيزو 22000', 'هاسب', 'حلال معتمد', 'ممارسات التصنيع الجيدة'],
  },
  gallery: {
    eyebrow: 'المعرض',
    title: 'من داخل مزارعنا ومرافقنا',
    desc: 'نظرة على الأشخاص والأماكن والعمليات وراء كل بيضة طازجة.',
  },
  contact: {
    eyebrow: 'تواصل',
    title: 'لنتحدّث عن البيض الطازج',
    desc: 'استفسارات، طلبات بالجملة أو شراكات — فريقنا جاهز لمساعدتك.',
    addressLabel: 'زورونا',
    address: 'محافظة مرات – طريق لبخة المقتسم – ص.ب 12816، الرياض، المملكة العربية السعودية',
    phoneLabel: 'اتصل بنا',
    phone: '+966 50 748 8650',
    emailLabel: 'راسلنا',
    email: 'AL-HOMODI@HOTMAIL.COM',
    hoursLabel: 'ساعات العمل',
    hours: 'السبت – الخميس، 8:00 ص – 6:00 م',
    formName: 'الاسم الكامل',
    formEmail: 'البريد الإلكتروني',
    formPhone: 'رقم الهاتف',
    formMessage: 'كيف يمكننا مساعدتك؟',
    formSubmit: 'إرسال الرسالة',
    formSuccess: 'شكراً لك! سيتم فتح واتساب لإرسال رسالتك إلينا مباشرة. إذا لم يُفتح، راسلنا على +966 50 748 8650.',
  },
  footer: {
    about: 'شركة بيض العائلة للتجارة — بيض سعودي طازج وفاخر يصلك كل يوم بجودة واهتمام.',
    quick: 'روابط سريعة',
    contact: 'تواصل',
    social: 'تابعنا',
    rights: 'جميع الحقوق محفوظة.',
    made: 'طازج من عائلتنا إلى عائلتك.',
  },
  marquee: ['طازج يومياً من المزرعة', 'آيزو 22000', 'هاسب', 'متوافق مع الغذاء والدواء', 'حلال معتمد', 'مزارع بالطاقة الشمسية', 'بيض سعودي 100%', 'مفروز ومفحوص'],
};

export const CONTENT: Record<Lang, Dictionary> = { en, ar };
