import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Marks a trusted, in-repo SVG/HTML string as safe so Angular renders it
 * verbatim instead of stripping SVG nodes via the default HTML sanitizer.
 * Only ever used with our own hard-coded icon markup — never user input.
 */
@Pipe({ name: 'safeHtml', standalone: true })
export class SafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
