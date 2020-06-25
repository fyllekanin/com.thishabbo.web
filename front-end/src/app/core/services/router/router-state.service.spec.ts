import { RouterStateService } from 'core/services/router/router-state.service';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogService } from 'core/services/dialog/dialog.service';

describe('RouterStateService', () => {

    let service: RouterStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [],
            providers: [
                RouterStateService,
                {
                    provide: DialogService, useValue: {
                        closeDialog: () => {
                            // Empty
                        }
                    }
                }
            ]
        });
        service = TestBed.inject(RouterStateService);
    });

    describe('updateNotificationAmount', () => {
        it('should set title to default if notification count is 0', () => {
            // Given
            const notificationAmount = 0;

            // When
            service.updateNotificationAmount(notificationAmount);

            // Then
            expect(document.title).toEqual('TH');
        });
        it('should add amount of notification before title if more then 0', () => {
            // Given
            const notificationAmount = 5;

            // When
            service.updateNotificationAmount(notificationAmount);

            // Then
            expect(document.title).toEqual('(5) TH');
        });
    });
});
