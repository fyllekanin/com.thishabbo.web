import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { CategoryLeaf } from '../../forum/category/category.model';

export class InfractionLevel {
    @primitive()
    infractionLevelId: number;
    @primitive()
    title: string;
    @primitive()
    points: number;
    @primitive()
    lifeTime: number;
    @primitive()
    createdAt: number;
    @primitive()
    categoryId: number;
    @primitive()
    penalty: number;

    @arrayOf(CategoryLeaf)
    categories: Array<CategoryLeaf> = [];

    constructor(source?: Partial<InfractionLevel>) {
        ClassHelper.assign(this, source);
    }
}

export enum InfractionLevelActions {
    SAVE,
    DELETE,
    CANCEL
}
