import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import {
    PAGES_BREADCRUMB_ITEM,
    SITECP_BREADCRUMB_ITEM,
    WEBSITE_SETTINGS_BREADCRUMB_ITEM
} from '../../../../sitecp.constants';
import { PageActions, PageModel } from '../page.model';
import { EditorComponent } from 'shared/components/editor/editor.component';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-sitecp-website-settings-page',
    templateUrl: 'page.component.html'
})
export class PageComponent extends Page implements OnDestroy {
    private _data: PageModel = new PageModel();

    @ViewChild('editor', {static: true}) editor: EditorComponent;

    tabs: Array<TitleTab> = [];

    constructor (
        private _router: Router,
        private _httpService: HttpService,
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Page',
            items: [
                SITECP_BREADCRUMB_ITEM,
                WEBSITE_SETTINGS_BREADCRUMB_ITEM,
                PAGES_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onTabClick (action: number): void {
        switch (action) {
            case PageActions.BACK:
                this._router.navigateByUrl(PAGES_BREADCRUMB_ITEM.url);
                break;
            case PageActions.DELETE:
                this.onDelete();
                break;
            case PageActions.SAVE:
                this.onSave();
                break;
        }
    }

    onSave (): void {
        this._data.content = this.editor.getEditorValue();
        if (this._data.createdAt) {
            this._httpService.put(`sitecp/content/pages/${this._data.pageId}`, {data: this._data})
                .subscribe(() => {
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Success',
                        message: 'This page has been updated!'
                    }));
                });
        } else {
            this._httpService.post(`sitecp/content/pages`, {data: this._data})
                .subscribe(res => {
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Success',
                        message: 'This page has been saved!'
                    }));
                    this._data = new PageModel(res);
                    this.updateTabs();
                });
        }
    }

    get title (): string {
        return this._data.createdAt ? `Editing: ${this._data.title}` : `Creating: ${this._data.title}`;
    }

    get model (): PageModel {
        return this._data;
    }

    private onDelete (): void {
        this._dialogService.confirm({
            title: 'Delete Page',
            content: 'Are you sure you want to delete this page?',
            callback: () => {
                this._httpService.delete(`sitecp/content/pages/${this._data.pageId}`)
                    .subscribe(() => {
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'This page has been deleted!'
                        }));
                        this._router.navigateByUrl(PAGES_BREADCRUMB_ITEM.url);
                    }, this._notificationService.failureNotification.bind(this._notificationService));
            }
        });
    }

    private onData (data: { data: PageModel }): void {
        this._data = data.data;
        this.updateTabs();
    }

    private updateTabs (): void {
        const tabs = [
            {title: 'Save', value: PageActions.SAVE, condition: true},
            {title: 'Delete', value: PageActions.DELETE, condition: this._data.createdAt && !this._data.isSystem},
            {title: 'Back', value: PageActions.BACK, condition: true}
        ];
        this.tabs = tabs.filter(item => item.condition).map(item => new TitleTab(item));
    }
}
