import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class FollowerView {
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    isApproved: boolean;

    constructor(source: Partial<FollowerView>) {
        ClassHelper.assign(this, source);
    }
}
