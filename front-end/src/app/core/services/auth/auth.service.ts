import { GlobalNotificationService } from './../notification/global-notification.service';
import { Observable, Subject, Subscription, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { AdminPermissions, AuthUser, StaffPermissions } from 'core/services/auth/auth.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpService } from 'core/services/http/http.service';
import { RouterStateService } from 'core/services/router/router-state.service';
import { GlobalNotification, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { DialogService } from 'core/services/dialog/dialog.service';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';

@Injectable()
export class AuthService {
    private _user: AuthUser;

    private _onUserChangeSubject: Subject<void> = new Subject();

    constructor(
        private _routerState: RouterStateService,
        private _activatedRoute: ActivatedRoute,
        private _globalNotificationService: GlobalNotificationService,
        private _router: Router,
        private _httpService: HttpService,
        private _dialogService: DialogService
    ) {
    }

    set user(user: AuthUser) {
        this._user = user;
        this.storeAuthUser(this._user);
    }

    login(loginName: string, password: string, onFailure?: () => void): Subscription {
        return this._httpService.post('auth/login', { loginName: loginName, password: password })
            .subscribe(this.doLogin.bind(this), res => {
                this.user = null;
                this._globalNotificationService.failureNotification(res);
                if (onFailure) {
                    onFailure();
                }
            });
    }

    logout(isRedirect: boolean): void {
        this.clearUserAndNavigate(isRedirect);
        this._onUserChangeSubject.next();
        this._httpService.post('auth/logout', null).subscribe(() => {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Success',
                message: 'You logged out!'
            }));
        });
    }

    isLoggedIn(): boolean {
        return Boolean(this._user);
    }

    navigateToHome(): void {
        this._router.navigateByUrl('/home');
    }

    getRefreshToken(): string {
        const user = this.getAuthUser();
        return user ? user.oauth.refreshToken : '';
    }

    refreshToken(): Observable<string> {
        return this._httpService.get('auth/refresh', null, {
            headers: new HttpHeaders().set('RefreshAuthorization', this.getRefreshToken())
        }).pipe(map((res: AuthUser) => {
            if (!res || !res.oauth.accessToken) {
                this.logout(true);
                return '';
            }
            this._user = new AuthUser(res);
            this.storeAuthUser(res);
            return res.oauth.accessToken;
        }), catchError(error => {
            this._user = null;
            this.storeAuthUser(null);
            return throwError(error);
        }));
    }

    getAccessToken(): string {
        const user = this.getAuthUser();
        return user && user.oauth ? user.oauth.accessToken : '';
    }

    get onUserChange(): Observable<void> {
        return this._onUserChangeSubject.asObservable();
    }

    get adminPermissions(): AdminPermissions {
        return this._user ? this._user.adminPermissions : new AdminPermissions();
    }

    get staffPermissions(): StaffPermissions {
        return this._user ? this._user.staffPermissions : new StaffPermissions();
    }

    get authUser(): AuthUser {
        return this._user;
    }

    getAuthUser(): AuthUser {
        const user = localStorage.getItem(LOCAL_STORAGE.AUTH_USER);
        return user ? JSON.parse(user) : null;
    }

    private doLogin(res: AuthUser): void {
        this._user = new AuthUser(res);
        this.storeAuthUser(res);
        this.checkGdpr();

        this._onUserChangeSubject.next();
        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
            title: 'Success',
            message: 'You are logged in!'
        }));

        if (this._activatedRoute.snapshot.queryParams['redirected']) {
            this._router.navigateByUrl(this._routerState.getPreviousUrl())
                .catch(() => {
                    this.navigateToHome();
                    this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                        title: 'Warning',
                        message: 'Your previous page is not a valid page',
                        type: NotificationType.WARNING
                    }));
                });
            return;
        }

        if (this._user.homePage) {
            this._router.navigateByUrl(this._user.homePage)
                .catch(() => {
                    this.navigateToHome();
                    this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                        title: 'Warning',
                        message: 'Your previous page is not a valid page',
                        type: NotificationType.WARNING
                    }));
                });
        } else {
            this.navigateToHome();
        }
    }

    private checkGdpr(): void {
        if (this._user.gdpr) {
            return;
        }

        this._dialogService.openDialog({
            title: 'Privacy Policy & GDPR',
            content: `You are an existing user of ThisHabbo & have not accepted our privacy policy and GDPR declaration.
In order for us to provide you with our services we require your consent to process the information that we have requested about you.
To see why we need this information please click <u><a>here</a></u>.
<br />
<br />
Until you accept our terms and conditions you will not be able to use most of the services avaliable on ThisHabbo.`,
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({
                    title: 'Accept',
                    callback: () => {
                        this._httpService.put('auth/accept/gdpr')
                            .subscribe(() => {
                                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                                    title: 'You have accepted!',
                                    message: 'You have accepted Thishabbo\'s privacy policy & gdpr!'
                                }));
                                this._user.gdpr = true;
                                this._dialogService.closeDialog();
                            });
                    }
                })
            ]
        });
    }

    private clearUserAndNavigate(isRedirect: boolean): void {
        this._user = null;
        this.storeAuthUser(null);
        this.navigateToLogin(isRedirect);
    }

    private navigateToLogin(isRedirect: boolean): void {
        this._router.navigateByUrl(`/auth/login${isRedirect ? '?redirected=true' : ''}`);
    }

    private storeAuthUser(user: AuthUser): void {
        localStorage.setItem(LOCAL_STORAGE.AUTH_USER, JSON.stringify(user) || '');
    }
}
