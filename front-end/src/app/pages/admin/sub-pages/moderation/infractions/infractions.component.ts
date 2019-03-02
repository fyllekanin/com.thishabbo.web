import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import {
    Action,
    FilterConfig,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from '../../../admin.constants';
import { InfractionsPage, InfractionsPageActions } from './infractions.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { QueryParameters } from 'core/services/http/http.model';
import { HttpService } from 'core/services/http/http.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-admin-moderation-infractions',
    templateUrl: 'infractions.component.html'
})
export class InfractionsComponent extends Page implements OnDestroy {
    private _page: InfractionsPage;
    private _filterTimer = null;
    private _filter: QueryParameters;
    private _detailsAction = new TableAction({ title: 'Details', value: InfractionsPageActions.DETAILS });
    private _reverseAction = new TableAction({ title: 'Reverse', value: InfractionsPageActions.REVERSE });

    tableConfig: TableConfig;
    pagination: PaginationModel;

    constructor(
        private _globalNotificationService: GlobalNotificationService,
        private _dialogService: DialogService,
        private _httpService: HttpService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Infractions',
            items: [
                SITECP_BREADCRUMB_ITEM
            ]
        });
    }

    onAction(action: Action): void {
        switch (action.value) {
            case InfractionsPageActions.DETAILS:
                this.showDetails(Number(action.rowId));
                break;
            case InfractionsPageActions.REVERSE:
                this.reverse(Number(action.rowId));
                break;
        }
    }

    onFilter(filter: QueryParameters): void {
        clearTimeout(this._filterTimer);

        this._filterTimer = setTimeout(() => {
            this._httpService.get(`admin/moderation/infractions/page/1`, filter)
                .subscribe(res => {
                    this._filter = filter;
                    this.onPage({ data: new InfractionsPage(res) });
                });
        }, 200);
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    private onPage(data: { data: InfractionsPage }): void {
        this._page = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            page: this._page.page,
            total: this._page.total,
            url: '/admin/moderation/infractions/page/:page',
            params: this._filter
        });
    }

    private createOrUpdateTable(): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Infractions',
            headers: InfractionsComponent.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [new FilterConfig({
                title: 'Search by user',
                placeholder: 'Nickname..',
                key: 'filter'
            })]
        });
    }

    private getTableRows(): Array<TableRow> {
        return this._page.items.map(item => new TableRow({
            id: String(item.infractionId),
            cells: [
                new TableCell({ title: item.user.nickname }),
                new TableCell({ title: TimeHelper.getLongDateWithTime(item.createdAt) }),
                new TableCell({ title: item.by.nickname }),
                new TableCell({ title: item.isDeleted ? 'Yes' : 'No' })
            ],
            actions: item.isDeleted ? [this._detailsAction] : [this._detailsAction, this._reverseAction]
        }));
    }

    private static getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'User' }),
            new TableHeader({ title: 'At' }),
            new TableHeader({ title: 'By' }),
            new TableHeader({ title: 'Is Reversed' })
        ];
    }

    private reverse(infractionId: number): void {
        this._dialogService.openConfirmDialog(
            'Are you sure?',
            'Are you sure you wanna reverse this infraction?',
            () => {
                this._httpService.delete(`admin/moderation/infraction/${infractionId}`)
                    .subscribe(() => {
                        const infraction = this._page.items.find(item => item.infractionId === infractionId);
                        infraction.isDeleted = true;
                        this.createOrUpdateTable();

                        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                            title: 'Success',
                            message: 'Infraction reversed'
                        }));
                        this._dialogService.closeDialog();
                    }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
            }
        );
    }

    private showDetails(infractionId: number): void {
        const infraction = this._page.items.find(item => item.infractionId === infractionId);
        this._dialogService.openDialog({
            title: `Infraction ${infraction.user.nickname} - ${TimeHelper.getLongDateWithTime(infraction.createdAt)}`,
            content: `<strong>Title:</strong><br />
                ${infraction.title}
                <br />
                <br />
                <strong>Reason:</strong><br />
                ${infraction.reason}
                <br />
                <br />
                <strong>By:</strong><br />
                ${infraction.user.nickname}
                <br />
                <br />
                <strong>Is Revered:</strong><br/>
                ${infraction.isDeleted ? 'Yes' : 'No'}
                `,
            buttons: [
                new DialogCloseButton('Close')
            ]
        });
    }
}
