import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { DoNotHireActions, DoNotHireItem } from './do-not-hire.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { STAFFCP_BREADCRUM_ITEM, STAFFCP_MANAGEMENT_BREADCRUMB_ITEM } from '../../../staff.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { HttpService } from 'core/services/http/http.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';

@Component({
    selector: 'app-staff-management-do-not-hire',
    templateUrl: 'do-not-hire.component.html'
})
export class DoNotHireComponent extends Page implements OnDestroy {
    private _editing;
    private _data = new DoNotHireItem();
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
            current: 'Do Not Hire',
            items: [
                STAFFCP_BREADCRUM_ITEM,
                STAFFCP_MANAGEMENT_BREADCRUMB_ITEM
            ]
        });
    }

    onTabClick (value: number): void {
        switch (value) {
            case DoNotHireActions.SAVE:
                this.save();
                break;
            case DoNotHireActions.BACK:
                this.cancel();
                break;
            case DoNotHireActions.DELETE:
                this.delete();
                break;
        }
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    private cancel (): void {
        this._router.navigateByUrl('/staff/management/do-not-hire');
    }

    private delete (): void {
        this._dialogService.confirm({
            title: `Deleting DNH Entry`,
            content: `Are you sure that you wanna delete this?`,
            callback: this.onDelete.bind(this, this._data.nickname)
        });
    }

    private save (): void {
        const information = {
            nickname: this._data.nickname,
            reason: this._data.reason,
            createdAt: this._data.createdAt
        };

        if (this._editing) {
            this._httpService.put(`staff/management/do-not-hire/${this._editing}`,
                {information: information})
                .subscribe(() => {
                        this.onSuccessUpdate();
                    },
                    error => {
                        this._notificationService.failureNotification(error);
                    });
        } else {
            this._httpService.post('staff/management/do-not-hire', {information: information})
                .subscribe(() => {
                        this.onSuccessCreate();
                    },
                    error => {
                        this._notificationService.failureNotification(error);
                    });
        }
    }

    private onDelete (nickname: string): void {
        this._httpService.delete(`staff/management/do-not-hire/${nickname}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Entry deleted!'
                }));
                this._router.navigateByUrl('/staff/management/do-not-hire');
            }, error => {
                this._notificationService.failureNotification(error);
            }, () => {
                this._dialogService.closeDialog();
            });
    }

    private onSuccessCreate (): void {
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'User added to Do Not Hire!'
        }));
        this._data.createdAt = new Date().getTime() / 1000;
        this._editing = this._data.nickname;
    }

    private onSuccessUpdate (): void {
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'Do Not Hire updated!'
        }));
    }

    get model (): DoNotHireItem {
        return this._data;
    }

    get title (): string {
        return this._data.createdAt ?
            `Editing Do Not Hire: ${this._data.nickname}` :
            `Adding to Do Not Hire list`;
    }

    private onData (data: { data: DoNotHireItem }): void {
        this._data = data.data;
        if (this._data.createdAt) {
            this._editing = this._data.nickname;
        }

        const tabs = [
            {title: 'Save', value: DoNotHireActions.SAVE, condition: true},
            {title: 'Delete', value: DoNotHireActions.DELETE, condition: this._data.createdAt},
            {title: 'Back', value: DoNotHireActions.BACK, condition: true}
        ];

        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}
