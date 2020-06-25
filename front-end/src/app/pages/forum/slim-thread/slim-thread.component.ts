import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'shared/page/page.model';
import { ForumPermissions, SlimThread } from '../forum.model';
import { IUserProfile } from 'shared/directives/user-profile/user-profile.directive';

@Component({
    selector: 'app-forum-slim-thread',
    templateUrl: 'slim-thread.component.html',
    styleUrls: [ 'slim-thread.component.css' ]
})

export class SlimThreadComponent extends Page implements OnDestroy {
    private _slimThread: SlimThread = new SlimThread();

    @Input() forumPermissions: ForumPermissions;
    @Output() onCheckChanged: EventEmitter<number> = new EventEmitter();
    @Input() isChecked: boolean;

    lastPostInfo: IUserProfile;
    pages = [];

    constructor (
        private _router: Router,
        elementRef: ElementRef
    ) {
        super(elementRef);
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    goToLastPost (): void {
        const lastPost = this._slimThread.lastPost;
        this._router.navigateByUrl(`/forum/thread/${this._slimThread.threadId}/page/${lastPost.page}?scrollTo=post-${lastPost.postId}`);
    }

    onCheck (): void {
        this.onCheckChanged.emit(this._slimThread.threadId);
    }

    @Input()
    set thread (thread: SlimThread) {
        this._slimThread = thread || new SlimThread();
        this.setPages();
        this.lastPostInfo = this._slimThread ? {
            userId: this._slimThread.lastPost.user.userId,
            avatarUpdatedAt: this._slimThread.lastPost.user.avatarUpdatedAt
        } : null;
    }

    get canSelectThreads (): boolean {
        return this.forumPermissions && (
            this.forumPermissions.canMoveThreads || this.forumPermissions.canChangeOwner);
    }

    get title (): string {
        return this._slimThread.title;
    }

    get threadUrl (): string {
        return `/forum/thread/${this._slimThread.threadId}/page/1`;
    }

    get isClosed (): boolean {
        return !this._slimThread.isOpen;
    }

    get isApproved (): boolean {
        return this._slimThread.isApproved;
    }

    get isSticky (): boolean {
        return this._slimThread.isSticky;
    }

    get thread (): SlimThread {
        return this._slimThread;
    }

    get views (): number {
        return this._slimThread.views;
    }

    get posts (): number {
        return this._slimThread.posts;
    }

    get haveRead (): boolean {
        return this._slimThread.haveRead;
    }

    get icon (): string {
        return this._slimThread.icon || 'fas fa-comment-alt';
    }

    private setPages (): void {
        if (!this._slimThread.lastPost) {
            return;
        }
        this.pages = [];
        for (let i = 1; i <= this._slimThread.lastPost.page && i < 6; i++) {
            this.pages.push(i);
        }
    }
}
