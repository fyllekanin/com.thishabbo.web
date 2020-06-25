import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class MoveThreadCategory {
    @primitive()
    categoryId: number;
    @primitive()
    title: string;
    @arrayOf(MoveThreadCategory)
    children: Array<MoveThreadCategory> = [];

    constructor (source: Partial<MoveThreadCategory>) {
        ClassHelper.assign(this, source);
    }
}
