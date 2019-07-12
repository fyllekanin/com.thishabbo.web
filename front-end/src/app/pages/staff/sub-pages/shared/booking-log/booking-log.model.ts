import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class BookingItem {
    @objectOf(SlimUser)
    user: SlimUser;
    @objectOf(SlimUser)
    affected: SlimUser;
    @primitive()
    day: number;
    @primitive()
    hour: number;
    @primitive()
    action: number;
    @primitive()
    updatedAt: number;

    constructor (source: Partial<BookingItem>) {
        ClassHelper.assign(this, source);
    }
}

export class BookingLogModel {
    @arrayOf(BookingItem)
    items: Array<BookingItem> = [];
    @primitive()
    page: number;
    @primitive()
    total: number;

    constructor (source?: Partial<BookingLogModel>) {
        ClassHelper.assign(this, source);
    }
}

export enum BookingActions {
    UNBOOKED_EVENT = 28,
    UNBOOKED_RADIO = 20,
    BOOKED_RADIO = 21,
    BOOKED_EVENTS = 29,
    CREATED_PERM = 22,
    DELETED_PERM = 24,
    EDITED_EVENTS = 194,
    EDITED_RADIO = 195
}
