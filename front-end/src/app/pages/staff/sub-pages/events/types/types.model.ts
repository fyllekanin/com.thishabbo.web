import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class EventType {
    @primitive()
    eventId: number;
    @primitive()
    name: string;
    @primitive()
    createdAt: number;
    @primitive()
    updatedAt: number;

    constructor (source?: Partial<EventType>) {
        ClassHelper.assign(this, source);
    }
}

export class EventTypesPage {
    @arrayOf(EventType)
    events: Array<EventType> = [];
    @primitive()
    page: number;
    @primitive()
    total: number;

    constructor (source: Partial<EventTypesPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum EventTypesListActions {
    EDIT_TYPE,
    DELETE_TYPE
}
