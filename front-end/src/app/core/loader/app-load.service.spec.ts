import { AppLoadService } from 'core/loader/app-load.service';
import { TestBed } from '@angular/core/testing';
import { HttpService } from 'core/services/http/http.service';
import { AuthService } from 'core/services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { RouterStateService } from 'core/services/router/router-state.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationService } from 'core/services/notification/notification.service';
import { DialogService } from 'core/services/dialog/dialog.service';

describe('AppLoadService', () => {

    let service: AppLoadService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [],
            providers: [
                AppLoadService,
                AuthService,
                RouterStateService,
                NotificationService,
                DialogService,
                { provide: HttpService, useValue: { get: () => {} } }
            ]
        });
        service = TestBed.get(AppLoadService);
    });

    describe('initializeNavigation', () => {
        it('should fetch navigation from BE and set to localStorage', done => {
            // Given
            const httpService = TestBed.get(HttpService);
            spyOn(httpService, 'get').and.returnValue(of({
                navigation: [
                    {
                        label: 'navigation'
                    }
                ]
            }));

            // When
            service.initializeNavigation().then(() => {
                // Then
                expect(JSON.parse(localStorage.getItem(LOCAL_STORAGE.NAVIGATION))).toEqual([
                    {
                        label: 'navigation'
                    }
                ]);
                done();
            });
        });
        it('should resolve the promise if BE returns error', done => {
            // Given
            const httpService = TestBed.get(HttpService);
            spyOn(httpService, 'get').and.returnValue(throwError(null));

            // When
            service.initializeNavigation().then(() => {
                done();
            });
        });
    });

    describe('initializeUser', () => {
        it('should fetch auth user and set to authService', done => {
            // Given
            localStorage.setItem(LOCAL_STORAGE.AUTH_USER, '{}');
            const httpService = TestBed.get(HttpService);
            const authService = TestBed.get(AuthService);
            spyOn(httpService, 'get').and.returnValue(of({}));

            // When
            service.initializeUser().then(() => {
                expect(authService.authUser).not.toBeNull();
                done();
            });
        });
        it('should set user to null and resolve if BE returns error', done => {
            // Given
            localStorage.setItem(LOCAL_STORAGE.AUTH_USER, '{}');
            const httpService = TestBed.get(HttpService);
            const authService = TestBed.get(AuthService);
            spyOn(httpService, 'get').and.returnValue(throwError(null));

            // When
            service.initializeUser().then(() => {
                expect(authService.authUser).toBeNull();
                done();
            });
        });
    });
});
