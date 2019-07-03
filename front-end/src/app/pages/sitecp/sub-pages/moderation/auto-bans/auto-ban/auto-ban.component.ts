import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { AutoBan, AutoBanActions } from '../auto-ban.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { AUTO_BAN_LIST_BREADCRUMB_ITEM, SITECP_BREADCRUMB_ITEM } from '../../../../sitecp.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { DialogService } from 'core/services/dialog/dialog.service';

@Component({
    selector: 'app-sitecp-auto-ban',
    templateUrl: 'auto-ban.component.html'
})
export class AutoBanComponent extends Page implements OnDestroy {
    private _data = new AutoBan();

    tabs: Array<TitleTab> = [];

    constructor (
        private _router: Router,
        private _httpService: HttpService,
        private _notificationService: NotificationService,
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

    ngOnDestroy (): void {
        super.destroy();
    }

    onTabClick (action: number): void {
        switch (action) {
            case AutoBanActions.SAVE:
                this.onSave();
                break;
            case AutoBanActions.DELETE:
                this.onDelete();
                break;
            case AutoBanActions.BACK:
                this._router.navigateByUrl('/sitecp/moderation/auto-bans/page/1');
                break;
        }
    }

    get model (): AutoBan {
        return this._data;
    }

    get title (): string {
        return this._data && this._data.updatedAt ? `Editing: ${this._data.title}` : `Creating: ${this._data.title}`;
    }

    private onDelete (): void {
        this._dialogService.confirm({
            title: `Delete Autoban`,
            content: `Are you sure you want to delete ${this._data.title}?`,
            callback: () => {
                this._httpService.delete(`sitecp/moderation/auto-bans/${this._data.autoBanId}`)
                    .subscribe(() => {
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'Autoban deleted'
                        }));
                        this._dialogService.closeDialog();
                        this._router.navigateByUrl('/sitecp/moderation/auto-bans/page/1');
                    }, this._notificationService.failureNotification.bind(this._notificationService));
            }
        });
    }

    private onSave (): void {
        if (this._data.updatedAt) {
            this._httpService.put(`sitecp/moderation/auto-bans/${this._data.autoBanId}`, {autoBan: this._data})
                .subscribe(res => {
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Success',
                        message: 'Autoban updated'
                    }));
                    this.onData({data: new AutoBan(res)});
                }, this._notificationService.failureNotification.bind(this._notificationService));
        } else {
            this._httpService.post(`sitecp/moderation/auto-bans`, {autoBan: this._data})
                .subscribe(res => {
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Success',
                        message: 'Autoban created'
                    }));
                    this.onData({data: new AutoBan(res)});
                }, this._notificationService.failureNotification.bind(this._notificationService));
        }
    }

    private onData (data: { data: AutoBan }): void {
        this._data = data.data;

        const tabs = [
            {title: 'Save', value: AutoBanActions.SAVE, condition: true},
            {title: 'Back', value: AutoBanActions.BACK, condition: true},
            {title: 'Delete', value: AutoBanActions.DELETE, condition: this._data.updatedAt}
        ];

        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}

