import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { TitleTab } from 'shared/app-views/title/title.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { STAFFCP_BREADCRUM_ITEM, STAFFCP_RADIO_BREADCRUM_ITEM } from '../../../staff.constants';
import { ManageConnectionActions, ManageConnectionModel } from './manage-connection.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-staff-manage-connection',
    templateUrl: 'manage-connection.component.html'
})

export class ManageConnectionComponent extends Page implements OnDestroy {

    private _manageConnectionModel = new ManageConnectionModel();
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save', value: ManageConnectionActions.SAVE })
    ];

    constructor (
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Manage Connection Information',
            items: [
                STAFFCP_BREADCRUM_ITEM,
                STAFFCP_RADIO_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    toggleType (event, type: string): void {
        event.preventDefault();
        this._manageConnectionModel.serverType = type;
    }

    isServerType (type: string): boolean {
        return this._manageConnectionModel.serverType === type;
    }

    get model (): ManageConnectionModel {
        return this._manageConnectionModel;
    }

    onTabClick (value: number): void {
        switch (value) {
            case ManageConnectionActions.SAVE:
                this.save();
                break;
        }
    }

    private save (): void {
        this._httpService.put('staff/radio/manage-connection', { information: this._manageConnectionModel })
            .subscribe(() => {
                this.onSuccessUpdate();
            }, error => {
                this._notificationService.failureNotification(error);
            });
    }

    private onSuccessUpdate (): void {
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'Information updated!'
        }));
    }

    private onData (data: { data: ManageConnectionModel }): void {
        this._manageConnectionModel = data.data;
    }
}
