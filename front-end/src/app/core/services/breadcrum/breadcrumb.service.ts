import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';

@Injectable()
export class BreadcrumbService {
    private _onBreadcrumbSubject: Subject<Breadcrumb> = new Subject();

    set breadcrumb (breadcrumb: Breadcrumb) {
        this._onBreadcrumbSubject.next(breadcrumb);
    }

    get onBreadcrumb (): Observable<Breadcrumb> {
        return this._onBreadcrumbSubject.asObservable();
    }
}
