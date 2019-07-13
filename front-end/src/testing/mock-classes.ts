import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';

export class BreadcrumbServiceMock {

    breadcrumbSubject = new Subject();
    current: Breadcrumb;

    get onBreadcrumb () {
        return this.breadcrumbSubject.asObservable();
    }

    set breadcrumb (val) {
        this.current = val;
        this.breadcrumbSubject.next(val);
    }

    get breadcrumb () {
        return this.current;
    }

    static get () {
        return {provide: BreadcrumbService, useValue: new BreadcrumbServiceMock()};
    }
}

export class ActivatedRouteMock {
    private _subject = new Subject();

    setData (data) {
        this._subject.next({data: data});
    }

    get data () {
        return this._subject.asObservable();
    }

    get provider () {
        return {provide: ActivatedRoute, useValue: this};
    }

    static get () {
        return {provide: ActivatedRoute, useValue: new ActivatedRouteMock()};
    }
}
