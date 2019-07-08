import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, ResolveEnd, Router, Scroll } from '@angular/router';
import { Page } from 'shared/page/page.model';
import { UserService } from 'core/services/user/user.service';
import { fadeAnimation } from 'shared/animations/fade.animation';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { AuthService } from 'core/services/auth/auth.service';

@Component({
    selector: 'app-root',
    template: `
        <div class="loader" [ngClass]="!isLoading ? 'not-loading' : ''"
             [ngStyle]="{'width': loadingProgress + '%'}"></div>
        <div class="request-wrapper" [ngClass]="requestInProgress ? 'request-wrapper-show' : ''">
            <div class="request" [ngClass]="requestInProgress ? 'request-show' : ''">
                Loading....
            </div>
        </div>
        <app-dialog></app-dialog>
        <app-global-notification></app-global-notification>
        <app-top-bar></app-top-bar>
        <app-top-box></app-top-box>
        <app-header></app-header>
        <div class="grid-container content-margin">
            <app-site-messages></app-site-messages>
            <div class="grid-x">
                <div class="cell small-12" [@fadeAnimation]="o.isActivated ? o.activatedRoute : ''"
                     [ngClass]="isFixed ? 'fixed-menu' : ''">
                    <router-outlet #o="outlet"></router-outlet>
                </div>
            </div>
        </div>
        <app-footer></app-footer>
        <div class="to-top" (click)="goToTop()">&#8249;</div>
    `,
    styleUrls: ['app.component.css'],
    animations: [fadeAnimation]
})
export class AppComponent extends Page implements OnInit, OnDestroy {
    loadingProgress = 0;
    isLoading = false;
    isFixed = false;
    requestInProgress = false;

    constructor (
        private _router: Router,
        private _elementRef: ElementRef,
        private _userService: UserService,
        private _authService: AuthService,
        continuesInformationService: ContinuesInformationService
    ) {
        super(_elementRef);
        this.addCustomListeners();
        this.addActivityListener();
        this.isFixed = Boolean(localStorage.getItem(LOCAL_STORAGE.FIXED_MENU));
        continuesInformationService.onDeviceSettingsUpdated.subscribe(() => {
            this.isFixed = Boolean(localStorage.getItem(LOCAL_STORAGE.FIXED_MENU));
        });
        this._router.events.subscribe(ev => {
            if (ev instanceof NavigationStart) {
                this.loadingProgress = 10;
                this.isLoading = true;
            }
            if (ev instanceof ResolveEnd) {
                this.loadingProgress = 75;
            }
            if (ev instanceof Scroll) {
                this.loadingProgress = 100;
                this.isLoading = false;
                setTimeout(() => {
                    this.loadingProgress = 0;
                }, 2000);
                try {
                    if (AppComponent.isScrollToSet()) {
                        this.tryToScrollToElement();
                    } else if (!AppComponent.isScrollOff()) {
                        document.getElementsByTagName('body')[0].scrollIntoView({behavior: 'smooth'});
                    }
                } catch (e) {
                    document.getElementsByTagName('body')[0].scrollIntoView({behavior: 'smooth'});
                }
            }
        });
    }

    ngOnInit (): void {
        if (location.pathname !== '/') {
            return;
        }
        if (this._authService.isLoggedIn()) {
            this._router.navigateByUrl(this._authService.getAuthUser().homePage)
                .catch(() => {
                    this._router.navigateByUrl('/home');
                });
        }
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    goToTop (): void {
        document.getElementsByTagName('body')[0].scrollIntoView({behavior: 'smooth'});
    }

    private addCustomListeners (): void {
        document.body.addEventListener('click', (event) => {
            const target = event.target;
            if (AppComponent.isTargetInternalLink(target)) {
                event.preventDefault();
                const url = AppComponent.getUrl(target);
                this._router.navigateByUrl(url);
            }
        });
    }

    private addActivityListener (): void {
        window.addEventListener('focus', () => {
            this._userService.isUserActive = true;
        });
        window.addEventListener('blur', () => {
            this._userService.isUserActive = false;
        });
        this._userService.onRequestInProgressChange.subscribe(val => this.requestInProgress = val);
    }

    private static getUrl (ele): string {
        return ele['dataset']['url'];
    }

    private static isTargetInternalLink (ele): boolean {
        return ele instanceof Element
            && ele.nodeName.toUpperCase() === 'A'
            && ele['dataset']['type'] === 'internal';
    }

    private static isScrollToSet (): boolean {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has('scrollTo');
    }

    private static isScrollOff (): boolean {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has('skipScroll');
    }

    private tryToScrollToElement (): void {
        let count = 0;
        const interval = setInterval(() => {
            const result = this.scrollToElement();
            if (count > 5 || result) {
                clearInterval(interval);
            }
            count++;
        }, 500);
    }

    private scrollToElement (): boolean {
        const urlParams = new URLSearchParams(window.location.search);
        let top = -1;
        if (urlParams.has('scrollTo')) {
            const eleSelector = urlParams.get('scrollTo');
            const eles = this._elementRef.nativeElement.getElementsByClassName(`${eleSelector}`);
            top = eles.length > 0 ? eles[0]['ofnfsetTop'] : -1;
        }

        window.scrollTo({left: 0, top: top, behavior: 'smooth'});
        return top > 0;
    }
}
