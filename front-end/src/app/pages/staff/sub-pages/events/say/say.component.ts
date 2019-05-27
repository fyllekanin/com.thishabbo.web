import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { STAFFCP_BREADCRUM_ITEM } from '../../../staff.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';

@Component({
    selector: 'app-staff-events-say',
    templateUrl: 'say.component.html'
})
export class SayComponent extends Page implements OnDestroy {
    say: string;

    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Save'})
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
            current: 'Events Says',
            items: [
                STAFFCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onSave (): void {
        this._httpService.put('staff/events/say', {say: this.say})
            .subscribe(() => {
                this._notificationService.sendInfoNotification('Events say updated!');
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private onData (data: { data: string }): void {
        this.say = typeof data.data === 'string' ? data.data : '';
    }
}
