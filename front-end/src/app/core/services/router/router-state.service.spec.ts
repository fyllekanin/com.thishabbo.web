import { RouterStateService } from 'core/services/router/router-state.service';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('RouterStateService', () => {

    let service: RouterStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [],
            providers: [
                RouterStateService
            ]
        });
        service = TestBed.get(RouterStateService);
    });

    describe('updateTitle', () => {
        it('should set title to default if notification count is 0', () => {
            // Given
            const notificationAmount = 0;

            // When
            service.updateTitle(notificationAmount);

            // Then
            expect(document.title).toEqual('THX');
        });
        it('should add amount of notification before title if more then 0', () => {
            // Given
            const notificationAmount = 5;

            // When
            service.updateTitle(notificationAmount);

            // Then
            expect(document.title).toEqual('(5) THX');
        });
    });
});
