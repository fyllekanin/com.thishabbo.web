import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { DialogService } from 'core/services/dialog/dialog.service';

@Injectable()
export class RouterStateService {
    private _notificationAmount = 0;
    private _currentPage = '';
    private _urls: Array<string> = [];
    private readonly _defaultTitle = 'TH';

    constructor (router: Router, dialogService: DialogService) {
        document.title = this._defaultTitle;
        router.events.subscribe(ev => {
            if (ev instanceof NavigationStart) {
                this._urls.push(ev.url);
                dialogService.closeDialog();
            }
        });
    }

    updateNotificationAmount (amountOfNotifications: number): void {
        this._notificationAmount = amountOfNotifications;
        this.setTitle();
    }

    updateCurrentPage (page: string): void {
        this._currentPage = page;
        this.setTitle();
    }

    pushUrl (url: string): void {
        this._urls.push(url);
    }

    getPreviousUrl (): string {
        const previous = this._urls[this._urls.length - 2];
        this._urls = [];
        return previous;
    }

    private setTitle (): void {
        const prefix = this._notificationAmount > 0 ?
            `(${this._notificationAmount}) ` : '';
        const postfix = this._currentPage ?
            `- ${this._currentPage}` : '';

        document.title = prefix + `${this._defaultTitle} ${postfix}`;
    }
}
