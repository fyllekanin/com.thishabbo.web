import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class ProfileModel {
    @primitive()
    youtube: string;
    @primitive()
    isPrivate: boolean;

    constructor(source: Partial<ProfileModel>) {
        ClassHelper.assign(this, source);
    }
}
