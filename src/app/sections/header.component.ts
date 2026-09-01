import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { I18nService } from '../core/i18n/i18n.service';
import { ScrollToService } from '../core/scroll-to.service';
import { WhatsappService } from '../core/whatsapp.service';
import { BrandLogoComponent } from '../shared/brand-logo.component';

/**
 * The site's only "request a quote" button lives here.
 *
 * It used to appear in the hero, on every pack card, in the sticky bar and
 * again at the end of the page. One sticky header carries it now; nothing
 * else on the page asks for the same action.
 */
@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrandLogoComponent, RouterLink],
  template: `
    <header class="bar" [class.is-solid]="solid()" [class.is-open]="open()">
      <a
        class="bar__brand"
        href="#hero"
        [attr.aria-label]="t().site.name"
        (click)="jump($event, 'hero')"
      >
        <app-brand-logo
          variant="logo-lockup"
          [priority]="true"
          sizes="(min-width: 1100px) 128px, (min-width: 768px) 115px, 105px"
        />
      </a>

      <nav class="bar__nav" [attr.aria-label]="t().footer.nav">
        <ul>
          @for (item of t().nav; track item.id) {
            <li>
              <a [href]="'#' + item.id" (click)="jump($event, item.id)">{{ item.label }}</a>
            </li>
          }
        </ul>
      </nav>

      <!-- The accessible name has to start with the visible text, otherwise
           "click English" in voice control does not match the control. -->
      <a class="bar__lang" [routerLink]="'/' + i18n.other()" (click)="close()">
        <span [attr.lang]="i18n.other()">{{ t().site.langToggle }}</span>
        <span class="visually-hidden">{{ t().site.langOther }}</span>
      </a>

      <a class="bar__cta btn btn--primary" [href]="quoteHref()" rel="noopener">{{ t().cta }}</a>

      <button
        type="button"
        class="bar__burger"
        [attr.aria-expanded]="open()"
        [attr.aria-label]="open() ? t().site.menuClose : t().site.menuOpen"
        aria-controls="menu"
        (click)="toggle()"
      >
        <span></span><span></span>
      </button>
    </header>

    @if (open()) {
      <div class="menu" id="menu">
        <ul>
          @for (item of t().nav; track item.id) {
            <li>
              <a [href]="'#' + item.id" (click)="jump($event, item.id)">{{ item.label }}</a>
            </li>
          }
        </ul>
        <a class="btn btn--primary btn--block" [href]="quoteHref()" rel="noopener" (click)="close()">
          {{ t().cta }}
        </a>
      </div>
    }
  `,
  styles: `
    .bar {
      position: fixed;
      inset-block-start: 0;
      inset-inline: 0;
      z-index: 60;
      min-height: var(--header-h);
      display: flex;
      align-items: center;
      gap: clamp(0.5rem, 2vw, 1.25rem);
      padding-inline: var(--gutter);
      background: var(--ivory);
      color: var(--on-ivory);
      transition: box-shadow var(--dur-fast) var(--ease);
    }

    .bar.is-solid,
    .bar.is-open {
      box-shadow: 0 1px 0 var(--ivory-line);
    }

    /* Sized by width, not height: the lockup and the mark have different
       proportions and the brand name has to stay readable in both. */
    /* Sized by width, not height: the lockup has to stay legible, and the
       brand name is the part that has to read. */
    .bar__brand {
      --logo-w: 105px;
      display: inline-flex;
      align-items: center;
      min-height: var(--tap);
      margin-inline-end: auto;
    }

    @media (min-width: 768px) {
      .bar__brand {
        --logo-w: 115px;
      }
    }

    @media (min-width: 1100px) {
      .bar__brand {
        --logo-w: 128px;
      }
    }

    .bar__nav {
      display: none;
    }

    .bar__nav ul {
      display: flex;
      gap: clamp(1rem, 2.5vw, 1.75rem);
      font-size: var(--step--1);
      font-weight: 500;
    }

    .bar__nav a {
      display: inline-flex;
      align-items: center;
      min-height: var(--tap);
      border-block-end: 2px solid transparent;
    }

    .bar__nav a:hover {
      border-block-end-color: var(--orange);
    }

    .bar__lang {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: var(--tap);
      min-width: var(--tap);
      padding-inline: 0.5rem;
      font-size: var(--step--1);
      font-weight: 600;
      letter-spacing: 0.02em;
      opacity: 0.9;
    }

    .bar__lang:hover {
      opacity: 1;
      color: var(--orange);
    }

    .bar__cta {
      display: none;
      padding: 0.55rem 1.15rem;
      min-height: 40px;
      font-size: var(--step--1);
    }

    .bar__burger {
      width: var(--tap);
      height: var(--tap);
      margin-inline-end: calc(var(--gutter) * -0.35);
      display: grid;
      place-content: center;
      gap: 6px;
      background: none;
      border: 0;
      cursor: pointer;
    }

    .bar__burger span {
      display: block;
      width: 22px;
      height: 2px;
      background: currentcolor;
      transition: transform var(--dur-fast) var(--ease);
    }

    .bar.is-open .bar__burger span:first-child {
      transform: translateY(4px) rotate(45deg);
    }

    .bar.is-open .bar__burger span:last-child {
      transform: translateY(-4px) rotate(-45deg);
    }

    .menu {
      position: fixed;
      inset: var(--header-h) 0 0;
      z-index: 55;
      background: var(--ivory);
      color: var(--on-ivory);
      padding: var(--gutter);
      padding-block-end: calc(var(--gutter) + env(safe-area-inset-bottom));
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      overflow-y: auto;
    }

    .menu ul {
      display: flex;
      flex-direction: column;
    }

    .menu a {
      display: flex;
      align-items: center;
      min-height: 56px;
      font-size: var(--step-2);
      font-weight: 600;
      border-block-end: 1px solid var(--ivory-line);
    }

    .menu .btn {
      margin-block-start: auto;
      border-block-end: 0;
    }

    @media (min-width: 900px) {
      .bar__nav,
      .bar__cta {
        display: flex;
      }

      .bar__burger {
        display: none;
      }

      .bar__brand {
        margin-inline-end: 0;
      }

      .bar__nav {
        margin-inline: auto;
      }
    }
  `,
})
export class HeaderComponent implements OnInit, OnDestroy {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;
  private readonly whatsapp = inject(WhatsappService);
  protected readonly quoteHref = computed(() => this.whatsapp.enquiry());

  protected readonly solid = signal(false);
  protected readonly open = signal(false);

  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly scroller = inject(ScrollToService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private frame = 0;

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }
    this.zone.runOutsideAngular(() => {
      this.doc.defaultView?.addEventListener('scroll', this.onScroll, { passive: true });
    });
    this.onScroll();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) {
      return;
    }
    this.doc.defaultView?.removeEventListener('scroll', this.onScroll);
    cancelAnimationFrame(this.frame);
    this.unlock();
  }

  protected toggle(): void {
    this.open.update((v) => !v);
    if (this.open()) {
      this.doc.body.style.overflow = 'hidden';
    } else {
      this.unlock();
    }
  }

  /** Close the menu first, then scroll — otherwise the locked body swallows it. */
  protected jump(event: Event, id: string): void {
    event.preventDefault();
    this.close();
    this.scroller.go(id);
  }

  protected close(): void {
    if (this.open()) {
      this.open.set(false);
      this.unlock();
    }
  }

  /** Always restores scrolling — the menu must never strand the page. */
  private unlock(): void {
    this.doc.body.style.removeProperty('overflow');
  }

  private readonly onScroll = (): void => {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      const view = this.doc.defaultView;
      if (!view) {
        return;
      }
      const next = view.scrollY > view.innerHeight * 0.7;
      if (next !== this.solid()) {
        this.zone.run(() => this.solid.set(next));
      }
    });
  };
}
