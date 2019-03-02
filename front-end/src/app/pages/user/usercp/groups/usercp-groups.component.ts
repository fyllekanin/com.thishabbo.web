import { DialogService } from 'core/services/dialog/dialog.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { USERCP_BREADCRUM_ITEM } from '../usercp.constants';
import { UserCpGroup, UserCpGroupsPage } from './usercp-groups.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { UsercpGroupsService } from '../services/usercp-groups.service';
import { TitleTab } from 'shared/app-views/title/title.model';

@Component({
    selector: 'app-usercp-groups',
    templateUrl: 'usercp-groups.component.html',
    styleUrls: ['usercp-groups.component.css']
})
export class UsercpGroupsComponent extends Page implements OnDestroy {
    private _data: UserCpGroupsPage;

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];

    constructor(
        private _globalNotificationService: GlobalNotificationService,
        private _dialogService: DialogService,
        private _service: UsercpGroupsService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Public Groups',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    updateDisplayGroup(): void {
        this._service.updateDisplayGroup(this._data.displayGroup);
    }

    apply(groupId: number): void {
        const group = this._data.groups.find(gr => gr.groupId === groupId);
        this._dialogService.openConfirmDialog(
            `Apply for group`,
            `Are you sure you wanna apply for ${group.name}?`,
            this.onApply.bind(this, groupId)
        );
    }

    leave(groupId: number): void {
        const group = this._data.groups.find(gr => gr.groupId === groupId);
        this._dialogService.openConfirmDialog(
            `Leave group`,
            `Are you sure you wanna leave ${group.name}?`,
            this.onLeave.bind(this, groupId)
        );
    }

    get nonMemberPublicGroups(): Array<UserCpGroup> {
        return this._data.groups.filter(group => !group.isMember)
            .filter(group => group.isPublic);
    }

    get memberGroups(): Array<UserCpGroup> {
        return this._data.groups.filter(group => group.isMember);
    }

    get displayGroupId(): number {
        return this._data.displayGroup ? this._data.displayGroup.groupId : 0;
    }

    set displayGroupId(groupId: number) {
        this._data.displayGroup = this._data.groups.find(group => group.groupId === Number(groupId));
    }

    private onApply(groupId: number): void {
        this._service.apply(groupId).subscribe(() => {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Success',
                message: 'You are applied!'
            }));
            this._dialogService.closeDialog();
            const group = this._data.groups.find(gr => gr.groupId === groupId);
            group.haveApplied = true;
        });
    }

    private onLeave(groupId: number): void {
        this._service.leave(groupId).subscribe(() => {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Success',
                message: 'You have left the group!'
            }));
            this._dialogService.closeDialog();
            const group = this._data.groups.find(gr => gr.groupId === groupId);
            group.isMember = false;
            this._data.displayGroup = this._data.displayGroup && this._data.displayGroup.groupId === groupId ?
                null : this._data.displayGroup;
        });
    }

    private onData(data: { data: UserCpGroupsPage }): void {
        this._data = data.data;
    }
}
