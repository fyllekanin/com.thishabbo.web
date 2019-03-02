import { TopBoxComponent } from 'shared/app-views/top-box/top-box.component';
import { TestBed } from '@angular/core/testing';
import { AuthService } from 'core/services/auth/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, Subject } from 'rxjs';

describe('TopBoxComponent', () => {

    class MockAuthService {
        subject = new Subject<void>();

        get onUserChange(): Observable<void> {
            return this.subject.asObservable();
        }

        get authUser() {
            return null;
        }

        isLoggedIn() {}

        triggerUserChange(): void {
            this.subject.next();
        }
    }

    let component: TopBoxComponent;
    let authService: MockAuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [
                TopBoxComponent
            ],
            providers: [
                { provide: AuthService, useValue: new MockAuthService() }
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        });

        component = TestBed.createComponent(TopBoxComponent).componentInstance;
        authService = TestBed.get(AuthService);
    });

    describe('nickname', () => {
       it('should return default value User if not logged in', () => {
           // Given
           spyOn(authService, 'isLoggedIn').and.returnValue(false);
           authService.triggerUserChange();

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
           authService.triggerUserChange();

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
            authService.triggerUserChange();

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
            authService.triggerUserChange();

            // When
            const result = component.isLoggedIn;

            // Then
            expect(result).toBeTruthy();
        });
    });
});
