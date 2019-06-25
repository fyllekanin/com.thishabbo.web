import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import {
    SITE_MESSAGES_BREADCRUMB_ITEM,
    SITECP_BREADCRUMB_ITEM,
    WEBSITE_SETTINGS_BREADCRUMB_ITEM
} from '../../../../sitecp.constants';
import { SiteMessageModel, SiteMessagesActions } from '../site-message.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { EditorComponent } from 'shared/components/editor/editor.component';

@Component({
    selector: 'app-sitecp-website-settings-site-message',
    templateUrl: 'site-message.component.html'
})
export class SiteMessageComponent extends Page implements OnDestroy {
    private _data: SiteMessageModel;

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
            current: 'Site Message',
            items: [
                SITECP_BREADCRUMB_ITEM,
                WEBSITE_SETTINGS_BREADCRUMB_ITEM,
                SITE_MESSAGES_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onTabClick (value: number): void {
        switch (value) {
            case SiteMessagesActions.SAVE:
                this.onSave();
                break;
            case SiteMessagesActions.DELETE:
                this.onDelete();
                break;
        }
    }

    onSave (): void {
        this._data.content = this.editor.getEditorValue();
        if (this._data.createdAt) {
            this._httpService.put(`sitecp/content/site-messages/${this._data.siteMessageId}`, {data: this._data})
                .subscribe(() => {
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Success',
                        message: 'Site message is updated'
                    }));
                }, this._notificationService.failureNotification.bind(this._notificationService));
        } else {
            this._httpService.post(`sitecp/content/site-messages`, {data: this._data})
                .subscribe(() => {
                    this._data.createdAt = new Date().getTime() / 1000;
                    this.setTabs();
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Success',
                        message: 'Site message is saved'
                    }));
                }, this._notificationService.failureNotification.bind(this._notificationService));
        }
    }

    get model (): SiteMessageModel {
        return this._data;
    }

    get title (): string {
        return this._data && this._data.createdAt ? `Editing: ${this._data.title}` : `Creating: ${this._data.title}`;
    }

    private onData (data: { data: SiteMessageModel }): void {
        this._data = data.data;
        this.setTabs();
    }

    private setTabs (): void {
        const tabs = [
            {title: 'Save', value: SiteMessagesActions.SAVE, condition: true},
            {title: 'Delete', value: SiteMessagesActions.DELETE, condition: this._data.createdAt},
            {title: 'Back', link: '/sitecp/website-settings/site-messages', condition: true}
        ];

        this.tabs = tabs.filter(item => item.condition).map(item => new TitleTab(item));
    }

    private onDelete (): void {
        this._dialogService.confirm({
            title: 'Are you sure?',
            content: 'Are you sure you wanna delete this site message?',
            callback: () => {
                this._httpService.delete(`sitecp/content/site-messages/${this._data.siteMessageId}`)
                    .subscribe(() => {
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'Site message is deleted'
                        }));
                        this._router.navigateByUrl('/sitecp/website-settings/site-messages');
                    });
            }
        });
    }
}
