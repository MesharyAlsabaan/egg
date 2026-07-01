import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type EggTone = 'white' | 'brown' | 'golden' | 'cream' | 'sage';

/**
 * Reusable, near-photoreal SVG egg — replaces product/scene photography with
 * crisp, infinitely-scalable art. A top-left key light drives layered shell
 * gradients, a warm bounce light lifts the base, ambient occlusion grounds it,
 * and a soft specular hotspot + fine pores sell the surface. Shade with [tone].
 */
@Component({
  selector: 'app-egg',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg class="egg" viewBox="0 0 120 152" role="img" [attr.aria-label]="label()">
      <defs>
        <radialGradient [attr.id]="uid + '-body'" cx="40%" cy="28%" r="82%">
          <stop offset="0" [attr.stop-color]="c(0)" />
          <stop offset="30%" [attr.stop-color]="c(1)" />
          <stop offset="62%" [attr.stop-color]="c(2)" />
          <stop offset="86%" [attr.stop-color]="c(3)" />
          <stop offset="100%" [attr.stop-color]="c(4)" />
        </radialGradient>
        <radialGradient [attr.id]="uid + '-bounce'" cx="50%" cy="92%" r="46%">
          <stop offset="0" stop-color="#ffd9a1" stop-opacity="0.55" />
          <stop offset="100%" stop-color="#ffd9a1" stop-opacity="0" />
        </radialGradient>
        <radialGradient [attr.id]="uid + '-ao'" cx="50%" cy="50%" r="52%">
          <stop offset="72%" stop-color="#000" stop-opacity="0" />
          <stop offset="100%" [attr.stop-color]="c(4)" stop-opacity="0.55" />
        </radialGradient>
        <clipPath [attr.id]="uid + '-clip'">
          <path d="M60 6 C83 6 101 42 101 83 C101 118 83 144 60 144 C37 144 19 118 19 83 C19 42 37 6 60 6 Z" />
        </clipPath>
        <filter [attr.id]="uid + '-blur'" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.4" />
        </filter>
      </defs>

      <ellipse class="egg__shadow" cx="60" cy="146" rx="33" ry="6.5" />

      <path
        class="egg__body"
        [attr.fill]="'url(#' + uid + '-body)'"
        d="M60 6 C83 6 101 42 101 83 C101 118 83 144 60 144 C37 144 19 118 19 83 C19 42 37 6 60 6 Z"
      />

      <g [attr.clip-path]="'url(#' + uid + '-clip)'">
        <!-- warm reflected bounce light on the base -->
        <rect x="0" y="0" width="120" height="152" [attr.fill]="'url(#' + uid + '-bounce)'" />
        <!-- ambient occlusion vignette -->
        <rect x="0" y="0" width="120" height="152" [attr.fill]="'url(#' + uid + '-ao)'" />

        @if (speckled()) {
          <g [attr.fill]="c(4)">
            <circle cx="45" cy="58" r="1.7" opacity="0.5" /><circle cx="72" cy="50" r="1.1" opacity="0.4" />
            <circle cx="66" cy="86" r="1.9" opacity="0.5" /><circle cx="43" cy="98" r="1.3" opacity="0.45" />
            <circle cx="79" cy="104" r="1.5" opacity="0.5" /><circle cx="54" cy="120" r="1.2" opacity="0.4" />
            <circle cx="37" cy="78" r="1.1" opacity="0.4" /><circle cx="83" cy="76" r="1.4" opacity="0.45" />
            <circle cx="58" cy="40" r="1" opacity="0.35" /><circle cx="70" cy="128" r="1.3" opacity="0.4" />
          </g>
        }

        <!-- broad soft key highlight -->
        <ellipse cx="46" cy="42" rx="16" ry="24" fill="#fffef7" opacity="0.55" [attr.filter]="'url(#' + uid + '-blur)'" />
        <!-- crisp specular hotspot -->
        <ellipse cx="43" cy="34" rx="5" ry="8" fill="#ffffff" opacity="0.9" transform="rotate(-24 43 34)" />
        <!-- faint rim light on the shadow side -->
        <path d="M96 70 C99 88 92 112 78 128" stroke="#fff4dd" stroke-width="3" fill="none" opacity="0.25" stroke-linecap="round" [attr.filter]="'url(#' + uid + '-blur)'" />
      </g>
    </svg>
  `,
  styles: [
    `
      :host { display: inline-block; line-height: 0; }
      .egg { width: 100%; height: 100%; overflow: visible; }
      .egg__shadow { fill: rgba(42, 38, 32, 0.18); filter: blur(3.5px); }
    `,
  ],
})
export class EggComponent {
  readonly tone = input<EggTone>('white');
  readonly speckled = input(false);
  readonly label = input('Egg');

  /** Unique ids so multiple eggs on a page don't share defs. */
  readonly uid = 'egg-' + Math.random().toString(36).slice(2, 8);

  /** 5-stop shell ramps: [highlight, light, mid, shadow, edge]. */
  private readonly ramps: Record<EggTone, string[]> = {
    white: ['#ffffff', '#fbf5ea', '#f0e3cd', '#ddc9aa', '#c9b189'],
    cream: ['#fffbf2', '#fbeecd', '#f2ddb4', '#e3c78f', '#cba968'],
    golden: ['#fff6d8', '#ffe8a6', '#f7c948', '#e5a52a', '#c9861a'],
    brown: ['#f3d9b0', '#e0b277', '#c98f4f', '#a5703a', '#835626'],
    sage: ['#f4f8ee', '#dce9cd', '#c2d8ac', '#a6c389', '#89a86c'],
  };

  c = (i: number): string => this.ramps[this.tone()][i];
}
