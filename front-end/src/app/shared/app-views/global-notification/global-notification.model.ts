import { IdHelper } from 'shared/helpers/id.helper';
import { ClassHelper } from 'shared/helpers/class.helper';

export enum NotificationType {
    INFO,
    WARNING,
    ERROR,
    SUCCESS
}

export class GlobalNotification {
    id = IdHelper.newUuid;
    title: string;
    message: string;
    timeout = 5000;
    type = NotificationType.INFO;

    constructor(source: Partial<GlobalNotification>) {
        ClassHelper.assign(this, source);
    }
}
