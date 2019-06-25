import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { INFO_BOX_TYPE, InfoBoxModel } from 'shared/app-views/info-box/info-box.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { TitleTab } from 'shared/app-views/title/title.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-staff-radio-kick-dj',
    templateUrl: 'kick-dj.component.html'
})
export class KickDjComponent extends Page implements OnDestroy {

    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Kick DJ'})
    ];
    infoModel: InfoBoxModel = {
        title: 'Warning!',
        type: INFO_BOX_TYPE.WARNING,
        content: `If you kick off the DJ there will be no one air! This action is direct and you should be prepared for any other DJ to jump on air after this button has been clicked.`
    };

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
        elementRef: ElementRef
    ) {
        super(elementRef);
    }

    onKick (): void {
        this._dialogService.confirm({
            title: `Kick Current DJ`,
            content: `Are you sure you want to kick off the current DJ?`,
            callback: this.doKick.bind(this)
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    private doKick (): void {
        this._httpService.post('staff/radio/kick/dj', {})
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success - Kicked',
                    message: 'DJ has been kicked off air!'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

}
