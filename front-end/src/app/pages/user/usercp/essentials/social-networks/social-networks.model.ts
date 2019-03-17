import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class SocialNetworksModel {
    @primitive()
    discord: string;
    @primitive()
    twitter: string;

    constructor(source?: Partial<SocialNetworksModel>) {
        ClassHelper.assign(this, source);
    }
}
