import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class MemberOfTheMonthModel {
    @primitive()
    month: string;
    @primitive()
    member: string;
    @primitive()
    staff: string;

    constructor (source?) {
        ClassHelper.assign(this, source);
    }
}
