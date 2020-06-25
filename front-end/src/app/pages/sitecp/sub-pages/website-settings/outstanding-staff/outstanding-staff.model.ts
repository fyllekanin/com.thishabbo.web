import { arrayOf, ClassHelper, primitive, primitiveOf } from 'shared/helpers/class.helper';
import { CategoryLeaf } from '../../forum/category/category.model';

export class Member {
    @primitiveOf(String)
    nickname = '';
    @primitiveOf(String)
    replacer = '';

    constructor (source?: Partial<Member>) {
        ClassHelper.assign(this, source);
    }
}

export class Subscription {
    @primitive()
    title: string;
    @primitive()
    subscriptionId: number;

    constructor (source?: Partial<Subscription>) {
        ClassHelper.assign(this, source);
    }
}

export class Group {
    @primitive()
    groupId: number;
    @primitive()
    name: string;

    constructor (source?: Partial<Group>) {
        ClassHelper.assign(this, source);
    }
}

export class OutstandingStaffModel {
    @primitive()
    categoryId: number;
    @primitiveOf(String)
    title = '';
    @primitiveOf(String)
    content = '';
    @primitive()
    subscriptionId: number;
    @arrayOf(Member)
    members: Array<Member>;
    @arrayOf(Subscription)
    subscriptions: Array<Subscription>;
    @arrayOf(CategoryLeaf)
    categories: Array<CategoryLeaf>;

    constructor (source?: Partial<OutstandingStaffModel>) {
        ClassHelper.assign(this, source);
    }
}

export enum OutstandingStaffActions {
    SAVE,
    BACK
}
