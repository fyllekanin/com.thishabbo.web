import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Pipe({
    name: 'safeStyle'
})
export class SafeStylePipe implements PipeTransform {
    private _previous: SafeStyle;
    private _previousAsString: string;

    constructor (protected sanitizer: DomSanitizer) {
    }

    transform (value: string): SafeStyle {
        if (value === this._previousAsString) {
            return this._previous;
        }
        this._previous = this.sanitizer.bypassSecurityTrustStyle(value);
        return this._previous;
    }
}
