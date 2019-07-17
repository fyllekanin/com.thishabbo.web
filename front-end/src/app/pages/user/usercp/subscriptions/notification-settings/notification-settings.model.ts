import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class NotificationSettingsModel {
    @primitive()
    QUOTE_NOTIFICATIONS: boolean;
    @primitive()
    MENTION_NOTIFICATIONS: boolean;
    @primitive()
    AUTO_SUBSCRIBE_THREAD: boolean;
    @primitive()
    ROULETTE_ARCADE: boolean;

    constructor (source: Partial<NotificationSettingsModel>) {
        ClassHelper.assign(this, source);
    }
}
