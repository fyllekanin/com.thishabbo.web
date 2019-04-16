import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class CategoryViewThread {
    @primitive()
    categoryTitle: string;
    @primitive()
    threadId: number;
    @primitive()
    title: string;

    constructor(source: Partial<CategoryViewThread>) {
        ClassHelper.assign(this, source);
    }
}

export class CategoryView {
    @objectOf(SlimUser)
    user: SlimUser;
    @objectOf(CategoryViewThread)
    thread: CategoryViewThread;

    constructor(source: Partial<CategoryView>) {
        ClassHelper.assign(this, source);
    }
}
