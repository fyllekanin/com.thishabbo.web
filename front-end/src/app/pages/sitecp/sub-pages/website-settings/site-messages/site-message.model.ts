import { ClassHelper, primitive, primitiveOf } from 'shared/helpers/class.helper';

export class SiteMessageModel {
    @primitive()
    siteMessageId: number;
    @primitive()
    title: string;
    @primitiveOf(Number)
    type = 1;
    @primitive()
    content: string;
    @primitive()
    expiresAt: number;
    @primitive()
    createdAt: number;
    @primitive()
    updatedAt: number;

    constructor (source?: Partial<SiteMessageModel>) {
        ClassHelper.assign(this, source);
    }

    isExpired (): boolean {
        return (new Date().getTime() / 1000) > this.expiresAt;
    }
}

export enum SiteMessagesActions {
    EDIT,
    DELETE,
    SAVE
}
