import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UserService {
    private _userActiveSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);

    set isUserActive(value: boolean) {
        this._userActiveSubject.next(value);
    }

    get onUserActivityChange(): Observable<boolean> {
        return this._userActiveSubject.asObservable();
    }
}
