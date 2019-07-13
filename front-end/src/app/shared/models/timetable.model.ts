import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { EventType } from 'app/pages/staff/sub-pages/events/types/types.model';
import { SlimUser } from 'core/services/auth/auth.model';
import { TimetableHelper } from 'shared/helpers/timetable.helper';

export class TimetableModel {
    @primitive()
    timetableId: number;
    @primitive()
    day: number;
    @primitive()
    hour: number;
    @primitive()
    isPerm: boolean;
    @primitive()
    type: number;
    @primitive()
    name: string;
    @objectOf(EventType)
    event: EventType;
    @primitive()
    link: string;
    @primitive()
    createdAt: number;
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    timestamp: number;

    constructor (source: Partial<TimetableModel>) {
        ClassHelper.assign(this, source);
    }
}

export class TimetablePage {
    @arrayOf(TimetableModel)
    timetable: Array<TimetableModel> = [];
    @arrayOf(EventType)
    events: Array<EventType> = [];
    @arrayOf(String)
    timezones: Array<string> = [];

    constructor (source?: Partial<TimetablePage>) {
        ClassHelper.assign(this, source);
        this.timetable = this.timetable.map(TimetableHelper.mapBookingWithTime);
    }
}
