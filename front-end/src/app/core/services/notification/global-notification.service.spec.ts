import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';

describe('GlobalNotificationService', () => {

    let service: GlobalNotificationService;

    beforeEach(() => {
        service = new GlobalNotificationService();
    });

    it('failureNotification should use HttpErrorResponse to get message', (done) => {
        // Given
        const response = new HttpErrorResponse({
            error: { message: 'test' }
        });
        service.onGlobalNotification.subscribe(res => {
            expect(res.title).toEqual('Error');
            expect(res.message).toEqual('test');
            done();
        });

        // When
        service.failureNotification(response);
    });

    describe('sendGlobalNotification', () => {
        it('should do nothing if argument is null', () => {
            // Given
            let count = 0;
            service.onGlobalNotification.subscribe(() => count++);

            // When
            service.sendGlobalNotification(null);

            // Then
            expect(count).toBe(0);
        });
        it('should trigger observable', (done) => {
            // Given
            service.onGlobalNotification.subscribe(() => done());

            // When
            service.sendGlobalNotification(new GlobalNotification({ title: 'test' }));
        });
    });
});
