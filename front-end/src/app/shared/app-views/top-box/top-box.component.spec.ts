import { TopBoxComponent } from 'shared/app-views/top-box/top-box.component';
import { TestBed } from '@angular/core/testing';
import { AuthService } from 'core/services/auth/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';

describe('TopBoxComponent', () => {

    let userChangeCallback;

    class MockAuthService {
        onUserChange = {
            subscribe: callback => userChangeCallback = callback
        };

        get authUser () {
            return null;
        }

        isLoggedIn () {
            return false;
        }
    }

    let component: TopBoxComponent;
    let authService: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                TopBoxComponent
            ],
            providers: [
                { provide: AuthService, useValue: new MockAuthService() },
                {
                    provide: ContinuesInformationService, useValue: {
                        onDeviceSettingsUpdated: {
                            subscribe: () => null
                        }
                    }
                }
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        });

        component = TestBed.createComponent(TopBoxComponent).componentInstance;
        authService = TestBed.inject(AuthService);
    });

    describe('nickname', () => {
        it('should return default value User if not logged in', () => {
            // Given
            spyOn(authService, 'isLoggedIn').and.returnValue(false);
            userChangeCallback();

            // When
            const result = component.nickname;

            // Then
            expect(result).toEqual('User');
        });
        it('should return nickname of user if logged in', () => {
            // Given
            spyOn(authService, 'isLoggedIn').and.returnValue(true);
            spyOnProperty(authService, 'authUser', 'get')
                .and.returnValue({ nickname: 'Tovven' });
            userChangeCallback();

            // When
            const result = component.nickname;

            // Then
            expect(result).toEqual('Tovven');
        });
    });

    describe('isLoggedIn', () => {
        it('should return false if user is not logged in', () => {
            // Given
            spyOn(authService, 'isLoggedIn').and.returnValue(false);
            userChangeCallback();

            // When
            const result = component.isLoggedIn;

            // Then
            expect(result).toBeFalsy();
        });
        it('should return true if user is logged in', () => {
            // Given
            spyOn(authService, 'isLoggedIn').and.returnValue(true);
            spyOnProperty(authService, 'authUser', 'get')
                .and.returnValue({});
            userChangeCallback();

            // When
            const result = component.isLoggedIn;

            // Then
            expect(result).toBeTruthy();
        });
    });
});
