import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MotionService } from './core/motion.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<router-outlet />`,
})
export class App implements OnInit {
  private readonly motion = inject(MotionService);

  ngOnInit(): void {
    // Unlocks the reveal styles. Until this runs — or if it never runs —
    // every section renders fully visible.
    this.motion.enable();
  }
}
