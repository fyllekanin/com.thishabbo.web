import { Prefix } from '../prefixes/prefix.model';
import { Observable, throwError } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { ThreadTemplate } from '../thread-templates/thread-template.model';
import { NotificationService } from 'core/services/notification/notification.service';

@Injectable()
export class ThreadTemplateService implements Resolve<Prefix> {

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<Prefix> {
        const threadTemplateId = route.params['threadTemplateId'];
        return this._httpService.get(`sitecp/thread-templates/${threadTemplateId}`)
            .pipe(map(data => new Prefix(data)));
    }

    create (threadTemplate: ThreadTemplate): Observable<ThreadTemplate> {
        return this._httpService.post('sitecp/thread-templates',
            { threadTemplate: threadTemplate })
            .pipe(map(res => new ThreadTemplate(res)),
                catchError(error => {
                    this._notificationService.failureNotification(error);
                    return throwError(null);
                }));
    }

    update (templateId: number, threadTemplate: ThreadTemplate): Observable<ThreadTemplate> {
        return this._httpService.put(`sitecp/thread-templates/${templateId}`,
            { threadTemplate: threadTemplate })
            .pipe(map(res => new ThreadTemplate(res)),
                catchError(error => {
                    this._notificationService.failureNotification(error);
                    return throwError(null);
                }));
    }

    delete (templateId: number): Observable<void> {
        return this._httpService.delete(`sitecp/thread-templates/${templateId}`)
            .pipe(catchError(error => {
                this._notificationService.failureNotification(error);
                return throwError(null);
            }));
    }
}
