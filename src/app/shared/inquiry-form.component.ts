import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { type AnalyticsEvent, AnalyticsService } from '../core/analytics.service';
import {
  type BuyerType,
  CONTACT,
  type Channel,
  type ProductInterest,
} from '../core/i18n/dictionary';
import { I18nService } from '../core/i18n/i18n.service';
import { pagePath } from '../core/pages';

type Field = 'name' | 'company' | 'country' | 'email' | 'phone' | 'buyer' | 'product' | 'volume' | 'message';
type Errors = Partial<Record<Field | 'captcha', string>>;

/**
 * - `handoff`: no server delivery available (the default, and the only mode
 *   on a static host). The form writes the message and opens it in the
 *   visitor's own WhatsApp or email app. Nothing has been sent until they
 *   press Send there, and the UI says so.
 * - `server`: server/inquiry.mjs is configured. The form posts the enquiry
 *   and shows "sent" only after the server confirms the email went out.
 */
type Mode = 'handoff' | 'server';
type Status = 'idle' | 'sending' | 'sent' | 'failed' | 'busy' | 'handed-off';

interface TurnstileApi {
  render(el: HTMLElement, options: Record<string, unknown>): string;
  reset(id?: string): void;
  remove(id?: string): void;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s()-]{7,20}$/;
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/**
 * The commercial enquiry form.
 *
 * Analytics: `*_inquiry_submit` (the conversion) fires only on a confirmed
 * server delivery. A hand-off fires `inquiry_handoff`; a failed send fires
 * `inquiry_error`. Parameters are labels only — never anything typed.
 *
 * Without JavaScript the form falls back to a plain mailto: submission.
 */
@Component({
  selector: 'app-inquiry-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <form
      #form
      class="inq"
      [hidden]="status() === 'sent' || status() === 'handed-off'"
      novalidate
      [attr.action]="'mailto:' + c.email"
      method="post"
      enctype="text/plain"
      [attr.aria-busy]="status() === 'sending'"
      (submit)="submit($event)"
    >
      @if (summary()) {
        <p class="inq__summary" role="alert">{{ f().errors.summary }}</p>
      }

      <div class="inq__grid">
        <div class="inq__field">
          <label for="inq-name">{{ f().name }}</label>
          <input
            id="inq-name"
            name="name"
            autocomplete="name"
            maxlength="120"
            required
            [attr.aria-invalid]="!!errors().name"
            [attr.aria-describedby]="errors().name ? 'inq-name-err' : null"
          />
          @if (errors().name) {
            <p class="inq__error" id="inq-name-err">{{ errors().name }}</p>
          }
        </div>

        <div class="inq__field">
          <label for="inq-company">{{ f().company }}</label>
          <input
            id="inq-company"
            name="company"
            autocomplete="organization"
            maxlength="160"
            required
            [attr.aria-invalid]="!!errors().company"
            [attr.aria-describedby]="errors().company ? 'inq-company-err' : null"
          />
          @if (errors().company) {
            <p class="inq__error" id="inq-company-err">{{ errors().company }}</p>
          }
        </div>

        <div class="inq__field">
          <label for="inq-buyer">{{ f().buyer }}</label>
          <select
            id="inq-buyer"
            name="buyer"
            required
            [attr.aria-invalid]="!!errors().buyer"
            [attr.aria-describedby]="errors().buyer ? 'inq-buyer-err' : null"
          >
            <option value="" [attr.selected]="!buyer() ? '' : null">{{ f().buyerPlaceholder }}</option>
            @for (option of f().buyerOptions; track option.id) {
              <option [value]="option.id" [attr.selected]="option.id === buyer() ? '' : null">{{ option.label }}</option>
            }
          </select>
          @if (errors().buyer) {
            <p class="inq__error" id="inq-buyer-err">{{ errors().buyer }}</p>
          }
        </div>

        <div class="inq__field">
          <label for="inq-country">
            {{ f().country }}
            @if (!international()) {
              <span class="inq__opt">({{ f().optional }})</span>
            }
          </label>
          <input
            id="inq-country"
            name="country"
            autocomplete="country-name"
            maxlength="80"
            [attr.value]="international() ? null : f().countryDefault"
            [attr.required]="international() ? '' : null"
            [attr.aria-invalid]="!!errors().country"
            [attr.aria-describedby]="errors().country ? 'inq-country-err' : null"
          />
          @if (errors().country) {
            <p class="inq__error" id="inq-country-err">{{ errors().country }}</p>
          }
        </div>

        <div class="inq__field">
          <label for="inq-email">{{ f().email }}</label>
          <input
            id="inq-email"
            name="email"
            type="email"
            inputmode="email"
            autocomplete="email"
            maxlength="160"
            dir="ltr"
            [attr.aria-invalid]="!!errors().email"
            [attr.aria-describedby]="errors().email ? 'inq-email-err' : null"
          />
          @if (errors().email) {
            <p class="inq__error" id="inq-email-err">{{ errors().email }}</p>
          }
        </div>

        <div class="inq__field">
          <label for="inq-phone">{{ f().phone }}</label>
          <input
            id="inq-phone"
            name="phone"
            type="tel"
            inputmode="tel"
            autocomplete="tel"
            maxlength="24"
            dir="ltr"
            [attr.aria-invalid]="!!errors().phone"
            [attr.aria-describedby]="errors().phone ? 'inq-phone-err' : null"
          />
          @if (errors().phone) {
            <p class="inq__error" id="inq-phone-err">{{ errors().phone }}</p>
          }
        </div>

        <div class="inq__field">
          <label for="inq-product">
            {{ f().product }} <span class="inq__opt">({{ f().optional }})</span>
          </label>
          <select id="inq-product" name="product">
            <option value=""></option>
            @for (option of f().productOptions; track option.id) {
              <option [value]="option.id">{{ option.label }}</option>
            }
          </select>
        </div>

        <div class="inq__field">
          <label for="inq-volume">
            {{ f().volume }} <span class="inq__opt">({{ f().optional }})</span>
          </label>
          <input id="inq-volume" name="volume" maxlength="120" [attr.placeholder]="f().volumeHint" />
        </div>

        <div class="inq__field inq__field--wide">
          <label for="inq-message">
            {{ f().message }} <span class="inq__opt">({{ f().optional }})</span>
          </label>
          <textarea id="inq-message" name="message" rows="4" maxlength="1000"></textarea>
        </div>
      </div>

      <!-- Honeypot. Hidden from people and assistive technology; a bot that
           fills every field fills this one too, and the server drops it. -->
      <div class="inq__trap" aria-hidden="true">
        <label for="inq-website">{{ f().trap }}</label>
        <input id="inq-website" name="website" tabindex="-1" autocomplete="off" />
      </div>

      @if (mode() === 'handoff') {
        <fieldset class="inq__channel">
          <legend>{{ f().channel }}</legend>
          <label>
            <input
              type="radio"
              name="channel"
              value="whatsapp"
              [checked]="channel() === 'whatsapp'"
              (change)="channel.set('whatsapp')"
            />
            {{ f().channels.whatsapp }}
          </label>
          <label>
            <input
              type="radio"
              name="channel"
              value="email"
              [checked]="channel() === 'email'"
              (change)="channel.set('email')"
            />
            {{ f().channels.email }}
          </label>
        </fieldset>
      } @else if (turnstileKey()) {
        <div class="inq__captcha" #captcha></div>
        @if (errors().captcha) {
          <p class="inq__error" role="alert">{{ errors().captcha }}</p>
        }
      }

      @if (status() === 'failed' || status() === 'busy') {
        <div class="inq__failed" role="alert">
          <p class="inq__failed-title">{{ f().failure.title }}</p>
          <p>{{ status() === 'busy' ? f().failure.busy : f().failure.body }}</p>
          <p class="inq__alt">
            {{ f().failure.alternatives }}
            <button type="button" class="inq__link" (click)="handoff('whatsapp')">
              {{ f().channels.whatsapp }}
            </button>
            ·
            <button type="button" class="inq__link" (click)="handoff('email')">
              {{ f().channels.email }}
            </button>
          </p>
        </div>
      }

      <button
        type="submit"
        class="btn btn--primary inq__submit"
        [disabled]="status() === 'sending'"
      >
        {{ submitLabel() }}
      </button>
      <p class="inq__privacy">
        {{ mode() === 'server' ? f().privacy.server : f().privacy.handoff }}
        <a [routerLink]="privacyPath()">{{ f().privacy.link }}</a>
      </p>
    </form>

    @if (status() === 'sent') {
      <div class="inq__done inq__done--sent" role="status">
        <h3 tabindex="-1" #doneEl>{{ f().success.title }}</h3>
        <p>{{ f().success.body }}</p>
        <button type="button" class="btn btn--ghost-dark" (click)="restart(true)">
          {{ f().success.again }}
        </button>
      </div>
    }

    @if (status() === 'handed-off' && handed(); as result) {
      <div class="inq__done" role="status">
        <h3 tabindex="-1" #doneEl>{{ f().handoff.title }}</h3>
        <p>{{ f().handoff.body[result.channel] }}</p>
        <p class="inq__fallback">
          {{ f().handoff.fallback }}
          <a [href]="result.href" data-track="off" target="_blank" rel="noopener">{{
            f().handoff.fallbackLink
          }}</a>
        </p>
        <button type="button" class="btn btn--ghost-dark" (click)="restart(false)">
          {{ f().handoff.again }}
        </button>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .inq__grid {
      display: grid;
      gap: 1.25rem 1.5rem;
    }

    .inq__field {
      display: grid;
      gap: 0.4rem;
      align-content: start;
    }

    label,
    legend {
      font-size: var(--step--1);
      font-weight: 600;
    }

    .inq__opt {
      font-weight: 400;
      color: var(--on-ivory-dim);
    }

    input:not([type='radio']),
    select,
    textarea {
      width: 100%;
      min-height: 48px;
      padding: 0.7rem 0.85rem;
      /* 16px minimum, so iOS never zooms the page on focus. */
      font-size: max(16px, var(--step-0));
      background: #fff;
      color: var(--on-ivory);
      border: 1px solid #b9c0ad;
      border-radius: var(--radius);
      transition: border-color var(--dur-fast) var(--ease);
    }

    input:not([type='radio']):hover,
    select:hover,
    textarea:hover {
      border-color: var(--olive);
    }

    textarea {
      resize: vertical;
      min-height: 7.5rem;
    }

    [aria-invalid='true'] {
      border-color: var(--terra) !important;
      box-shadow: 0 0 0 1px var(--terra);
    }

    .inq__error {
      font-size: var(--step--1);
      font-weight: 600;
      color: #a3401f;
    }

    .inq__summary,
    .inq__failed {
      padding: 0.8rem 1rem;
      border-inline-start: 4px solid var(--terra);
      background: #fbefe9;
      color: #7d2f16;
    }

    .inq__summary {
      margin-block-end: 1.25rem;
      font-weight: 600;
    }

    .inq__failed {
      margin-block-start: 1.5rem;
      display: grid;
      gap: 0.4rem;
    }

    .inq__failed-title {
      font-weight: 700;
    }

    .inq__link {
      display: inline-flex;
      align-items: center;
      min-height: var(--tap);
      padding: 0 0.15rem;
      background: none;
      border: 0;
      font-weight: 700;
      color: #7d2f16;
      text-decoration: underline;
      text-underline-offset: 3px;
      cursor: pointer;
    }

    .inq__trap {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }

    .inq__channel {
      margin: 1.75rem 0 0;
      padding: 0;
      border: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1.5rem;
    }

    .inq__channel legend {
      margin-block-end: 0.5rem;
      padding: 0;
    }

    .inq__channel label {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      min-height: var(--tap);
      font-size: var(--step-0);
      font-weight: 500;
      cursor: pointer;
    }

    .inq__channel input {
      width: 20px;
      height: 20px;
      accent-color: var(--ink);
    }

    .inq__captcha {
      margin-block-start: 1.75rem;
      min-height: 65px;
    }

    .inq__submit {
      margin-block-start: 1.5rem;
      width: 100%;
    }

    .inq__submit[disabled] {
      opacity: 0.7;
      cursor: progress;
    }

    .inq__privacy {
      margin-block-start: 1rem;
      font-size: var(--step--1);
      color: var(--on-ivory-dim);
      max-width: 62ch;
    }

    .inq__privacy a,
    .inq__fallback a {
      /* Inline in a sentence, but still a comfortable tap target. */
      display: inline-block;
      padding-block: 0.4rem;
      color: var(--olive-deep);
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    .inq__done {
      padding: clamp(1.5rem, 4vw, 2.25rem);
      background: #fff;
      border: 1px solid var(--ivory-line);
      border-inline-start: 4px solid var(--orange);
      border-radius: var(--radius);
      display: grid;
      gap: 0.85rem;
      justify-items: start;
    }

    .inq__done--sent {
      border-inline-start-color: var(--olive);
    }

    .inq__done h3 {
      font-size: var(--step-2);
    }

    .inq__done h3:focus {
      outline: none;
    }

    .inq__fallback {
      font-size: var(--step--1);
      color: var(--on-ivory-dim);
    }

    @media (min-width: 720px) {
      .inq__grid {
        grid-template-columns: 1fr 1fr;
      }

      .inq__field--wide {
        grid-column: 1 / -1;
      }

      .inq__submit {
        width: auto;
        min-width: 14rem;
      }
    }
  `,
})
export class InquiryFormComponent implements OnDestroy {
  /** Preselected business type. */
  readonly buyer = input<BuyerType | ''>('');
  /** International enquiries require a country and leave it blank by default. */
  readonly international = input(false);
  /** Which page the form sits on: 'wholesale' or 'international'. */
  readonly source = input.required<'wholesale' | 'international'>();

  protected readonly c = CONTACT;
  private readonly i18n = inject(I18nService);
  private readonly analytics = inject(AnalyticsService);
  private readonly doc = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly f = computed(() => this.i18n.t().form);
  protected readonly privacyPath = computed(() => pagePath(this.i18n.lang(), 'privacy'));

  /** null until the browser has asked the server whether it can deliver. */
  protected readonly mode = signal<Mode | null>(null);
  protected readonly turnstileKey = signal<string | null>(null);
  protected readonly channel = signal<Channel>('whatsapp');
  protected readonly status = signal<Status>('idle');
  protected readonly errors = signal<Errors>({});
  protected readonly summary = signal(false);
  protected readonly handed = signal<{ channel: Channel; href: string } | null>(null);

  protected readonly submitLabel = computed(() => {
    const f = this.f();
    if (this.status() === 'sending') return f.sending;
    return this.mode() === 'handoff' ? f.submitHandoff[this.channel()] : f.submit;
  });

  private readonly form = viewChild.required<ElementRef<HTMLFormElement>>('form');
  private readonly captchaEl = viewChild<ElementRef<HTMLElement>>('captcha');
  private readonly doneEl = viewChild<ElementRef<HTMLElement>>('doneEl');

  private openedAt = 0;
  private token = '';
  private widgetId?: string;

  constructor() {
    afterNextRender(() => {
      this.openedAt = Date.now();
      void this.detectMode();
    });
  }

  ngOnDestroy(): void {
    if (this.widgetId) this.turnstile()?.remove(this.widgetId);
  }

  /**
   * Ask the server whether it can deliver. Any failure — a static host with no
   * API, a network error, delivery not configured — means hand-off mode.
   * Resolved against <base href>, so a subpath preview asks its own origin.
   */
  private async detectMode(): Promise<void> {
    try {
      const response = await fetch('api/inquiry/config', { headers: { Accept: 'application/json' } });
      const config = response.ok ? await response.json() : null;
      if (config?.enabled === true) {
        this.turnstileKey.set(typeof config.turnstileSiteKey === 'string' ? config.turnstileSiteKey : null);
        this.mode.set('server');
        if (this.turnstileKey()) {
          afterNextRender(() => void this.mountTurnstile(), { injector: this.injector });
        }
        return;
      }
    } catch {
      // fall through
    }
    this.mode.set('handoff');
  }

  private turnstile(): TurnstileApi | undefined {
    return (this.doc.defaultView as (Window & { turnstile?: TurnstileApi }) | null)?.turnstile;
  }

  private async mountTurnstile(): Promise<void> {
    const el = this.captchaEl()?.nativeElement;
    const key = this.turnstileKey();
    if (!el || !key) return;
    if (!this.turnstile()) {
      await new Promise<void>((resolve, reject) => {
        const existing = this.doc.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
        const script = existing ?? this.doc.createElement('script');
        script.addEventListener('load', () => resolve(), { once: true });
        script.addEventListener('error', () => reject(), { once: true });
        if (!existing) {
          script.src = TURNSTILE_SRC;
          script.async = true;
          this.doc.head.appendChild(script);
        }
      }).catch(() => undefined);
    }
    const api = this.turnstile();
    if (!api) return; // The server will reject without a token; the failure state offers hand-off.
    this.widgetId = api.render(el, {
      sitekey: key,
      language: this.i18n.lang(),
      theme: 'light',
      callback: (token: string) => (this.token = token),
      'expired-callback': () => (this.token = ''),
      'error-callback': () => (this.token = ''),
    });
  }

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.status() === 'sending') return;

    const value = this.read();
    const errors = this.validate(value);
    if (this.mode() === 'server' && this.turnstileKey() && !this.token) {
      errors.captcha = this.f().errors.captcha;
    }
    this.errors.set(errors);
    const invalid = Object.keys(errors).filter((k) => k !== 'captcha') as Field[];
    if (invalid.length || errors.captcha) {
      this.summary.set(invalid.length > 0);
      // Move focus to the first problem so keyboard and screen-reader users
      // land on it, not on a submit button that apparently did nothing.
      if (invalid.length) queueMicrotask(() => this.doc.getElementById(`inq-${invalid[0]}`)?.focus());
      return;
    }
    this.summary.set(false);

    if (this.mode() === 'server') {
      await this.deliver(value);
    } else {
      this.handoff(this.channel());
    }
  }

  /** Server delivery. "Sent" is shown only on a 200 from the server. */
  private async deliver(value: Record<Field, string>): Promise<void> {
    this.status.set('sending');
    let reason: 'busy' | 'captcha' | 'invalid' | 'server' | 'network' | null = 'network';
    try {
      const response = await fetch('api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...value,
          website: this.fieldValue('website'),
          elapsedMs: Date.now() - this.openedAt,
          lang: this.i18n.lang(),
          source: this.source(),
          token: this.token,
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (response.ok && body?.ok === true) {
        reason = null;
      } else if (response.status === 429) {
        reason = 'busy';
      } else if (body?.error === 'captcha') {
        reason = 'captcha';
      } else if (body?.error === 'invalid') {
        reason = 'invalid';
      } else {
        reason = 'server';
      }
    } catch {
      reason = 'network';
    }

    if (this.widgetId) {
      this.token = '';
      this.turnstile()?.reset(this.widgetId);
    }

    if (reason === null) {
      const buyer = value.buyer as BuyerType;
      this.analytics.track(this.conversionFor(buyer), this.labels(value, 'server'));
      this.form().nativeElement.reset();
      this.status.set('sent');
      this.focusDone();
      return;
    }

    this.analytics.track('inquiry_error', { reason, form_location: this.source(), language: this.i18n.lang() });
    if (reason === 'captcha') {
      this.status.set('idle');
      this.errors.set({ captcha: this.f().errors.captcha });
    } else {
      this.status.set(reason === 'busy' ? 'busy' : 'failed');
    }
  }

  /**
   * Open the enquiry in the visitor's own app. Not a delivery: the confirmation
   * says "ready — not sent yet", and the event is `inquiry_handoff`.
   */
  protected handoff(channel: Channel): void {
    const value = this.read();
    const body = this.compose(value);
    const href =
      channel === 'whatsapp'
        ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(body)}`
        : `mailto:${CONTACT.email}?subject=${encodeURIComponent(
            `${this.f().heading} — ${value.company}`,
          )}&body=${encodeURIComponent(body.replace(/\n/g, '\r\n'))}`;

    this.analytics.track('inquiry_handoff', { ...this.labels(value, channel), channel });
    this.handed.set({ channel, href });
    this.status.set('handed-off');
    const view = this.doc.defaultView;
    if (channel === 'whatsapp') {
      view?.open(href, '_blank', 'noopener');
    } else if (view) {
      view.location.href = href;
    }
    this.focusDone();
  }

  protected restart(clear: boolean): void {
    if (clear) this.form().nativeElement.reset();
    this.status.set('idle');
    this.handed.set(null);
    this.openedAt = Date.now();
    afterNextRender(() => this.doc.getElementById('inq-name')?.focus(), { injector: this.injector });
  }

  private focusDone(): void {
    // The confirmation exists only after the next render (change detection is
    // coalesced to the next frame), so focus it then, not in a microtask.
    afterNextRender(() => this.doneEl()?.nativeElement.focus(), { injector: this.injector });
  }

  private fieldValue(name: string): string {
    if (!this.isBrowser) return '';
    const el = this.form().nativeElement.elements.namedItem(name) as HTMLInputElement | null;
    return (el?.value ?? '').trim();
  }

  private read(): Record<Field, string> {
    const fields: Field[] = ['name', 'company', 'country', 'email', 'phone', 'buyer', 'product', 'volume', 'message'];
    return Object.fromEntries(fields.map((k) => [k, this.fieldValue(k)])) as Record<Field, string>;
  }

  private validate(value: Record<Field, string>): Errors {
    const e = this.f().errors;
    const errors: Errors = {};
    if (!value.name) errors.name = e.required;
    if (!value.company) errors.company = e.required;
    if (!value.buyer) errors.buyer = e.required;
    if (this.international() && !value.country) errors.country = e.required;
    if (value.email && !EMAIL.test(value.email)) errors.email = e.email;
    if (value.phone && !PHONE.test(value.phone)) errors.phone = e.phone;
    if (!value.email && !value.phone) {
      errors.email = e.contact;
      errors.phone = e.contact;
    }
    return errors;
  }

  /** The hand-off message, labelled in the visitor's language. */
  private compose(value: Record<Field, string>): string {
    const f = this.f();
    const option = <T extends { id: string; label: string }>(list: T[], id: string) =>
      list.find((o) => o.id === id)?.label ?? '';
    const rows: [string, string][] = [
      [f.name, value.name],
      [f.company, value.company],
      [f.country, value.country],
      [f.buyer, option(f.buyerOptions, value.buyer)],
      [f.product, option(f.productOptions, value.product)],
      [f.volume, value.volume],
      [f.email, value.email],
      [f.phone, value.phone],
      [f.message, value.message],
    ];
    const lines = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
    const page = this.doc.defaultView?.location.href.split('#')[0] ?? '';
    return [f.heading, '', ...lines, '', page].join('\n');
  }

  private labels(value: Record<Field, string>, delivery: string): Record<string, string> {
    return {
      buyer_type: value.buyer || 'none',
      product_interest: (value.product as ProductInterest) || 'none',
      delivery,
      form_location: this.source(),
      language: this.i18n.lang(),
    };
  }

  private conversionFor(buyer: BuyerType): AnalyticsEvent {
    if (buyer === 'importer' || this.international()) return 'international_inquiry_submit';
    if (buyer === 'distributor') return 'distributor_inquiry_submit';
    return 'wholesale_inquiry_submit';
  }
}
