import { DomSanitizer } from '@angular/platform-browser';
import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { Button, ButtonColor } from 'shared/directives/button/button.model';

@Directive({
    selector: '[appButton]'
})
export class ButtonDirective {
    private _color: ButtonColor = Button.BLUE;
    private _lastClick = 0;

    private _float: 'left' | 'center' | 'right' | null = null;

    @HostBinding('style.font-size') fontSize = '11px';
    @HostBinding('style.padding') padding = '10px';
    @HostBinding('style.cursor') cursor = 'pointer';
    @HostBinding('style.font-weight') fontWeight = 'bold';
    @HostBinding('style.text-shadow') textShadow;
    @HostBinding('style.box-shadow') boxShadow;
    @HostBinding('style.background') background;
    @HostBinding('style.float') floatDirection = null;
    @HostBinding('style.color') textColor = '#ffffff';
    @HostBinding('style.outline') outline = 'none';
    @HostBinding('style.margin') margin = '0 0 0 5px';
    @HostBinding('class') class = Button.BLUE.class;

    @Output() onClick: EventEmitter<void> = new EventEmitter();

    constructor (
        private _sanitizer: DomSanitizer
    ) {
        this.background = this._sanitizer.bypassSecurityTrustStyle(`url(/assets/images/bargradient.png) , ${this._color.background}`);
        this.textShadow = this._sanitizer.bypassSecurityTrustStyle('1px 1px 0 rgba(125, 125, 125, 0.85)');
        this.boxShadow = this._sanitizer.bypassSecurityTrustStyle(`inset 0 0 0 1px rgba(0,0,0,.18),
            inset 0 0 0 2px rgba(255,255,255,.18),
            0 2px 0 rgba(0, 0, 0, 0.09)`);
    }

    @HostListener('click', ['$event, $event.target'])
    click () {
        if (this._lastClick < (new Date().getTime() - 1000)) {
            this._lastClick = new Date().getTime();
            this.onClick.emit();
        }
    }

    @Input()
    set color (color: ButtonColor) {
        this._color = color || Button.BLUE;
        this.background = this._sanitizer.bypassSecurityTrustStyle(`url(/assets/images/bargradient.png) , ${this._color.background}`);
        this.textColor = this._color.color;
        this.class = color.class;
    }

    @Input()
    set float (align: 'left' | 'center' | 'right') {
        this._float = align;
        this.floatDirection = this._float;
    }
}
