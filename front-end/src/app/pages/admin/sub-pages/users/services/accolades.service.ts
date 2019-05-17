import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { HttpService } from 'core/services/http/http.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AccoladeItem, AccoladesPage } from '../accolades/accolades.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { AccoladeComponent } from '../accolades/accolade/accolade.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { NotificationService } from 'core/services/notification/notification.service';

@Injectable()
export class AccoladesService implements Resolve<AccoladesPage> {

    constructor (
        private _httpService: HttpService,
        private _dialogService: DialogService,
        private _componentFactory: ComponentFactoryResolver,
        private _notificationService: NotificationService
    ) {
    }

    resolve (activatedRoute: ActivatedRouteSnapshot): Observable<AccoladesPage> {
        const userId = activatedRoute.params['userId'];
        return this._httpService.get(`admin/users/${userId}/accolades`)
            .pipe(map(res => new AccoladesPage(res)));
    }

    onDeleteAccolade (page: AccoladesPage, accoladeId: number): Observable<number> {
        return this._httpService.delete(`admin/users/${page.user.userId}/accolades/${accoladeId}`)
            .pipe(map(() => {
                    this._notificationService.sendInfoNotification('Deleted accolade');
                    return accoladeId;
                }),
                catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }

    onUpdateAccolade (page: AccoladesPage, accoladeId: number): Promise<AccoladeItem> {
        return new Promise(res => {
            this._dialogService.openDialog({
                title: 'Create Accolade',
                component: this._componentFactory.resolveComponentFactory(AccoladeComponent),
                data: {data: page, accolade: page.items.find(item => item.accoladeId === accoladeId)},
                buttons: [
                    new DialogCloseButton('Close'),
                    new DialogButton({
                        title: 'Save',
                        callback: (data) => this.updateAccolade(page, data, res)
                    })
                ]
            });
        });
    }

    onCreateAccolade (page: AccoladesPage): Promise<AccoladeItem> {
        return new Promise(res => {
            this._dialogService.openDialog({
                title: 'Create Accolade',
                component: this._componentFactory.resolveComponentFactory(AccoladeComponent),
                data: {data: page},
                buttons: [
                    new DialogCloseButton('Close'),
                    new DialogButton({
                        title: 'Create',
                        callback: (data) => this.createAccolade(page, data, res)
                    })
                ]
            });
        });
    }

    private createAccolade (page: AccoladesPage, data: AccoladeItem, res): void {
        this._httpService.post(`admin/users/${page.user.userId}/accolades`, {data: data})
            .subscribe(item => {
                res(new AccoladeItem(item));
                this._dialogService.closeDialog();
                this._notificationService.sendInfoNotification('Created accolade');
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private updateAccolade (page: AccoladesPage, data: AccoladeItem, res): void {
        this._httpService.put(`admin/users/${page.user.userId}/accolades/${data.accoladeId}`, {data: data})
            .subscribe(item => {
                res(new AccoladeItem(item));
                this._dialogService.closeDialog();
                this._notificationService.sendInfoNotification('Updated accolade');
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }
}
