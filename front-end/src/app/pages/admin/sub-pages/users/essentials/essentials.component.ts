import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, USER_LIST_BREADCRUMB_ITEM } from '../../../admin.constants';
import { ActivatedRoute } from '@angular/router';
import { User } from 'core/services/auth/auth.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { TitleTab } from 'shared/app-views/title/title.model';

@Component({
    selector: 'app-admin-user-essentials',
    templateUrl: 'essentials.component.html',
    styleUrls: ['essentials.component.css']
})
export class EssentialsComponent extends Page implements OnDestroy {
    private _data: User;
    private _updatedAt = (new Date().getTime() / 1000);

    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Remove'})
    ];

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Editing User Essentials',
            items: [
                SITECP_BREADCRUMB_ITEM,
                USER_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onRemoveAvatar (): void {
        this._httpService.delete(`admin/users/${this._data.userId}/avatar`)
            .subscribe(() => {
                this._notificationService.sendInfoNotification('Avatar removed!');
                this._updatedAt = new Date().getTime() / 1000;
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    onRemoveCoverPhoto (): void {
        this._httpService.delete(`admin/users/${this._data.userId}/cover-photo`)
            .subscribe(() => {
                this._notificationService.sendInfoNotification('Coverphoto removed!');
                this._updatedAt = new Date().getTime() / 1000;
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    onRemoveSignature (): void {
        this._httpService.delete(`admin/users/${this._data.userId}/signature`)
            .subscribe(() => {
                this._notificationService.sendInfoNotification('Signature removed!');
                this._data.signature = '';
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    get userId (): number {
        return this._data.userId;
    }

    get signature (): string {
        return this._data.signature;
    }

    get updatedAt (): number {
        return this._updatedAt;
    }

    private onData (data: { data: User }): void {
        this._data = data.data;
    }
}
