import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthUser, SitecpPermissions, StaffPermissions } from 'core/services/auth/auth.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { HttpService } from 'core/services/http/http.service';
import { RouterStateService } from 'core/services/router/router-state.service';
import { Observable, Subject, Subscription, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { NotificationMessage, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AuthService {
    private _user: AuthUser;

    private _onUserChangeSubject: Subject<void> = new Subject();

    constructor (
        private _routerState: RouterStateService,
        private _activatedRoute: ActivatedRoute,
        private _notificationService: NotificationService,
        private _router: Router,
        private _httpService: HttpService,
        private _dialogService: DialogService
    ) {
    }

    set user (user: AuthUser) {
        this._user = user;
        this.storeAuthUser(this._user);
    }

    login (loginName: string, password: string, stay = false, onFailure?: () => void): Subscription {
        return this._httpService.post('auth/login', {loginName: loginName, password: password})
            .subscribe(res => {
                this.doLogin(res, stay);
            }, error => {
                this._user = null;
                this._notificationService.failureNotification(error);
                if (onFailure) {
                    onFailure();
                }
            });
    }

    logout (isRedirect: boolean): void {
        this.clearUserAndNavigate(isRedirect);
        this._onUserChangeSubject.next();
        this._httpService.post('auth/logout', null).subscribe(() => {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Success',
                message: 'You logged out!'
            }));
        });
    }

    isLoggedIn (): boolean {
        return Boolean(this._user);
    }

    navigateToHome (): void {
        this._router.navigateByUrl('/home');
    }

    getRefreshToken (): string {
        const user = this.getAuthUser();
        return user ? user.oauth.refreshToken : '';
    }

    refreshToken (): Observable<string> {
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

    getAccessToken (): string {
        const user = this.getAuthUser();
        return user ? user.oauth.accessToken : '';
    }

    get onUserChange (): Observable<void> {
        return this._onUserChangeSubject.asObservable();
    }

    get sitecpPermissions (): SitecpPermissions {
        return this._user ? this._user.sitecpPermissions : new SitecpPermissions();
    }

    get staffPermissions (): StaffPermissions {
        return this._user ? this._user.staffPermissions : new StaffPermissions();
    }

    get authUser (): AuthUser {
        return this._user;
    }

    getAuthUser (): AuthUser {
        const user = localStorage.getItem(LOCAL_STORAGE.AUTH_USER);
        if (!user) {
            return null;
        }
        try {
            return JSON.parse(atob(user));
        } catch (e) {
            return null;
        }
    }

    private doLogin (res: AuthUser, stay: boolean): void {
        this._user = new AuthUser(res);
        this.storeAuthUser(res);
        this._onUserChangeSubject.next();

        if (!this._user.gdpr) {
            this.askForGdpr();
            return;
        }

        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'You are logged in!'
        }));

        if (stay && !this._router.url.includes('auth/login')) {
            return;
        }

        if (this._activatedRoute.snapshot.queryParams['redirected']) {
            this._router.navigateByUrl(this._routerState.getPreviousUrl())
                .catch(() => {
                    this.navigateToHome();
                    this._notificationService.sendNotification(new NotificationMessage({
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
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Warning',
                        message: 'Your home page is not a valid page',
                        type: NotificationType.WARNING
                    }));
                });
        } else {
            this.navigateToHome();
        }
    }

    private askForGdpr (): void {
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
                                this._notificationService.sendNotification(new NotificationMessage({
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

    private clearUserAndNavigate (isRedirect: boolean): void {
        this._user = null;
        this.storeAuthUser(null);
        this.navigateToLogin(isRedirect);
    }

    private navigateToLogin (isRedirect: boolean): void {
        this._router.navigateByUrl(`/auth/login${isRedirect ? '?redirected=true' : ''}`);
    }

    private storeAuthUser (user: AuthUser): void {
        localStorage.setItem(LOCAL_STORAGE.AUTH_USER, btoa(JSON.stringify(user) || ''));
    }
}
