import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { DialogService } from 'core/services/dialog/dialog.service';
import { AuthService } from 'core/services/auth/auth.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { RequestComponent } from '../request/request.component';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { RadioModel } from '../radio.model';

@Injectable()
export class RadioService {

    constructor (
        private _dialogService: DialogService,
        private _authService: AuthService,
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _componentResolver: ComponentFactoryResolver
    ) {
    }

    openRequest (): void {
        this._dialogService.openDialog({
            title: 'Request',
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({title: 'Send', callback: this.onRequest.bind(this)})
            ],
            component: this._componentResolver.resolveComponentFactory(RequestComponent),
            data: this._authService.isLoggedIn()
        });
    }

    likeDj (): void {
        if (!this._authService.isLoggedIn()) {
            this._notificationService.sendErrorNotification('You need to be logged in when liking a DJ');
            return;
        }
        this._httpService.post('radio/like', null).subscribe((res: { isTimeout: boolean, timeLeft: number }) => {
            if (!res.isTimeout) {
                this._notificationService.sendInfoNotification('You liked the DJ!');
            } else {
                this._notificationService.sendErrorNotification(`You need to wait ${Math.floor(res.timeLeft / 60)} min(s) to like!`);
            }
        }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    likeHost (): void {
        if (!this._authService.isLoggedIn()) {
            this._notificationService.sendErrorNotification('You need to be logged in when liking a host');
            return;
        }
        this._httpService.post('event/like', null).subscribe(() => {
            this._notificationService.sendInfoNotification('You liked the Events Host!');
        }, this._notificationService.failureNotification.bind(this._notificationService));
    }


    openInfo (stats: RadioModel, isPlaying: boolean): void {
        this._dialogService.openDialog({
            title: 'Radio Info',
            content: `<strong>Current DJ:</strong> <br /> ${stats.currentDj.nickname} <br /><br />
                <strong>Song:</strong> <br /> ${stats.song} <br /><br />
                <strong>Listeners:</strong> <br /> ${isPlaying ? stats.listeners : 'Tune in to see the song...'}`,
            buttons: [
                new DialogCloseButton('Close')
            ]
        });
    }

    private onRequest (request: { content: string, nickname: string }): void {
        this._httpService.post('radio/request', {content: request.content, nickname: request.nickname})
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Request sent!'
                }));
                this._dialogService.closeDialog();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

}
