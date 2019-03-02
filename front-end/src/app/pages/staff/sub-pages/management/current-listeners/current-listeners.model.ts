import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class CurrentListener {
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    time: number;

    constructor(source: Partial<CurrentListener>) {
        ClassHelper.assign(this, source);
    }
}
