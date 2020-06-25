import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage, NotificationType } from '../global-notification/global-notification.model';
import { StringHelper } from 'shared/helpers/string.helper';

@Component({
    selector: 'app-search-bar',
    templateUrl: 'search-bar.component.html',
    styleUrls: [ 'search-bar.component.css' ]
})

export class SearchBarComponent {
    text: string;

    constructor (
        private _router: Router,
        private _notificationService: NotificationService
    ) {
    }

    goToSearch (): void {
        if (!this.text) {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Error',
                message: 'You need to specify what you want to search first!',
                type: NotificationType.ERROR
            }));
            return;
        }

        const doABarrelRoll = 'do a barrel roll';
        new Promise(res => {
            if (this.text !== doABarrelRoll) {
                res();
                return;
            }

            let degree = 1;
            const timer = setInterval(() => {
                if (degree === 0) {
                    res();
                    clearInterval(timer);
                }
                // @ts-ignore
                $(document.body).css('transform', `rotate(${degree}deg)`);
                degree = degree >= 360 ? 0 : degree + 1;
            }, 5);
        }).then(() => {
            const queryParameters = { queryParams: { text: this.text } };
            this.text = '';
            this._router.navigateByUrl(this._router.createUrlTree(
                [ '/home/search/threads/page/1' ],
                queryParameters
            ));
        });
    }

    goToAdvancedSearch (): void {
        this._router.navigateByUrl('/home/search/threads/page/1');
    }

    onKeyUp (event): void {
        if (StringHelper.isKey(event, 'enter')) {
            this.goToSearch();
        }
    }
}
