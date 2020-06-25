import { AfterViewInit, Directive, ElementRef, HostBinding, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
    selector: '[appImageLazyLoad]'
})
export class ImageLazyLoadDirective implements AfterViewInit {
    private _src: string;
    @HostBinding('attr.src') srcAttr = null;
    @HostBinding('style.background-image') backgroundImageStyle = null;

    @Input() isStyle = false;

    constructor (
        private _elementRef: ElementRef,
        private _sanitizer: DomSanitizer
    ) {
    }

    ngAfterViewInit () {
        this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage();
    }

    @Input()
    set src(src: string) {
        if (this._src !== src) {
            this._src = src;
            this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage();
        }
    }

    private canLazyLoad () {
        return window && 'IntersectionObserver' in window;
    }

    private lazyLoadImage () {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(({ isIntersecting }) => {
                if (isIntersecting) {
                    this.loadImage();
                    obs.unobserve(this._elementRef.nativeElement);
                }
            });
        });
        obs.observe(this._elementRef.nativeElement);
    }

    private loadImage () {
        if (this.isStyle) {
            this.backgroundImageStyle = this._sanitizer.bypassSecurityTrustStyle(`url('${this._src}')`);
        } else {
            this.srcAttr = this._src;
        }
    }
}
