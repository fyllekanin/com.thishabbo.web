import { DialogService } from 'core/services/dialog/dialog.service';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { HttpService } from 'core/services/http/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Prefix, PrefixActions, PrefixCategory } from '../prefix.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-admin-forum-prefix',
    templateUrl: 'prefix.component.html',
    styleUrls: ['prefix.component.css']
})
export class PrefixComponent extends Page implements OnDestroy {
    private _prefix: Prefix = new Prefix();
    private _categories: Array<PrefixCategory> = [];

    tabs: Array<TitleTab> = [];

    constructor(
        private _dialogService: DialogService,
        private _globalNotificationService: GlobalNotificationService,
        private _httpService: HttpService,
        private _router: Router,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onTabClick(value: number): void {
        switch (value) {
            case PrefixActions.CANCEL:
                this._router.navigateByUrl('/admin/forum/prefixes');
                break;
            case PrefixActions.SAVE:
                if (this._prefix.createdAt) {
                    this._httpService.put(`admin/prefixes/${this._prefix.prefixId}`, { prefix: this._prefix })
                        .subscribe(res => {
                            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                                title: 'Success',
                                message: 'Prefix updated'
                            }));
                            this.onData({ data: new Prefix(res) });
                        }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
                } else {
                    this._httpService.post('admin/prefixes', { prefix: this._prefix })
                        .subscribe(res => {
                            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                                title: 'Success',
                                message: 'Prefix created'
                            }));
                            this.onData({ data: new Prefix(res) });
                        }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
                    }
                break;
            case PrefixActions.DELETE:
                this._dialogService.openConfirmDialog(
                    `Delete Prefix`,
                    `Are you sure that you want to delete the prefix?`,
                    this.onDelete.bind(this)
                );
                break;
        }
    }

    toggle(categoryId: number): void {
        if (this.isSelected(categoryId)) {
            this._prefix.categoryIds = this._prefix.categoryIds.filter(id => id !== categoryId);
        } else {
            this._prefix.categoryIds.push(categoryId);
        }
    }

    isSelected(categoryId: number): boolean {
        return this._prefix.categoryIds.indexOf(categoryId) > -1;
    }

    get categories(): Array<PrefixCategory> {
        return this._categories;
    }

    get title(): string {
        return this._prefix.createdAt ?
            `Editing Prefix: ${this._prefix.text}` :
            `Creating Prefix: ${this._prefix.text}`;
    }

    get prefix(): Prefix {
        return this._prefix;
    }

    get preview(): string {
        return `<span style="${this._prefix.style}">${this._prefix.text}</span>`;
    }

    private onDelete(): void {
        this._httpService.delete(`admin/prefixes/${this._prefix.prefixId}`)
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Prefix deleted'
                }));
                this._router.navigateByUrl('/admin/forum/prefixes');
                this._dialogService.closeDialog();
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private flat(array: Array<PrefixCategory>, prefix: string = '', shouldAppend: boolean = true) {
        let result = [];
        array.forEach((item: PrefixCategory) => {
            item.title = `${prefix} ${item.title}`;
            result.push(item);
            if (Array.isArray(item.children)) {
                result = result.concat(this.flat(item.children, shouldAppend ? `${prefix}--` : ''));
            }
        });
        return result;
    }

    private onData(data: { data: Prefix }): void {
        this._prefix = data.data;
        const categories = [new PrefixCategory({ title: 'All', categoryId: -1 })];
        this._categories = categories.concat(this.flat(this._prefix.categories, '--'));

        const tabs = [
            { title: 'Save', value: PrefixActions.SAVE, condition: true },
            { title: 'Delete', value: PrefixActions.DELETE, condition: this._prefix.createdAt },
            { title: 'Cancel', value: PrefixActions.CANCEL, condition: true }
        ];

        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}
