import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { I18nService } from '../core/i18n/i18n.service';
import { MotionService } from '../core/motion/motion.service';
import { LogoComponent } from '../shared/components/logo.component';
import { SafeHtmlPipe } from '../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LogoComponent, SafeHtmlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="container footer__top">
        <div class="footer__brand" data-reveal>
          <app-logo [light]="true" />
          <p>{{ t().footer.about }}</p>
          <div class="footer__social" [attr.aria-label]="t().footer.social">
            @for (s of social; track s.label) {
              <a [href]="s.href" [attr.aria-label]="s.label" target="_blank" rel="noopener" [innerHTML]="s.icon | safeHtml"></a>
            }
          </div>
        </div>

        <nav class="footer__col" aria-label="Quick links" data-reveal>
          <h4>{{ t().footer.quick }}</h4>
          <ul>
            @for (link of links; track link.id) {
              <li><a [href]="'#' + link.id">{{ t().nav[link.key] }}</a></li>
            }
          </ul>
        </nav>

        <div class="footer__col" data-reveal>
          <h4>{{ t().footer.contact }}</h4>
          <ul class="footer__contact">
            <li><span>{{ t().contact.address }}</span></li>
            <li><a href="tel:+966507488650" dir="ltr">{{ t().contact.phone }}</a></li>
            <li><a href="mailto:AL-HOMODI@HOTMAIL.COM">{{ t().contact.email }}</a></li>
            <li>{{ t().contact.hours }}</li>
          </ul>
        </div>

        <div class="footer__col footer__newsletter" data-reveal>
          <h4>{{ t().footer.made }}</h4>
          <a href="#contact" class="btn btn--green">{{ t().nav.cta }}</a>
        </div>
      </div>

      <div class="footer__bar">
        <div class="container footer__bar-inner">
          <span>© {{ year }} شركة بيض العائلة للتجارة. {{ t().footer.rights }}</span>
          <span class="footer__heart">{{ t().footer.made }}</span>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        background: #1c1610;
        color: rgba(255, 255, 255, 0.78);
      }
      .footer__top {
        display: grid;
        grid-template-columns: 1.6fr 1fr 1.2fr 1fr;
        gap: clamp(28px, 4vw, 56px);
        padding-block: clamp(48px, 7vw, 80px);
      }
      .footer__brand {
        p { margin: 18px 0 20px; max-width: 38ch; font-size: 0.95rem; line-height: 1.7; }
      }
      .footer__social {
        display: flex;
        gap: 10px;
        a {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          transition: background 0.25s var(--ease), transform 0.25s var(--ease);
          ::ng-deep svg { width: 19px; height: 19px; }
          &:hover { background: var(--brand); transform: translateY(-3px); }
        }
      }
      .footer__col h4 {
        color: #fff;
        font-size: 1.05rem;
        margin-bottom: 18px;
      }
      .footer__col ul { display: flex; flex-direction: column; gap: 11px; }
      .footer__col a, .footer__col li {
        color: rgba(255, 255, 255, 0.72);
        font-size: 0.94rem;
        transition: color 0.2s var(--ease);
      }
      .footer__col a:hover { color: var(--yolk); }
      .footer__contact span { display: block; max-width: 30ch; }
      .footer__newsletter .btn { margin-top: 4px; }
      .footer__bar {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      .footer__bar-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding-block: 22px;
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.6);
        flex-wrap: wrap;
      }
      @media (max-width: 880px) {
        .footer__top { grid-template-columns: 1fr 1fr; }
        .footer__brand { grid-column: 1 / -1; }
      }
      @media (max-width: 520px) {
        .footer__top { grid-template-columns: 1fr; }
        .footer__bar-inner { justify-content: center; text-align: center; }
      }
    `,
  ],
})
export class FooterComponent implements AfterViewInit {
  readonly t = inject(I18nService).t;
  readonly year = 2026;

  private readonly motion = inject(MotionService);
  private readonly host = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    const cols = this.host.nativeElement.querySelectorAll('[data-reveal]') as NodeListOf<HTMLElement>;
    this.motion.revealStagger(cols, { stagger: 0.13 });
  }

  readonly links = [
    { id: 'about', key: 'about' as const },
    { id: 'products', key: 'products' as const },
    { id: 'why', key: 'why' as const },
    { id: 'process', key: 'process' as const },
    { id: 'gallery', key: 'gallery' as const },
    { id: 'contact', key: 'contact' as const },
  ];

  readonly social = [
    { label: 'Twitter / X', href: '#', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8-9.2L1 2h7l4.8 6.3Zm-1.2 18h1.7L7.4 3.8H5.6Z"/></svg>' },
    { label: 'Instagram', href: '#', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>' },
    { label: 'LinkedIn', href: '#', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05C20.4 8.65 21 11 21 14.1V21h-4v-6c0-1.43-.03-3.27-2-3.27-2 0-2.3 1.56-2.3 3.17V21H9Z"/></svg>' },
    { label: 'WhatsApp', href: 'https://wa.me/966507488650', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.2-.8-2.7-1.2-4.4-4-4.5-4.2-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.4 2.6 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9 1c.2.1.4.2.5.3.1.3.1.7-.1 1.2Z"/></svg>' },
  ];
}
