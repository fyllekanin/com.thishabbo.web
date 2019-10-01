import { DomSanitizer } from '@angular/platform-browser';
import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
    selector: '[appUserProfile]'
})
export class UserProfileDirective {
    private _info: IUserProfile = {};

    @HostBinding('style.background-position') backgroundPosition = 'center';
    @HostBinding('style.background-position-x') backgroundPositionX = '0';
    @HostBinding('style.background-repeat') backgroundRepeat = 'no-repeat';
    @HostBinding('style.background-size') backgroundSize = '100%';
    @HostBinding('style.border') border = '1px solid #fff';
    @HostBinding('style.border-radius') borderRadius = '100%';
    @HostBinding('style.height') height = '70px';
    @HostBinding('style.width') width = '70px';
    @HostBinding('style.-webkit-box-shadow') webkitBoxShadow;
    @HostBinding('style.float') floatStyle;
    @HostBinding('style.margin') margin = '0 auto';

    constructor(
        protected _elementRef: ElementRef,
        sanitizer: DomSanitizer
    ) {
        this.webkitBoxShadow = sanitizer.bypassSecurityTrustStyle('rgba(0, 0, 0, 0.1) 0 3px 5px');
    }

    @Input()
    set info(info: IUserProfile) {
        this._info = info || {};
        this.setImage();
    }

    @Input()
    set float(float: 'right' | 'left') {
        this.floatStyle = float;
    }

    @Input()
    set isSmall(value: boolean) {
        this.height = value ? '50px' : '70px';
        this.width = value ? '50px' : '70px';
    }

    private setImage(): void {
        this._elementRef.nativeElement.style.backgroundImage =
            `url(/rest/resources/images/users/${this._info.userId}.gif?updatedAt=${this._info.avatarUpdatedAt})`;
    }
}

export interface IUserProfile {
    userId?: number;
    avatarUpdatedAt?: number;
}
