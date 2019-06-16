import { objectOf, primitive, ClassHelper } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class MiniProfileModel {
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    left: number;
    @primitive()
    top: number;

    constructor(source?: Partial<MiniProfileModel>) {
        ClassHelper.assign(this, source);
    }
}
