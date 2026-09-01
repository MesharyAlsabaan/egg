import { Injectable, inject } from '@angular/core';

import { CONTACT } from './i18n/dictionary';
import { I18nService } from './i18n/i18n.service';

/**
 * Builds the single wa.me deep link the site uses. The message is written in
 * the language the visitor is reading, so the thread starts in the right one.
 */
@Injectable({ providedIn: 'root' })
export class WhatsappService {
  private readonly i18n = inject(I18nService);

  private readonly openers: Record<'ar' | 'en', string> = {
    ar: 'السلام عليكم، أرغب بطلب عرض سعر من بيض العائلة للتجارة.',
    en: 'Hello, I would like to request a quote from Family Eggs For Trading Co.',
  };

  /** The quote request, opened from the header button. */
  enquiry(): string {
    return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
      this.openers[this.i18n.lang()],
    )}`;
  }
}
