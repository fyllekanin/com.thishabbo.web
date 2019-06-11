import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { Followers, ProfileModel, ProfileVisitorMessage } from './profile.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { map } from 'rxjs/operators';
import { NotificationService } from 'core/services/notification/notification.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { ReportComponent } from './report/report.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';

@Injectable()
export class ProfileService implements Resolve<ProfileModel> {

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
        private _componentResolver: ComponentFactoryResolver
    ) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<ProfileModel> {
        const nickname = route.params['nickname'];
        const page = route.params['page'] || 1;
        return this._httpService.get(`page/profile/${nickname}/page/${page}`)
            .pipe(map(res => new ProfileModel(res)));
    }

    delete (visitorMessage: ProfileVisitorMessage): Promise<void> {
        return new Promise(res => {
            this._dialogService.confirm({
                title: 'Are you sure?',
                content: 'Are you sure you wanna delete this visitor message / comment?',
                callback: () => {
                    this._httpService.delete(`sitecp/moderation/visitor-message/${visitorMessage.visitorMessageId}`)
                        .subscribe(() => {
                            this._notificationService.sendInfoNotification('Visitor message/comment deleted!');
                            res();
                            this._dialogService.closeDialog();
                        }, this._notificationService.failureNotification.bind(this._notificationService));
                }
            });
        });
    }

    report (visitorMessage: ProfileVisitorMessage): void {
        this._dialogService.openDialog({
            title: 'Report visitor message',
            component: this._componentResolver.resolveComponentFactory(ReportComponent),
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({
                    title: 'Report',
                    callback: message => {
                        this._httpService.post(`profile/visitor-message/${visitorMessage.visitorMessageId}/report`, {message: message})
                            .subscribe(() => {
                                this._notificationService.sendInfoNotification('Visitor message reported!');
                                this._dialogService.closeDialog();
                            }, this._notificationService.failureNotification.bind(this._notificationService));
                    }
                })
            ]
        });
    }

    follow (userId: number): Observable<Followers> {
        return this._httpService.post('usercp/profile/follow', {userId: userId});
    }

    unfollow (userId: number): Observable<Followers> {
        return this._httpService.delete(`usercp/profile/unfollow/${userId}`);
    }

    postVisitorMessage (hostId: number, value: string, parentId: number = null): Observable<ProfileVisitorMessage> {
        return this._httpService.post('profile/visitor-message', {
            data: {
                hostId: hostId,
                content: value,
                parentId: parentId
            }
        }).pipe(map(res => new ProfileVisitorMessage(res)));
    }

    likeMessage (visitorMessageId: number): Observable<void> {
        return this._httpService.post(`profile/visitor-message/${visitorMessageId}/like`, null);
    }

    unlikeMessage (visitorMessageId: number): Observable<void> {
        return this._httpService.delete(`profile/visitor-message/${visitorMessageId}/like`);
    }
}
