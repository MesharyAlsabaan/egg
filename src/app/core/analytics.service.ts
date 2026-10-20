import { DOCUMENT, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * GA4 measurement ID, e.g. 'G-XXXXXXXXXX'. Empty means Google Analytics is
 * never loaded: events still go to `window.dataLayer`, where a tag manager
 * added later can pick them up, but nothing leaves the browser.
 *
 * Set it only once the owner has created the GA4 property and decided on
 * consent handling — see docs/seo-growth/13-ANALYTICS-AND-SEARCH-CONSOLE.md.
 */
export const GA4_MEASUREMENT_ID = '';

/** Read by the privacy notice, so what it says always matches what runs. */
export const ANALYTICS_ENABLED = GA4_MEASUREMENT_ID !== '';

/**
 * The only event names the site sends.
 *
 * The three `*_inquiry_submit` events are conversions and fire ONLY when the
 * website's own server has accepted and emailed the enquiry. A WhatsApp or
 * email hand-off is not a delivered enquiry — it is `inquiry_handoff`, and a
 * failed send is `inquiry_error`. Neither should be marked as a key event.
 */
export type AnalyticsEvent =
  | 'wholesale_inquiry_submit'
  | 'distributor_inquiry_submit'
  | 'international_inquiry_submit'
  | 'inquiry_handoff'
  | 'inquiry_error'
  | 'whatsapp_click'
  | 'phone_click'
  | 'email_click';

/**
 * Parameters are deliberately low-cardinality labels. Never pass anything a
 * visitor typed — names, companies, numbers and addresses stay out.
 */
export type AnalyticsParams = Record<string, string>;

type Gtag = (...args: unknown[]) => void;
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: Gtag };

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private started = false;

  /**
   * Called once from the root component. Loads GA4 if configured and installs
   * the one delegated listener for contact-link clicks — one listener for the
   * whole document, so a link rendered twice can never double-count.
   */
  start(): void {
    if (!this.isBrowser || this.started) {
      return;
    }
    this.started = true;
    const view = this.doc.defaultView as AnalyticsWindow | null;
    if (!view) {
      return;
    }
    view.dataLayer = view.dataLayer ?? [];

    if (GA4_MEASUREMENT_ID) {
      view.gtag = function gtag() {
        // gtag.js expects the Arguments object itself, not an array.
        // eslint-disable-next-line prefer-rest-params
        view.dataLayer!.push(arguments);
      };
      view.gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'granted',
      });
      view.gtag('js', new Date());
      view.gtag('config', GA4_MEASUREMENT_ID, { anonymize_ip: true });

      const script = this.doc.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
      this.doc.head.appendChild(script);
    }

    this.doc.addEventListener('click', this.onClick, { capture: true, passive: true });
  }

  track(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
    if (!this.isBrowser) {
      return;
    }
    const view = this.doc.defaultView as AnalyticsWindow | null;
    if (!view) {
      return;
    }
    const payload = { ...params, page_path: view.location.pathname };
    if (view.gtag) {
      view.gtag('event', event, payload);
    } else {
      (view.dataLayer = view.dataLayer ?? []).push({ event, ...payload });
    }
  }

  private readonly onClick = (event: Event): void => {
    const target = event.target as Element | null;
    const link = target?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!link) {
      return;
    }
    // Links the inquiry form opens itself are tracked as submissions instead.
    if (link.dataset['track'] === 'off') {
      return;
    }
    const href = link.getAttribute('href') ?? '';
    const location = link.closest('[data-track-area]')?.getAttribute('data-track-area') ?? 'page';

    if (href.startsWith('https://wa.me/')) {
      this.track('whatsapp_click', { link_location: location });
    } else if (href.startsWith('tel:')) {
      this.track('phone_click', { link_location: location });
    } else if (href.startsWith('mailto:') || href.includes('/cdn-cgi/l/email-protection')) {
      // Cloudflare rewrites mailto links in the served HTML; both forms count.
      this.track('email_click', { link_location: location });
    }
  };
}
