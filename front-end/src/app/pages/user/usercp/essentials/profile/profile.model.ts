import { ClassHelper, objectOf, primitive, primitiveOf } from 'shared/helpers/class.helper';

export class ProfileRelations {
    @primitiveOf(String)
    love = '';
    @primitiveOf(String)
    like = '';
    @primitiveOf(String)
    hate = '';

    constructor (source?: Partial<ProfileRelations>) {
        ClassHelper.assign(this, source);
    }
}

export class ProfileModel {
    @primitive()
    youtube: string;
    @primitive()
    isPrivate: boolean;
    @objectOf(ProfileRelations)
    relations = new ProfileRelations();

    constructor (source: Partial<ProfileModel>) {
        ClassHelper.assign(this, source);
    }
}
