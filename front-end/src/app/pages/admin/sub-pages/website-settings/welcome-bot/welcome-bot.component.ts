import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { WelcomeBotModel, WelcomeBotUser, WelcomeBotCategory } from './welcome-bot.model';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { TitleTab } from 'shared/app-views/title/title.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { EditorComponent } from 'shared/components/editor/editor.component';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, WEBSITE_SETTINGS_BREADCRUMB_ITEM } from '../../../admin.constants';

@Component({
    selector: 'app-admin-content-welcome-bot',
    templateUrl: 'welcome-bot.component.html'
})
export class WelcomeBotComponent extends Page implements OnDestroy {
    private _welcomeBot: WelcomeBotModel = new WelcomeBotModel();

    @ViewChild('editor', { static: true }) editor: EditorComponent;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];

    constructor(
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Manage Welcome Bot',
            items: [
                SITECP_BREADCRUMB_ITEM,
                WEBSITE_SETTINGS_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onSave(): void {
        this._welcomeBot.content = this.editor.getEditorValue();
        if (this.haveErrors()) {
            this.notifyErrors();
            return;
        }
        this._welcomeBot.user = this.findUserWithName();
        this._httpService.put('admin/content/welcome-bot', this._welcomeBot)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Welcome Bot settings updated!'
                }));
            });
    }

    get user(): WelcomeBotUser {
        return this._welcomeBot.user;
    }

    get categories(): Array<WelcomeBotCategory> {
        return this._welcomeBot.categories;
    }

    get category(): WelcomeBotCategory {
        return this._welcomeBot.category;
    }

    get content(): string {
        return this._welcomeBot.content;
    }

    private findUserWithName(): WelcomeBotUser {
        return this._welcomeBot.users.find(user => {
            const selectednickname = this._welcomeBot.user && this._welcomeBot.user.nickname ?
                this._welcomeBot.user.nickname.toLowerCase() : '';
            return user.nickname.toLowerCase() === selectednickname;
        });
    }

    private onData(data: { data: WelcomeBotModel }): void {
        this._welcomeBot = data.data;
    }

    private haveErrors(): boolean {
        return this.userIsNotCorrect() || this._welcomeBot.content.length === 0 || this.categoryIsNotCorrect();
    }

    private userIsNotCorrect(): boolean {
        return !Boolean(this.findUserWithName());
    }

    private categoryIsNotCorrect(): boolean {
        return this._welcomeBot.categories.findIndex(category => {
            return Number(category.categoryId) === Number(this._welcomeBot.category.categoryId);
        }) === -1;
    }

    private notifyErrors(): void {
        const notification = new NotificationMessage({ title: 'Error', message: '' });
        if (this.userIsNotCorrect()) {
            notification.message = 'User do not exist';
        }
        if (this.categoryIsNotCorrect()) {
            notification.message = 'Category do not exist';
        }
        if (this._welcomeBot.content.length === 0) {
            notification.message = 'Content can not be empty';
        }
        this._notificationService.sendNotification(notification);
    }
}
