import { arrayOf, ClassHelper } from 'shared/helpers/class.helper';

export class RegisterModel {
    username: string;
    nickname: string;
    referredBy: string;
    password: string;
    repassword: string;
    gdpr: boolean;

    constructor(source?: Partial<RegisterModel>) {
        ClassHelper.assign(this, source);
    }
}

export class RegisterPage {
    @arrayOf(String)
    nicknames: Array<string> = [];
    @arrayOf(String)
    usernames: Array<string> = [];
    @arrayOf(String)
    takenHabbos: Array<string> = [];

    constructor(source: Partial<RegisterPage>) {
        ClassHelper.assign(this, source);
    }
}
