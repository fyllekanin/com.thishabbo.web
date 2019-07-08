import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { BasicModel, BasicPage } from './basic.model';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { SITECP_BREADCRUMB_ITEM, USER_LIST_BREADCRUMB_ITEM } from '../../../sitecp.constants';
import { AuthService } from 'core/services/auth/auth.service';
import { UserService } from '../services/user.service';
import { UserCustomFields } from 'core/services/auth/auth.model';

@Component({
    selector: 'app-sitecp-users-user',
    templateUrl: 'basic.component.html'
})
export class BasicComponent extends Page implements OnDestroy {
    private _basicPage: BasicPage = new BasicPage();

    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Save'}),
        new TitleTab({title: 'Back', link: '/sitecp/users/page/1'})
    ];

    constructor (
        private _authService: AuthService,
        private _service: UserService,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Editing User',
            items: [
                SITECP_BREADCRUMB_ITEM,
                USER_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onSave (): void {
        this._service.save(this._basicPage);
    }

    get title (): string {
        return `Editing User ${this._basicPage.user.nickname}`;
    }

    get user (): BasicModel {
        return this._basicPage.user;
    }

    get customFields (): UserCustomFields {
        return this._basicPage.customFields;
    }

    get canDoBasic (): boolean {
        return this._authService.sitecpPermissions.canEditUserBasic;
    }

    get canDoAdvanced (): boolean {
        return this._authService.sitecpPermissions.canEditUserAdvanced;
    }

    private onPage (data: { data: BasicPage }): void {
        this._basicPage = data.data;
    }
}
