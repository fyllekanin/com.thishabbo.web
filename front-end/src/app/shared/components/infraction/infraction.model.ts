import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { InfractionLevel } from '../../../pages/sitecp/sub-pages/moderation/infraction-levels/infraction-level.model';
import { SlimUser } from 'core/services/auth/auth.model';

export class Infraction {
    @primitive()
    title: string;
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    createdAt: number;

    constructor(source: Partial<Infraction>) {
        ClassHelper.assign(this, source);
    }
}

export class InfractionContext {
    @arrayOf(InfractionLevel)
    levels: Array<InfractionLevel> = [];
    @arrayOf(Infraction)
    history: Array<Infraction> = [];
    @objectOf(SlimUser)
    user: SlimUser;

    constructor(source: Partial<InfractionContext>) {
        ClassHelper.assign(this, source);
    }
}

export class InfractModel {
    @primitive()
    infractionLevelId: number;
    @primitive()
    reason: string;
    @primitive()
    userId: number;

    constructor(source: Partial<InfractModel>) {
        ClassHelper.assign(this, source);
    }

    get isValid(): boolean {
        return Boolean (this.infractionLevelId) && Boolean(this.reason) && this.reason.length > 0;
    }
}
