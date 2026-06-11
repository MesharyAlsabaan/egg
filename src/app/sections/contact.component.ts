import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { I18nService } from '../core/i18n/i18n.service';
import { RevealDirective } from '../shared/directives/reveal.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="contact" class="section">
      <div class="container contact">
        <div class="contact__info" appReveal>
          <span class="eyebrow">{{ t().contact.eyebrow }}</span>
          <h2 class="h-section">{{ t().contact.title }}</h2>
          <p class="lead">{{ t().contact.desc }}</p>

          <ul class="contact__list">
            <li>
              <span class="contact__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
              </span>
              <div><strong>{{ t().contact.addressLabel }}</strong><span>{{ t().contact.address }}</span></div>
            </li>
            <li>
              <span class="contact__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></svg>
              </span>
              <div><strong>{{ t().contact.phoneLabel }}</strong><a href="tel:+966507488650" dir="ltr">{{ t().contact.phone }}</a></div>
            </li>
            <li>
              <span class="contact__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
              </span>
              <div><strong>{{ t().contact.emailLabel }}</strong><a href="mailto:AL-HOMODI@HOTMAIL.COM">{{ t().contact.email }}</a></div>
            </li>
            <li>
              <span class="contact__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
              </span>
              <div><strong>{{ t().contact.hoursLabel }}</strong><span>{{ t().contact.hours }}</span></div>
            </li>
          </ul>

          <div class="contact__map">
            <iframe
              title="Family Eggs location map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=45.2%2C24.9%2C46.2%2C25.4&layer=mapnik&marker=25.07%2C45.5"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div class="contact__form-wrap" appReveal="1">
          @if (submitted()) {
            <div class="contact__success" role="status">
              <span class="contact__success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4 10-10"/></svg>
              </span>
              <p>{{ t().contact.formSuccess }}</p>
              <button class="btn btn--ghost" (click)="reset()">＋</button>
            </div>
          } @else {
            <form class="contact__form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
              <div class="field">
                <label for="name">{{ t().contact.formName }}</label>
                <input id="name" type="text" formControlName="name" [class.invalid]="invalid('name')" />
                @if (invalid('name')) { <small>•</small> }
              </div>
              <div class="field-row">
                <div class="field">
                  <label for="email">{{ t().contact.formEmail }}</label>
                  <input id="email" type="email" formControlName="email" [class.invalid]="invalid('email')" />
                </div>
                <div class="field">
                  <label for="phone">{{ t().contact.formPhone }}</label>
                  <input id="phone" type="tel" formControlName="phone" dir="ltr" />
                </div>
              </div>
              <div class="field">
                <label for="message">{{ t().contact.formMessage }}</label>
                <textarea id="message" rows="5" formControlName="message" [class.invalid]="invalid('message')"></textarea>
              </div>
              <button type="submit" class="btn contact__submit">
                {{ t().contact.formSubmit }}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
            </form>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  readonly t = inject(I18nService).t;
  readonly submitted = signal(false);

  /** Company WhatsApp number (digits only), from the carton: +966 50 748 8650. */
  private readonly whatsappNumber = '966507488650';

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  invalid(ctrl: string): boolean {
    const c = this.form.get(ctrl);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // No backend: hand the message off to WhatsApp pre-filled with the
    // visitor's details, then show the confirmation state.
    const { name, email, phone, message } = this.form.getRawValue();
    const lines = [
      `الاسم: ${name}`,
      `البريد الإلكتروني: ${email}`,
      phone ? `رقم الهاتف: ${phone}` : '',
      `الرسالة: ${message}`,
    ].filter(Boolean);
    const text = `مرحباً، لديّ استفسار عبر موقع شركة بيض العائلة:\n\n${lines.join('\n')}`;
    const url = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');

    this.submitted.set(true);
  }

  reset(): void {
    this.form.reset();
    this.submitted.set(false);
  }
}
