import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ThreadTemplate, ThreadTemplateActions } from '../thread-template.model';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, THREAD_TEMPLATES_LIST } from '../../../../sitecp.constants';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { CategoryLeaf } from '../../category/category.model';
import { EditorComponent } from 'shared/components/editor/editor.component';
import { ThreadTemplateService } from '../../services/thread-template.service';

@Component({
    selector: 'app-sitecp-forum-thread-template',
    templateUrl: 'thread-template.component.html',
    styleUrls: [ 'thread-template.component.css' ]
})
export class ThreadTemplateComponent extends Page implements OnDestroy {
    private _threadTemplate = new ThreadTemplate();
    private _categories: Array<CategoryLeaf> = [];

    @ViewChild(EditorComponent, { static: true }) editorComponent: EditorComponent;
    tabs: Array<TitleTab> = [];

    constructor (
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        private _router: Router,
        private _service: ThreadTemplateService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Thread Template',
            items: [
                SITECP_BREADCRUMB_ITEM,
                THREAD_TEMPLATES_LIST
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onTabClick (value: number): void {
        switch (value) {
            case ThreadTemplateActions.BACK:
                this._router.navigateByUrl('/sitecp/forum/thread-templates/page/1');
                break;
            case ThreadTemplateActions.SAVE:
                this._threadTemplate.content = this.editorComponent.getEditorValue();
                if (this._threadTemplate.createdAt) {
                    this._service.update(this._threadTemplate.threadTemplateId, this._threadTemplate)
                        .subscribe(template => {
                            this._notificationService.sendNotification(new NotificationMessage({
                                title: 'Success',
                                message: 'Thread Template updated'
                            }));
                            this.onData({ data: template });
                        });
                } else {
                    this._service.create(this._threadTemplate)
                        .subscribe(template => {
                            this._notificationService.sendNotification(new NotificationMessage({
                                title: 'Success',
                                message: 'Thread Template created'
                            }));
                            this.onData({ data: template });
                        });
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
            this._threadTemplate.categoryIds = this._threadTemplate.categoryIds.filter(id => id !== categoryId);
        } else {
            this._threadTemplate.categoryIds.push(categoryId);
        }
    }

    isSelected (categoryId: number): boolean {
        return this._threadTemplate.categoryIds.indexOf(categoryId) > -1;
    }

    get categories (): Array<CategoryLeaf> {
        return this._categories;
    }

    get title (): string {
        return this._threadTemplate.createdAt ?
            `Editing Thread Template: ${this._threadTemplate.name}` :
            `Creating Thread Template: ${this._threadTemplate.name}`;
    }

    get threadTemplate (): ThreadTemplate {
        return this._threadTemplate;
    }

    private onDelete (): void {
        this._service.delete(this._threadTemplate.threadTemplateId)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Thread Template deleted'
                }));
                this._router.navigateByUrl('/sitecp/forum/thread-templates');
                this._dialogService.closeDialog();
            });
    }

    private onData (data: { data: ThreadTemplate }): void {
        this._threadTemplate = data.data;
        const categories = [ new CategoryLeaf({ title: 'All', categoryId: -1 }) ];
        this._categories = categories.concat(ArrayHelper.flat(this._threadTemplate.categories, '--'));

        const tabs = [
            { title: 'Save', value: ThreadTemplateActions.SAVE, condition: true },
            { title: 'Back', value: ThreadTemplateActions.BACK, condition: true },
            { title: 'Delete', value: ThreadTemplateActions.DELETE, condition: this._threadTemplate.createdAt }
        ];

        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}
