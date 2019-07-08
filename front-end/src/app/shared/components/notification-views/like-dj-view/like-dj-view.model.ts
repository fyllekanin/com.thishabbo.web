import { ClassHelper, objectOf } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class LikeDjView {
    @objectOf(SlimUser)
    user: SlimUser;

    constructor (source: Partial<LikeDjView>) {
        ClassHelper.assign(this, source);
    }
}
