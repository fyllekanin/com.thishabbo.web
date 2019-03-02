import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';

@Component({
    selector: 'app-auth-forgot-password',
    templateUrl: 'forgot-password.component.html',
    styleUrls: ['forgot-password.component.css']
})
export class ForgotPasswordComponent extends Page implements OnDestroy {

    constructor(elementRef: ElementRef) {
        super(elementRef);
    }

    ngOnDestroy(): void {
        super.destroy();
    }
}
