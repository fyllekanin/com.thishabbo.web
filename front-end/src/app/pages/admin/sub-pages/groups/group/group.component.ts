import { Component, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminPermissions, StaffPermissions } from 'core/services/auth/auth.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Page } from 'shared/page/page.model';
import { GROUP_LIST_BREADCRUMB_ITEM, SITECP_BREADCRUMB_ITEM } from '../../../admin.constants';
import { Group, GroupActions, GroupOptions } from '../groups.model';
import { UserHelper } from 'shared/helpers/user.helper';

@Component({
    selector: 'app-groups-group',
    templateUrl: 'group.component.html'
})
export class GroupComponent extends Page implements OnDestroy {
    private _group: Group = new Group();

    tabs: Array<TitleTab> = [];

    constructor (
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        private _router: Router,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Editing Usergroup',
            items: [
                SITECP_BREADCRUMB_ITEM,
                GROUP_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    onTabClick (value: number): void {
        switch (value) {
            case GroupActions.SAVE:
                this.save();
                break;
            case GroupActions.DELETE:
                this.delete();
                break;
            case GroupActions.BACK:
                this.cancel();
                break;
        }
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    save (): void {
        if (this._group.createdAt) {
            this._httpService.put(`admin/groups/${this._group.groupId}`, {group: this._group})
                .subscribe(this.onSuccessUpdate.bind(this),
                    this._notificationService.failureNotification.bind(this._notificationService));
        } else {
            this._httpService.post('admin/groups', {group: this._group})
                .subscribe(this.onSuccessCreate.bind(this),
                    this._notificationService.failureNotification.bind(this._notificationService));
        }
    }

    delete (): void {
        this._dialogService.confirm({
            title: `Deleting group`,
            content: `Are you sure that you want to delete the group ${this._group.name}?`,
            callback: this.onDelete.bind(this)
        });
    }

    cancel (): void {
        this._router.navigateByUrl('/admin/groups/page/1');
    }

    onImmunityChange (): void {
        if (this._group.immunity > this._group.maxImmunity) {
            this._group.immunity = this._group.maxImmunity;
        } else if (this._group.immunity < 0 || isNaN(this._group.immunity)) {
            this._group.immunity = 0;
        }
    }

    get userBarStyle (): string {
        return this._group.userBarStyling;
    }

    get nicknameStyle (): string {
        return UserHelper.getNameColour([this._group.nameColour]);
    }

    get title (): string {
        return this._group.createdAt ?
            `Editing Group: ${this._group.name}` :
            `Creating Group: ${this._group.name}`;
    }

    get group (): Group {
        return this._group;
    }

    get adminPermissions (): AdminPermissions {
        return this._group.adminPermissions || new AdminPermissions();
    }

    get staffPermissions (): StaffPermissions {
        return this._group.staffPermissions || new StaffPermissions();
    }

    get options (): GroupOptions {
        return this._group.options || new GroupOptions();
    }

    private onDelete (): void {
        this._httpService.delete(`admin/groups/${this._group.groupId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Group deleted!'
                }));
                this._router.navigateByUrl('/admin/groups/page/1');
            }, this._notificationService.failureNotification.bind(this._notificationService), () => {
                this._dialogService.closeDialog();
            });
    }

    private onPage (data: { data: Group }): void {
        this._group = data.data;

        const tabs = [
            {title: 'Save', value: GroupActions.SAVE, condition: true},
            {title: 'Delete', value: GroupActions.DELETE, condition: this._group.createdAt},
            {title: 'Back', value: GroupActions.BACK, condition: true}
        ];

        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }

    private onSuccessUpdate (group: Group): void {
        this._group = new Group(group);
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'Group updated!'
        }));
    }

    private onSuccessCreate (group: Group): void {
        this.onPage({data: new Group(group)});
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'Group created!'
        }));
    }
}
