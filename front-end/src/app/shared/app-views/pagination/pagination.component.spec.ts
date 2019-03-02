import { PaginationItem, PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { PaginationComponent } from 'shared/app-views/pagination/pagination.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

describe('PaginationComponent', () => {
    let component: PaginationComponent;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                PaginationComponent
            ],
            providers: [],
            schemas: [ NO_ERRORS_SCHEMA ]
        });

        router = TestBed.get(Router);
        component = TestBed.createComponent(PaginationComponent).componentInstance;

        spyOn(router, 'navigateByUrl');
        component.paginationModel = new PaginationModel({
            page: 2,
            total: 5,
            url: 'test/:page'
        });
    });

    it('getUrl should replace ":page" in the url with the value', () => {
        // Given
        const value: PaginationItem = { value: 5 };

        // When
        const result = component.getUrl(value);

        // Then
        expect(result).toBe('test/5');
    });

    it('goToPrevious should take current page - 1 and navigate', () => {
        // When
        component.goToPrevious();

        // Then
        expect(router.navigateByUrl).toHaveBeenCalledWith('test/1');
    });

    it('goToNext should take current page + 1 and navigate', () => {
        // When
        component.goToNext();

        // Then
        expect(router.navigateByUrl).toHaveBeenCalledWith('test/3');
    });

    describe('fillBackwardItems', () => {
        it('should return empty array if there is a gap backwards', () => {
            // Given
            component.paginationModel = new PaginationModel({ page: 5, total: 1, url: 'test' });

            // When
            const result = component.fillBackwardItems;

            // Then
            expect(result).toEqual([]);
        });
        it('should return array of items less then current page if no gap', () => {
            // Given
            component.paginationModel = new PaginationModel({ page: 4, total: 1, url: 'test' });

            // When
            const result = component.fillBackwardItems;

            // Then
            expect(result).toEqual([
                { value: 1, title: '1' },
                { value: 2, title: '2' },
                { value: 3, title: '3' }
            ]);
        });
    });

    describe('fillForwardItems', () => {
        it('should return empty array if there is a gap forward', () => {
            // Given
            component.paginationModel = new PaginationModel({ page: 5, total: 10, url: 'test' });

            // When
            const result = component.fillForwardItems;

            // Then
            expect(result).toEqual([]);
        });
        it('should return array of items less then current page if no gap', () => {
            // Given
            component.paginationModel = new PaginationModel({ page: 4, total: 6, url: 'test' });

            // When
            const result = component.fillForwardItems;

            // Then
            expect(result).toEqual([
                { value: 5, title: '5' },
                { value: 6, title: '6' }
            ]);
        });
    });

    describe('thereIsPrevious', () => {
        it('should return true if page is larger then 1', () => {
            // Given
            component.paginationModel = new PaginationModel({ page: 2, total: 1, url: 'test' });

            // When
            const result = component.thereIsPrevious;

            // Then
            expect(result).toBeTruthy();
        });
        it('should return false if page is 1', () => {
            // Given
            component.paginationModel = new PaginationModel({ page: 1, total: 1, url: 'test' });

            // When
            const result = component.thereIsPrevious;

            // Then
            expect(result).toBeFalsy();
        });
    });

    describe('thereIsNext', () => {
        it('should return true if page is less then total', () => {
            // Given
            component.paginationModel = new PaginationModel({ page: 2, total: 3, url: 'test' });

            // When
            const result = component.thereIsNext;

            // Then
            expect(result).toBeTruthy();
        });
        it('should return false if page is same as total', () => {
            // Given
            component.paginationModel = new PaginationModel({ page: 1, total: 1, url: 'test' });

            // When
            const result = component.thereIsNext;

            // Then
            expect(result).toBeFalsy();
        });
    });

    it('currentPage should return current page as string', () => {
        // Given
        component.paginationModel = new PaginationModel({ page: 2, total: 1, url: 'test' });

        // When
        const result = component.currentPage;

        // Then
        expect(result).toEqual(jasmine.any(String));
    });
});
