import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { Group } from '../groups.model';

export class GroupsListPage {
    @arrayOf(Group)
    groups: Array<Group> = [];
    @primitive()
    page: number;
    @primitive()
    total: number;

    constructor(source?: Partial<GroupsListPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum GroupListActions {
    EDIT_GROUP,
    DELETE_GROUP
}
