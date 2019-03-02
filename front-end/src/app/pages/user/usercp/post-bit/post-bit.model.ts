import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class PostBitModel {
    @primitive()
    hideJoinDate: boolean;
    @primitive()
    hidePostCount: boolean;
    @primitive()
    hideLikesCount: boolean;
    @primitive()
    hideSocials: boolean;

    constructor(source?: Partial<PostBitModel>) {
        ClassHelper.assign(this, source);
    }
}
