import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { HttpService } from 'core/services/http/http.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { map } from 'rxjs/operators';
import { InfractionContext, InfractModel } from 'shared/components/infraction/infraction.model';
import { Observable } from 'rxjs';
import { InfractionComponent } from 'shared/components/infraction/infraction.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { GlobalNotification, NotificationType } from 'shared/app-views/global-notification/global-notification.model';


@Injectable()
export class InfractionService {

    constructor(
        private _componentResolver: ComponentFactoryResolver,
        private _httpService: HttpService,
        private _dialogService: DialogService,
        private _globalNotificationService: GlobalNotificationService
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
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification( {
                    title: 'Success',
                    message: 'Infraction created!'
                }));
                this._dialogService.closeDialog();
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private invalidInfractData(): void {
        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
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
