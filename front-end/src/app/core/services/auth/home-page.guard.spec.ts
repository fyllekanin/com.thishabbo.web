import { HomePageGuard } from 'core/services/auth/home-page.guard';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'core/services/auth/auth.service';
import { Router } from '@angular/router';

describe('HomePageGuard', () => {

    let guard: HomePageGuard;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            providers: [
                HomePageGuard,
                {
                    provide: AuthService, useValue: {
                        isLoggedIn: () => {
                        },
                        getAuthUser: () => {
                        }
                    }
                }
            ]
        });

        guard = TestBed.get(HomePageGuard);
        router = TestBed.get(Router);
        spyOn(router, 'navigateByUrl').and.callFake(url => {
            return new Promise((resolve, reject) => {
                if (url === 'random') {
                    reject();
                } else {
                    resolve();
                }
            });
        });
    });

    it('should navigate to home if not logged in', done => {
        // Given
        spyOn(TestBed.get(AuthService), 'isLoggedIn').and.returnValue(false);

        // When
        guard.canActivate().then(() => {
            // Then
            expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
            done();
        });
    });

    it('should navigate to home if home page do not exist', done => {
        // Given
        spyOn(TestBed.get(AuthService), 'isLoggedIn').and.returnValue(true);
        spyOn(TestBed.get(AuthService), 'getAuthUser').and.returnValue({ homePage: 'random' });

        // When
        guard.canActivate().then(() => {
            // Then
            expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
            done();
        });
    });

    it('should navigate to home page of the user', done => {
        // Given
        spyOn(TestBed.get(AuthService), 'isLoggedIn').and.returnValue(true);
        spyOn(TestBed.get(AuthService), 'getAuthUser').and.returnValue({ homePage: 'forum' });

        // When
        guard.canActivate().then(() => {
            // Then
            expect(router.navigateByUrl).toHaveBeenCalledWith('forum');
            done();
        });
    });
});
