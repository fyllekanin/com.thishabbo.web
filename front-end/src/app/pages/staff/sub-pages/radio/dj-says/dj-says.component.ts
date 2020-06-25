import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { DjSaysModel } from './dj-says.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { STAFFCP_BREADCRUM_ITEM, STAFFCP_RADIO_BREADCRUM_ITEM } from '../../../staff.constants';
import { INFO_BOX_TYPE, InfoBoxModel } from 'shared/app-views/info-box/info-box.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-staff-radio-dj-says',
    templateUrl: 'dj-says.component.html'
})
export class DjSaysComponent extends Page implements OnDestroy {
    private _data: DjSaysModel = new DjSaysModel();

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];
    infoModel: InfoBoxModel = {
        title: 'Warning!',
        type: INFO_BOX_TYPE.WARNING,
        content: `You are not the current DJ and do not have override permission to update the DJ says`
    };

    constructor (
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'DJ Says',
            items: [
                STAFFCP_BREADCRUM_ITEM,
                STAFFCP_RADIO_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onSave (): void {
        this._httpService.put('staff/radio/dj-says', { says: this._data.says })
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'DJ Says updated!'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    get model (): DjSaysModel {
        return this._data;
    }

    private onData (data: { data: DjSaysModel }): void {
        this._data = data.data;
    }
}
