import { Component, ComponentFactoryResolver, ElementRef, OnDestroy } from '@angular/core';
import { Ban, BanModel } from './ban.model';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, USER_LIST_BREADCRUMB_ITEM } from '../../../sitecp.constants';
import { ActivatedRoute } from '@angular/router';
import { TitleTab } from 'shared/app-views/title/title.model';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { TimeHelper } from 'shared/helpers/time.helper';
import { DialogService } from 'core/services/dialog/dialog.service';
import { ReasonComponent } from 'shared/components/reason/reason.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { IReason } from 'shared/components/reason/reason.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { BanService } from '../services/ban.service';

@Component({
    selector: 'app-sitecp-users-ban',
    templateUrl: 'ban.component.html',
    styleUrls: ['ban.component.css']
})
export class BanComponent extends Page implements OnDestroy {
    private _data: BanModel = new BanModel();

    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Ban'}),
        new TitleTab({title: 'Back', link: '/sitecp/users/page/1'})
    ];
    banTabs: Array<TitleTab> = [
        new TitleTab({title: 'Lift Ban'})
    ];

    constructor (
        private _notificationService: NotificationService,
        private _service: BanService,
        private _dialogService: DialogService,
        private _componentFactory: ComponentFactoryResolver,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'User Bans',
            items: [
                SITECP_BREADCRUMB_ITEM,
                USER_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    getTime (expiresAt: number): string {
        return expiresAt === 0 ? 'Never' : TimeHelper.getLongDateWithTime(expiresAt);
    }

    canLift (ban: Ban): boolean {
        if (ban.isLifted) {
            return false;
        }
        return ban.expiresAt === 0 || (new Date().getTime() / 1000) < ban.expiresAt;
    }

    liftBan (banId: number): void {
        this._dialogService.openDialog({
            title: `Lifting ban on ${this._data.user.nickname}`,
            component: this._componentFactory.resolveComponentFactory(ReasonComponent),
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({title: 'Lift', callback: this.doLift.bind(this, banId)})
            ],
            data: {isBanning: false}
        });
    }

    createBan (): void {
        this._dialogService.openDialog({
            title: `New ban on ${this._data.user.nickname}`,
            component: this._componentFactory.resolveComponentFactory(ReasonComponent),
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({title: 'Ban', callback: this.doBan.bind(this)})
            ],
            data: {isBanning: true}
        });
    }

    get title (): string {
        if (!this._data) {
            return '';
        }
        return `${this._data.user.nickname} ban page`;
    }

    get bans (): Array<Ban> {
        return this._data.bans.sort(ArrayHelper.sortByPropertyDesc.bind(this, 'banId'));
    }

    private onData (data: { data: BanModel }): void {
        this._data = data.data;
    }

    private doLift (banId: number, reason: IReason): void {
        if (!reason.reason) {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Error',
                message: 'You need to set a reason',
                type: NotificationType.ERROR
            }));
            return;
        }

        this._service.liftBan(this._data.user.userId, banId, reason)
            .subscribe(res => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: `${this._data.user.nickname}s ban is now liften`
                }));

                this._data.bans = this._data.bans.filter(item => item.banId !== banId);
                this._data.bans.push(new Ban(res));
            }, error => {
                this._notificationService.failureNotification(error);
            }, () => {
                this._dialogService.closeDialog();
            });
    }

    private doBan (reason: IReason): void {
        if (!reason.length) {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Error',
                message: 'You need to set a length of the ban',
                type: NotificationType.ERROR
            }));
            return;
        }
        if (!reason.reason) {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Error',
                message: 'You need to set a reason',
                type: NotificationType.ERROR
            }));
            return;
        }

        this._service.banUser(this._data.user.userId, reason)
            .subscribe(res => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: `${this._data.user.nickname} is now banned`
                }));

                const ban = new Ban(res);
                this._data.bans.push(ban);
            }, error => {
                this._notificationService.failureNotification(error);
            }, () => {
                this._dialogService.closeDialog();
            });
    }
}
