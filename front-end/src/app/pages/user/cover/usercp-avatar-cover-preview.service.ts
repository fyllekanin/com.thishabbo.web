import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class UsercpAvatarCoverPreviewService implements OnDestroy {
    private _onUpdateSubject: Subject<void> = new Subject();
    private _onShowSubject: Subject<void> = new Subject();
    private _onHideSubject: Subject<void> = new Subject();

    update() {
        this._onUpdateSubject.next();
    }

    show() {
        this._onShowSubject.next();
    }

    hide() {
        this._onHideSubject.next();
    }

    ngOnDestroy (): void {
        this._onUpdateSubject.complete();
        this._onShowSubject.complete();
        this._onHideSubject.complete();
    }

    get onUpdate(): Observable<void> {
        return this._onUpdateSubject.asObservable();
    }

    get onShow(): Observable<void> {
        return this._onShowSubject.asObservable();
    }

    get onHide(): Observable<void> {
        return this._onHideSubject.asObservable();
    }
}
