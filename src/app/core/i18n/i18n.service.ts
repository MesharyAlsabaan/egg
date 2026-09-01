import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';

import { DICTIONARIES, type Dictionary, type Lang } from './dictionary';

const STORAGE_KEY = 'familyeggs.lang';

export const LANGS: readonly Lang[] = ['ar', 'en'];

export function isLang(value: unknown): value is Lang {
  return value === 'ar' || value === 'en';
}

/**
 * The single source of the active language.
 *
 * Components read `t()` and never hold their own copy of a string. Setting
 * the language also rewrites `lang` and `dir` on <html>, which is what flips
 * every logical property in the stylesheet — no per-component RTL branches.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly doc = inject(DOCUMENT);

  private readonly current = signal<Lang>('ar');

  readonly lang = this.current.asReadonly();
  readonly dir = computed<'rtl' | 'ltr'>(() => (this.current() === 'ar' ? 'rtl' : 'ltr'));
  readonly t = computed<Dictionary>(() => DICTIONARIES[this.current()]);
  readonly other = computed<Lang>(() => (this.current() === 'ar' ? 'en' : 'ar'));

  apply(lang: Lang): void {
    this.current.set(lang);

    const root = this.doc.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    try {
      this.doc.defaultView?.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Private mode or storage disabled: the URL still carries the language.
    }
  }

}
