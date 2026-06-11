import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { I18nService } from '../core/i18n/i18n.service';
import { SectionHeadingComponent } from '../shared/components/section-heading.component';
import { RevealDirective } from '../shared/directives/reveal.directive';

interface GalleryImage {
  src: string;
  alt: string;
  span: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [SectionHeadingComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="gallery" class="section section--tint">
      <div class="container">
        <app-section-heading
          [eyebrow]="t().gallery.eyebrow"
          [title]="t().gallery.title"
          [desc]="t().gallery.desc"
        />

        <div class="gallery">
          @for (img of images; track img.src; let i = $index) {
            <button
              class="gallery__item"
              [class]="img.span"
              (click)="open(i)"
              appReveal
              [appReveal]="(i % 4) + 1"
              [attr.aria-label]="'View image: ' + img.alt"
            >
              <img [src]="img.src" [alt]="img.alt" loading="lazy" />
              <span class="gallery__zoom">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-3.5-3.5M11 8v6M8 11h6"/></svg>
              </span>
            </button>
          }
        </div>
      </div>
    </section>

    @if (current() !== null) {
      <div class="lightbox" (click)="close()">
        <button class="lightbox__close" (click)="close()" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
        <button class="lightbox__nav prev" (click)="step(-1, $event)" aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg>
        </button>
        <figure class="lightbox__figure" (click)="$event.stopPropagation()">
          <img [src]="images[current()!].src" [alt]="images[current()!].alt" />
          <figcaption>{{ images[current()!].alt }}</figcaption>
        </figure>
        <button class="lightbox__nav next" (click)="step(1, $event)" aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>
        </button>
      </div>
    }
  `,
  styles: [
    `
      .gallery {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-auto-rows: 200px;
        gap: 14px;
      }
      .gallery__item {
        position: relative;
        overflow: hidden;
        border-radius: var(--radius);
        cursor: pointer;
        box-shadow: var(--shadow-sm);
        img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--ease); }
        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(43, 23, 8, 0.35), transparent 55%);
          opacity: 0;
          transition: opacity 0.35s var(--ease);
        }
        &:hover img { transform: scale(1.1); }
        &:hover::after { opacity: 1; }
        &:hover .gallery__zoom { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
      .gallery__zoom {
        position: absolute;
        top: 50%;
        inset-inline-start: 50%;
        transform: translate(-50%, -50%) scale(0.7);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.95);
        color: var(--brand-700);
        display: grid;
        place-items: center;
        opacity: 0;
        transition: opacity 0.35s var(--ease), transform 0.35s var(--ease);
        z-index: 2;
        svg { width: 22px; height: 22px; }
      }
      .wide { grid-column: span 2; }
      .tall { grid-row: span 2; }

      .lightbox {
        position: fixed;
        inset: 0;
        z-index: 1000;
        background: rgba(20, 14, 8, 0.92);
        backdrop-filter: blur(8px);
        display: grid;
        place-items: center;
        padding: clamp(16px, 4vw, 48px);
        animation: fade 0.3s var(--ease);
      }
      @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
      .lightbox__figure {
        max-width: min(1000px, 92vw);
        max-height: 84vh;
        img {
          width: 100%;
          max-height: 78vh;
          object-fit: contain;
          border-radius: var(--radius);
          box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.7);
        }
        figcaption { color: rgba(255, 255, 255, 0.85); text-align: center; margin-top: 14px; font-size: 0.95rem; }
      }
      .lightbox__close {
        position: absolute;
        top: 20px;
        inset-inline-end: 20px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.12);
        color: #fff;
        display: grid;
        place-items: center;
        transition: background 0.25s var(--ease);
        &:hover { background: rgba(255, 255, 255, 0.25); }
        svg { width: 24px; height: 24px; }
      }
      .lightbox__nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.12);
        color: #fff;
        display: grid;
        place-items: center;
        transition: background 0.25s var(--ease);
        &:hover { background: var(--brand); }
        svg { width: 26px; height: 26px; }
        &.prev { inset-inline-start: 16px; }
        &.next { inset-inline-end: 16px; }
      }
      @media (max-width: 880px) {
        .gallery { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 160px; }
        .wide { grid-column: span 2; }
        .tall { grid-row: span 1; }
      }
      @media (max-width: 520px) {
        .gallery { grid-template-columns: 1fr 1fr; grid-auto-rows: 130px; }
        .lightbox__nav { width: 44px; height: 44px; }
      }
    `,
  ],
})
export class GalleryComponent {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  readonly current = signal<number | null>(null);

  readonly images: GalleryImage[] = [
    { src: 'assets/images/conveyor-eggs.jpg', alt: 'Fresh eggs travelling along the collection conveyor', span: 'wide tall' },
    { src: 'assets/images/hen-house.jpg', alt: 'Climate-controlled hen house', span: '' },
    { src: 'assets/images/grading-hall.jpg', alt: 'Modern egg grading hall', span: '' },
    { src: 'assets/images/packing-line.jpg', alt: 'Automated packing and tray line', span: 'wide' },
    { src: 'assets/images/farm-solar.jpg', alt: 'Solar-powered farm buildings', span: '' },
    { src: 'assets/images/product-blue-tray.jpg', alt: 'Tray of farm-fresh white eggs', span: '' },
    { src: 'assets/images/green-fields-2.jpg', alt: 'Green irrigated pivot fields', span: 'wide' },
    { src: 'assets/images/facility-aerial.jpg', alt: 'Aerial view of the production facility', span: '' },
    { src: 'assets/images/solar-panels.jpg', alt: 'On-site solar energy array', span: '' },
  ];

  open(i: number): void {
    this.current.set(i);
    document.body.style.overflow = 'hidden';
  }
  close(): void {
    this.current.set(null);
    document.body.style.overflow = '';
  }
  step(dir: number, ev: Event): void {
    ev.stopPropagation();
    const len = this.images.length;
    this.current.update((c) => (c === null ? null : (c + dir + len) % len));
  }

  @HostListener('document:keydown', ['$event'])
  onKey(ev: KeyboardEvent): void {
    if (this.current() === null) return;
    if (ev.key === 'Escape') this.close();
    else if (ev.key === 'ArrowRight') this.step(this.i18n.isRtl() ? -1 : 1, ev);
    else if (ev.key === 'ArrowLeft') this.step(this.i18n.isRtl() ? 1 : -1, ev);
  }
}
