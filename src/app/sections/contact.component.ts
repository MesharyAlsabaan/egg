import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { CONTACT } from '../core/i18n/dictionary';
import { I18nService } from '../core/i18n/i18n.service';
import { WhatsappService } from '../core/whatsapp.service';
import { RevealDirective } from '../shared/reveal.directive';

/**
 * Contact details, reachable in one tap each — not another prompt to press a
 * quote button. The header already asks for that once.
 */
@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section class="con" id="contact" aria-labelledby="contact-title">
      <div class="con__inner">
        <header class="con__head" appReveal>
          <p class="eyebrow">{{ t().contact.eyebrow }}</p>
          <h2 class="display" id="contact-title">{{ t().contact.title }}</h2>
          <p class="lede">{{ t().contact.body }}</p>
        </header>

        <ul class="channels">
          <li>
            <a [href]="whatsappHref()" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.2-.8-2.7-1.2-4.4-4-4.5-4.2-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.4 2.6 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9 1c.2.1.4.2.5.3.1.3.1.7-.1 1.2Z"
                />
              </svg>
              <span class="channels__label">{{ t().contact.whatsapp }}</span>
              <span class="channels__value" dir="ltr">{{ c.whatsappDisplay }}</span>
            </a>
          </li>
          <li>
            <a [href]="'tel:' + c.phoneHref">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path
                  d="M6.6 3.5h3l1.2 3.4-1.9 1.3a11 11 0 0 0 4.9 4.9l1.3-1.9 3.4 1.2v3a2 2 0 0 1-2.2 2A16.4 16.4 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="channels__label">{{ t().contact.phone }}</span>
              <span class="channels__value" dir="ltr">{{ c.phoneDisplay }}</span>
            </a>
          </li>
          <li>
            <a [href]="'mailto:' + c.email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <rect x="2.75" y="5" width="18.5" height="14" rx="2.5" />
                <path d="m3.5 7 8.5 6 8.5-6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="channels__label">{{ t().contact.email }}</span>
              <span class="channels__value" dir="ltr">{{ c.email }}</span>
            </a>
          </li>
        </ul>

        <div class="places">
          <address>
            <p class="places__label">{{ t().contact.office }}</p>
            @for (line of officeLines(); track line) {
              <p>{{ line }}</p>
            }
          </address>
          <address>
            <p class="places__label">{{ t().contact.farm }}</p>
            @for (line of farmLines(); track line) {
              <p>{{ line }}</p>
            }
          </address>
        </div>
      </div>
    </section>
  `,
  styles: `
    .con {
      background: var(--ink);
      color: var(--on-ink);
      --accent: var(--orange);
      --muted: var(--on-ink-dim);
      padding-block: var(--section-y);
    }

    .con__inner {
      width: min(100% - (var(--gutter) * 2), var(--container));
      margin-inline: auto;
    }

    .con__head {
      margin-block-end: clamp(2rem, 6vw, 3rem);
    }

    .con__head .lede {
      margin-block-start: 1rem;
    }

    .channels {
      display: grid;
      gap: 1px;
      background: rgb(248 249 246 / 0.18);
      border-block: 1px solid rgb(248 249 246 / 0.18);
    }

    .channels a {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.35rem 0.9rem;
      min-height: 68px;
      padding-block: 1rem;
      background: var(--ink);
      transition: color var(--dur-fast) var(--ease);
    }

    .channels a:hover {
      color: var(--orange);
    }

    .channels svg {
      width: 22px;
      height: 22px;
      flex: none;
      color: var(--orange);
    }

    .channels__label {
      font-size: var(--step--1);
      color: var(--sage);
      min-width: 6.5rem;
    }

    .channels__value {
      font-size: var(--step-1);
      font-weight: 600;
      margin-inline-start: auto;
    }

    .places {
      display: grid;
      gap: 1.75rem;
      margin-block-start: clamp(2rem, 6vw, 3rem);
    }

    .places address {
      font-style: normal;
      font-size: var(--step--1);
      line-height: 1.9;
      color: var(--on-ink-dim);
    }

    .places__label {
      font-weight: 700;
      letter-spacing: 0.04em;
      color: var(--sage);
    }

    @media (min-width: 720px) {
      .places {
        grid-template-columns: 1fr 1fr;
        gap: 2.5rem;
      }
    }
  `,
})
export class ContactComponent {
  protected readonly c = CONTACT;
  private readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;
  private readonly whatsapp = inject(WhatsappService);
  protected readonly whatsappHref = computed(() => this.whatsapp.enquiry());

  protected readonly officeLines = computed(() => CONTACT.officeLines[this.i18n.lang()]);
  protected readonly farmLines = computed(() => CONTACT.farmLines[this.i18n.lang()]);
}
