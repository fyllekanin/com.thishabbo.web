import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationSettingsModel } from './notification-settings.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { NotificationSettingsService } from '../services/notification-settings.service';

@Component({
    selector: 'app-usercp-notification-settings',
    templateUrl: 'notification-settings.component.html'
})
export class NotificationSettingsComponent extends Page implements OnDestroy {
    private _data: NotificationSettingsModel;

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];

    constructor (
        private _service: NotificationSettingsService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Notification Settings',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onSave (): void {
        this._service.save(this._data);
    }

    get model (): NotificationSettingsModel {
        return this._data;
    }

    private onData (data: { data: NotificationSettingsModel }): void {
        this._data = data.data;
    }
}
