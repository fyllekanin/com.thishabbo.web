import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';
import { TitleTopBorder } from 'shared/app-views/title/title.model';

export class GroupListUser extends SlimUser {
    @primitive()
    role: string;

    constructor (source: Partial<GroupListUser>) {
        super(source);
        ClassHelper.assign(this, source);
    }
}

export class GroupList {
    @primitive()
    name: string;
    @primitive()
    color: string;
    @arrayOf(GroupListUser)
    users: Array<GroupListUser> = [];

    constructor (source: Partial<GroupList>) {
        ClassHelper.assign(this, source);
        this.color = TitleTopBorder[this.color];
    }
}
