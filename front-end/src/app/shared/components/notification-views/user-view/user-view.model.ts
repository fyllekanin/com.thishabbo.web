import { ClassHelper, objectOf } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class UserView {
    @objectOf(SlimUser)
    user: SlimUser;

    constructor (source: Partial<UserView>) {
        ClassHelper.assign(this, source);
    }
}
