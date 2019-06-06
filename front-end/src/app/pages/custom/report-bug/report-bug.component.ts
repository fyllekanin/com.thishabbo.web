import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { ReportBugModel } from './report-bug.model';
import { AuthService } from 'core/services/auth/auth.service';
import { InfoBoxModel, INFO_BOX_TYPE } from 'shared/app-views/info-box/info-box.model';
import { HttpService } from 'core/services/http/http.service';

@Component({
    selector: 'app-custom-report-bug',
    templateUrl: 'report-bug.component.html'
})
export class ReportBugComponent extends Page implements OnDestroy {
    data = new ReportBugModel();
    notLoggedIn: InfoBoxModel = {
        type: INFO_BOX_TYPE.INFO,
        title: 'You need to be logged in',
        content: 'You need to be logged in to report a bug!'
    };
    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Report'})
    ];

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _authService: AuthService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Report A Bug'
        });
    }


    get isLoggedIn (): boolean {
        return this._authService.isLoggedIn();
    }

    ngOnDestroy () {
        super.destroy();
    }

    onReport (): void {
        this._httpService.post('form/bug', { data: this.data })
            .subscribe(() => {
                this._notificationService.sendInfoNotification('Bug reported!');
                this.data = new ReportBugModel();
            }, error => {
                this._notificationService.failureNotification(error);
            });
    }
}
