import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'shared/page/page.model';
import { ForumPermissions, SlimThread, SlimPost } from '../forum.model';
import { IUserProfile } from 'shared/directives/user-profile.directive';

@Component({
    selector: 'app-forum-slim-thread',
    templateUrl: 'slim-thread.component.html',
    styleUrls: ['slim-thread.component.css']
})

export class SlimThreadComponent extends Page implements OnDestroy {
    private _slimThread: SlimThread = new SlimThread();

    @Input() forumPermissions: ForumPermissions;
    @Output() onCheckChanged: EventEmitter<number> = new EventEmitter();
    @Input() isChecked: boolean;

    lastPostInfo: IUserProfile;

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
        return `/forum/thread/${this._slimThread.threadId}/page/${this._slimThread.firstUnreadPost.page}`;
    }

    get firstUnreadPost (): SlimPost {
        return this._slimThread.firstUnreadPost;
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
}
