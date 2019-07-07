import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { HomePageThreadsAction, HomePageThreadsPage } from './home-page-threads.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, WEBSITE_SETTINGS_BREADCRUMB_ITEM } from '../../../sitecp.constants';
import { SelectItem } from 'shared/components/form/select/select.model';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { CategoryLeaf } from '../../forum/category/category.model';

@Component({
    selector: 'app-sitecp-website-settings-home-page-threads',
    templateUrl: 'home-page-threads.component.html'
})
export class HomePageThreadsComponent extends Page implements OnDestroy {
    private _data: HomePageThreadsPage;

    tableConfig: TableConfig;
    items: Array<SelectItem> = [];
    value: SelectItem = null;
    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Save', value: HomePageThreadsAction.SAVE}),
        new TitleTab({title: 'Add Item', value: HomePageThreadsAction.ADD}),
        new TitleTab({title: 'Back', link: '/sitecp/website-settings'})
    ];

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Home Page Threads',
            items: [
                SITECP_BREADCRUMB_ITEM,
                WEBSITE_SETTINGS_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onAction (action: number): void {
        switch (action) {
            case HomePageThreadsAction.SAVE:
                this.onSave();
                break;
            case HomePageThreadsAction.ADD:
                this.onAdd();
                break;
        }
    }

    onRemove (action: Action): void {
        const categoryId = Number(action.rowId);
        this._data.categoryIds = this._data.categoryIds.filter(id => id !== categoryId);
        this.setItems();
        this.createOrUpdateTable();
    }

    private onAdd (): void {
        this._data.categoryIds.push(this.value.value);
        this.value = null;
        this.setItems();
        this.createOrUpdateTable();
    }

    private onSave (): void {
        this._httpService.put('sitecp/content/home-page-threads', {data: this._data.categoryIds})
            .subscribe(() => {
                this._notificationService.sendInfoNotification('Categories set!');
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private onData (data: { data: HomePageThreadsPage }): void {
        this._data = data.data;
        this.setItems();
        this.createOrUpdateTable();
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Categories',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private setItems (): void {
        this._data.categories.sort(ArrayHelper.sortByPropertyAsc.bind(this, 'displayOrder'));
        const items = this.flat(this._data.categories, '');
        this.items = items.filter(item => this._data.categoryIds.indexOf(item.categoryId) === -1)
            .map(item => ({
                label: item.title,
                value: item.categoryId
            }));
    }

    private getTableRows (): Array<TableRow> {
        return this._data.categories.filter(category => this._data.categoryIds.indexOf(category.categoryId) > -1)
            .map(category => new TableRow({
                id: category.categoryId.toString(),
                cells: [
                    new TableCell({title: category.title})
                ],
                actions: [
                    new TableAction({title: 'Remove'})
                ]
            }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Category'})
        ];
    }

    private flat (array: Array<CategoryLeaf>, prefix = '', shouldAppend = true) {
        let result = [];
        array.sort(ArrayHelper.sortByPropertyAsc.bind(this, 'displayOrder'));
        array.forEach((item: CategoryLeaf) => {
            item.title = `${prefix} ${item.title}`;
            result.push(item);
            if (Array.isArray(item.children)) {
                result = result.concat(this.flat(item.children, shouldAppend ? `${prefix}--` : ''));
            }
        });
        return result;
    }
}
