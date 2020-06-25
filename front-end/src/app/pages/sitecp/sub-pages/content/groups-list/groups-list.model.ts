import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class GroupList {
    @primitive()
    groupId: number;
    @primitive()
    name: string;
    @primitive()
    displayOrder = -1;
    @primitive()
    color = 'BLUE';

    constructor (source: Partial<GroupList>) {
        ClassHelper.assign(this, source);
        this.displayOrder = this.displayOrder || -1;
    }
}

export enum GroupsActions {
    ADD,
    SAVE
}
