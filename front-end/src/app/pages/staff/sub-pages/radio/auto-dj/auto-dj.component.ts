import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { Button } from 'shared/directives/button/button.model';

@Component({
    selector: 'app-staff-radio-auto-dj',
    templateUrl: 'auto-dj.component.html'
})
export class AutoDjComponent extends Page implements OnDestroy {

    startButton = Button.GREEN;
    stopButton = Button.RED;

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
        elementRef: ElementRef
    ) {
        super(elementRef);
    }

    onStart (): void {
        this._dialogService.confirm({
            title: `Start Auto DJ`,
            content: `Are you sure you want to start the Auto DJ?`,
            callback: this.doStart.bind(this)
        });
    }

    onStop (): void {
        this._dialogService.confirm({
            title: `Stop Auto DJ`,
            content: `Are you sure you want to stop the Auto DJ?`,
            callback: this.doStop.bind(this)
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    private doStart (): void {
        this._httpService.post('staff/radio/auto-dj/start', {})
            .subscribe(() => {
                this._dialogService.closeDialog();
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success - Started',
                    message: 'Auto DJ have been started'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private doStop (): void {
        this._httpService.post('staff/radio/auto-dj/stop', {})
            .subscribe(() => {
                this._dialogService.closeDialog();
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success - Stopped',
                    message: 'Auto DJ have been stopped'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }
}
