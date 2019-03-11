import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { USERCP_BREADCRUM_ITEM } from '../usercp.constants';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { AuthService } from 'core/services/auth/auth.service';
import { TitleTab } from 'shared/app-views/title/title.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { UsercpHabboService } from '../services/usercp-habbo.service';

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
        private _globalNotificationService: GlobalNotificationService,
        private _service: UsercpHabboService,
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
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Warning',
                message: 'You can not update to nothing, fill something in',
                type: NotificationType.WARNING
            }));
            return;
        }
        this._service.save(this.newHabbo).subscribe(() => {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
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
