import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { NotificationModel } from 'shared/app-views/top-bar/top-bar.model';

export class NotificationsPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(NotificationModel)
    items: Array<NotificationModel<any>> = [];

    constructor (source: Partial<NotificationsPage>) {
        ClassHelper.assign(this, source);
    }
}
