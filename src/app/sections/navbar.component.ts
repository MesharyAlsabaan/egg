import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { I18nService } from '../core/i18n/i18n.service';
import { LogoComponent } from '../shared/components/logo.component';

interface NavLink {
  id: string;
  key: keyof ReturnType<I18nService['t']>['nav'];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#products">{{ t().nav.products }}</a>
    <header class="nav" [class.nav--scrolled]="scrolled()">
      <div class="container nav__inner">
        <a href="#home" class="nav__brand" aria-label="Family Eggs — home">
          <app-logo />
        </a>

        <nav class="nav__links" [class.open]="menuOpen()" aria-label="Primary">
          @for (link of links; track link.id) {
            <a
              [href]="'#' + link.id"
              class="nav__link"
              [class.active]="active() === link.id"
              (click)="close()"
              >{{ t().nav[link.key] }}</a
            >
          }
          <div class="nav__mobile-actions">
            <a href="#contact" class="btn" (click)="close()">{{ t().nav.cta }}</a>
          </div>
        </nav>

        <div class="nav__actions">
          <a href="#contact" class="btn nav__cta">{{ t().nav.cta }}</a>
          <button
            class="burger"
            [class.is-open]="menuOpen()"
            (click)="toggleMenu()"
            [attr.aria-expanded]="menuOpen()"
            aria-label="Menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  `,
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);
  readonly active = signal('home');

  readonly links: NavLink[] = [
    { id: 'home', key: 'home' },
    { id: 'about', key: 'about' },
    { id: 'products', key: 'products' },
    { id: 'why', key: 'why' },
    { id: 'process', key: 'process' },
    { id: 'gallery', key: 'gallery' },
    { id: 'contact', key: 'contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
    this.computeActive();
  }

  private computeActive(): void {
    const mid = window.scrollY + window.innerHeight * 0.35;
    let current = this.links[0].id;
    for (const link of this.links) {
      const el = document.getElementById(link.id);
      if (el && el.offsetTop <= mid) current = link.id;
    }
    this.active.set(current);
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }
  close(): void {
    this.menuOpen.set(false);
  }
}
