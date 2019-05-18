import { of } from 'rxjs';
import { AuthService } from 'core/services/auth/auth.service';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { RouterStateService } from 'core/services/router/router-state.service';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { DialogService } from 'core/services/dialog/dialog.service';
import { AuthUser, OAuth } from 'core/services/auth/auth.model';
import { Router } from '@angular/router';


describe('AuthService', () => {

    class HttpServiceMock {
        post () {
            return null;
        }

        get () {
        }
    }

    let authService: AuthService = null;
    let httpServiceMock: HttpServiceMock;

    beforeEach(() => {
        httpServiceMock = new HttpServiceMock();
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([
                    {path: 'auth/login', redirectTo: ''},
                    {path: 'dashboard', redirectTo: ''}
                ])
            ],
            providers: [
                AuthService,
                DialogService,
                RouterStateService,
                {
                    provide: ContinuesInformationService, useValue: {
                        triggerFetch: () => {
                        }
                    }
                },
                {
                    provide: NotificationService, useValue: {
                        failureNotification: () => {
                        },
                        sendNotification: () => {
                        }
                    }
                },
                {provide: HttpService, useValue: httpServiceMock}
            ]
        });

        authService = TestBed.get(AuthService);
    });

    it('user should set the user and store it in localStorage', () => {
        // Given
        const user = new AuthUser({nickname: 'test'});

        // When
        authService.user = user;

        // Then
        expect(authService.authUser.nickname).toEqual(user.nickname);
        expect(JSON.parse(atob(localStorage.getItem(LOCAL_STORAGE.AUTH_USER))).nickname).toEqual(user.nickname);
    });

    it('navigateToHome should navigate to /home', done => {
        // Given
        spyOn(TestBed.get(Router), 'navigateByUrl').and.callFake(url => {
            expect(url).toEqual('/home');
            done();
        });

        // When
        authService.navigateToHome();
    });

    describe('getRefreshToken', () => {
        it('should return empty string if no user set', () => {
            // Given
            authService.user = null;

            // When
            const result = authService.getRefreshToken();

            // Then
            expect(result).toEqual('');
        });
        it('should return the refreshToken if user is set', () => {
            // Given
            authService.user = new AuthUser({oauth: new OAuth({refreshToken: 'test'})});

            // When
            const result = authService.getRefreshToken();

            // Then
            expect(result).toEqual('test');
        });
    });

    describe('login', () => {
        it('should set user to null and stop the code if login was failed', (done) => {
            // Given
            spyOn(httpServiceMock, 'post').and.returnValue({
                subscribe: (_success, fail) => {
                    fail(null);
                    expect(authService.authUser).toBeNull();
                    done();
                }
            });

            // When
            authService.login('nickname', 'password');
        });
        it('should set the user and navigate to home if no error', (done) => {
            // Given
            const loginResponse = {
                userId: 1,
                nickname: 'Tovven',
                oauth: {
                    accessToken: 'ba63-c261-41e3-5d5f-cf3b-3175-2af0-8a69-7393-e8d6-d484-09b4',
                    refreshToken: '1bf2-7936-01e5-ac63-526e-f5f6-0568-fa8c-09cb-cc85-177f-1b58',
                    expiresIn: 5400
                }
            };
            spyOn(httpServiceMock, 'post').and.returnValue(of(loginResponse));
            spyOn(authService, 'navigateToHome').and.callFake(() => {
                expect(authService.authUser).not.toBeNull();
                expect(authService.isLoggedIn()).toBeTruthy();
                done();
            });

            // When
            authService.login('nickname', 'password');
        });
        it('should call callback if provided on fail', done => {
            // Given
            spyOn(httpServiceMock, 'post').and.returnValue({
                subscribe: (_success, fail) => {
                    fail(null);
                }
            });

            // When
            authService.login('nickname', 'password', () => {
                done();
            });
        });
    });

    it('logout should clear the user and token', () => {
        // Given
        spyOn(httpServiceMock, 'post').and.returnValue(of(null));

        // When
        authService.logout(false);

        // Then
        expect(authService.authUser).toBeNull();
        expect(localStorage.getItem(LOCAL_STORAGE.AUTH_USER)).toBe(btoa('null'));
    });

    it('getAccessToken should return "access-token" from localStorage', () => {
        // Given
        const user = {oauth: {accessToken: 'token'}};
        localStorage.setItem(LOCAL_STORAGE.AUTH_USER, btoa(JSON.stringify(user)));

        // When
        const result = authService.getAccessToken();

        // Then
        expect(result).toBe('token');
    });
});
