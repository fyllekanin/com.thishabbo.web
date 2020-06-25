import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class MemberOfTheMonthModel {
    @primitive()
    month: string;
    @primitive()
    year: number;
    @primitive()
    member: string;
    @primitive()
    photo: string;

    constructor (source?) {
        ClassHelper.assign(this, source);
    }
}
