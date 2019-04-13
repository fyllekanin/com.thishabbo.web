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
        new TitleTab({ title: 'Kick DJ' })
    ];
    infoModel: InfoBoxModel = {
        title: 'Warning!',
        type: INFO_BOX_TYPE.WARNING,
        content: `If you kick off the DJ there will be no one air! This action is direct and<br />
you should be prepared or any other DJ to jump on air after this button click.`
    };

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
        elementRef: ElementRef
    ) {
        super(elementRef);
    }

    onKick(): void {
        this._dialogService.openConfirmDialog(
            `Kicking current DJ`,
            `Are you sure you wanna kick the current DJ?`,
            this.doKick.bind(this)
        );
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    private doKick(): void {
        this._httpService.post('staff/radio/kick/dj', {})
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'DJ is kicked off air!'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

}
