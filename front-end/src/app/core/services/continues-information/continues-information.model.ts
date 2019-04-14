import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { RadioModel } from 'shared/components/radio/radio.model';
import { INFO_BOX_TYPE } from 'shared/app-views/info-box/info-box.model';
import { SlimUser } from 'core/services/auth/auth.model';

export class SlimSiteMessage {
    @primitive()
    siteMessageId: number;
    @primitive()
    title: string;
    @primitive()
    type: number;
    @primitive()
    content: string;

    constructor(source: Partial<SlimSiteMessage>) {
        ClassHelper.assign(this, source);
    }

    getType(): INFO_BOX_TYPE {
        switch (this.type) {
            case 1:
                return INFO_BOX_TYPE.WARNING;
            case 2:
                return INFO_BOX_TYPE.INFO;
            case 3:
            default:
                return INFO_BOX_TYPE.ALERT;
        }
    }
}

export class ActiveUser {
    @primitive()
    userId: number;
    @primitive()
    nickname: string;

    constructor(source: Partial<ActiveUser>) {
        ClassHelper.assign(this, source);
    }
}

export class ActivityThread {
    @primitive()
    title: string;
    @primitive()
    threadId: number;
    @primitive()
    page: number;

    constructor(source: Partial<ActivityThread>) {
        ClassHelper.assign(this, source);
    }
}

export class Activity {
    @primitive()
    logId: number;
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    type: number;
    @objectOf(ActivityThread)
    thread: ActivityThread;
    @primitive()
    createdAt: number;

    constructor(source: Partial<Activity>) {
        ClassHelper.assign(this, source);
    }
}

export class ContinuesInformationModel {
    @objectOf(RadioModel)
    radio: RadioModel;
    @primitive()
    unreadNotifications: number;
    @arrayOf(SlimSiteMessage)
    siteMessages: Array<SlimSiteMessage> = [];
    @arrayOf(ActiveUser)
    activeUsers: Array<ActiveUser> = [];
    @arrayOf(Activity)
    activities: Array<Activity> = [];

    constructor(source?: Partial<ContinuesInformationModel>) {
        ClassHelper.assign(this, source);
    }
}

export enum PING_TYPES {
    ADMIN = 'admin',
    STAFF = 'staff',
    USER = 'user'
}
