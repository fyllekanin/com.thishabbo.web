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
import { NotificationMessage, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { UserService } from 'core/services/user/user.service';
import { DialogService } from 'core/services/dialog/dialog.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    private static PULL_STOP = false;
    private readonly GET_METHOD = 'GET';
    private isRefreshingToken = false;
    private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor (
        private _authService: AuthService,
        private _router: Router,
        private _notificationService: NotificationService,
        private _userService: UserService,
        private _dialogService: DialogService
    ) {
    }

    intercept (req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        if (req.method !== this.GET_METHOD) {
            this._userService.isRequestInProgress = true;
        }
        return next.handle(this.addToken(req, this._authService.getAccessToken())).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse) {
                    switch ((<HttpErrorResponse>error).status) {
                        case 401:
                            return this.logoutUser();
                        case 419:
                            return this.handle419Error(req, next);
                        case 400:
                            if (req.method === this.GET_METHOD) {
                                this._notificationService.failureNotification(error);
                            }
                            return observableThrowError(error);
                        case 403:
                            this._notificationService.sendNotification(new NotificationMessage({
                                title: 'Oops!',
                                message: error.error.message,
                                type: NotificationType.WARNING
                            }));
                            this._router.navigateByUrl('/page/access');
                            return observableThrowError(error);
                        case 404:
                            if (req.method !== this.GET_METHOD) {
                                return observableThrowError(error);
                            }
                            this._notificationService.sendNotification(new NotificationMessage({
                                title: 'Oops!',
                                message: error.error.message,
                                type: NotificationType.WARNING
                            }));
                            this._router.navigateByUrl('/page/missing');
                            return observableThrowError(error);
                        case 418:
                            if (HttpRequestInterceptor.PULL_STOP && req.url.indexOf('puller/pull') > -1) {
                                return observableThrowError(error);
                            }
                            this._dialogService.confirm({
                                title: `New version detected, ${window['version']} -> ${error.error.message}`,
                                content: `There is a new version available, click reload to load the new version.<br/>
                                If interested in what's new, scroll down and look on versions! <img src="/assets/images/update.png"/>`,
                                forced: true,
                                callback: () => {
                                    this._dialogService.closeDialog();
                                    location.reload();
                                }
                            });
                            HttpRequestInterceptor.PULL_STOP = true;
                            return observableThrowError(error);
                        case 500:
                            return observableThrowError(error);
                        case 503:
                            location.reload();
                            return observableThrowError(error);
                        default:
                            return observableThrowError(error);
                    }
                } else {
                    return observableThrowError(error);
                }
            }), finalize(() => {
                this._userService.isRequestInProgress = false;
            }));
    }

    private addToken (req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
                ClientVersion: window['version']
            }
        });
    }

    private handle419Error (req: HttpRequest<any>, next: HttpHandler) {
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

    private logoutUser (): Observable<any> {
        this._authService.logout(true);
        return observableThrowError('');
    }
}
