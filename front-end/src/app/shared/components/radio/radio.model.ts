import { ClassHelper, primitive } from 'shared/helpers/class.helper';

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

    constructor(source: Partial<RadioModel>) {
        ClassHelper.assign(this, source);
    }
}
