import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';

@Injectable()
export class BreadcrumbService {
    private _onBreadcrumbSubject: Subject<Breadcrumb> = new Subject();

    set breadcrumb(breadcrum: Breadcrumb) {
        this._onBreadcrumbSubject.next(breadcrum);
    }

    get onBreadcrumb(): Observable<Breadcrumb> {
        return this._onBreadcrumbSubject.asObservable();
    }
}
