import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NotificationView } from 'shared/app-views/top-bar/notification-views/notification-views.model';
import { NotificationModel, NotificationTypes } from 'shared/app-views/top-bar/top-bar.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { InfractionView } from 'shared/app-views/top-bar/notification-views/infraction-view/infraction-view.model';

@Component({
    selector: 'app-top-bar-infraction-view',
    templateUrl: 'infraction-view.component.html',
    styleUrls: ['../notification.views.css', 'infraction-view.component.css']
})
export class InfractionViewComponent implements NotificationView {
    private _notification: NotificationModel<InfractionView>;

    @Output()
    onClick = new EventEmitter<number>();

    @Input()
    set notification(notification: NotificationModel<InfractionView>) {
        this._notification = notification;
    }

    get title(): string {
        return this._notification.item.infraction.title;
    }

    get text(): string {
        return this.isInfractionGivenType ?
            'You received an infraction' : 'One of your infractions got removed';
    }

    get isInfractionGivenType(): boolean {
        return this._notification.type === NotificationTypes.INFRACTION_GIVE;
    }

    getTime(): string {
        return TimeHelper.getTime(this._notification.createdAt);
    }

    @HostListener('click')
    click(): void {
        this.onClick.next(this._notification.notificationId);
    }
}
