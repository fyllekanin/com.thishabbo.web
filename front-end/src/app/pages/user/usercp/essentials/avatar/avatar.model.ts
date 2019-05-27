import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class AvatarModel {
    @primitive()
    height: number;
    @primitive()
    width: number;
    @arrayOf(Number)
    oldAvatarIds: Array<number> = [];

    constructor (source: Partial<AvatarModel>) {
        ClassHelper.assign(this, source);
    }
}
