import { AfterViewInit, Directive, ElementRef, HostBinding, Input, OnDestroy, Sanitizer, SecurityContext } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
    selector: '[appLazyLoad]'
})
export class LazyLoadDirective implements OnDestroy, AfterViewInit {
    private _isLoaded = false;
    private _imageUrl: string;

    private _scrollSubscription: Subscription;

    @HostBinding('style.background-image') backgroundUrl;
    @HostBinding('style.display') display = 'inline-block';

    constructor (
        private _elementRef: ElementRef,
        private _santitizer: DomSanitizer
    ) {}

    ngAfterViewInit (): void {
        this.loadImage();
    }

    ngOnDestroy (): void {
        if (!this.haveLoadedImage() && this.isInsideViewport()) {
            this.setImage();
        }
    }

    @Input()
    set image (url: string) {
        if (this._isLoaded) {
            return;
        }
        this.subscribeToScroll();
        this._imageUrl = url;
        this.loadImage();
    }

    private onScroll (event): void {
        event.stopPropagation();
        this.loadImage();
    }

    private setImage (): void {
        if (this._isLoaded) {
            return;
        }
        this.unsubscribeToScroll();
        this._isLoaded = true;
        if (this._elementRef.nativeElement.nodeName === 'IMG') {
            this._elementRef.nativeElement.src = this._imageUrl;
        } else {
            this.backgroundUrl = this._santitizer.bypassSecurityTrustStyle(this._imageUrl);
        }
    }

    private loadImage (): void {
        if (!this.haveLoadedImage() && this.isInsideViewport()) {
            this.setImage();
        }
    }

    private subscribeToScroll (): void {
        this._scrollSubscription = fromEvent(window, 'scroll').subscribe(this.onScroll.bind(this));
    }

    private unsubscribeToScroll (): void {
        if (this._scrollSubscription) {
            this._scrollSubscription.unsubscribe();
        }
    }

    private haveLoadedImage (): boolean {
        return this._imageUrl === this._loadedImage;
    }

    private isInsideViewport (): boolean {
        const rect = this._elementRef.nativeElement.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

        const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
        const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

        return (vertInView && horInView);
    }
}
