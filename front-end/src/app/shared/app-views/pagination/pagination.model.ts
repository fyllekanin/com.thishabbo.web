import { ClassHelper, primitive, primitiveOf } from 'shared/helpers/class.helper';
import { QueryParameters } from 'core/services/http/http.model';

export class PaginationModel {
    @primitiveOf(Number)
    page = 1;
    @primitiveOf(Number)
    total = 1;
    @primitive()
    url = '';
    params: QueryParameters;

    constructor (source?: Partial<PaginationModel>) {
        ClassHelper.assign(this, source);
    }
}

export interface PaginationItem {
    value: number;
    title?: string;
}
