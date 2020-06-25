import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class EventsModel {
    @objectOf(SlimUser)
    currentHost: SlimUser;
    @primitive()
    event: string;
    @objectOf(SlimUser)
    nextHost: SlimUser;
    @primitive()
    nextEvent: string;
    @primitive()
    says: string;
    @primitive()
    link: string;

    constructor (source: Partial<EventsModel>) {
        ClassHelper.assign(this, source);
    }
}

export class RadioModel {
    @objectOf(SlimUser)
    currentDj: SlimUser;
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
    @objectOf(SlimUser)
    nextDj: SlimUser;
    @primitive()
    radioUrl: string;

    constructor (source: Partial<RadioModel>) {
        ClassHelper.assign(this, source);
    }
}
