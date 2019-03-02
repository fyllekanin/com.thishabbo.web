import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { AutoBan, AutoBanActions } from '../auto-ban.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { AUTO_BAN_LIST_BREADCRUMB_ITEM, SITECP_BREADCRUMB_ITEM } from '../../../../admin.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { DialogService } from 'core/services/dialog/dialog.service';

@Component({
    selector: 'app-admin-auto-ban',
    templateUrl: 'auto-ban.component.html'
})
export class AutoBanComponent extends Page implements OnDestroy {
    private _data = new AutoBan();

    tabs: Array<TitleTab> = [];

    constructor(
        private _router: Router,
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService,
        private _dialogService: DialogService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Auto Ban',
            items: [
                SITECP_BREADCRUMB_ITEM,
                AUTO_BAN_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onTabClick(action: number): void {
        switch (action) {
            case AutoBanActions.SAVE:
                this.onSave();
                break;
            case AutoBanActions.DELETE:
                this.onDelete();
                break;
            case AutoBanActions.CANCEL:
                this._router.navigateByUrl('/admin/moderation/auto-bans/page/1');
                break;
        }
    }

    get model(): AutoBan {
        return this._data;
    }

    get title(): string {
        return this._data && this._data.updatedAt ? `Editing: ${this._data.title}` : `Creating: ${this._data.title}`;
    }

    private onDelete(): void {
        this._dialogService.openConfirmDialog(
            `Are you sure?`,
            `Are you sure you wanna delete ${this._data.title}?`,
            () => {
                this._httpService.delete(`admin/moderation/auto-bans/${this._data.autoBanId}`)
                    .subscribe(() => {
                        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                            title: 'Success',
                            message: 'Autoban deleted'
                        }));
                        this._dialogService.closeDialog();
                        this._router.navigateByUrl('/admin/moderation/auto-bans/page/1');
                    }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
            }
        );
    }

    private onSave(): void {
        if (this._data.updatedAt) {
            this._httpService.put(`admin/moderation/auto-bans/${this._data.autoBanId}`, { autoBan: this._data })
                .subscribe(res => {
                    this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                        title: 'Success',
                        message: 'Autoban updated'
                    }));
                    this.onData({ data: new AutoBan(res) });
                }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
        } else {
            this._httpService.post(`admin/moderation/auto-bans`, { autoBan: this._data })
                .subscribe(res => {
                    this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                        title: 'Success',
                        message: 'Autoban created'
                    }));
                    this.onData({ data: new AutoBan(res) });
                }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
        }
    }

    private onData(data: { data: AutoBan }): void {
        this._data = data.data;

        const tabs = [
            { title: 'Cancel', value: AutoBanActions.CANCEL, condition: true },
            { title: 'Delete', value: AutoBanActions.DELETE, condition: this._data.updatedAt },
            { title: 'Save', value: AutoBanActions.SAVE, condition: true }
        ];

        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}

