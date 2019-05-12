import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class EventsModel {
    @primitive()
    nickname: string;
    @primitive()
    event: string;
    @primitive()
    nextHost: string;
    @primitive()
    nextEvent: string;
    @primitive()
    says: string;

    constructor (source: Partial<EventsModel>) {
        ClassHelper.assign(this, source);
    }
}

export class RadioModel {
    @primitive()
    nickname: string;
    @primitive()
    likes: number;
    @primitive()
    userId: number;
    @primitive()
    listeners: number;
    @primitive()
    song: string;
    @primitive()
    albumArt: string;
    @primitive()
    djSays: string;
    @primitive()
    ip: string;
    @primitive()
    port: string;
    @primitive()
    nextDj: string;

    constructor (source: Partial<RadioModel>) {
        ClassHelper.assign(this, source);
    }
}
