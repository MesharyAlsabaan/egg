import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

import { MotionService } from '../core/motion.service';

/**
 * Marks an element for reveal-on-scroll. The hidden state lives in CSS behind
 * `html.js-motion`, so this directive can only ever *show* things.
 */
@Directive({
  selector: '[appReveal]',
  host: { 'data-reveal': '' },
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly motion = inject(MotionService);
  private stop?: () => void;

  ngOnInit(): void {
    this.stop = this.motion.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.stop?.();
  }
}
