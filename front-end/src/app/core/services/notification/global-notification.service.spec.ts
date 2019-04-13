import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'core/services/notification/notification.service';

describe('NotificationService', () => {

    let service: NotificationService;

    beforeEach(() => {
        service = new NotificationService();
    });

    it('failureNotification should use HttpErrorResponse to get message', (done) => {
        // Given
        const response = new HttpErrorResponse({
            error: { message: 'test' }
        });
        service.onNotification.subscribe(res => {
            expect(res.title).toEqual('Error');
            expect(res.message).toEqual('test');
            done();
        });

        // When
        service.failureNotification(response);
    });

    describe('sendNotification', () => {
        it('should do nothing if argument is null', () => {
            // Given
            let count = 0;
            service.onNotification.subscribe(() => count++);

            // When
            service.sendNotification(null);

            // Then
            expect(count).toBe(0);
        });
        it('should trigger observable', (done) => {
            // Given
            service.onNotification.subscribe(() => done());

            // When
            service.sendNotification(new NotificationMessage({ title: 'test' }));
        });
    });
});
