import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[appHabboBadge]'
})
export class HabboBadgeDirective {
    private static readonly DEFAULT = '/assets/images/badge_error.gif';
    private static readonly URL = 'https://images.habbogroup.com/c_images/album1584/{code}.{extension}';
    private static readonly EXTENSIONS = [
        'gif',
        'png',
        'jpg'
    ];
    private _code: string;

    constructor (private _elementRef: ElementRef) {
    }

    @Input()
    set code (code: string) {
        this._code = code;
        this.setImage(0);
    }

    private setImage (index: number): void {
        const image = new Image();
        const path = HabboBadgeDirective.URL
            .replace('{code}', this._code)
            .replace('{extension}', HabboBadgeDirective.EXTENSIONS[index]);

        image.onload = () => {
            this._elementRef.nativeElement.src = path;
        };
        image.onerror = () => {
            if (index < (HabboBadgeDirective.EXTENSIONS.length - 1)) {
                this.setImage(index + 1);
            } else {
                image.src = HabboBadgeDirective.DEFAULT;
            }
        };
        image.src = path;
    }
}
