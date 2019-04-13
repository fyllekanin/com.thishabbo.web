import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { AuthService } from 'core/services/auth/auth.service';
import { TitleTab } from 'shared/app-views/title/title.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationModel, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { HabboService } from '../services/habbo.service';

@Component({
    selector: 'app-usercp-habbo',
    templateUrl: 'habbo.component.html'
})
export class HabboComponent extends Page implements OnDestroy {
    private _habbo: string;

    newHabbo: string;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];

    constructor(
        private _notificationService: NotificationService,
        private _service: HabboService,
        private _authService: AuthService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Habbo',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onSave(): void {
        if (!this.newHabbo) {
            this._notificationService.sendNotification(new NotificationModel({
                title: 'Warning',
                message: 'You can not update to nothing, fill something in',
                type: NotificationType.WARNING
            }));
            return;
        }
        this._service.save(this.newHabbo).subscribe(() => {
            this._notificationService.sendNotification(new NotificationModel({
                title: 'Success',
                message: 'Your habbo is updated!'
            }));
            this._habbo = this.newHabbo;
            this.newHabbo = '';
        });
    }

    get motto(): string {
        return `thishabbo-${this._authService.authUser.userId}`;
    }

    get habbo(): string {
        return this._habbo || 'None';
    }

    private onData(data: { data: string }): void {
        this._habbo = data.data;
    }
}
