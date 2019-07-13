import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class EventStatsItem {
    @primitive()
    eventId: number;
    @primitive()
    name: string;
    @primitive()
    amount: number;

    constructor (source: Partial<EventStatsItem>) {
        ClassHelper.assign(this, source);
    }
}
