import { User } from 'core/services/auth/auth.model';
import { primitive, objectOf, ClassHelper, arrayOf } from 'shared/helpers/class.helper';

export class WelcomeBotCategory {
    @primitive()
    categoryId = 0;
    @primitive()
    title: string;

    constructor(source?: Partial<WelcomeBotCategory>) {
        ClassHelper.assign(this, source);
    }
}

export class WelcomeBotUser {
    @primitive()
    userId: number;
    @primitive()
    nickname: string;

    constructor(source?: Partial<WelcomeBotUser>) {
        ClassHelper.assign(this, source);
    }
}

export class WelcomeBotModel {
    @objectOf(User)
    user: WelcomeBotUser = new WelcomeBotUser();
    @primitive()
    content: string;
    @objectOf(WelcomeBotCategory)
    category: WelcomeBotCategory = new WelcomeBotCategory();
    @arrayOf(WelcomeBotCategory)
    categories: Array<WelcomeBotCategory> = [];
    @arrayOf(WelcomeBotUser)
    users: Array<WelcomeBotUser> = [];

    constructor(source?: Partial<WelcomeBotModel>) {
        ClassHelper.assign(this, source);
    }
}
