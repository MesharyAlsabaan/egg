import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RevealDirective } from '../directives/reveal.directive';

/** Reusable centred section header: eyebrow chip + title + optional lead. */
@Component({
  selector: 'app-section-heading',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sh" [class.sh--start]="align() === 'start'">
      <span class="eyebrow" appReveal>{{ eyebrow() }}</span>
      <h2 class="h-section" appReveal="1">{{ title() }}</h2>
      @if (desc()) {
        <p class="lead" appReveal="2">{{ desc() }}</p>
      }
    </header>
  `,
  styles: [
    `
      .sh {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 16px;
        margin-bottom: clamp(36px, 5vw, 56px);
      }
      .sh .lead {
        margin-inline: auto;
      }
      .sh--start {
        align-items: flex-start;
        text-align: start;
      }
      .sh--start .lead {
        margin-inline: 0;
      }
    `,
  ],
})
export class SectionHeadingComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly desc = input<string>('');
  readonly align = input<'center' | 'start'>('center');
}
