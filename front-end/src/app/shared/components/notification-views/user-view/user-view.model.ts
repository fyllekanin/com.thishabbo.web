import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class UserView {
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    customData: string;

    constructor (source: Partial<UserView>) {
        ClassHelper.assign(this, source);
        if (!this.user) {
            this.user = new SlimUser({ userId: 0 });
        }
    }
}
