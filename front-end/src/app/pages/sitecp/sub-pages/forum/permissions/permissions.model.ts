import { ForumPermissions } from '../../../../forum/forum.model';
import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';

export class PermissionCategory {
    @primitive()
    categoryId: number;
    @primitive()
    title: string;

    constructor (source: Partial<PermissionCategory>) {
        ClassHelper.assign(this, source);
    }
}

export class PermissionGroup {
    @primitive()
    groupId: number;
    @primitive()
    name: string;
    @objectOf(ForumPermissions)
    forumPermissions: ForumPermissions;
    @primitive()
    isChecked: boolean;

    constructor (source: Partial<PermissionGroup>) {
        ClassHelper.assign(this, source);
    }
}

export class PermissionsPage {
    @objectOf(PermissionCategory)
    category: PermissionCategory;
    @objectOf(PermissionGroup)
    group: PermissionGroup;
    @arrayOf(PermissionGroup)
    groups: Array<PermissionGroup> = [];
    @primitive()
    isAuthOnly: boolean;

    constructor (source?: Partial<PermissionsPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum PermissionActions {
    SAVE,
    SAVE_CASCADE,
    BACK
}
