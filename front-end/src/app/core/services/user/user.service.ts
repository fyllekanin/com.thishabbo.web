import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UserService {
    private _userActiveSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private _requestSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

    set isUserActive (value: boolean) {
        this._userActiveSubject.next(value);
    }

    get onUserActivityChange (): Observable<boolean> {
        return this._userActiveSubject.asObservable();
    }

    set isRequestInProgress (value: boolean) {
        this._requestSubject.next(value);
    }

    get onRequestInProgressChange (): Observable<boolean> {
        return this._requestSubject.asObservable();
    }
}
