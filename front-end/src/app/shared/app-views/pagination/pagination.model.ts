import {ClassHelper, isPresent, primitiveOf} from 'shared/helpers/class.helper';
import { primitive } from 'shared/helpers/class.helper';
import { QueryParameters } from 'core/services/http/http.model';
import { HttpService } from 'core/services/http/http.service';

export class PaginationModel {
    @primitiveOf(Number)
    page = 1;
    @primitiveOf(Number)
    total = 1;
    @primitive()
    url = '';
    params: QueryParameters;

    constructor(source?: Partial<PaginationModel>) {
        ClassHelper.assign(this, source);
        if (isPresent(this.params)) {
            this.url += HttpService.buildParameters(this.params);
        }
    }
}

export interface PaginationItem {
    value: number;
    title?: string;
}
