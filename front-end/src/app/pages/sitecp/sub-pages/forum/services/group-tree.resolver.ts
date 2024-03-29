import { HttpService } from 'core/services/http/http.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TreeDiagram } from 'shared/components/graph/tree-diagram/tree-diagram.model';

@Injectable()
export class GroupTreeResolver implements Resolve<TreeDiagram> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<TreeDiagram> {
        const categoryId = route.params['categoryId'];
        return this._httpService.get(`sitecp/categories/${categoryId}/groups`)
            .pipe(map(data => data));
    }
}
