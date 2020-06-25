import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { BotCategory, BotSettingsModel, BotUser } from './bot-settings.model';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { TitleTab } from 'shared/app-views/title/title.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { EditorComponent } from 'shared/components/editor/editor.component';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, WEBSITE_SETTINGS_BREADCRUMB_ITEM } from '../../../sitecp.constants';

@Component({
    selector: 'app-sitecp-content-bot-settings',
    templateUrl: 'bot-settings.component.html'
})
export class BotSettingsComponent extends Page implements OnDestroy {
    private _botSettings: BotSettingsModel = new BotSettingsModel();

    @ViewChild('welcomeEditor', { static: true }) welcomeEditor: EditorComponent;
    @ViewChild('multipleAccountsEditor', { static: true }) multipleAccountsEditor: EditorComponent;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' }),
        new TitleTab({ title: 'Back', link: '/sitecp/website-settings' })
    ];

    constructor (
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Manage Bot Settings',
            items: [
                SITECP_BREADCRUMB_ITEM,
                WEBSITE_SETTINGS_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onSave (): void {
        this._botSettings.welcomeContent = this.welcomeEditor.getEditorValue();
        this._botSettings.multipleAccountsContent = this.multipleAccountsEditor.getEditorValue();
        this._botSettings.user = this.findUserWithName();
        this._httpService.put('sitecp/content/bot-settings', this._botSettings)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Bot settings updated!'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    get user (): BotUser {
        return this._botSettings.user;
    }

    get categories (): Array<BotCategory> {
        return this._botSettings.categories;
    }

    get welcomeCategory (): BotCategory {
        return this._botSettings.welcomeCategory || new BotCategory();
    }

    get multipleAccountsCategory (): BotCategory {
        return this._botSettings.multipleAccountsCategory || new BotCategory();
    }

    get welcomeContent (): string {
        return this._botSettings.welcomeContent;
    }

    get multipleAccountsContent (): string {
        return this._botSettings.multipleAccountsContent;
    }

    private findUserWithName (): BotUser {
        return this._botSettings.users.find(user => {
            const selectedNickname = this._botSettings.user && this._botSettings.user.nickname ?
                this._botSettings.user.nickname.toLowerCase() : '';
            return user.nickname.toLowerCase() === selectedNickname;
        });
    }

    private onData (data: { data: BotSettingsModel }): void {
        this._botSettings = data.data;
    }
}
