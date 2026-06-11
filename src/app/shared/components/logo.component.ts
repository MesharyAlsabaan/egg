import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Crisp, scalable brand mark — a nest of eggs with a fresh-green leaf,
 * rebuilt as inline SVG from the company logo so it stays sharp at any size
 * and adapts to light/dark backgrounds.
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="logo" [class.logo--light]="light()">
      <svg
        class="logo__mark"
        viewBox="0 0 64 64"
        role="img"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="eggGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#FFF7E6" />
            <stop offset="1" stop-color="#F4D58A" />
          </linearGradient>
        </defs>
        <!-- nest -->
        <path
          d="M8 40c4 9 14 14 24 14s20-5 24-14c-6 3-16 5-24 5S14 43 8 40Z"
          fill="#C9661B"
        />
        <path
          d="M6 38c6 5 16 8 26 8s20-3 26-8c-3 7-13 12-26 12S9 45 6 38Z"
          fill="#E07B26"
        />
        <!-- eggs -->
        <ellipse cx="24" cy="32" rx="8" ry="11" fill="url(#eggGrad)" />
        <ellipse cx="40" cy="32" rx="8" ry="11" fill="url(#eggGrad)" />
        <ellipse cx="32" cy="26" rx="8.5" ry="12" fill="#FFFDF8" />
        <!-- leaf -->
        <path
          d="M32 14c5-6 13-6 13-6s-1 9-7 11c-3 1-5 0-6-1Z"
          fill="#4CAF50"
        />
        <path d="M40 9c-3 2-5 5-6 9" stroke="#3D9442" stroke-width="1.4" fill="none" stroke-linecap="round" />
      </svg>
      <span class="logo__text">
        <strong>بيض العائلة</strong>
        <small>للتجارة</small>
      </span>
    </span>
  `,
  styles: [
    `
      .logo {
        display: inline-flex;
        align-items: center;
        gap: 12px;
      }
      .logo__mark {
        width: 46px;
        height: 46px;
        flex: none;
        filter: drop-shadow(0 4px 8px rgba(176, 90, 22, 0.25));
      }
      .logo__text {
        display: flex;
        flex-direction: column;
        line-height: 1.05;
      }
      .logo__text strong {
        font-family: var(--font-ar);
        font-size: 1.2rem;
        font-weight: 800;
        letter-spacing: -0.01em;
        color: var(--ink);
      }
      .logo__text small {
        font-family: var(--font-ar);
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--brand);
      }
      .logo--light .logo__text strong {
        color: #fff;
      }
      .logo--light .logo__text small {
        color: var(--yolk);
      }
    `,
  ],
})
export class LogoComponent {
  readonly light = input(false);
}
