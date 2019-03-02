import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class Group {
    @primitive()
    name: string;
    @primitive()
    groupId: number;

    constructor(source: Partial<Group>) {
        ClassHelper.assign(this, source);
    }
}

export class GroupsModel {
    @primitive()
    nickname: string;
    @primitive()
    userId: string;
    @primitive()
    displayGroupId: number;
    @arrayOf(Group)
    groups: Array<Group> = [];
    @arrayOf(Group)
    possibleGroups: Array<Group> = [];

    constructor(source?: Partial<GroupsModel>) {
        ClassHelper.assign(this, source);
    }
}
