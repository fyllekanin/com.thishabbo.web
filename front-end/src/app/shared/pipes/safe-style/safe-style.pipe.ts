import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Pipe({
  name: 'safeStyle'
})
export class SafeStylePipe implements PipeTransform {

    constructor(protected sanitizer: DomSanitizer) {}

    transform(value: string): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(value);
    }
}
