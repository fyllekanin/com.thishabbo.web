import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class HighScoreModel {
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    score: number;
    @primitive()
    createdAt: number;

    constructor (source: Partial<HighScoreModel>) {
        ClassHelper.assign(this, source);
    }
}
