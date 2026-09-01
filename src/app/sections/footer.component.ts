import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CONTACT } from '../core/i18n/dictionary';
import { I18nService } from '../core/i18n/i18n.service';
import { ScrollToService } from '../core/scroll-to.service';
import { WhatsappService } from '../core/whatsapp.service';
import { BrandLogoComponent } from '../shared/brand-logo.component';

/**
 * Links, company identity, copyright and the language switch. No marketing
 * copy and no third call to action — the contact section above already lists
 * every channel.
 *
 * Social icons stay out until there are real accounts to link to; the
 * previous site pointed three of them at "#".
 */
@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrandLogoComponent, RouterLink],
  template: `
    <footer class="foot">
      <div class="foot__inner">
        <div class="foot__brand">
          <app-brand-logo variant="logo-lockup" sizes="(min-width: 1100px) 190px, (min-width: 768px) 170px, 155px" />
          <p class="foot__tag">{{ t().site.tagline }}</p>
        </div>

        <nav class="foot__nav" [attr.aria-label]="t().footer.nav">
          <p class="foot__label">{{ t().footer.nav }}</p>
          <ul>
            @for (item of t().nav; track item.id) {
              <li>
                <a [href]="'#' + item.id" (click)="jump($event, item.id)">{{ item.label }}</a>
              </li>
            }
          </ul>
        </nav>

        <div class="foot__meta">
          <p class="foot__label">{{ t().footer.contact }}</p>
          <p>
            <a [href]="whatsappHref()" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.2-.8-2.7-1.2-4.4-4-4.5-4.2-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.4 2.6 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9 1c.2.1.4.2.5.3.1.3.1.7-.1 1.2Z"
                />
              </svg>
              <span dir="ltr">{{ c.whatsappDisplay }}</span>
            </a>
          </p>
          <p>
            <a [href]="'tel:' + c.phoneHref">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path
                  d="M6.6 3.5h3l1.2 3.4-1.9 1.3a11 11 0 0 0 4.9 4.9l1.3-1.9 3.4 1.2v3a2 2 0 0 1-2.2 2A16.4 16.4 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"
                  stroke-linejoin="round"
                />
              </svg>
              <span dir="ltr">{{ c.phoneDisplay }}</span>
            </a>
          </p>
          <p>
            <a [href]="'mailto:' + c.email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <rect x="2.75" y="5" width="18.5" height="14" rx="2.5" />
                <path d="m3.5 7 8.5 6 8.5-6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span dir="ltr">{{ c.email }}</span>
            </a>
          </p>
        </div>
      </div>

      <div class="foot__bottom">
        <p>© {{ year }} {{ t().site.name }} — {{ t().site.rights }}</p>
        <a class="foot__lang" [routerLink]="'/' + i18n.other()" [attr.lang]="i18n.other()">
          {{ t().site.langToggle }}
        </a>
      </div>
    </footer>
  `,
  styles: `
    .foot {
      background: var(--ivory);
      color: var(--on-ivory);
      padding-block: clamp(3rem, 8vw, 4.5rem) 0;
      border-block-start: 1px solid var(--ivory-line);
    }

    .foot__inner {
      width: min(100% - (var(--gutter) * 2), var(--container));
      margin-inline: auto;
      display: grid;
      gap: 2.5rem;
    }

    .foot__brand {
      --logo-w: 155px;
    }

    .foot__tag {
      margin-block-start: 15px;
      font-size: var(--step--1);
      color: var(--on-ivory-dim);
    }

    @media (min-width: 768px) {
      .foot__brand {
        --logo-w: 170px;
      }
    }

    @media (min-width: 1100px) {
      .foot__brand {
        --logo-w: 190px;
      }
    }

    .foot__label {
      font-size: var(--step--1);
      font-weight: 700;
      letter-spacing: 0.06em;
      color: var(--olive);
      margin-block-end: 0.5rem;
    }

    .foot__nav ul {
      display: grid;
      font-weight: 500;
    }

    .foot__nav a,
    .foot__meta a {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      min-height: var(--tap);
    }

    .foot__meta svg {
      width: 17px;
      height: 17px;
      flex: none;
      color: var(--olive);
    }

    .foot__nav a:hover,
    .foot__meta a:hover,
    .foot__lang:hover {
      color: var(--olive);
    }

    .foot__meta {
      font-size: var(--step--1);
      color: var(--on-ivory-dim);
    }

    .foot__bottom {
      width: min(100% - (var(--gutter) * 2), var(--container));
      margin: clamp(2.5rem, 7vw, 3.5rem) auto 0;
      padding-block: 1.25rem;
      border-block-start: 1px solid var(--ivory-line);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem 1rem;
      font-size: var(--step--1);
      color: var(--on-ivory-dim);
    }

    .foot__lang {
      display: inline-flex;
      align-items: center;
      min-height: var(--tap);
      font-weight: 600;
      color: var(--on-ivory);
    }

    @media (min-width: 820px) {
      .foot__inner {
        grid-template-columns: 1.4fr 1fr 1fr;
        gap: 3rem;
      }
    }
  `,
})
export class FooterComponent {
  protected readonly c = CONTACT;
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;
  protected readonly year = new Date().getFullYear();
  private readonly scroller = inject(ScrollToService);
  private readonly whatsapp = inject(WhatsappService);
  protected readonly whatsappHref = computed(() => this.whatsapp.enquiry());

  protected jump(event: Event, id: string): void {
    event.preventDefault();
    this.scroller.go(id);
  }
}
