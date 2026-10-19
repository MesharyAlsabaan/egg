import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { CONTACT, DICTIONARIES, type Lang } from './i18n/dictionary';
import { ORIGIN, type PageKey, isIndexable, pageUrl, xDefaultLang } from './pages';

const OG_IMAGE = `${ORIGIN}/media/farm-day-1200.jpg`;
const ORG_ID = `${ORIGIN}/#organization`;

/**
 * Keeps the head in sync with the active page and language: title,
 * description, Open Graph, canonical, the hreflang set, and the JSON-LD
 * graph. All of it runs during prerender, so crawlers that never execute
 * JavaScript still get the final tags in the HTML.
 *
 * Structured data is limited to what the site can back up: Organization
 * (identity, addresses, contact points), WebSite, WebPage, BreadcrumbList and
 * — on the wholesale page — FAQPage, mirroring the visible questions. No
 * Product markup: Google only accepts it with price, reviews or ratings, and
 * none of those are published.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly doc = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update(lang: Lang, page: PageKey): void {
    const t = DICTIONARIES[lang];
    const { title, description } = page === 'home' ? t.meta : t.pageMeta[page];
    const url = pageUrl(lang, page);

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({
      name: 'robots',
      content: isIndexable(page) ? 'index, follow, max-image-preview:large' : 'noindex, follow',
    });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: t.site.name });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: OG_IMAGE });
    this.meta.updateTag({ property: 'og:image:alt', content: t.meta.ogAlt });
    this.meta.updateTag({ property: 'og:locale', content: lang === 'ar' ? 'ar_SA' : 'en_US' });
    this.meta.updateTag({
      property: 'og:locale:alternate',
      content: lang === 'ar' ? 'en_US' : 'ar_SA',
    });

    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: OG_IMAGE });

    this.link('canonical', url);
    this.link('alternate', pageUrl('ar', page), 'ar');
    this.link('alternate', pageUrl('en', page), 'en');
    this.link('alternate', pageUrl(xDefaultLang(page), page), 'x-default');

    this.jsonLd(this.graph(lang, page, title, description));
  }

  private graph(lang: Lang, page: PageKey, title: string, description: string): object {
    const t = DICTIONARIES[lang];
    const url = pageUrl(lang, page);
    const home = pageUrl(lang, 'home');
    const office = CONTACT.officeLines[lang];
    const farm = CONTACT.farmLines[lang];

    const nodes: object[] = [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: DICTIONARIES.ar.site.name,
        alternateName: DICTIONARIES.en.site.name,
        url: `${ORIGIN}/`,
        logo: `${ORIGIN}/brand/logo-lockup-720.png`,
        image: OG_IMAGE,
        email: CONTACT.email,
        telephone: CONTACT.phoneHref,
        address: {
          '@type': 'PostalAddress',
          streetAddress: office[0],
          addressLocality: lang === 'ar' ? 'الرياض' : 'Riyadh',
          postalCode: '12823-2778',
          addressCountry: 'SA',
        },
        location: {
          '@type': 'Place',
          name: lang === 'ar' ? 'مزرعة بيض العائلة — مرات' : 'Family Eggs farm — Marat',
          address: {
            '@type': 'PostalAddress',
            streetAddress: farm[0],
            addressLocality: lang === 'ar' ? 'مرات' : 'Marat',
            addressRegion: lang === 'ar' ? 'منطقة الرياض' : 'Riyadh Region',
            addressCountry: 'SA',
          },
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'sales',
            telephone: CONTACT.whatsappHref,
            email: CONTACT.email,
            availableLanguage: ['ar', 'en'],
          },
          {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: CONTACT.phoneHref,
            availableLanguage: ['ar', 'en'],
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${home}#website`,
        url: home,
        name: t.site.name,
        inLanguage: lang,
        publisher: { '@id': ORG_ID },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: lang,
        isPartOf: { '@id': `${home}#website` },
        about: { '@id': ORG_ID },
        primaryImageOfPage: OG_IMAGE,
        ...(page === 'home' ? {} : { breadcrumb: { '@id': `${url}#breadcrumb` } }),
      },
    ];

    if (page !== 'home') {
      nodes.push({
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.site.home, item: home },
          { '@type': 'ListItem', position: 2, name: t[page].eyebrow, item: url },
        ],
      });
    }

    if (page === 'wholesale') {
      nodes.push({
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        inLanguage: lang,
        mainEntity: t.wholesale.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      });
    }

    return { '@context': 'https://schema.org', '@graph': nodes };
  }

  /** One JSON-LD block, replaced on every update so pages never accumulate graphs. */
  private jsonLd(data: object): void {
    let script = this.doc.head.querySelector<HTMLScriptElement>('script#ld-graph');
    if (!script) {
      script = this.doc.createElement('script');
      script.id = 'ld-graph';
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    // `<` cannot appear in any value today, but escaping it keeps a future
    // string from ever closing the script element early.
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
  }

  /** One tag per (rel, hreflang) pair — updated in place, never duplicated. */
  private link(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang
      ? `link[rel="${rel}"][hreflang="${hreflang}"]`
      : `link[rel="${rel}"]:not([hreflang])`;

    let element = this.doc.head.querySelector<HTMLLinkElement>(selector);
    if (!element) {
      element = this.doc.createElement('link');
      element.rel = rel;
      if (hreflang) {
        element.hreflang = hreflang;
      }
      this.doc.head.appendChild(element);
    }
    element.href = href;
  }
}
