import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { EmailModel } from './email.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-usercp-email',
    templateUrl: 'email.component.html',
    styleUrls: ['email.component.css']
})
export class EmailComponent extends Page implements OnDestroy {
    private _data = new EmailModel();

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];

    constructor(
        private _globalNotificationService: GlobalNotificationService,
        private _httpService: HttpService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
    }

    onSave(): void {
        this._httpService.put('usercp/email', { data: this._data })
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'E-mail saved'
                }));
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    get model(): EmailModel {
        return this._data;
    }

    private onData(data: { data: EmailModel }): void {
        this._data = data.data;
    }
}
