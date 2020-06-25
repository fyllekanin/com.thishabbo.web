import { User } from 'core/services/auth/auth.model';
import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';

export class BotCategory {
    @primitive()
    categoryId = 0;
    @primitive()
    title: string;

    constructor (source?: Partial<BotCategory>) {
        ClassHelper.assign(this, source);
    }
}

export class BotUser {
    @primitive()
    userId: number;
    @primitive()
    nickname: string;

    constructor (source?: Partial<BotUser>) {
        ClassHelper.assign(this, source);
    }
}

export class BotSettingsModel {
    @objectOf(User)
    user: BotUser = new BotUser();
    @primitive()
    welcomeContent: string;
    @primitive()
    multipleAccountsContent: string;
    @objectOf(BotCategory)
    welcomeCategory: BotCategory = new BotCategory();
    @objectOf(BotCategory)
    multipleAccountsCategory: BotCategory = new BotCategory();
    @arrayOf(BotCategory)
    categories: Array<BotCategory> = [];
    @arrayOf(BotUser)
    users: Array<BotUser> = [];

    constructor (source?: Partial<BotSettingsModel>) {
        ClassHelper.assign(this, source);
    }
}
