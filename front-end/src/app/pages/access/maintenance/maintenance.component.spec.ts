import { MaintenanceComponent } from './maintenance.component';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteMock, BreadcrumbServiceMock } from '../../../../testing/mock-classes';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MaintenanceComponent', () => {

    let component: MaintenanceComponent;
    let activatedRoute: ActivatedRouteMock;

    beforeEach(() => {
        activatedRoute = ActivatedRouteMock.get().useValue;
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                MaintenanceComponent
            ],
            providers: [
                BreadcrumbServiceMock.get(),
                activatedRoute.provider
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        });

        component = TestBed.createComponent(MaintenanceComponent).componentInstance;
    });

    it('should set content to data.data in activatedRoute', () => {
        // When
        activatedRoute.setData('This is the content');

        // Then
        expect(component.content).toEqual('This is the content');
    });
});
