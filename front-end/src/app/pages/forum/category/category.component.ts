import { DialogService } from 'core/services/dialog/dialog.service';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { TitleTab, TitleTopBorder } from 'shared/app-views/title/title.model';
import { FixedToolItem, FixedTools } from 'shared/components/fixed-tools/fixed-tools.model';
import { ThreadActions } from '../thread/thread.model';
import { Breadcrumb, BreadcrumbItem } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CATEGORY_SORT_BY, CategoryActions, CategoryDisplayOptions, CategoryPage, SORT_ORDER } from './category.model';
import { Component, ComponentFactoryResolver, ElementRef, OnDestroy } from '@angular/core';
import { FORUM_BREADCRUM_ITEM } from '../forum.constants';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { AuthService } from 'core/services/auth/auth.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { MoveThreadComponent } from '../thread/move-thread/move-thread.component';
import { ChangeOwnerComponent } from '../thread/change-owner/change-owner.component';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { Button } from 'shared/directives/button/button.model';

@Component({
    selector: 'app-forum-category',
    templateUrl: 'category.component.html'
})
export class CategoryComponent extends Page implements OnDestroy {
    categoryPage = new CategoryPage();
    isToolsVisible = false;
    isStickiesVisible = true;

    fixedTools: FixedTools;
    pagination: PaginationModel;
    tabs: Array<TitleTab> = [];
    toggleStickies: Array<TitleTab> = [ new TitleTab({ title: 'Toggle' }) ];
    stickyHeader = TitleTopBorder.RED;

    constructor (
        private _dialogService: DialogService,
        private _authService: AuthService,
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _breadcrumbService: BreadcrumbService,
        private _componentFactory: ComponentFactoryResolver,
        elementRef: ElementRef
    ) {
        super(elementRef);
        this.addSubscription(this._activatedRoute.data, this.onData.bind(this));
        this.isToolsVisible = Boolean(localStorage.getItem(LOCAL_STORAGE.FORUM_TOOLS));
        this.isStickiesVisible = this.isStickiesContracted();
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onToggleStickies (): void {
        if (this.isStickiesVisible) {
            this.onUnContractStickies();
        } else {
            this.onContractStickies();
        }
        this.isStickiesVisible = !this.isStickiesVisible;
    }

    onSort (options: CategoryDisplayOptions): void {
        this._router.navigateByUrl(`/forum/category/${this.categoryPage.categoryId}/page/1${this.getQueryParams(options)}`);
    }

    onTabClick (value: number): void {
        switch (value) {
            case CategoryActions.SUBSCRIBE:
                this._httpService.post(`forum/category/${this.categoryPage.categoryId}/subscribe`, {})
                    .subscribe(() => {
                        this.categoryPage.isSubscribed = true;
                        this.setTabs();
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'You are now subscribed!'
                        }));
                    }, this._notificationService.failureNotification.bind(this._notificationService));
                break;
            case CategoryActions.UNSUBSCRIBE:
                this._httpService.delete(`forum/category/${this.categoryPage.categoryId}/unsubscribe`)
                    .subscribe(() => {
                        this.categoryPage.isSubscribed = false;
                        this.setTabs();
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'You are now unsubscribed!'
                        }));
                    }, this._notificationService.failureNotification.bind(this._notificationService));
                break;
            case CategoryActions.IGNORE:
                this.onIgnoreCategory();
                break;
            case CategoryActions.UNIGNORE:
                this._httpService.delete(`forum/category/${this.categoryPage.categoryId}/ignore`)
                    .subscribe(() => {
                        this.categoryPage.isIgnored = false;
                        this.setTabs();
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'You unignored the Category!'
                        }));
                    }, this._notificationService.failureNotification.bind(this._notificationService));
                break;
            case CategoryActions.TOGGLE_TOOLS:
                this.isToolsVisible = !this.isToolsVisible;
                this.buildModerationTools();
                break;
        }
    }

    onAction (action: number): void {
        const selectedIds = this.categoryPage.getSelectedThreadIds();
        switch (action) {
            case ThreadActions.MOVE_THREAD:
                this.onMoveThread();
                break;
            case ThreadActions.CHANGE_THREAD_OWNER:
                this.onChangeOwner();
                break;
            case ThreadActions.SELECT_ALL:
                this.categoryPage.getAllThreads()
                    .forEach(thread => thread.isSelected = true);
                break;
            case ThreadActions.STICKY_THREAD:
                this._httpService.put(`forum/moderation/threads/sticky`, { ids: selectedIds })
                    .subscribe(() => {
                        this.unSelectAllThreads();
                        this._router.navigateByUrl(`/forum/category/${this.categoryPage.categoryId}/page/1`);
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'Threads are stickied!'
                        }));
                    }, this._notificationService.failureNotification.bind(this._notificationService));
                break;
            case ThreadActions.UNSTICKY_THREAD:
                this._httpService.put(`forum/moderation/threads/unsticky`, { ids: selectedIds })
                    .subscribe(() => {
                        this.unSelectAllThreads();
                        this._router.navigateByUrl(`/forum/category/${this.categoryPage.categoryId}/page/1`);
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'Threads are unstickied!'
                        }));
                    }, this._notificationService.failureNotification.bind(this._notificationService));
                break;
        }
    }

    onCheckChanged (threadId: number) {
        const thread = this.categoryPage.getAllThreads().find(item => item.threadId === threadId);
        thread.isSelected = !thread.isSelected;

        if (this.getSelectedThreadIds().length > 0) {
            this.isToolsVisible = true;
            if (!this.fixedTools) {
                this.buildModerationTools();
            }
        } else {
            this.isToolsVisible = false;
            this.fixedTools = null;
        }
    }

    private getQueryParams (options: CategoryDisplayOptions): string {
        if (options.sortOrder === SORT_ORDER.DESC &&
            options.sortedBy === CATEGORY_SORT_BY.LAST_POST_TIME &&
            options.fromThe === 'BEGINNING') {
            return '';
        }

        const sortedBy = `sortedBy=${CATEGORY_SORT_BY[options.sortedBy]}`;
        const sortOrder = `sortOrder=${SORT_ORDER[options.sortOrder]}`;
        const fromThe = `fromThe=${options.fromThe}`;
        return `?${sortedBy}&${sortOrder}&${fromThe}`;
    }

    private onData (data: { data: CategoryPage }): void {
        this.categoryPage = data.data;
        this.setPagination();
        this.setTabs();
        this.setBreadcrumb();
        this.buildModerationTools();
    }

    private setTabs (): void {
        if (!this._authService.isLoggedIn()) {
            return;
        }

        const actions = [
            {
                title: 'Create Thread', link: `/forum/category/${this.categoryPage.categoryId}/thread/new`,
                condition: this.categoryPage.forumPermissions.canCreateThreads && this.categoryPage.isOpen
            },
            { title: 'Subscribe', value: CategoryActions.SUBSCRIBE, condition: !this.categoryPage.isSubscribed },
            { title: 'Unsubscribe', value: CategoryActions.UNSUBSCRIBE, condition: this.categoryPage.isSubscribed },
            { title: 'Ignore', value: CategoryActions.IGNORE, condition: !this.categoryPage.isIgnored },
            { title: 'Unignore', value: CategoryActions.UNIGNORE, condition: this.categoryPage.isIgnored }
        ];

        actions.push({
            title: 'Toggle Tools',
            value: CategoryActions.TOGGLE_TOOLS,
            condition: this.getCategoryTools().filter(item => item.condition).length > 0
        });

        this.tabs = actions.filter(item => item.condition)
            .map(item => new TitleTab(item));
    }

    private getCategoryTools (): Array<{ title: string, value: number, condition: boolean }> {
        return [
            {
                title: 'Select All',
                value: ThreadActions.SELECT_ALL,
                condition: true
            },
            {
                title: 'Move Thread(s)', value: ThreadActions.MOVE_THREAD,
                condition: this.categoryPage.forumPermissions.canMoveThreads
            },
            {
                title: 'Change Owner', value: ThreadActions.CHANGE_THREAD_OWNER,
                condition: this.categoryPage.forumPermissions.canChangeOwner
            },
            {
                title: 'Sticky Threads', value: ThreadActions.STICKY_THREAD,
                condition: this.categoryPage.forumPermissions.canStickyThread
            }
            ,
            {
                title: 'Unsticky Threads', value: ThreadActions.UNSTICKY_THREAD,
                condition: this.categoryPage.forumPermissions.canStickyThread
            }
        ];
    }

    private setBreadcrumb (): void {
        this.categoryPage.parents.sort(ArrayHelper.sortByPropertyDesc.bind(this, 'displayOrder'));
        this._breadcrumbService.breadcrumb = new Breadcrumb({
            current: this.categoryPage.title,
            items: [ FORUM_BREADCRUM_ITEM ].concat(this.categoryPage.parents.map(parent => new BreadcrumbItem({
                title: parent.title,
                url: `/forum/category/${parent.categoryId}/page/1`
            })))
        });
    }

    private setPagination (): void {
        this.pagination = new PaginationModel({
            total: this.categoryPage.total,
            page: this.categoryPage.page,
            url: `/forum/category/${this.categoryPage.categoryId}/page/:page${this.getQueryParams(this.categoryPage.displayOptions)}`
        });
    }

    private buildModerationTools (): void {
        if (!this.isToolsVisible) {
            this.fixedTools = null;
            return;
        }

        this.fixedTools = new FixedTools({
            items: [
                new FixedToolItem({
                    title: 'Category Tools',
                    children: this.getCategoryTools().filter(item => item.condition).map(action => new FixedToolItem({
                        title: action.title,
                        value: action.value
                    }))
                })
            ]
        });
    }

    private onMoveThread (): void {
        this._dialogService.openDialog({
            title: `Move threads`,
            component: this._componentFactory.resolveComponentFactory(MoveThreadComponent),
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({
                    title: 'Done', callback: categoryId => {
                        this._httpService.put(`forum/moderation/thread/move/category/${categoryId}`,
                            { threadIds: this.getSelectedThreadIds() })
                            .subscribe(() => {
                                this._notificationService.sendNotification(new NotificationMessage({
                                    title: 'Success',
                                    message: 'Threads are moved!'
                                }));
                                this.unSelectAllThreads();
                                this._dialogService.closeDialog();
                                this._router.navigateByUrl(`/forum/category/${categoryId}/page/1`);
                            }, this._notificationService.failureNotification.bind(this._notificationService));
                    }
                })
            ]
        });
    }

    private onChangeOwner (): void {
        this._dialogService.openDialog({
            title: 'Change thread owner',
            component: this._componentFactory.resolveComponentFactory(ChangeOwnerComponent),
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({
                    title: 'Done', callback: nickname => {
                        this._httpService.put('forum/moderation/thread/change-owner', {
                            threadIds: this.getSelectedThreadIds(),
                            nickname: nickname
                        }).subscribe(() => {
                            this._notificationService.sendNotification(new NotificationMessage({
                                title: 'Success',
                                message: 'Thread owners changed!'
                            }));
                            this.unSelectAllThreads();
                            this._router.navigateByUrl(`/forum/category/${this.categoryPage.categoryId}/page/1`);
                        }, this._notificationService.failureNotification.bind(this._notificationService));
                    }
                })
            ]
        });
    }

    private isStickiesContracted (): boolean {
        const contractedStickies = this.getContractedStickies();
        return Boolean(contractedStickies.indexOf(String(this.categoryPage.categoryId)) > -1);
    }

    private onContractStickies (): void {
        const contractedStickies = this.getContractedStickies();
        if (contractedStickies.indexOf(String(this.categoryPage.categoryId)) === -1) {
            contractedStickies.push(String(this.categoryPage.categoryId));
        }
        localStorage.setItem(LOCAL_STORAGE.CONTRACTED_STICKIES, JSON.stringify(contractedStickies));
    }

    private onUnContractStickies (): void {
        let contractedStickies = this.getContractedStickies();
        if (contractedStickies.indexOf(String(this.categoryPage.categoryId)) > -1) {
            contractedStickies = contractedStickies.filter(item => item !== String(this.categoryPage.categoryId));
        }
        localStorage.setItem(LOCAL_STORAGE.CONTRACTED_STICKIES, JSON.stringify(contractedStickies));
    }

    private getContractedStickies (): Array<string> {
        const stored = localStorage.getItem(LOCAL_STORAGE.CONTRACTED_STICKIES);
        return stored ? JSON.parse(stored) : [];
    }

    private unSelectAllThreads (): void {
        this.categoryPage.getAllThreads().forEach(thread => thread.isSelected = false);
    }

    private getSelectedThreadIds (): Array<number> {
        return this.categoryPage.stickyThreads.concat(this.categoryPage.threads)
            .filter(thread => thread.isSelected)
            .map(thread => thread.threadId);
    }

    private onIgnoreCategory (): void {
        if (this.categoryPage.categories.length === 0) {
            this.doIgnore(false);
            return;
        }

        this._dialogService.openDialog({
            title: 'Cascade Ignore',
            content: 'Do you want to ignore all categories that belongs to this one aswell?',
            buttons: [
                new DialogButton({
                    title: 'Only this one',
                    type: Button.YELLOW,
                    callback: () => this.doIgnore(false)
                }),
                new DialogButton({
                    title: 'Cascade',
                    type: Button.BLUE,
                    callback: () => this.doIgnore(true)
                }),
                new DialogCloseButton('Cancel')
            ]
        });
    }

    private doIgnore (isCascade: boolean): void {
        this._dialogService.closeDialog();
        this._httpService.post(`forum/category/${this.categoryPage.categoryId}/ignore`, { isCascade: isCascade })
            .subscribe(() => {
                this.categoryPage.isIgnored = true;
                this.setTabs();
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'You ignored the Category!'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }
}
