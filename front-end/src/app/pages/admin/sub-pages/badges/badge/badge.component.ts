import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Page } from 'shared/page/page.model';
import { BADGE_LIST_BREADCRUMB_ITEM, SITECP_BREADCRUMB_ITEM } from '../../../admin.constants';
import { Badge, BadgeActions } from '../badges.model';

@Component({
    selector: 'app-badges-badge',
    templateUrl: 'badge.component.html'
})
export class BadgeComponent extends Page implements OnDestroy {
    private _badge: Badge = new Badge();

    @ViewChild('file', { static: true }) fileInput;
    tabs: Array<TitleTab> = [];

    constructor (
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        private _httpClient: HttpClient,
        private _router: Router,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Editing Badge',
            items: [
                SITECP_BREADCRUMB_ITEM,
                BADGE_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    onTabClick (value: number): void {
        switch (value) {
            case BadgeActions.SAVE:
                this.save();
                break;
            case BadgeActions.DELETE:
                this.delete();
                break;
            case BadgeActions.CANCEL:
                this.cancel();
                break;
        }
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    save (): void {
        const form = new FormData();
        const file = this.fileInput.nativeElement.files ? this.fileInput.nativeElement.files[0] : null;
        form.append('badgeImage', file);
        form.append('badge', JSON.stringify(this._badge));
        if (this._badge.badgeId) {
            this._httpClient.post(`rest/api/admin/badges/${this._badge.badgeId}`, form).subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: `${this._badge.name} was updated!`
                }));
                this.cancel();
            }, this._notificationService.failureNotification.bind(this._notificationService));
        } else {
            this._httpClient.post('rest/api/admin/badges', form).subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: `${this._badge.name} was created!`
                }));
                this.cancel();
            }, this._notificationService.failureNotification.bind(this._notificationService));
        }
    }

    delete (): void {
        this._dialogService.confirm({
            title: `Deleting badge`,
            content: `Are you sure that you want to delete the badge ${this._badge.name}?`,
            callback: this.onDelete.bind(this)
        });
    }

    cancel (): void {
        this._router.navigateByUrl('/admin/badges/page/1');
    }

    get title (): string {
        return this._badge.createdAt ?
            `Editing Badge: ${this._badge.name}` :
            `Creating Badge: ${this._badge.name}`;
    }

    get badge (): Badge {
        return this._badge;
    }

    get badgesImage (): string {
        return `${this._badge.badgeId}.gif?${this._badge.updatedAt}`;
    }

    private onDelete (): void {
        this._httpClient.delete(`rest/api/admin/badges/${this._badge.badgeId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Badge deleted!'
                }));
                this._router.navigateByUrl('/admin/badges/page/1');
            }, this._notificationService.failureNotification.bind(this._notificationService), () => {
                this._dialogService.closeDialog();
            });
    }

    private onPage (data: { data: Badge }): void {
        this._badge = data.data;

        const tabs = [
            {title: 'Cancel', value: BadgeActions.CANCEL, condition: true},
            {title: 'Delete', value: BadgeActions.DELETE, condition: this._badge.createdAt},
            {title: 'Save', value: BadgeActions.SAVE, condition: true}
        ];

        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}
