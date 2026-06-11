import { Injectable, computed, signal, effect, inject, DOCUMENT } from '@angular/core';
import { CONTENT, Dictionary, Lang } from './translations';

const STORAGE_KEY = 'fe-lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly doc = inject(DOCUMENT);

  /** Active language as a reactive signal. */
  readonly lang = signal<Lang>(this.initialLang());

  /** Strongly-typed dictionary for the active language. */
  readonly t = computed<Dictionary>(() => CONTENT[this.lang()]);

  /** Layout direction derived from language. */
  readonly dir = computed<'rtl' | 'ltr'>(() => (this.lang() === 'ar' ? 'rtl' : 'ltr'));

  readonly isRtl = computed(() => this.lang() === 'ar');

  constructor() {
    // Keep <html> lang/dir and persistence in sync with the signal.
    effect(() => {
      const lang = this.lang();
      const html = this.doc.documentElement;
      html.setAttribute('lang', lang);
      html.setAttribute('dir', this.dir());
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        /* storage unavailable — non-fatal */
      }
    });
  }

  toggle(): void {
    this.lang.update((l) => (l === 'en' ? 'ar' : 'en'));
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
  }

  private initialLang(): Lang {
    // Site is Arabic-only.
    return 'ar';
  }
}
