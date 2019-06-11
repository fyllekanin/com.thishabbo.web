import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class PageModel {
    @primitive()
    pageId: number;
    @primitive()
    path: string;
    @primitive()
    title: string;
    @primitive()
    content: string;
    @primitive()
    isSystem: boolean;
    @primitive()
    canEdit: boolean;
    @primitive()
    createdAt: number;
    @primitive()
    updatedAt: number;

    constructor (source?: Partial<PageModel>) {
        ClassHelper.assign(this, source);
    }
}

export enum PageActions {
    EDIT,
    DELETE,
    SAVE,
    BACK
}
