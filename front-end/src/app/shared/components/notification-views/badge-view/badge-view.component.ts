import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NotificationView } from 'shared/components/notification-views/notification-views.model';
import { NotificationModel } from 'shared/app-views/top-bar/top-bar.model';
import { BadgeView } from 'app/shared/components/notification-views/badge-view/badge-view.model';

@Component({
    selector: 'app-top-bar-badge-view',
    templateUrl: 'badge-view.component.html',
    styleUrls: ['../notification.views.css']
})
export class BadgeViewComponent implements NotificationView {
    private _notification: NotificationModel<BadgeView>;

    @Output()
    onClick = new EventEmitter<number>();

    @Input()
    set notification (notification: NotificationModel<BadgeView>) {
        this._notification = notification;
    }

    get imagePath (): string {
        return `/rest/resources/images/badges/${this._notification.item.badge.badgeId}.gif`;
    }

    get name (): string {
        return this._notification.item.badge.name;
    }

    getTime (): string {
        return this._notification.createdAt;
    }

    @HostListener('click')
    click (): void {
        this.onClick.next(this._notification.notificationId);
    }
}
