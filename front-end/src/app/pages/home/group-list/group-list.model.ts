import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';
import { TitleTopBorder } from 'shared/app-views/title/title.model';

export class GroupList {
    @primitive()
    name: string;
    @primitive()
    color: string;
    @arrayOf(SlimUser)
    users: SlimUser;

    constructor(source: Partial<GroupList>) {
        ClassHelper.assign(this, source);
        this.color = TitleTopBorder[this.color];
    }
}
