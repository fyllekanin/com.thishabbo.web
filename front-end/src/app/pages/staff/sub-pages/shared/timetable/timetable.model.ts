import { User } from 'core/services/auth/auth.model';
import { arrayOf, ClassHelper, objectOf, primitive, primitiveOf } from 'shared/helpers/class.helper';
import { EventType } from '../../events/types/types.model';

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
    @primitiveOf(String)
    link = '';
    @primitive()
    createdAt: number;
    @objectOf(User)
    user: User;

    constructor (source: Partial<TimetableModel>) {
        ClassHelper.assign(this, source);
    }
}

export class TimetablePage {
    @arrayOf(TimetableModel)
    timetable: Array<TimetableModel> = [];
    @arrayOf(EventType)
    events: Array<EventType> = [];

    constructor (source?: Partial<TimetablePage>) {
        ClassHelper.assign(this, source);
    }
}
