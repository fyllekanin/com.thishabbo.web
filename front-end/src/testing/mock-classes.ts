import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

export class BreadcrumbServiceMock {
    set breadcrumb (_val) {
        // Empty
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
