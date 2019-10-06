import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { ThreadTemplate, ThreadTemplateActions, ThreadTemplateCategory } from '../thread-template.model';

@Component({
    selector: 'app-sitecp-forum-thread-template',
    templateUrl: 'thread-template.component.html',
    styleUrls: [ 'thread-template.component.css' ]
})
export class ThreadTemplateComponent extends Page implements OnDestroy {
    private _categories: Array<ThreadTemplateCategory> = [];

    threadTemplate = new ThreadTemplate();
    tabs: Array<TitleTab> = [];

    constructor (
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        private _router: Router,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onTabClick (value: number): void {
        switch (value) {
            case ThreadTemplateActions.BACK:
                this._router.navigateByUrl('/sitecp/forum/thread-templates');
                break;
            case ThreadTemplateActions.SAVE:
                if (this.threadTemplate.createdAt) {
                    this._httpService.put(`sitecp/thread-templates/${this.threadTemplate.threadTemplateId}`, { threadTemplate: this.threadTemplate })
                        .subscribe(res => {
                            this._notificationService.sendNotification(new NotificationMessage({
                                title: 'Success',
                                message: 'Thread template updated'
                            }));
                            this.onData({ data: new ThreadTemplate(res) });
                        }, this._notificationService.failureNotification.bind(this._notificationService));
                } else {
                    this._httpService.post('sitecp/thread-templates', { threadTemplate: this.threadTemplate })
                        .subscribe(res => {
                            this._notificationService.sendNotification(new NotificationMessage({
                                title: 'Success',
                                message: 'Thread template created'
                            }));
                            this.onData({ data: new ThreadTemplate(res) });
                        }, this._notificationService.failureNotification.bind(this._notificationService));
                }
                break;
            case ThreadTemplateActions.DELETE:
                this._dialogService.confirm({
                    title: `Delete Thread Template`,
                    content: `Are you sure that you want to delete the thread template?`,
                    callback: this.onDelete.bind(this)
                });
                break;
        }
    }

    toggle (categoryId: number): void {
        if (this.isSelected(categoryId)) {
            this.threadTemplate.categoryIds = this.threadTemplate.categoryIds.filter(id => id !== categoryId);
        } else {
            this.threadTemplate.categoryIds.push(categoryId);
        }
    }

    isSelected (categoryId: number): boolean {
        return this.threadTemplate.categoryIds.indexOf(categoryId) > -1;
    }

    get categories (): Array<ThreadTemplateCategory> {
        return this._categories;
    }

    get title (): string {
        return this.threadTemplate.createdAt ?
            `Editing Thread Template: ${this.threadTemplate.name}` :
            `Creating Thread Template: ${this.threadTemplate.name}`;
    }

    private onDelete (): void {
        this._httpService.delete(`sitecp/thread-templates/${this.threadTemplate.threadTemplateId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Thread template deleted'
                }));
                this._router.navigateByUrl('/sitecp/forum/thread-templates');
                this._dialogService.closeDialog();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private onData (data: { data: ThreadTemplate }): void {
        this.threadTemplate = data.data;
        const categories = [ new ThreadTemplateCategory({ title: 'All', categoryId: -1 }) ];
        this._categories = categories.concat(ArrayHelper.flat(this.threadTemplate.categories, '--'));

        const tabs = [
            { title: 'Save', value: ThreadTemplateActions.SAVE, condition: true },
            { title: 'Back', value: ThreadTemplateActions.BACK, condition: true },
            { title: 'Delete', value: ThreadTemplateActions.DELETE, condition: this.threadTemplate.createdAt }
        ];

        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}
