import { ForumPermissions } from '../../../../forum/forum.model';
import { CATEGORY_LIST_BREADCRUMB_ITEM, SITECP_BREADCRUMB_ITEM } from '../../../sitecp.constants';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { AuthService } from 'core/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionActions, PermissionGroup, PermissionsPage } from './permissions.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { TitleTab } from 'shared/app-views/title/title.model';

@Component({
    selector: 'app-sitecp-forum-category-permissions',
    templateUrl: 'permissions.component.html'
})
export class PermissionsComponent extends Page implements OnDestroy {
    private _permissionsPage: PermissionsPage = new PermissionsPage();
    private _selectableGroups: Array<PermissionGroup> = [];

    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Save', value: PermissionActions.SAVE}),
        new TitleTab({title: 'Save & Cascade', value: PermissionActions.SAVE_CASCADE}),
        new TitleTab({title: 'Back', value: PermissionActions.BACK})
    ];

    constructor (
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        private _authService: AuthService,
        private _router: Router,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Category Permissions',
            items: [
                SITECP_BREADCRUMB_ITEM,
                CATEGORY_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onTabClick (action: number): void {
        switch (action) {
            case PermissionActions.BACK:
                this._router.navigateByUrl('/sitecp/forum/categories/page/1');
                break;
            case PermissionActions.SAVE:
                this.save(false);
                break;
            case PermissionActions.SAVE_CASCADE:
                this.save(true);
                break;
        }
    }

    onGroupChange (groupId: number): void {
        this._router.navigateByUrl(`/sitecp/forum/categories/${this._permissionsPage.category.categoryId}/permissions/${groupId}`);
    }

    save (cascade: boolean): void {
        const url = `sitecp/categories/permissions/${this._permissionsPage.category.categoryId}`;
        const groups = this._permissionsPage.groups.filter(item => item.isChecked);
        groups.push(new PermissionGroup({groupId: this._permissionsPage.group.groupId}));

        this._httpService.put(url, {
            groups: groups,
            cascade: cascade,
            permissions: this._permissionsPage.group.forumPermissions,
            isAuthOnly: this._permissionsPage.isAuthOnly
        })
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Group Forum Permissions Updated!'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    get permissions (): ForumPermissions {
        return this._permissionsPage.group.forumPermissions || new ForumPermissions();
    }

    get title (): string {
        return this._permissionsPage ?
            `Forum Permissions for Category: ${this._permissionsPage.category.title}` : '';
    }

    get groups (): Array<PermissionGroup> {
        return this._selectableGroups;
    }

    get groupTitle (): string {
        return `Editing Group: ${this._permissionsPage.group.name} Forum Permissions`;
    }

    get leftHalf (): Array<PermissionGroup> {
        return this._permissionsPage.groups.slice(0, Math.ceil(this._permissionsPage.groups.length / 2));
    }

    get rightHalf (): Array<PermissionGroup> {
        return this._permissionsPage.groups.slice(Math.ceil(this._permissionsPage.groups.length / 2));
    }

    get model (): PermissionsPage {
        return this._permissionsPage;
    }

    private onPage (data: { data: PermissionsPage }): void {
        this._permissionsPage = new PermissionsPage(data.data);
        if (this._authService.sitecpPermissions.canManageForumPermissions && this._permissionsPage.group.groupId !== 0) {
            this._permissionsPage.groups.unshift(new PermissionGroup({name: 'Default', groupId: 0}));
        }

        this._selectableGroups = [].concat(this._permissionsPage.groups);
        this._selectableGroups.push(this._permissionsPage.group);
    }
}
