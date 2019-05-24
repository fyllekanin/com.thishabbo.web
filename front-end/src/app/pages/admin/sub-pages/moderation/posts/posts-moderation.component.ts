import { ActivatedRoute } from '@angular/router';
import { PostModerate, PostModerationActions } from './posts-moderation.model';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from '../../../admin.constants';

@Component({
    selector: 'app-admin-moderation-posts',
    templateUrl: 'posts-moderation.component.html'
})
export class PostsModerationComponent extends Page implements OnDestroy {
    private _posts: Array<PostModerate> = [];

    tableConfig: TableConfig;

    constructor (
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        private _dialogService: DialogService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Moderate Posts',
            items: [
                SITECP_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onAction (action: Action): void {
        const post = this._posts.find(po => po.postId === Number(action.rowId));
        switch (action.value) {
            case PostModerationActions.APPROVE_POST:
                this._dialogService.confirm({
                    title: `Approve post`,
                    content: `Are you sure you wanna approve the post?`,
                    callback: this.approvePost.bind(this, post)
                });
                break;
            case PostModerationActions.DELETE_POST:
                this._dialogService.confirm({
                    title: `Delete post`,
                    content: `Are you sure you wanna delete the post?`,
                    callback: this.deletePost.bind(this, post)
                });
                break;
            case PostModerationActions.WATCH_CONTENT:
                this._dialogService.openDialog({
                    title: 'Content',
                    content: post.content,
                    buttons: [new DialogCloseButton('Close')]
                });
                break;
        }
    }

    private approvePost (post: PostModerate): void {
        this._httpService.put(`forum/moderation/thread/approve/posts`, {postIds: [post.postId]})
            .subscribe(() => {
                this._posts = this._posts.filter(po => po.postId !== post.postId);
                this.createOrUpdateTable();
                this._dialogService.closeDialog();
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: `Post is now approved!`
                }));
            });
    }

    private deletePost (post: PostModerate): void {
        this._httpService.put(`forum/moderation/thread/delete/posts`, {postIds: [post.postId]})
            .subscribe(() => {
                this._posts = this._posts.filter(po => po.postId !== post.postId);
                this.createOrUpdateTable();
                this._dialogService.closeDialog();
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: `Post is now deleted!`
                }));
            });
    }

    private onPage (data: { data: Array<PostModerate> }): void {
        this._posts = data.data;
        this.createOrUpdateTable();
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Moderate Posts',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._posts.map(post => {
            const actions = [
                {title: 'Approve', value: PostModerationActions.APPROVE_POST, condition: post.canApprove},
                {title: 'See Content', value: PostModerationActions.WATCH_CONTENT, condition: true},
                {title: 'Delete', value: PostModerationActions.DELETE_POST, condition: post.canDelete}
            ];
            return new TableRow({
                id: String(post.postId),
                cells: [
                    new TableCell({title: post.threadTitle}),
                    new TableCell({title: post.user.nickname})
                ],
                actions: actions.filter(action => action.condition).map(action => new TableAction(action))
            });
        });
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Thread'}),
            new TableHeader({title: 'User'})
        ];
    }
}
