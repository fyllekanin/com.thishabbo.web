import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NotificationView } from 'shared/components/notification-views/notification-views.model';
import { NotificationModel } from 'shared/app-views/top-bar/top-bar.model';
import { BadgeView } from 'app/shared/components/notification-views/badge-view/badge-view.model';

@Component({
    selector: 'app-top-bar-badge-view',
    templateUrl: 'badge-view.component.html',
    styleUrls: [ '../notification.views.css' ]
})
export class BadgeViewComponent implements NotificationView {
    private _notification: NotificationModel<BadgeView>;

    imagePath: string;
    name: string;

    @Output()
    onClick = new EventEmitter<number>();

    @Input()
    set notification (notification: NotificationModel<BadgeView>) {
        this._notification = notification;
        this.name = this._notification.item.badge ? this._notification.item.badge.name : 'Unknown';
        this.imagePath = this._notification.item.badge ?
            `/resources/images/badges/${this._notification.item.badge.badgeId}.gif` :
            '/assets/images/badge_error.gif';
    }

    getTime (): string {
        return this._notification.createdAt;
    }

    @HostListener('click', [ '$event.target' ])
    click (): void {
        this.onClick.next(this._notification.notificationId);
    }
}
