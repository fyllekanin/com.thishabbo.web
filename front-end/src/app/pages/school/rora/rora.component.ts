import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { SlimUser } from 'core/services/auth/auth.model';
import { RoraService } from './rora.service';

@Component({
    selector: 'app-school-rora',
    templateUrl: 'rora.component.html',
    styleUrls: [
        'rora.component.css'
    ]
})
export class RoraComponent extends Page implements OnDestroy {
    tabs: Array<TitleTab> = [];
    nickname: string;
    users: Array<SlimUser> = [];

    constructor (
        elementRef: ElementRef,
        private _service: RoraService
    ) {
        super(elementRef);
        this.tabs = [
            new TitleTab({
                title: 'Search'
            })
        ];
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    searchUsers (): void {
        this._service.searchUsers(this.nickname).subscribe(data => this.users = data);
    }
}
