import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ThemeModel } from './theme.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { NotificationModel } from 'shared/app-views/global-notification/global-notification.model';
import { ThemeHelper } from 'shared/helpers/theme.helper';

@Component({
    selector: 'app-user-account-theme',
    templateUrl: 'theme.component.html'
})
export class ThemeComponent extends Page implements OnDestroy {
    private _data: Array<ThemeModel> = [];

    themeId: number;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save Selection' })
    ];

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Theme',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onSave(): void {
        this._httpService.put('usercp/themes', { themeId: this.themeId })
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationModel({

                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    applyTheme(): void {
        const theme = this._data.find(item => item.themeId === Number(this.themeId));
        ThemeHelper.applyTheme(theme ? theme.minified : '');
    }

    get themes(): Array<ThemeModel> {
        return this._data;
    }

    private onData(data: { data: Array<ThemeModel> }): void {
        this._data = data.data;

        const selectedTheme = this._data.find(item => item.isSelected);
        this.themeId = selectedTheme ? selectedTheme.themeId : 0;
    }
}
