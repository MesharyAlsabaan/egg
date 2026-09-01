import { DOCUMENT, Injectable, inject } from '@angular/core';

/**
 * In-page navigation.
 *
 * A plain `href="#automation"` did nothing here: the router owns the URL, so
 * the browser's own fragment handling never ran and the page stayed put. This
 * scrolls the element itself and then writes the fragment into the URL, which
 * keeps the link shareable without handing control back to the router.
 *
 * Section offset comes from `scroll-margin-top` in the stylesheet, so the
 * sticky header never covers the heading it just scrolled to.
 */
@Injectable({ providedIn: 'root' })
export class ScrollToService {
  private readonly doc = inject(DOCUMENT);

  go(id: string): void {
    const target = this.doc.getElementById(id);
    if (!target) {
      return;
    }

    const reduced =
      this.doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });

    // Move keyboard focus with the view. Sections are not focusable by
    // default, so give it a temporary tabindex and take it back afterwards.
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }
    target.focus({ preventScroll: true });

    // history.replaceState, not router.navigate: a router navigation triggers
    // scrollPositionRestoration, which threw the page straight back to the top
    // and cancelled the scroll that had just started.
    // Keep the path: a bare '#id' resolves against <base href="/"> and
    // would drop the language out of a shared link.
    const view = this.doc.defaultView;
    view?.history.replaceState(null, '', `${view.location.pathname}#${id}`);
  }
}
