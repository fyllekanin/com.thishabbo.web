import { TestBed } from '@angular/core/testing';
import { BreadcrumbComponent } from 'shared/app-views/breadcrumb/breadcrumb.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from 'core/services/auth/auth.service';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { BreadcrumbServiceMock } from '../../../../testing/mock-classes';
import { RouterStateService } from 'core/services/router/router-state.service';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';

describe('BreadcrumbComponent', () => {

    class AuthServiceMock {
        isLoggedIn () {
        }

        get authUser () {
            return null;
        }
    }

    let component: BreadcrumbComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                SafeHtmlModule,
                SafeStyleModule
            ],
            declarations: [
                BreadcrumbComponent
            ],
            providers: [
                {provide: AuthService, useValue: new AuthServiceMock()},
                {provide: BreadcrumbService, useValue: new BreadcrumbServiceMock()},
                {
                    provide: RouterStateService,
                    useValue: {
                        updateCurrentPage: () => {
                        }
                    }
                }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
        component = TestBed.createComponent(BreadcrumbComponent).componentInstance;
    });

    describe('homePage', () => {
        it('should set homePage to home if not logged in', () => {
            // Given
            spyOn(TestBed.get(AuthService), 'isLoggedIn').and.returnValue(false);

            // When
            const result = component.homePage;

            // Then
            expect(result[0]).toEqual('/home');
        });
        it('should set homePage to home if no homePage set', () => {
            // Given
            spyOn(TestBed.get(AuthService), 'isLoggedIn').and.returnValue(true);
            spyOnProperty(TestBed.get(AuthService), 'authUser', 'get').and.returnValue({
                homePage: null
            });

            // When
            const result = component.homePage;

            // Then
            expect(result[0]).toEqual('/home');
        });
        it('should set homePage to declared homePage', () => {
            // Given
            spyOn(TestBed.get(AuthService), 'isLoggedIn').and.returnValue(true);
            spyOnProperty(TestBed.get(AuthService), 'authUser', 'get').and.returnValue({
                homePage: 'test'
            });

            // When
            const result = component.homePage;

            // Then
            expect(result[0]).toEqual('test');
        });
    });
});
