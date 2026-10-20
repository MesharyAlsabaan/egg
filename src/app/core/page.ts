import { effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import type { Lang } from './i18n/dictionary';
import { I18nService } from './i18n/i18n.service';
import type { PageKey } from './pages';
import { SeoService } from './seo.service';

/**
 * Wires a routed page to its language and head tags. Call it from the page
 * component's constructor (it needs an injection context).
 *
 * The language comes from route data, never from storage, so what the
 * prerender writes for /en/... is always English.
 */
export function setupPage(page: PageKey): void {
  const i18n = inject(I18nService);
  const seo = inject(SeoService);
  const routeLang = toSignal(
    inject(ActivatedRoute).data.pipe(map((data) => data['lang'] as Lang)),
    { initialValue: 'ar' as Lang },
  );

  effect(() => i18n.apply(routeLang()));
  effect(() => seo.update(i18n.lang(), page));
}
