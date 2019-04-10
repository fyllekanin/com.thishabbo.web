import {DialogService} from 'core/services/dialog/dialog.service';
import {DialogButton, DialogCloseButton} from 'shared/app-views/dialog/dialog.model';
import {TitleTab} from 'shared/app-views/title/title.model';
import {FixedToolItem, FixedTools} from 'shared/components/fixed-tools/fixed-tools.model';
import {ThreadActions} from '../thread/thread.model';
import {Breadcrumb, BreadcrumbItem} from 'core/services/breadcrum/breadcrum.model';
import {BreadcrumbService} from 'core/services/breadcrum/breadcrumb.service';
import {Page} from 'shared/page/page.model';
import {PaginationModel} from 'shared/app-views/pagination/pagination.model';
import {ActivatedRoute, Router} from '@angular/router';
import {CATEGORY_SORT_BY, CategoryActions, CategoryDisplayOptions, CategoryPage, SORT_ORDER} from './category.model';
import {Component, ComponentFactoryResolver, ElementRef, OnDestroy} from '@angular/core';
import {FORUM_BREADCRUM_ITEM} from '../forum.constants';
import {ArrayHelper} from 'shared/helpers/array.helper';
import {AuthService} from 'core/services/auth/auth.service';
import {HttpService} from 'core/services/http/http.service';
import {GlobalNotificationService} from 'core/services/notification/global-notification.service';
import {GlobalNotification} from 'shared/app-views/global-notification/global-notification.model';
import {MoveThreadComponent} from '../thread/move-thread/move-thread.component';
import {ChangeOwnerComponent} from '../thread/change-owner/change-owner.component';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';

@Component({
    selector: 'app-forum-category',
    templateUrl: 'category.component.html'
})

export class CategoryComponent extends Page implements OnDestroy {
    private _categoryPage: CategoryPage = new CategoryPage();
    private _selectedThreadIds: Array<number> = [];
    private _isToolsVisible = false;
    private _isStickiesVisible = true;

    fixedTools: FixedTools;
    pagination: PaginationModel;
    tabs: Array<TitleTab> = [];
    toggleStickies: Array<TitleTab> = [new TitleTab({ title: 'Toggle' })];

    constructor(
        private _dialogService: DialogService,
        private _authService: AuthService,
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _breadcrumbService: BreadcrumbService,
        private _componentFactory: ComponentFactoryResolver,
        elementRef: ElementRef
    ) {
        super(elementRef);
        this.addSubscription(this._activatedRoute.data, this.onCategory.bind(this));
        this._isStickiesVisible = this.isStickiesContracted();
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onToggleStickies(): void {
        if (this._isStickiesVisible) {
            this.onUnContractStickies();
        } else {
            this.onContractStickies();
        }
        this._isStickiesVisible = !this._isStickiesVisible;
    }

    onSort(options: CategoryDisplayOptions): void {
        this._router.navigateByUrl(`/forum/category/${this._categoryPage.categoryId}/page/1${this.getQueryParams(options)}`);
    }

    onTabClick(value: number): void {
        switch (value) {
            case CategoryActions.SUBSCRIBE:
                this._httpService.post(`forum/category/${this._categoryPage.categoryId}/subscribe`, {})
                    .subscribe(() => {
                        this._categoryPage.isSubscribed = true;
                        this.setTabs();
                        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                            title: 'Success',
                            message: 'You are now subscribed!'
                        }));
                    }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
                break;
            case CategoryActions.UNSUBSCRIBE:
                this._httpService.delete(`forum/category/${this._categoryPage.categoryId}/unsubscribe`)
                    .subscribe(() => {
                        this._categoryPage.isSubscribed = false;
                        this.setTabs();
                        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                            title: 'Success',
                            message: 'You are now unsubscribed!'
                        }));
                    }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
                break;
            case CategoryActions.IGNORE:
                this._httpService.post(`forum/category/${this._categoryPage.categoryId}/ignore`, {})
                    .subscribe(() => {
                        this._categoryPage.isIgnored = true;
                        this.setTabs();
                        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                            title: 'Success',
                            message: 'You ignored the Category!'
                        }));
                    }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
                break;
            case CategoryActions.UNIGNORE:
                this._httpService.delete(`forum/category/${this._categoryPage.categoryId}/ignore`)
                    .subscribe(() => {
                        this._categoryPage.isIgnored = false;
                        this.setTabs();
                        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                            title: 'Success',
                            message: 'You unignored the Category!'
                        }));
                    }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
                break;
            case CategoryActions.TOGGLE_TOOLS:
                this._isToolsVisible = !this._isToolsVisible;
                this.buildModerationTools();
                break;
        }
    }

    onAction(action: number): void {
        switch (action) {
            case ThreadActions.MOVE_THREAD:
                this.onMoveThread();
                break;
            case ThreadActions.CHANGE_THREAD_OWNER:
                this.onChangeOwner();
                break;
        }
    }

    onCheckChanged(threadId: number) {
        if (this._selectedThreadIds.includes(threadId)) {
            this._selectedThreadIds = this._selectedThreadIds.filter(id => id !== threadId);
        } else {
            this._selectedThreadIds.push(threadId);
        }
    }

    get isStickiesVisible(): boolean {
        return this._isStickiesVisible;
    }

    get categoryPage(): CategoryPage {
        return this._categoryPage;
    }

    get haveSubCategories(): boolean {
        return this._categoryPage.categories.length > 0;
    }

    get isMainParent(): boolean {
        return this._categoryPage.parents.length === 0;
    }

    private getQueryParams(options: CategoryDisplayOptions): string {
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

    private onCategory(data: { data: CategoryPage }): void {
        this._categoryPage = data.data;
        this.setPagination();
        this.setTabs();
        this.setBreadcrumb();
        this.buildModerationTools();
    }

    private setTabs(): void {
        if (!this._authService.isLoggedIn()) {
            return;
        }

        const actions = [
            { title: 'Create Thread', link: `/forum/category/${this._categoryPage.categoryId}/thread/new`,
                condition: this._categoryPage.forumPermissions.canCreateThreads && this._categoryPage.isOpen  },
            { title: 'Subscribe', value: CategoryActions.SUBSCRIBE, condition: !this._categoryPage.isSubscribed },
            { title: 'Unsubscribe', value: CategoryActions.UNSUBSCRIBE, condition: this._categoryPage.isSubscribed },
            { title: 'Ignore', value: CategoryActions.IGNORE, condition: !this._categoryPage.isIgnored },
            { title: 'Unignore', value: CategoryActions.UNIGNORE, condition: this._categoryPage.isIgnored }
        ];

        actions.push({
            title: 'Toggle Tools',
            value: CategoryActions.TOGGLE_TOOLS,
            condition: this.getThreadTools().filter(item => item.condition).length > 0
        });

        this.tabs = actions.filter(item => item.condition)
            .map(item => new TitleTab(item));
    }

    private getThreadTools(): Array<{ title: string, value: number, condition: boolean}> {
        return [
            {
                title: 'Move Thread(s)', value: ThreadActions.MOVE_THREAD,
                condition: this._categoryPage.forumPermissions.canMoveThreads
            },
            {   title: 'Change Owner', value: ThreadActions.CHANGE_THREAD_OWNER,
                condition: this._categoryPage.forumPermissions.canChangeOwner
            }
        ];
    }

    private setBreadcrumb(): void {
        this._breadcrumbService.breadcrumb = new Breadcrumb({
            current: this._categoryPage.title,
            items: [FORUM_BREADCRUM_ITEM].concat(this._categoryPage.parents.sort(ArrayHelper.sortByPropertyDesc.bind(this, 'displayOrder'))
                .map(parent => new BreadcrumbItem({
                    title: parent.title,
                    url: `/forum/category/${parent.categoryId}/page/1`
                })))
        });
    }

    private setPagination(): void {
        this.pagination = new PaginationModel({
            total: this._categoryPage.total,
            page: this._categoryPage.page,
            url: `/forum/category/${this._categoryPage.categoryId}/page/:page${this.getQueryParams(this._categoryPage.displayOptions)}`
        });
    }

    private buildModerationTools(): void {
        if (!this._isToolsVisible) {
            this.fixedTools = null;
            return;
        }

        this.fixedTools = new FixedTools({
            items: [
                new FixedToolItem({
                    title: 'Thread tools',
                    children: this.getThreadTools().filter(item => item.condition).map(action => new FixedToolItem({
                        title: action.title,
                        value: action.value
                    })),
                })
            ]
        });
    }

    private onMoveThread(): void {
        this._dialogService.openDialog({
            title: `Move threads`,
            component: this._componentFactory.resolveComponentFactory(MoveThreadComponent),
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({ title: 'Done', callback: categoryId => {
                    this._httpService.put(`forum/moderation/thread/move/category/${categoryId}`,
                        { threadIds: this._selectedThreadIds})
                        .subscribe(() => {
                            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                                title: 'Success',
                                message: 'Threads are moved!'
                            }));
                            this._dialogService.closeDialog();
                            this._router.navigateByUrl(`/forum/category/${categoryId}/page/1`);
                        }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
                }})
            ]
        });
    }

    private onChangeOwner(): void {
        this._dialogService.openDialog({
            title: 'Change thread owner',
            component: this._componentFactory.resolveComponentFactory(ChangeOwnerComponent),
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({ title: 'Done', callback: nickname => {
                    this._httpService.put('forum/moderation/thread/change-owner', {
                        threadIds: this._selectedThreadIds,
                        nickname: nickname
                    }).subscribe(() => {
                        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                            title: 'Success',
                            message: 'Thread owners changed!'
                        }));
                        this._router.navigateByUrl(`/forum/category/${this._categoryPage.categoryId}/page/1`);
                    }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
                }})
            ]
        });
    }

    private isStickiesContracted(): boolean {
        const contractedStickies = this.getContractedStickies();
        return Boolean(contractedStickies.indexOf(String(this._categoryPage.categoryId)) > -1);
    }

    private onContractStickies(): void {
        const contractedStickies = this.getContractedStickies();
        if (contractedStickies.indexOf(String(this._categoryPage.categoryId)) === -1) {
            contractedStickies.push(String(this._categoryPage.categoryId));
        }
        localStorage.setItem(LOCAL_STORAGE.CONTRACTED_STICKIES, JSON.stringify(contractedStickies));
    }

    private onUnContractStickies(): void {
        let contractedStickies = this.getContractedStickies();
        if (contractedStickies.indexOf(String(this._categoryPage.categoryId)) > -1) {
            contractedStickies = contractedStickies.filter(item => item !== String(this._categoryPage.categoryId));
        }
        localStorage.setItem(LOCAL_STORAGE.CONTRACTED_STICKIES, JSON.stringify(contractedStickies));
    }

    private getContractedStickies(): Array<string> {
        const stored = localStorage.getItem(LOCAL_STORAGE.CONTRACTED_STICKIES);
        return stored ? JSON.parse(stored) : [];
    }
}
