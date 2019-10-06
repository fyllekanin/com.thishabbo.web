import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class ThreadTemplateCategory {
    @primitive()
    title: string;
    @primitive()
    categoryId: number;
    @arrayOf(ThreadTemplateCategory)
    children: Array<ThreadTemplateCategory> = [];

    constructor (source: Partial<ThreadTemplateCategory>) {
        ClassHelper.assign(this, source);
    }
}

export class ThreadTemplate {
    @primitive()
    threadTemplateId: number;
    @primitive()
    name: string;
    @primitive()
    template: string;
    @arrayOf(ThreadTemplateCategory)
    categories: Array<ThreadTemplateCategory> = [];
    @arrayOf(Number)
    categoryIds: Array<number> = [];
    @primitive()
    createdAt: number;

    constructor (source?: Partial<ThreadTemplate>) {
        ClassHelper.assign(this, source);
    }
}

export enum ThreadTemplateActions {
    EDIT_THREAD_TEMPLATE,
    DELETE_THREAD_TEMPLATE,
    SAVE,
    DELETE,
    BACK
}
