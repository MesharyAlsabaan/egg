import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { I18nService } from '../core/i18n/i18n.service';
import { pagePath } from '../core/pages';

/**
 * Opening band for the inner pages: breadcrumb, the page's only <h1>, and a
 * lede, over the same aerial poster the home hero uses.
 *
 * Reusing that poster is deliberate. index.html preloads it on every route,
 * so on an inner page it arrives as early as it does on the home page and the
 * preload is never wasted — and the brand's opening image stays consistent.
 */
@Component({
  selector: 'app-page-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="intro" id="top">
      <picture class="intro__media">
        <source
          media="(max-width: 767px)"
          type="image/avif"
          srcset="media/hero-poster-mobile-720.avif 720w, media/hero-poster-mobile-1080.avif 1080w"
          sizes="100vw"
        />
        <source
          media="(max-width: 767px)"
          type="image/webp"
          srcset="media/hero-poster-mobile-720.webp 720w, media/hero-poster-mobile-1080.webp 1080w"
          sizes="100vw"
        />
        <source
          type="image/avif"
          srcset="
            media/hero-poster-desktop-1280.avif 1280w,
            media/hero-poster-desktop-1600.avif 1600w,
            media/hero-poster-desktop-1920.avif 1920w
          "
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcset="
            media/hero-poster-desktop-1280.webp 1280w,
            media/hero-poster-desktop-1600.webp 1600w,
            media/hero-poster-desktop-1920.webp 1920w
          "
          sizes="100vw"
        />
        <img
          src="media/hero-poster-desktop-1600.jpg"
          alt=""
          width="1920"
          height="1080"
          fetchpriority="high"
          decoding="async"
        />
      </picture>

      <div class="intro__inner">
        <nav class="intro__crumbs" [attr.aria-label]="t().site.breadcrumb">
          <ol>
            <li><a [routerLink]="home()">{{ t().site.home }}</a></li>
            <li aria-current="page">{{ eyebrow() }}</li>
          </ol>
        </nav>
        <h1 class="intro__title">{{ title() }}</h1>
        <p class="intro__lede">{{ lede() }}</p>
      </div>
    </section>
  `,
  styles: `
    .intro {
      position: relative;
      isolation: isolate;
      display: grid;
      align-items: end;
      min-height: clamp(26rem, 68svh, 36rem);
      padding-block: calc(var(--header-h) + 2.5rem) clamp(2.5rem, 7vw, 4.5rem);
      background: var(--ink);
      color: var(--on-ink);
      overflow: hidden;
    }

    .intro__media,
    .intro__media img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: -2;
    }

    .intro__media img {
      object-fit: cover;
    }

    /* Ink scrim from the text edge, so the copy reads at AA over any frame. */
    .intro::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background: linear-gradient(
        to top,
        rgb(26 39 22 / 0.94) 0%,
        rgb(26 39 22 / 0.8) 45%,
        rgb(26 39 22 / 0.35) 100%
      );
    }

    .intro__inner {
      width: min(100% - (var(--gutter) * 2), var(--container));
      margin-inline: auto;
    }

    .intro__crumbs ol {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem 0.6rem;
      margin: 0 0 1.25rem;
      padding: 0;
      list-style: none;
      font-size: var(--step--1);
      font-weight: 600;
      color: var(--sage);
    }

    .intro__crumbs li + li::before {
      content: '/';
      margin-inline-end: 0.6rem;
      opacity: 0.6;
    }

    .intro__crumbs a {
      display: inline-flex;
      align-items: center;
      min-height: var(--tap);
      color: var(--on-ink);
      text-decoration: underline;
      text-underline-offset: 4px;
      text-decoration-color: rgb(248 249 246 / 0.4);
    }

    .intro__crumbs li[aria-current] {
      display: inline-flex;
      align-items: center;
    }

    .intro__title {
      font-size: var(--step-4);
      font-weight: 700;
      line-height: var(--lh-display);
      letter-spacing: var(--track-display);
      max-width: 22ch;
    }

    .intro__lede {
      margin-block-start: 1.25rem;
      font-size: var(--step-1);
      line-height: 1.7;
      color: var(--on-ink-dim);
      max-width: 52ch;
    }
  `,
})
export class PageIntroComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly lede = input.required<string>();

  private readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;
  protected readonly home = computed(() => pagePath(this.i18n.lang(), 'home'));
}
