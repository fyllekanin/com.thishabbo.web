import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { DialogService } from 'core/services/dialog/dialog.service';

@Injectable()
export class RouterStateService {
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

    updateTitle (amountOfNotifications: number): void {
        if (amountOfNotifications > 0) {
            document.title = `(${amountOfNotifications}) ${this._defaultTitle}`;
        } else {
            document.title = this._defaultTitle;
        }
    }

    pushUrl (url: string): void {
        this._urls.push(url);
    }

    getPreviousUrl (): string {
        const previous = this._urls[this._urls.length - 2];
        this._urls = [];
        return previous;
    }
}
