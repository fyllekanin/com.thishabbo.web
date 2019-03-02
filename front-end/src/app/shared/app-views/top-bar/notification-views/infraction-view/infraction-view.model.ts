import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';

export class InfractionViewInfraction {
    @primitive()
    infractionId: number;
    @primitive()
    title: string;

    constructor(source: Partial<InfractionViewInfraction>) {
        ClassHelper.assign(this, source);
    }
}

export class InfractionView {
    @objectOf(InfractionViewInfraction)
    infraction: InfractionViewInfraction;

    constructor(source: Partial<InfractionView>) {
        ClassHelper.assign(this, source);
    }
}
