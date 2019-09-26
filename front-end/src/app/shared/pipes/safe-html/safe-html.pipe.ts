import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
    private _previous: SafeHtml;
    private _previousAsString: string;

    constructor(protected sanitizer: DomSanitizer) {}

    transform(value: string): SafeHtml {
      if (value === this._previousAsString) {
        return this._previous;
      }
      this._previous = this.sanitizer.bypassSecurityTrustHtml(value);
      return this._previous;
    }
}
