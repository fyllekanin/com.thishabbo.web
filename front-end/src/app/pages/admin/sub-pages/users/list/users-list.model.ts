import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class ListUser {
    @primitive()
    nickname: string;
    @primitive()
    userId: number;
    @primitive()
    updatedAt: number;
    @primitive()
    credits: number;

    constructor(source: Partial<ListUser>) {
        ClassHelper.assign(this, source);
    }
}

export class UsersListPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(ListUser)
    users: Array<ListUser> = [];

    constructor(source?: Partial<UsersListPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum UserListAction {
    EDIT_USER_BASIC,
    EDIT_USER_GROUPS,
    MANAGE_BANS,
    MANAGE_THC,
    MERGE_USER
}
