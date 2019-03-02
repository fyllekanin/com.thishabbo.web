import { ClassHelper, primitive } from 'shared/helpers/class.helper';
import { BadgeView } from 'shared/app-views/top-bar/notification-views/badge-view/badge-view.model';
import { CategoryView } from 'shared/app-views/top-bar/notification-views/category-view/category-view.model';
import { ThreadView } from 'shared/app-views/top-bar/notification-views/thread-view/thread-view.model';
import { InfractionView } from 'shared/app-views/top-bar/notification-views/infraction-view/infraction-view.model';

export enum NotificationTypes {
    MENTION = 1,
    QUOTE = 2,
    BADGE = 3,
    THREAD_SUBSCRIPTION = 4,
    CATEGORY_SUBSCRIPTION = 5,
    INFRACTION_GIVE = 6,
    INFRACTION_DELETED = 7
}

export class NotificationModel<T> {
    private readonly _item;

    @primitive()
    notificationId: number;
    @primitive()
    createdAt: number;
    @primitive()
    type: number;

    constructor(source: Partial<NotificationModel<any>>) {
        ClassHelper.assign(this, source);
        switch (source.type) {
            case NotificationTypes.BADGE:
                this._item = new BadgeView(source.item);
                break;
            case NotificationTypes.CATEGORY_SUBSCRIPTION:
                this._item = new CategoryView(source.item);
                break;
            case NotificationTypes.QUOTE:
            case NotificationTypes.MENTION:
            case NotificationTypes.THREAD_SUBSCRIPTION:
                this._item = new ThreadView(source.item);
                break;
            case NotificationTypes.INFRACTION_GIVE:
            case NotificationTypes.INFRACTION_DELETED:
                this._item = new InfractionView(source.item);
        }
    }

    get item(): T {
        return this._item;
    }

    set item(_value) {
        // Intentionally Empty
    }
}
