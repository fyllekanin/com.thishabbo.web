import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { DialogService } from 'core/services/dialog/dialog.service';
import { Observable } from 'rxjs';
import { PlaceBetComponent } from '../dashboard/place-bet/place-bet.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { Bet } from '../dashboard/dashboard.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage, NotificationType } from 'shared/app-views/global-notification/global-notification.model';

@Injectable()
export class DashboardService {

    constructor(
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
        private _componentFactory: ComponentFactoryResolver
    ) {}

    openBetDialog(bet: Bet, maxThcAmount: number): Observable<number> {
        return new Observable(observer => {
            this._dialogService.openDialog({
                title: `Betting on: ${bet.name}`,
                component: this._componentFactory.resolveComponentFactory(PlaceBetComponent),
                buttons: [
                    new DialogCloseButton('Close'),
                    new DialogButton({ title: 'Place Bet', callback: this.onPlaceBet.bind(this, observer, maxThcAmount) })
                ]
            });
        });
    }

    private onPlaceBet(observer, maxThcAmount, data): void {
        if (!Number(data) || data <= 0) {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Error',
                message: 'The amount needs to be a positive number',
                type: NotificationType.ERROR
            }));
            return;
        }

        if (data > maxThcAmount) {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Error',
                message: 'You do not have enough credits',
                type: NotificationType.ERROR
            }));
            return;
        }

        observer.next(data);
        this._dialogService.closeDialog();
    }
}
