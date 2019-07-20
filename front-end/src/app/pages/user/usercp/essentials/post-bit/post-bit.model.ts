import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';

export class NamePositionModel {
    @primitive()
    isAvailable: boolean;
    @primitive()
    position: number;

    constructor (source: Partial<NamePositionModel>) {
        ClassHelper.assign(this, source);
    }
}

export class BarColorModel {
    @primitive()
    isAvailable: boolean;
    @arrayOf(String)
    color: Array<string> = [];

    constructor (source: Partial<BarColorModel>) {
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

    constructor (source: Partial<SlimBadge>) {
        ClassHelper.assign(this, source);
    }
}

export class PostBitInformation {
    @primitive()
    hideJoinDate: boolean;
    @primitive()
    hidePostCount: boolean;
    @primitive()
    hideLikesCount: boolean;
    @primitive()
    hideHabbo: boolean;
    @primitive()
    hideSocials: boolean;
    @arrayOf(SlimBadge)
    badges: Array<SlimBadge> = [];

    constructor (source?: Partial<PostBitInformation>) {
        ClassHelper.assign(this, source);
    }
}

export class PostBitModel {
    @objectOf(PostBitInformation)
    information: PostBitInformation;
    @objectOf(NamePositionModel)
    namePosition: NamePositionModel;
    @objectOf(BarColorModel)
    barColor: BarColorModel;

    constructor (source: Partial<PostBitModel>) {
        ClassHelper.assign(this, source);
    }
}

export enum PostBitActions {
    SAVE,
    ADD_BADGE
}
