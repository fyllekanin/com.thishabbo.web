import { DashboardComponent } from './dashboard.component';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { DashboardService } from '../services/dashboard.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Bet, BetCategory, BetDashboardListActions, DashboardModel } from './dashboard.model';
import { Action } from 'shared/components/table/table.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { StatsModel } from '../betting.model';

describe('Dashboard Component', () => {

    class MockActivatedRoute extends ActivatedRoute {
        dataSubject: Subject<any> = new Subject<any>();

        get data() {
            return this.dataSubject.asObservable();
        }

        set data(_val) {

        }
    }

    let activatedRoute: MockActivatedRoute;
    let component: DashboardComponent;

    beforeEach(() => {
        activatedRoute = new MockActivatedRoute();
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                CommonModule
            ],
            declarations: [
                DashboardComponent
            ],
            providers: [
                BreadcrumbService,
                { provide: HttpService, useValue: {} },
                { provide: NotificationService, useValue: {} },
                {
                    provide: DashboardService, useValue: {
                        openBetDialog: () => {
                        }
                    }
                },
                { provide: ActivatedRoute, useValue: activatedRoute }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        component = TestBed.createComponent(DashboardComponent).componentInstance;
    });

    it('ngOnInit should get the contracted sections from localstorage', () => {
        // Given
        localStorage.setItem(LOCAL_STORAGE.CONTRACTED_SECTIONS, JSON.stringify([1]));

        // When
        component.ngOnInit();

        // Then
        expect(component.isContracted(1)).toBeTruthy();
    });

    describe('onAction', () => {
        it('should find the bet in trendingBets if betCategoryId is not set', () => {
            // Given
            const dashboardService = TestBed.get(DashboardService);
            const bet = new Bet({ betId: 5, name: 'test' });
            spyOn(dashboardService, 'openBetDialog').and.returnValue({
                subscribe: () => {
                }
            });
            activatedRoute.dataSubject.next({
                data: new DashboardModel({
                    trendingBets: [bet],
                    stats: new StatsModel({ credits: 5 })
                })
            });

            // When
            component.onAction(new Action({ value: BetDashboardListActions.PLACE_BET, rowId: '5' }));

            // Then
            expect(dashboardService.openBetDialog).toHaveBeenCalledWith(bet, 5);
        });
        it('should find the bet in activeBets if betCategoryId is set', () => {
            // Given
            const dashboardService = TestBed.get(DashboardService);
            const bet = new Bet({ betId: 6, name: 'test' });
            spyOn(dashboardService, 'openBetDialog').and.returnValue({
                subscribe: () => {
                }
            });
            activatedRoute.dataSubject.next({
                data: new DashboardModel({
                    trendingBets: [],
                    activeBets: [
                        new BetCategory({
                            betCategoryId: 2,
                            activeBets: [bet]
                        })
                    ],
                    stats: new StatsModel({ credits: 5 })
                })
            });

            // When
            component.onAction(new Action({ value: BetDashboardListActions.PLACE_BET, rowId: '6' }), 2);

            // Then
            expect(dashboardService.openBetDialog).toHaveBeenCalledWith(bet, 5);
        });
    });

    describe('onToggle', () => {
        beforeEach(() => {
            localStorage.setItem(LOCAL_STORAGE.CONTRACTED_SECTIONS, JSON.stringify([1]));
            component.ngOnInit();
        });
        it('should remove the betCategoryId if it exists', () => {
            // When
            component.onToggle(1);

            // Then
            expect(component.isContracted(1)).toBeFalsy();
        });
        it('should add the betCategoryId if not existing', () => {
            // Given
            expect(component.isContracted(2)).toBeFalsy();

            // When
            component.onToggle(2);

            // Then
            expect(component.isContracted(2)).toBeTruthy();
        });
    });

    describe('isContracted', () => {
        it('should return false if betCategoryId is not contracted', () => {
            // Given
            localStorage.setItem(LOCAL_STORAGE.CONTRACTED_SECTIONS, JSON.stringify([]));
            component.ngOnInit();

            // When
            const result = component.isContracted(1);

            // Then
            expect(result).toBeFalsy();
        });
        it('should return true if betCategoryId is contracted', () => {
            // Given
            localStorage.setItem(LOCAL_STORAGE.CONTRACTED_SECTIONS, JSON.stringify([1]));
            component.ngOnInit();

            // When
            const result = component.isContracted(1);

            // Then
            expect(result).toBeTruthy();
        });
    });
});
