import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { HttpService } from 'core/services/http/http.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { map } from 'rxjs/operators';
import { InfractionContext, InfractModel } from 'shared/components/infraction/infraction.model';
import { Observable } from 'rxjs';
import { InfractionComponent } from 'shared/components/infraction/infraction.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { NotificationMessage, NotificationType } from 'shared/app-views/global-notification/global-notification.model';

export enum InfractionType {
    POST = 1,
    VISITOR_MESSAGE = 2,
    USER = 3
}

@Injectable()
export class InfractionService {

    constructor (
        private _componentResolver: ComponentFactoryResolver,
        private _httpService: HttpService,
        private _dialogService: DialogService,
        private _notificationService: NotificationService
    ) {
    }

    infract (userId: number, type: InfractionType, content: string): void {
        this.getModel(userId).subscribe(this.openDialog.bind(this, type, content));
    }

    private openDialog (type: InfractionType, content: string, model: InfractionContext): void {
        this._dialogService.openDialog({
            title: `Infract or Warn ${model.user.nickname}`,
            component: this._componentResolver.resolveComponentFactory(InfractionComponent),
            data: model,
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({
                    title: 'Infract',
                    callback: this.doInfract.bind(this, type, content)
                })
            ]
        });
    }

    private doInfract (type: InfractionType, content: string, data: InfractModel): void {
        if (!data.isValid) {
            this.invalidInfractData();
            return;
        }
        this._httpService.post('sitecp/moderation/infract', { infraction: data, type: type, content: content })
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Infraction created!'
                }));
                this._dialogService.closeDialog();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private invalidInfractData (): void {
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Missing data',
            message: 'You need to choose both infraction level & enter a reason',
            type: NotificationType.ERROR
        }));
    }

    private getModel (userId: number): Observable<InfractionContext> {
        return this._httpService.get(`sitecp/moderation/infract/${userId}`)
            .pipe(map(res => new InfractionContext(res)));
    }
}
