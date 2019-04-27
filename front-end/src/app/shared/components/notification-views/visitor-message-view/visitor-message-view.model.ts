import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class VisitorMessageView {
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    page: number;
    @objectOf(SlimUser)
    host: SlimUser;
    @primitive()
    subjectId: number;

    constructor (source: Partial<VisitorMessageView>) {
        ClassHelper.assign(this, source);
    }
}
