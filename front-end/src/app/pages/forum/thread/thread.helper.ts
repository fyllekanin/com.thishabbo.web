import { HttpService } from 'core/services/http/http.service';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { PostHistoryModel, ThreadActions, ThreadPage } from './thread.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { GlobalNotification, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { Router } from '@angular/router';
import { ChangeOwnerComponent } from './change-owner/change-owner.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { User } from 'core/services/auth/auth.model';
import { MoveThreadComponent } from './move-thread/move-thread.component';
import { ComponentFactoryResolver } from '@angular/core';
import { EditHistoryComponent } from './edit-history/edit-history.component';

export class ThreadActionExecutor {
    private readonly _httpService: HttpService;
    private readonly _globalNotificationService: GlobalNotificationService;
    private readonly _dialogService: DialogService;
    private readonly _componentFactory: ComponentFactoryResolver;
    private readonly _buildModerationTools: () => void;
    private readonly _router: Router;
    private readonly _threadPage: ThreadPage;
    private readonly _action: number;

    constructor(builder: Builder) {
        this._httpService = builder.getHttpService();
        this._globalNotificationService = builder.getGlobalNotificationService();
        this._dialogService = builder.getDialogService();
        this._router = builder.getRouter();
        this._threadPage = builder.getThreadPage();
        this._action = builder.getAction();
        this._componentFactory = builder.getComponentFactory();
        this._buildModerationTools = builder.getBuildModerationTools();

        this.execute();
    }

    static newBuilder(): Builder {
        // tslint:disable-next-line
        return new Builder();
    }

    private execute(): void {
        switch (this._action) {
            case ThreadActions.DELETE_THREAD:
                this.onDeleteThread();
                break;
            case ThreadActions.APPROVE_POSTS:
                this.onApprovePosts();
                break;
            case ThreadActions.UNAPPROVE_POSTS:
                this.onUnApprovePosts();
                break;
            case ThreadActions.EDIT_THREAD:
                this._router
                    .navigateByUrl(`/forum/category/${this._threadPage.categoryId}/thread/${this._threadPage.threadId}`);
                break;
            case ThreadActions.UNAPPROVE_THREAD:
                this.onUnApproveThread();
                break;
            case ThreadActions.APPROVE_THREAD:
                this.onApproveThread();
                break;
            case ThreadActions.UNSTICKY_THREAD:
                this.onUnStickyThread();
                break;
            case ThreadActions.STICKY_THREAD:
                this.onStickyThread();
                break;
            case ThreadActions.DELETE_POLL:
                this.onDeletePoll();
                break;
            case ThreadActions.VIEW_POLL:
                this._router.navigateByUrl(`/admin/moderation/polls/${this._threadPage.threadId}`);
                break;
            case ThreadActions.CLOSE_THREAD:
                this.onCloseThread();
                break;
            case ThreadActions.OPEN_THREAD:
                this.onOpenThread();
                break;
            case ThreadActions.CHANGE_OWNER:
                this.changeOwner();
                break;
            case ThreadActions.MERGE_POSTS:
                this._dialogService.openConfirmDialog(
                    'Are you sure?',
                    'Are you sure you wanna merge these posts?',
                    this.onMergePosts.bind(this));
                break;
            case ThreadActions.MOVE_THREAD:
                this.onMoveThread();
                break;
            case ThreadActions.THREAD_HISTORY:
                this.onPostHistory(this._threadPage.firstPostId);
                break;
            case ThreadActions.POST_HISTORY:
                const selectedIds = this._threadPage.threadPosts.filter(post => post.isSelected)
                    .map(post => post.postId);
                if (selectedIds.length !== 1) {
                    this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                        title: 'Error',
                        message: 'You need to select one postId to view history, not more or less',
                        type: NotificationType.ERROR
                    }));
                    return;
                }
                this.onPostHistory(selectedIds[0]);
        }
    }

    private onPostHistory(postId: number): void {
        this._httpService.get(`forum/thread/post/${postId}/history`)
            .subscribe((data: Array<any>) => {
                if (data.length < 1) {
                    this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                        title: 'Sorry',
                        message: 'There are no edits on this thread/post'
                    }));
                    return;
                }

                const history = data.map(item => new PostHistoryModel(item));
                this._dialogService.openDialog({
                    title: 'Edit History',
                    component: this._componentFactory.resolveComponentFactory(EditHistoryComponent),
                    data: history,
                    buttons: [
                        new DialogCloseButton('Close')
                    ]
                });

            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private onMergePosts(): void {
        const selectedPostIds = this._threadPage.threadPosts.filter(post => post.isSelected).map(post => post.postId);
        if (selectedPostIds.length < 2) {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Error',
                message: 'You most select at least two posts to merge',
                type: NotificationType.ERROR
            }));
            return;
        }

        this._httpService.put(`forum/moderation/thread/merge-posts/${this._threadPage.threadId}`, { postIds: selectedPostIds })
            .subscribe(newPost => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Posts are merged'
                }));
                this._threadPage.threadPosts =  this._threadPage.threadPosts.filter(item => {
                    return selectedPostIds.indexOf(item.postId) === -1 || item.postId === newPost.postId;
                });
                const post = this._threadPage.threadPosts.find(item => item.postId === newPost.postId);
                post.content = newPost.content;
                post.parsedContent = newPost.parsedContent;
                this._buildModerationTools();
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private onMoveThread(): void {
        this._dialogService.openDialog({
            title: `Move thread: ${this._threadPage.title}`,
            component: this._componentFactory.resolveComponentFactory(MoveThreadComponent),
            buttons: [
                new DialogCloseButton('Cancel'),
                new DialogButton({ title: 'Done', callback: categoryId => {
                    this._httpService.put(`forum/moderation/thread/move/category/${categoryId}`, { threadIds: [this._threadPage.threadId]})
                        .subscribe(() => {
                            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                                title: 'Success',
                                message: 'Thread is moved!'
                            }));
                            this._dialogService.closeDialog();
                            this._router.navigateByUrl(`/forum/thread/${this._threadPage.threadId}/page/${this._threadPage.page}`);
                        }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
                }})
            ]
        });
    }

    private changeOwner(): void {
        this._dialogService.openDialog({
            title: `Change owner of ${this._threadPage.title}`,
            component: this._componentFactory.resolveComponentFactory(ChangeOwnerComponent),
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({ title: 'Done', callback: this.onChangeOwner.bind(this) })
            ]
        });
    }

    private onChangeOwner(nickname: string): void {
        this._httpService.put(`forum/moderation/thread/change-owner/`, { nickname: nickname, threadIds: [this._threadPage.threadId] })
            .subscribe(user => {
                const newOwner = new User(user);
                if (this._threadPage.page === 1) {
                    this._threadPage.threadPosts[0].user = newOwner;
                }
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: `${newOwner.nickname} is now owner!`
                }));
                this._dialogService.closeDialog();
                this._buildModerationTools();
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private onOpenThread(): void {
        this._httpService.put(`forum/moderation/thread/open/${this._threadPage.threadId}`)
            .subscribe(() => {
                this._threadPage.isOpen = true;
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Thread is now open'
                }));
                this._buildModerationTools();
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private onCloseThread(): void {
        this._httpService.put(`forum/moderation/thread/close/${this._threadPage.threadId}`)
            .subscribe(() => {
                this._threadPage.isOpen = false;
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Thread is now closed'
                }));
                this._buildModerationTools();
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private onDeletePoll(): void {
        this._dialogService.openConfirmDialog(
            `Delete poll`,
            `Are you sure you wanna delete the poll?`,
            () => {
                this._httpService.delete(`forum/moderation/thread/poll/delete/${this._threadPage.threadId}`)
                    .subscribe(() => {
                        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                            title: 'Success',
                            message: 'Poll is deleted'
                        }));
                        this._threadPage.poll = null;
                        this._dialogService.closeDialog();
                        this._buildModerationTools();
                    }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
            }
        );
    }

    private onStickyThread(): void {
        this._httpService.put(`forum/moderation/thread/sticky/${this._threadPage.threadId}`)
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: `${this._threadPage.title} is now stickied!`
                }));
                this._threadPage.isSticky = true;
                this._buildModerationTools();
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private onUnStickyThread(): void {
        this._httpService.put(`forum/moderation/thread/unsticky/${this._threadPage.threadId}`)
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: `${this._threadPage.title} is now unstickied!`
                }));
                this._threadPage.isSticky = false;
                this._buildModerationTools();
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private onApproveThread(): void {
        this._httpService.put(`forum/moderation/thread/approve/${this._threadPage.threadId}`)
            .subscribe(() => {
                this._threadPage.isApproved = true;
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: `${this._threadPage.title} is now approved!`
                }));
                this._buildModerationTools();
            });
    }

    private onUnApproveThread(): void {
        this._httpService.put(`forum/moderation/thread/unapprove/${this._threadPage.threadId}`)
            .subscribe(() => {
                this._threadPage.isApproved = false;
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: `${this._threadPage.title} is now unapproved!`
                }));
                this._buildModerationTools();
            });
    }

    private onUnApprovePosts(): void {
        const selectedPostIds = this._threadPage.threadPosts.filter(post => post.isSelected).map(post => post.postId);
        this._httpService.put('forum/moderation/thread/unapprove/posts', { postIds: selectedPostIds })
            .subscribe(() => {
                this._threadPage.threadPosts = this._threadPage.threadPosts.map(post => {
                    post.isApproved = post.isSelected ? false : post.isApproved;
                    post.isSelected = false;
                    return post;
                });
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: `Post are now unapproved!`
                }));
            });
    }

    private onApprovePosts(): void {
        const selectedPostIds = this._threadPage.threadPosts.filter(post => post.isSelected).map(post => post.postId);
        this._httpService.put('forum/moderation/thread/approve/posts', { postIds: selectedPostIds })
            .subscribe(() => {
                this._threadPage.threadPosts = this._threadPage.threadPosts.map(post => {
                    post.isApproved = post.isSelected ? true : post.isApproved;
                    post.isSelected = false;
                    return post;
                });
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: `Post are now approved!`
                }));
            });
    }

    private onDeleteThread(): void {
        this._dialogService.openConfirmDialog(
            `Delete thread`,
            `Are you sure you wanna delete the thread: ${this._threadPage.title}?`,
            () => {
                this._httpService.delete(`forum/moderation/thread/delete/${this._threadPage.threadId}`)
                    .subscribe(() => {
                        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                            title: 'Success',
                            message: `${this._threadPage.title} is now deleted!`
                        }));
                        this._dialogService.closeDialog();
                        this._router.navigateByUrl(`/forum/category/${this._threadPage.categoryId}/page/1`);
                    });
            }
        );
    }
}

class Builder {
    private _httpService: HttpService;
    private _globalNotificationService: GlobalNotificationService;
    private _dialogService: DialogService;
    private _componentFactory: ComponentFactoryResolver;
    private _router: Router;
    private _threadPage: ThreadPage;
    private _action: number;
    private _buildModerationTools: () => void;

    withHttpService(httpService: HttpService): Builder {
        this._httpService = httpService;
        return this;
    }

    withGlobalNotificationService(globalNotificationService: GlobalNotificationService): Builder {
        this._globalNotificationService = globalNotificationService;
        return this;
    }

    withThreadPage(threadPage: ThreadPage): Builder {
        this._threadPage = threadPage;
        return this;
    }

    withAction(action: number): Builder {
        this._action = action;
        return this;
    }

    withDialogService(dialogService: DialogService): Builder {
        this._dialogService = dialogService;
        return this;
    }

    withRouter(router: Router): Builder {
        this._router = router;
        return this;
    }

    withComponentFactory(componentFactory: ComponentFactoryResolver): Builder {
        this._componentFactory = componentFactory;
        return this;
    }

    withBuildModerationTools(callback: () => void): Builder {
        this._buildModerationTools = callback;
        return this;
    }

    getHttpService(): HttpService {
        return this._httpService;
    }

    getGlobalNotificationService(): GlobalNotificationService {
        return this._globalNotificationService;
    }

    getThreadPage(): ThreadPage {
        return this._threadPage;
    }

    getAction(): number {
        return this._action;
    }

    getDialogService(): DialogService {
        return this._dialogService;
    }

    getRouter(): Router {
        return this._router;
    }

    getComponentFactory(): ComponentFactoryResolver {
        return this._componentFactory;
    }

    getBuildModerationTools(): () => void {
        // tslint:disable-next-line
        return this._buildModerationTools;
    }

    execute(): void {
        // tslint:disable-next-line
        new ThreadActionExecutor(this);
    }
}
