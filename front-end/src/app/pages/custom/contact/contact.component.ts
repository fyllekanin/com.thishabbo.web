import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { ContactModel } from './contact.model';
import { AuthService } from 'core/services/auth/auth.service';
import { INFO_BOX_TYPE, InfoBoxModel } from 'shared/app-views/info-box/info-box.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';

@Component({
    selector: 'app-custom-contact',
    templateUrl: 'contact.component.html',
    styleUrls: ['contact.component.css']
})
export class ContactComponent extends Page implements OnDestroy {
    notLoggedIn: InfoBoxModel = {
        type: INFO_BOX_TYPE.INFO,
        title: 'You need to be logged in',
        content: 'You need to be logged in to apply!'
    };
    data = new ContactModel();
    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Submit'})
    ];

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _authService: AuthService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Contact'
        });
    }

    get isLoggedIn (): boolean {
        return this._authService.isLoggedIn();
    }

    ngOnDestroy () {
        super.destroy();
    }

    onApply (): void {
        this._httpService.post('form/contact', {data: this.data})
            .subscribe(() => {
                this._notificationService.sendInfoNotification('Contact posted!');
                this.data = new ContactModel();
            }, error => {
                this._notificationService.failureNotification(error);
            });
    }
}
