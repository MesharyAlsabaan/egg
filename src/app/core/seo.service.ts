import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { DICTIONARIES, type Lang } from './i18n/dictionary';

const ORIGIN = 'https://familyeggs.sa';
const OG_IMAGE = `${ORIGIN}/media/farm-day-1200.jpg`;

/**
 * Keeps the head in sync with the active language: title, description,
 * Open Graph, canonical, and the hreflang pair (plus x-default pointing at
 * Arabic, which is the primary market).
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly doc = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update(lang: Lang): void {
    const t = DICTIONARIES[lang];
    const url = `${ORIGIN}/${lang}`;

    this.title.setTitle(t.meta.title);
    this.meta.updateTag({ name: 'description', content: t.meta.description });

    this.meta.updateTag({ property: 'og:title', content: t.meta.title });
    this.meta.updateTag({ property: 'og:description', content: t.meta.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: OG_IMAGE });
    this.meta.updateTag({ property: 'og:image:alt', content: t.meta.ogAlt });
    this.meta.updateTag({
      property: 'og:locale',
      content: lang === 'ar' ? 'ar_SA' : 'en_US',
    });
    this.meta.updateTag({
      property: 'og:locale:alternate',
      content: lang === 'ar' ? 'en_US' : 'ar_SA',
    });

    this.meta.updateTag({ name: 'twitter:title', content: t.meta.title });
    this.meta.updateTag({ name: 'twitter:description', content: t.meta.description });
    this.meta.updateTag({ name: 'twitter:image', content: OG_IMAGE });

    this.link('canonical', url);
    this.link('alternate', `${ORIGIN}/ar`, 'ar');
    this.link('alternate', `${ORIGIN}/en`, 'en');
    this.link('alternate', `${ORIGIN}/ar`, 'x-default');
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
