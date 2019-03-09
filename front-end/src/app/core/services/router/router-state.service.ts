import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable()
export class RouterStateService {
    private _urls: Array<string> = [];
    private readonly _defaultTitle = 'THVX';

    constructor(router: Router) {
        document.title = this._defaultTitle;
        router.events.subscribe(ev => {
            if (ev instanceof NavigationEnd) {
                this._urls.push(ev.url);
            }
        });
    }

    updateTitle(amountOfNotifications: number): void {
        if (amountOfNotifications > 0) {
            document.title = `(${amountOfNotifications}) ${this._defaultTitle}`;
        } else {
            document.title = this._defaultTitle;
        }
    }

    getPreviousUrl(): string {
        return this._urls[this._urls.length - 2];
    }
}
