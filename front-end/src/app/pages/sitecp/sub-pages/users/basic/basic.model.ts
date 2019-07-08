import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { UserCustomFields } from 'core/services/auth/auth.model';

export class BasicModel {
    @primitive()
    userId: number;
    @primitive()
    nickname: string;
    @primitive()
    password: string;
    @primitive()
    repassword: string;
    @primitive()
    habbo: string;
    @primitive()
    createdAt: number;
    @primitive()
    updatedAt: number;

    constructor (source: Partial<BasicModel>) {
        ClassHelper.assign(this, source);
    }
}

export class BasicPage {
    @objectOf(BasicModel)
    user: BasicModel;
    @objectOf(UserCustomFields)
    customFields: UserCustomFields;

    constructor (source?: Partial<BasicPage>) {
        ClassHelper.assign(this, source);
    }
}
