import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Prefix, PrefixActions } from '../prefix.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { PREFIX_LIST, SITECP_BREADCRUMB_ITEM } from '../../../../sitecp.constants';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { CategoryLeaf } from '../../category/category.model';

@Component({
    selector: 'app-sitecp-forum-prefix',
    templateUrl: 'prefix.component.html',
    styleUrls: [ 'prefix.component.css' ]
})
export class PrefixComponent extends Page implements OnDestroy {
    private _prefix: Prefix = new Prefix();
    private _categories: Array<CategoryLeaf> = [];

    tabs: Array<TitleTab> = [];

    constructor (
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        private _router: Router,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Prefix',
            items: [
                SITECP_BREADCRUMB_ITEM,
                PREFIX_LIST
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onTabClick (value: number): void {
        switch (value) {
            case PrefixActions.BACK:
                this._router.navigateByUrl('/sitecp/forum/prefixes/page/1');
                break;
            case PrefixActions.SAVE:
                if (this._prefix.createdAt) {
                    this._httpService.put(`sitecp/prefixes/${this._prefix.prefixId}`, { prefix: this._prefix })
                        .subscribe(res => {
                            this._notificationService.sendNotification(new NotificationMessage({
                                title: 'Success',
                                message: 'Prefix updated'
                            }));
                            this.onData({ data: new Prefix(res) });
                        }, this._notificationService.failureNotification.bind(this._notificationService));
                } else {
                    this._httpService.post('sitecp/prefixes', { prefix: this._prefix })
                        .subscribe(res => {
                            this._notificationService.sendNotification(new NotificationMessage({
                                title: 'Success',
                                message: 'Prefix created'
                            }));
                            this.onData({ data: new Prefix(res) });
                        }, this._notificationService.failureNotification.bind(this._notificationService));
                }
                break;
            case PrefixActions.DELETE:
                this._dialogService.confirm({
                    title: `Delete Prefix`,
                    content: `Are you sure that you want to delete the prefix?`,
                    callback: this.onDelete.bind(this)
                });
                break;
        }
    }

    toggle (categoryId: number): void {
        if (this.isSelected(categoryId)) {
            this._prefix.categoryIds = this._prefix.categoryIds.filter(id => id !== categoryId);
        } else {
            this._prefix.categoryIds.push(categoryId);
        }
    }

    isSelected (categoryId: number): boolean {
        return this._prefix.categoryIds.indexOf(categoryId) > -1;
    }

    get categories (): Array<CategoryLeaf> {
        return this._categories;
    }

    get title (): string {
        return this._prefix.createdAt ?
            `Editing Prefix: ${this._prefix.text}` :
            `Creating Prefix: ${this._prefix.text}`;
    }

    get prefix (): Prefix {
        return this._prefix;
    }

    get preview (): string {
        return `<span style="${this._prefix.style}">${this._prefix.text}</span>`;
    }

    private onDelete (): void {
        this._httpService.delete(`sitecp/prefixes/${this._prefix.prefixId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Prefix deleted'
                }));
                this._router.navigateByUrl('/sitecp/forum/prefixes/page/1');
                this._dialogService.closeDialog();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private onData (data: { data: Prefix }): void {
        this._prefix = data.data;
        const categories = [ new CategoryLeaf({ title: 'All', categoryId: -1 }) ];
        this._categories = categories.concat(ArrayHelper.flat(this._prefix.categories, '--'));

        const tabs = [
            { title: 'Save', value: PrefixActions.SAVE, condition: true },
            { title: 'Back', value: PrefixActions.BACK, condition: true },
            { title: 'Delete', value: PrefixActions.DELETE, condition: this._prefix.createdAt }
        ];

        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}
