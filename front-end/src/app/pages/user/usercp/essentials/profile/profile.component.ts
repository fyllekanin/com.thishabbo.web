import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ProfileModel, ProfileRelations } from './profile.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';

@Component({
    selector: 'app-usercp-profile',
    templateUrl: 'profile.component.html'
})
export class ProfileComponent extends Page implements OnDestroy {
    private _data: ProfileModel;

    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Save'})
    ];

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Profile Settings',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy() {
        super.destroy();
    }

    onSave(): void {
        this._httpService.put('usercp/profile', {data: this._data})
            .subscribe(() => {
                this._notificationService.sendInfoNotification('Profile Updated!');
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    get model(): ProfileModel {
        return this._data;
    }

    get relations(): ProfileRelations {
        return this._data.relations;
    }

    get testForUrl(): Array<string> {
        const regExp = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
        return this._data.youtube.match(regExp);
    }

    private onData(data: { data: ProfileModel }): void {
        this._data = data.data;
    }
}
