import { TestBed } from '@angular/core/testing';
import { BreadcrumbComponent } from 'shared/app-views/breadcrumb/breadcrumb.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from 'core/services/auth/auth.service';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { BreadcrumbServiceMock } from '../../../../testing/mock-classes';
import { RouterStateService } from 'core/services/router/router-state.service';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { Breadcrumb, BreadcrumbItem } from 'core/services/breadcrum/breadcrum.model';

describe('BreadcrumbComponent', () => {

    class AuthServiceMock {
        isLoggedIn () {
        }

        get authUser () {
            return null;
        }
    }

    let component: BreadcrumbComponent;
    let breadcrumbService: BreadcrumbServiceMock;

    beforeEach(() => {
        breadcrumbService = new BreadcrumbServiceMock();
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
                {provide: BreadcrumbService, useValue: breadcrumbService},
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

    describe('onBreadcrumb', () => {
        it('should update current page on new breadcrumb to current if set', () => {
            // Given
            const updateCurrentPageSpy = spyOn(TestBed.get(RouterStateService), 'updateCurrentPage');

            // When
            breadcrumbService.breadcrumb = new Breadcrumb({current: 'test'});

            // Then
            expect(updateCurrentPageSpy).toHaveBeenCalledWith('test');
        });
        it('should update current page on new breadcrumb to empty if not set', () => {
            // Given
            const updateCurrentPageSpy = spyOn(TestBed.get(RouterStateService), 'updateCurrentPage');

            // When
            breadcrumbService.breadcrumb = null;

            // Then
            expect(updateCurrentPageSpy).toHaveBeenCalledWith('');
        });
    });

    describe('breadcrumbItems', () => {
        it('should return items if breadcrumb is set', () => {
            // When
            breadcrumbService.breadcrumb = new Breadcrumb({
                current: 'test',
                items: [
                    new BreadcrumbItem(null)
                ]
            });

            // Then
            expect(component.breadcrumbItems.length).toEqual(1);
        });
        it('should return empty array if breadcrumb is not set', () => {
            // When
            breadcrumbService.breadcrumb = null;

            // Then
            expect(component.breadcrumbItems.length).toEqual(0);
        });
    });

    describe('current', () => {
        it('should return current if breadcrumb is set', () => {
            // When
            breadcrumbService.breadcrumb = new Breadcrumb({
                current: 'test',
                items: []
            });

            // Then
            expect(component.current).toEqual('test');
        });
        it('should return empty string if breadcrumb is not set', () => {
            // When
            breadcrumbService.breadcrumb = null;

            // Then
            expect(component.current).toEqual('');
        });
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
