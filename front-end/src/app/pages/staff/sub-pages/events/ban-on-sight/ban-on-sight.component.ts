import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { BanOnSightActions, BanOnSightItem } from './ban-on-sight.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { STAFFCP_BREADCRUM_ITEM } from '../../../staff.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { HttpService } from 'core/services/http/http.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';

@Component({
    selector: 'app-staff-ban-on-sight',
    templateUrl: './ban-on-sight.component.html'
})

export class BanOnSightComponent extends Page implements OnDestroy {
    private _data = new BanOnSightItem();
    tabs: Array<TitleTab> = [];

    constructor (
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        private _router: Router,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Ban On Sight',
            items: [
                STAFFCP_BREADCRUM_ITEM
            ]
        });
    }

    onTabClick (value: number): void {
        switch (value) {
            case BanOnSightActions.SAVE:
                this.save();
                break;
            case BanOnSightActions.BACK:
                this.cancel();
                break;
            case BanOnSightActions.DELETE:
                this.delete();
                break;
        }
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    private cancel (): void {
        this._router.navigateByUrl('/staff/events/ban-on-sight');
    }

    private delete (): void {
        this._dialogService.confirm({
            title: `Deleting BOS Entry`,
            content: `Are you sure that you want to delete this?`,
            callback: this.onDelete.bind(this, this._data.id)
        });
    }

    private save (): void {
        if (this._data.createdAt) {
            this._httpService.put(`staff/events/ban-on-sight/${this._data.id}`,
                { information: this._data })
                .subscribe(() => {
                        this.onSuccessUpdate();
                    },
                    error => {
                        this._notificationService.failureNotification(error);
                    });
        } else {
            this._httpService.post('staff/events/ban-on-sight', { information: this._data })
                .subscribe(res => {
                        this._data = new BanOnSightItem(res);
                        this.onSuccessCreate();
                    },
                    error => {
                        this._notificationService.failureNotification(error);
                    });
        }
    }

    private onDelete (entryId: number): void {
        this._httpService.delete(`staff/events/ban-on-sight/${entryId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'BOS Entry has been deleted!'
                }));
                this._router.navigateByUrl('/staff/events/ban-on-sight');
            }, error => {
                this._notificationService.failureNotification(error);
            }, () => {
                this._dialogService.closeDialog();
            });
    }

    private onSuccessCreate (): void {
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'User has been added to Ban On Sight!'
        }));
    }

    private onSuccessUpdate (): void {
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'Ban On Sight has been updated!'
        }));
        this._router.navigateByUrl('/staff/events/ban-on-sight');

    }

    get model (): BanOnSightItem {
        return this._data;
    }

    get title (): string {
        return this._data.createdAt ?
            `Editing Do Not Hire: ${this._data.name}` :
            `Adding to Do Not Hire list`;
    }

    private onData (data: { data: BanOnSightItem }): void {
        this._data = data.data;

        const tabs = [
            { title: 'Save', value: BanOnSightActions.SAVE, condition: true },
            { title: 'Back', value: BanOnSightActions.BACK, condition: true },
            { title: 'Delete', value: BanOnSightActions.DELETE, condition: this._data.createdAt }
        ];

        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}
