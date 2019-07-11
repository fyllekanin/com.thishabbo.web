import { ClassHelper, primitive, time } from 'shared/helpers/class.helper';
import { BadgeView } from 'shared/components/notification-views/badge-view/badge-view.model';
import { CategoryView } from 'shared/components/notification-views/category-view/category-view.model';
import { ThreadView } from 'shared/components/notification-views/thread-view/thread-view.model';
import { InfractionView } from 'shared/components/notification-views/infraction-view/infraction-view.model';
import { FollowerView } from 'shared/components/notification-views/follower-view/follower-view.model';
import { VisitorMessageView } from 'shared/components/notification-views/visitor-message-view/visitor-message-view.model';
import { UserView } from 'shared/components/notification-views/user-view/user-view.model';

export enum NotificationTypes {
    MENTION = 1,
    QUOTE = 2,
    BADGE = 3,
    THREAD_SUBSCRIPTION = 4,
    CATEGORY_SUBSCRIPTION = 5,
    INFRACTION_GIVE = 6,
    INFRACTION_DELETED = 7,
    FOLLOWED = 8,
    VISITOR_MESSAGE = 9,
    LIKE_POST = 10,
    LIKE_DJ = 11,
    RADIO_REQUEST = 12,
    LIKE_HOST = 13
}

export class NotificationModel<T> {
    private readonly _item;

    @primitive()
    notificationId: number;
    @time()
    createdAt: string;
    @primitive()
    type: number;
    @primitive()
    isRead: boolean;

    constructor (source: Partial<NotificationModel<any>>) {
        ClassHelper.assign(this, source);
        switch (this.type) {
            case NotificationTypes.BADGE:
                this._item = new BadgeView(source.item);
                break;
            case NotificationTypes.CATEGORY_SUBSCRIPTION:
                this._item = new CategoryView(source.item);
                break;
            case NotificationTypes.QUOTE:
            case NotificationTypes.MENTION:
            case NotificationTypes.THREAD_SUBSCRIPTION:
            case NotificationTypes.LIKE_POST:
                this._item = new ThreadView(source.item);
                break;
            case NotificationTypes.INFRACTION_GIVE:
            case NotificationTypes.INFRACTION_DELETED:
                this._item = new InfractionView(source.item);
                break;
            case NotificationTypes.FOLLOWED:
                this._item = new FollowerView(source.item);
                break;
            case NotificationTypes.LIKE_DJ:
            case NotificationTypes.LIKE_HOST:
            case NotificationTypes.RADIO_REQUEST:
                this._item = new UserView(source.item);
                break;
            case NotificationTypes.VISITOR_MESSAGE:
                this._item = new VisitorMessageView(source.item);
                break;
        }
    }

    get item (): T {
        return this._item;
    }

    set item (_value) {
        // Intentionally Empty
    }
}
