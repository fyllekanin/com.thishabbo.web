import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { User } from 'core/services/auth/auth.model';

export class AvatarModel {
    @primitive()
    height: number;
    @primitive()
    width: number;
    @arrayOf(Number)
    oldAvatarIds: Array<number> = [];
    @objectOf(User)
    user: User;
    @primitive()
    resizeForMe: boolean;

    constructor (source: Partial<AvatarModel>) {
        ClassHelper.assign(this, source);
    }
}
