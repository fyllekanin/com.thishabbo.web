import {
    HttpErrorResponse,
    HttpHandler,
    HttpHeaderResponse,
    HttpInterceptor,
    HttpProgressEvent,
    HttpRequest,
    HttpResponse,
    HttpSentEvent,
    HttpUserEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'core/services/auth/auth.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { BehaviorSubject, Observable, throwError as observableThrowError } from 'rxjs';

import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { NotificationModel, NotificationType } from 'shared/app-views/global-notification/global-notification.model';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    private isRefreshingToken = false;
    private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _notificationService: NotificationService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        return next.handle(this.addToken(req, this._authService.getAccessToken())).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse) {
                    switch ((<HttpErrorResponse>error).status) {
                        case 401:
                            this._notificationService.sendNotification(new NotificationModel({
                                title: 'Oh no!',
                                message: 'You have been logged out!'
                            }));
                            return this.logoutUser();
                        case 419:
                            return this.handle419Error(req, next);
                        case 403:
                            this._notificationService.sendNotification(new NotificationModel({
                                title: 'Oops!',
                                message: error.error.message
                            }));
                            this._router.navigateByUrl('/page/access');
                            return observableThrowError(error);
                        case 503:
                            this._notificationService.sendNotification(new NotificationModel({
                                title: 'Oh no!',
                                message: 'Maintenance Mode is on!',
                                type: NotificationType.WARNING
                            }));
                            this._router.navigateByUrl('/access/maintenance');
                            return observableThrowError(error);
                        default:
                            return observableThrowError(error);
                    }
                } else {
                    return observableThrowError(error);
                }
            }));
    }

    private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    private handle419Error(req: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            this.tokenSubject.next(null);
            return this._authService.refreshToken().pipe(
                switchMap((newToken: string) => {
                    if (newToken) {
                        this.tokenSubject.next(newToken);
                        return next.handle(this.addToken(req, newToken));
                    }
                    return this.logoutUser();
                }),
                catchError(this.logoutUser.bind(this)),
                finalize(() => {
                    this.isRefreshingToken = false;
                }));
        } else {
            return this.tokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(token => {
                    return next.handle(this.addToken(req, token));
                }));
        }
    }

    private logoutUser(): Observable<any> {
        this._authService.logout(true);
        return observableThrowError('');
    }
}
