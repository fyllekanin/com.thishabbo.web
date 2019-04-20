import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';

export class PostBitInformation {
    @primitive()
    hideJoinDate: boolean;
    @primitive()
    hidePostCount: boolean;
    @primitive()
    hideLikesCount: boolean;
    @primitive()
    hideSocials: boolean;

    constructor(source?: Partial<PostBitInformation>) {
        ClassHelper.assign(this, source);
    }
}

export class SlimBadge {
    @primitive()
    badgeId: number;
    @primitive()
    name: string;
    @primitive()
    isActive: boolean;
    @primitive()
    updatedAt: number;

    constructor(source: Partial<SlimBadge>) {
        ClassHelper.assign(this, source);
    }
}

export class PostBitModel {
    @objectOf(PostBitInformation)
    information: PostBitInformation;
    @arrayOf(SlimBadge)
    badges: Array<SlimBadge> = [];

    constructor(source: Partial<PostBitModel>) {
        ClassHelper.assign(this, source);
    }
}

export enum PostBitActions {
    SAVE,
    ADD_BADGE
}
