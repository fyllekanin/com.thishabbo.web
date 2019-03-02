import { ForumPermissions } from '../../../../forum/forum.model';
import { CATEGORY_LIST_BREADCRUMB_ITEM, SITECP_BREADCRUMB_ITEM } from '../../../admin.constants';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { HttpService } from 'core/services/http/http.service';
import { AuthService } from 'core/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionsPage, PermissionGroup } from './permissions.model';
import { OnDestroy, ElementRef, Component } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';

@Component({
    selector: 'app-admin-forum-category-permissions',
    templateUrl: 'permissions.component.html'
})
export class PermissionsComponent extends Page implements OnDestroy {
    private _permissionsPage: PermissionsPage = new PermissionsPage();
    private _selectableGroups: Array<PermissionGroup> = [];

    constructor(
        private _globalNotificationService: GlobalNotificationService,
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

    ngOnDestroy(): void {
        super.destroy();
    }

    onGroupChange(groupId: number): void {
        this._router.navigateByUrl(`/admin/forum/categories/${this._permissionsPage.category.categoryId}/permissions/${groupId}`);
    }

    cancel(): void {
        this._router.navigateByUrl('/admin/forum/categories/page/1');
    }

    save(cascade: boolean): void {
        const url = `admin/categories/permissions/${this._permissionsPage.category.categoryId}`;
        const groups = this._permissionsPage.groups.filter(item => item.isChecked);
        groups.push(new PermissionGroup({ groupId: this._permissionsPage.group.groupId }));

        this._httpService.put(url, { groups: groups, cascade: cascade, permissions: this._permissionsPage.group.forumPermissions })
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Group forum permissions updated!'
                }));
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    get permissions(): ForumPermissions {
        return this._permissionsPage.group.forumPermissions || new ForumPermissions();
    }

    get title(): string {
        return this._permissionsPage ?
            `Forum permissions for category: ${this._permissionsPage.category.title}` : '';
    }

    get group(): PermissionGroup {
        return this._permissionsPage.group;
    }

    get groups(): Array<PermissionGroup> {
        return this._selectableGroups;
    }

    get groupTitle(): string {
        return `Editing group: ${this._permissionsPage.group.name} forum permissions`;
    }

    get leftHalf(): Array<PermissionGroup> {
        return this._permissionsPage.groups.slice(0, Math.ceil(this._permissionsPage.groups.length / 2));
    }

    get rightHalf(): Array<PermissionGroup> {
        return this._permissionsPage.groups.slice(Math.ceil(this._permissionsPage.groups.length / 2));
    }

    get additionalGroupsTitle(): string {
        const selectedGroups = this._permissionsPage.groups.filter(item => item.isChecked);
        return `Additional groups to include in update (${selectedGroups.length} selected)`;
    }

    private onPage(data: { data: PermissionsPage }): void {
        this._permissionsPage = new PermissionsPage(data.data);
        if (this._authService.adminPermissions.canEditDefaultPermissions && this._permissionsPage.group.groupId !== 0) {
            this._permissionsPage.groups.unshift(new PermissionGroup({ name: 'Default', groupId: 0}));
        }

        this._selectableGroups = [].concat(this._permissionsPage.groups);
        this._selectableGroups.push(this._permissionsPage.group);
    }
}
