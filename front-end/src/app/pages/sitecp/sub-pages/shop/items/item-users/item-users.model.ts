import { arrayOf, ClassHelper, objectOf, primitive, dateAndTime } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class ItemUserModel {
    @primitive()
    userItemId: number;
    @objectOf(SlimUser)
    user: SlimUser;
    @dateAndTime()
    createdAt: string;

    constructor (source: Partial<ItemUserModel>) {
        ClassHelper.assign(this, source);
    }
}

export class ItemUsersPage {
    @primitive()
    itemId: number;
    @arrayOf(ItemUserModel)
    items: Array<ItemUserModel> = [];

    constructor (source: Partial<ItemUsersPage>) {
        ClassHelper.assign(this, source);
    }
}
