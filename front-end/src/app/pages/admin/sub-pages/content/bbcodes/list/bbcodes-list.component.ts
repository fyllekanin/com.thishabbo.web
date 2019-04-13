import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { BBcodeActions, BBcodeModel } from '../bbcode.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationModel } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, MANAGE_BBCODES_BREADCRUMB_ITEM } from '../../../../admin.constants';


@Component({
    selector: 'app-admin-content-bbcode-list',
    templateUrl: 'bbcodes-list.component.html'
})
export class BBcodesListComponent extends Page implements OnDestroy {
    private _bbcodes: Array<BBcodeModel> = [];

    customConfig: TableConfig;
    emojiConfig: TableConfig;
    systemConfig: TableConfig;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'New BBCode', link: '/admin/content/bbcodes/new'})
    ];

    constructor(
        private _router: Router,
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
        private _httpService: HttpService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: MANAGE_BBCODES_BREADCRUMB_ITEM.title,
            items: [SITECP_BREADCRUMB_ITEM]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onAction(action: Action): void {
        const bbcode = this._bbcodes.find(code => code.bbcodeId === Number(action.rowId));
        switch (action.value) {
            case BBcodeActions.EDIT_BBCODE:
                this._router.navigateByUrl(`/admin/content/bbcodes/${action.rowId}`);
                break;
            case BBcodeActions.DELETE_BBCODE:
                this._dialogService.openConfirmDialog(
                    `Delete BBcode`,
                    `Are you sure that you want to delete the bbcode ${bbcode.name}?`,
                    this.onDelete.bind(this, bbcode)
                );
                break;
        }
    }

    private onDelete(bbcode: BBcodeModel): void {
        this._httpService.delete(`admin/content/bbcodes/${bbcode.bbcodeId}`)
            .subscribe(() => {
                this._bbcodes = this._bbcodes.filter(code => code.bbcodeId !== bbcode.bbcodeId);
                this.createOrUpdateCustomTable();
                this._notificationService.sendNotification(new NotificationModel({
                    title: 'Success',
                    message: 'BBCode Deleted!'
                }));
                this._dialogService.closeDialog();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private onData(data: { data: Array<BBcodeModel> }): void {
        this._bbcodes = data.data;
        this.createOrUpdateCustomTable();
        this.createOrUpdateEmojiTable();
        this.createOrUpdateSystemTable();
    }

    private createOrUpdateSystemTable(): void {
        if (this.systemConfig) {
            this.systemConfig.rows = this.getTableRows(this._bbcodes.filter(item => item.isSystem), false);
            return;
        }
        this.systemConfig = new TableConfig({
            title: 'System Defined BBCodes',
            headers: this.getTableHeaders(),
            rows: this.getTableRows(this._bbcodes.filter(item => item.isSystem), false)
        });
    }

    private createOrUpdateEmojiTable(): void {
        const selector = item => !item.isSystem && item.isEmoji;
        if (this.emojiConfig) {
            this.emojiConfig.rows = this.getEmojiTableRows(this._bbcodes.filter(selector));
            return;
        }
        this.emojiConfig = new TableConfig({
            title: 'Manage Emojis',
            headers: this.getEmojiTableHeaders(),
            rows: this.getEmojiTableRows(this._bbcodes.filter(selector))
        });
    }

    private createOrUpdateCustomTable(): void {
        const selector = item => !item.isSystem && !item.isEmoji;
        if (this.customConfig) {
            this.customConfig.rows = this.getTableRows(this._bbcodes.filter(selector), true);
            return;
        }
        this.customConfig = new TableConfig({
            title: 'Manage Custom BBCodes',
            headers: this.getTableHeaders(),
            rows: this.getTableRows(this._bbcodes.filter(selector), true)
        });
    }

    private getEmojiTableRows(list: Array<BBcodeModel>): Array<TableRow> {
        const actions = [
            new TableAction({ title: 'Edit BBCode', value: BBcodeActions.EDIT_BBCODE }),
            new TableAction({ title: 'Delete BBCode', value: BBcodeActions.DELETE_BBCODE })
        ];
        return list.map(bbcode => {
            return new TableRow({
                id: String(bbcode.bbcodeId),
                cells: [
                    new TableCell({ title: bbcode.pattern }),
                    new TableCell({ title: `<img src="/rest/resources/images/emojis/${bbcode.bbcodeId}.gif" />`, innerHTML: true })
                ],
                actions: actions
            });
        });
    }

    private getTableRows(list: Array<BBcodeModel>, haveActions: boolean): Array<TableRow> {
        const actions = haveActions ? [
            new TableAction({ title: 'Edit BBCode', value: BBcodeActions.EDIT_BBCODE }),
            new TableAction({ title: 'Delete BBCode', value: BBcodeActions.DELETE_BBCODE })
        ] : [];
        return list.map(bbcode => {
            return new TableRow({
                id: String(bbcode.bbcodeId),
                cells: [
                    new TableCell({ title: bbcode.name }),
                    new TableCell({ title: bbcode.example })
                ],
                actions: actions
            });
        });
    }

    private getEmojiTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Selector' }),
            new TableHeader({ title: 'Image' })
        ];
    }


    private getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Name' }),
            new TableHeader({ title: 'Example' })
        ];
    }
}

