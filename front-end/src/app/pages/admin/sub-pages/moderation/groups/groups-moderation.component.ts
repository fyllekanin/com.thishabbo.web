import { DialogService } from 'core/services/dialog/dialog.service';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { HttpService } from 'core/services/http/http.service';
import { Action, TableCell, TableConfig, TableHeader, TableRow } from 'shared/components/table/table.model';
import { ActivatedRoute } from '@angular/router';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { GroupModerate, GroupModerationActions } from './groups-moderation.model';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from '../../../admin.constants';

@Component({
    selector: 'app-admin-moderation-groups',
    templateUrl: 'groups-moderation.component.html'
})
export class GroupsModerationComponent extends Page implements OnDestroy {
    private _groups: Array<GroupModerate> = [];

    tableConfig: TableConfig;

    constructor(
        private _dialogService: DialogService,
        private _globalNotificationService: GlobalNotificationService,
        private _httpService: HttpService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Moderate Groups',
            items: [
                SITECP_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onAction(action: Action): void {
        const groupRequest = this._groups.find(group => group.groupRequestId === Number(action.rowId));
        switch (action.value) {
            case GroupModerationActions.APPROVE_REQUEST:
                this._dialogService.openDialog({
                    title: 'Approve group request',
                    content: `You sure you wanna approve ${groupRequest.nickname} to join ${groupRequest.name}?`,
                    buttons: [
                        new DialogCloseButton('Close'),
                        new DialogButton({ title: 'Yes', callback: this.onApprove.bind(this, action.rowId) })
                    ]
                });
                break;
            case GroupModerationActions.DENY_REQUEST:
                this._dialogService.openDialog({
                    title: 'Deny group request',
                    content: `You sure you wanna deny ${groupRequest.nickname} to join ${groupRequest.name}?`,
                    buttons: [
                        new DialogCloseButton('Close'),
                        new DialogButton({ title: 'Yes', callback: this.onDeny.bind(this, action.rowId) })
                    ]
                });
                break;
        }
    }

    private onApprove(groupRequestId: number): void {
        this._httpService.post('admin/moderation/groups/approve', { groupRequestId: groupRequestId })
            .subscribe(() => {
                this._groups = this._groups.filter(group => group.groupRequestId === groupRequestId);
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Group request approved'
                }));
                this._dialogService.closeDialog();
                this.createOrUpdateTable();
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private onDeny(groupRequestId: number): void {
        this._httpService.delete(`admin/moderation/groups/deny/${groupRequestId}`)
            .subscribe(() => {
                this._groups = this._groups.filter(group => group.groupRequestId === groupRequestId);
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Group request denied'
                }));
                this._dialogService.closeDialog();
                this.createOrUpdateTable();
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private onData(data: { data: Array<GroupModerate> }): void {
        this._groups = data.data;
        this.createOrUpdateTable();
    }

    private createOrUpdateTable(): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Moderate Groups',
            headers: GroupsModerationComponent.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows(): Array<TableRow> {
        const actions = [
            { title: 'Approve', value: GroupModerationActions.APPROVE_REQUEST },
            { title: 'Deny', value: GroupModerationActions.DENY_REQUEST }
        ];
        return this._groups.map(group => {
            return new TableRow({
                id: String(group.groupRequestId),
                cells: [
                    new TableCell({ title: group.nickname }),
                    new TableCell({ title: group.name }),
                    new TableCell({ title: this.timeAgo(group.createdAt) })
                ],
                actions: actions
            });
        });
    }

    private static getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'User' }),
            new TableHeader({ title: 'Usergroup' }),
            new TableHeader({ title: 'Time ago' })
        ];
    }
}
