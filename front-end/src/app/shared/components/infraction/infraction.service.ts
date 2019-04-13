import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { HttpService } from 'core/services/http/http.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { map } from 'rxjs/operators';
import { InfractionContext, InfractModel } from 'shared/components/infraction/infraction.model';
import { Observable } from 'rxjs';
import { InfractionComponent } from 'shared/components/infraction/infraction.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { NotificationModel, NotificationType } from 'shared/app-views/global-notification/global-notification.model';


@Injectable()
export class InfractionService {

    constructor(
        private _componentResolver: ComponentFactoryResolver,
        private _httpService: HttpService,
        private _dialogService: DialogService,
        private _notificationService: NotificationService
    ) {}

    infract(userId: number): void {
        this.getModel(userId).subscribe(this.openDialog.bind(this));
    }

    private openDialog(model: InfractionContext): void {
        this._dialogService.openDialog({
            title: `Infracting ${model.user.nickname}`,
            component: this._componentResolver.resolveComponentFactory(InfractionComponent),
            data: model,
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({
                    title: 'Infract',
                    callback: this.doInfract.bind(this)
                })
            ]
        });
    }

    private doInfract(data: InfractModel): void {
        if (!data.isValid) {
            this.invalidInfractData();
            return;
        }
        this._httpService.post('admin/moderation/infract', { infraction: data })
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationModel( {
                    title: 'Success',
                    message: 'Infraction created!'
                }));
                this._dialogService.closeDialog();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private invalidInfractData(): void {
        this._notificationService.sendNotification(new NotificationModel({
            title: 'Missing data',
            message: 'You need to choose both infraction level & enter a reason',
            type: NotificationType.ERROR
        }));
    }

    private getModel(userId: number): Observable<InfractionContext> {
        return this._httpService.get(`admin/moderation/infract/${userId}`)
            .pipe(map(res => new InfractionContext(res)));
    }
}
