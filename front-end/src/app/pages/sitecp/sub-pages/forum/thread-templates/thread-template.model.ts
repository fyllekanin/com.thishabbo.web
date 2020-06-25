import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { CategoryLeaf } from '../category/category.model';

export class ThreadTemplate {
    @primitive()
    threadTemplateId: number;
    @primitive()
    name: string;
    @primitive()
    content: string;
    @arrayOf(CategoryLeaf)
    categories: Array<CategoryLeaf> = [];
    @arrayOf(Number)
    categoryIds: Array<number> = [];
    @primitive()
    createdAt: number;

    constructor (source?: Partial<ThreadTemplate>) {
        ClassHelper.assign(this, source);
    }
}

export class ThreadTemplateListPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(ThreadTemplate)
    items: Array<ThreadTemplate> = [];

    constructor (source?: Partial<ThreadTemplateListPage>) {
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
